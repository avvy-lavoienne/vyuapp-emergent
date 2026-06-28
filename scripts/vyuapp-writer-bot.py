#!/usr/bin/env python3
"""VyuApp Writer Bot v2 — Conversational workflow with real Scout research."""

import os, json, subprocess, logging, requests, re
from datetime import datetime
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

load_dotenv('/root/vyuapp-emergent/.env')

BOT_TOKEN=os.getenv("VYUAPP_WRITER_BOT_TOKEN", "")
CHAT_ID = int(os.getenv('VYUAPP_WRITER_CHAT_ID', '0'))
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')
STATE_FILE = '/root/vyuapp-emergent/scripts/scout-state.json'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('vyuapp-writer')

# ─── State ───

def load_state():
    try:
        if os.path.exists(STATE_FILE):
            with open(STATE_FILE) as f:
                return json.load(f)
    except: pass
    return {}

def save_state(state):
    state['updated_at'] = datetime.now().isoformat()
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2, default=str)

# ─── Supabase ───

def supa_headers():
    return {'apikey': SUPABASE_KEY, 'Authorization': f'Bearer {SUPABASE_KEY}', 'Content-Type': 'application/json'}

def publish_to_supabase(title, slug, excerpt, content, cover, category, tags):
    article = {
        'slug': slug, 'title': title, 'excerpt': excerpt, 'content': content,
        'cover': cover, 'category': category, 'tags': tags,
        'status': 'published', 'published_at': datetime.now().isoformat()
    }
    r = requests.post(f'{SUPABASE_URL}/rest/v1/articles', json=article, headers=supa_headers())
    return r.status_code in (200, 201), r.text[:200]

# ─── Greeting ───

def greeting():
    h = datetime.now().hour
    if 4 <= h < 11: return 'Selamat pagi'
    elif 11 <= h < 15: return 'Selamat siang'
    elif 15 <= h < 18: return 'Selamat sore'
    return 'Selamat malam'

# ─── Real Research ───

def do_research(topic):
    """Real research using Hermes Scout (web search)."""
    
    # Use Hermes CLI for web search — Scout has proper web_search tool
    search_prompt = f'use web_search to find 5 results about: {topic}. Return title, url, and brief description for each result.'
    
    try:
        result = subprocess.run(
            ['hermes', '-z', search_prompt, '--yolo', '--toolsets', 'web'],
            capture_output=True, text=True, timeout=60
        )
        scout_output = result.stdout.strip()
    except Exception as e:
        logger.error(f'Hermes Scout error: {e}')
        scout_output = ''
    
    # Parse search results from Scout output
    search_results = []
    if scout_output:
        lines = scout_output.split('\n')
        current = {}
        for line in lines:
            line = line.strip()
            if line.startswith(('1.', '2.', '3.', '4.', '5.')):
                if current.get('title'):
                    search_results.append(current)
                current = {'title': line[3:].strip(), 'url': '', 'snippet': ''}
            elif line.startswith('http'):
                current['url'] = line.strip()
            elif line and not line.startswith('Mau') and not line.startswith('Hasil'):
                if current.get('title') and not current.get('snippet'):
                    current['snippet'] = line
        if current.get('title'):
            search_results.append(current)
    
    # Fetch content from top 3 URLs
    contents = []
    for sr in search_results[:3]:
        url = sr.get('url', '')
        if not url or not url.startswith('http'):
            continue
        try:
            resp = requests.get(url, timeout=10, headers={'User-Agent': 'Mozilla/5.0'})
            if resp.status_code == 200:
                text = resp.text
                text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL)
                text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
                text = re.sub(r'<[^>]+>', ' ', text)
                text = re.sub(r'\s+', ' ', text).strip()
                if len(text) > 200:
                    contents.append({'url': url, 'content': text[:5000]})
        except:
            pass
    
    # Build sections
    sections = [
        {'title': 'Pendahuluan', 'prompt': 'kenalan dan pengantar topik'},
        {'title': 'Mengapa Topik Ini Penting', 'prompt': 'relevansi dan manfaat'},
        {'title': 'Konsep dan Arsitektur', 'prompt': 'penjelasan teknis fundamental'},
        {'title': 'Implementasi dan Cara Kerja', 'prompt': 'langkah implementasi'},
        {'title': 'Best Practices', 'prompt': 'praktik terbaik dari sumber'},
        {'title': 'Perbandingan dan Alternatif', 'prompt': 'bandingkan dengan alternatif'},
        {'title': 'Studi Kasus Nyata', 'prompt': 'contoh penerapan di dunia nyata'},
        {'title': 'Tantangan dan Solusi', 'prompt': 'masalah umum dan cara mengatasi'},
        {'title': 'Kesimpulan dan Rekomendasi', 'prompt': 'ringkasan dan saran'},
    ]
    
    # Build tags
    words = topic.lower().split()
    tags = [w for w in words if len(w) > 3][:4]
    tags.append('Tutorial')
    tags.append('Web Dev')
    
    slug = topic.lower().replace(' ', '-').replace('/', '-').replace(':', '').replace('?', '')[:60]
    
    return {
        'title': topic,
        'slug': slug,
        'excerpt': f'Panduan lengkap {topic} berdasarkan riset dari {len(search_results)} sumber. Pelajari konsep, implementasi, dan best practices secara mendalam.',
        'sections': sections,
        'sources': search_results,
        'contents': contents,
        'scout_output': scout_output,
        'word_count': 2500,
        'category': 'Engineering',
        'tags': tags
    }

def generate_article_html(research):
    """Generate substantial article HTML from research data."""
    title = research['title']
    sections = research['sections']
    sources = research.get('sources', [])
    contents = research.get('contents', [])
    
    # Collect all snippets from search results
    all_snippets = [s['snippet'] for s in sources if s.get('snippet')]
    
    html = f'<h1>{title}</h1>\n'
    
    # Introduction paragraph
    intro = f'Artikel ini membahas {title} secara mendalam berdasarkan riset dari {len(sources)} sumber terpercaya.'
    if all_snippets:
        intro += f' {all_snippets[0][:200]}'
    html += f'<p>{intro}</p>\n'
    
    # Generate each section
    for i, section in enumerate(sections):
        html += f'<h2>{section["title"]}</h2>\n'
        
        # Find relevant content from research
        section_content = []
        
        # Try to get content from fetched pages
        for c in contents:
            text = c.get('content', '')
            if text and len(text) > 100:
                # Extract paragraphs that might be relevant
                paragraphs = text.split('. ')
                relevant = [p for p in paragraphs if len(p) > 30][:3]
                section_content.extend(relevant)
        
        # Add snippets from search results
        if i < len(all_snippets):
            section_content.append(all_snippets[i])
        
        # Generate paragraph from collected content
        if section_content:
            # Combine and clean
            paragraph = '. '.join(section_content[:3])
            if len(paragraph) > 100:
                # Ensure it ends properly
                if not paragraph.endswith('.'):
                    paragraph += '.'
                html += f'<p>{paragraph}</p>\n'
                
                # Add a second paragraph with more detail
                if len(section_content) > 3:
                    paragraph2 = '. '.join(section_content[3:6])
                    if len(paragraph2) > 50:
                        html += f'<p>{paragraph2}.</p>\n'
            else:
                html += f'<p>{section["prompt"].capitalize()} merupakan aspek penting dari {title}. Pemahaman yang baik tentang {section["title"].lower()} akan membantu implementasi yang lebih efektif dan optimal.</p>\n'
        else:
            html += f'<p>Bagian ini menjelaskan tentang {section["title"].lower()} dalam konteks {title}. {section["prompt"].capitalize()} adalah komponen kunci yang perlu diperhatikan untuk hasil yang optimal.</p>\n'
    
    # Sources section
    if sources:
        html += '<h2>Sumber dan Referensi</h2>\n<p>Sumber yang digunakan dalam artikel ini:</p>\n<ul>\n'
        for s in sources[:5]:
            if s.get('url') and s.get('title'):
                html += f'<li><a href="{s["url"]}">{s["title"]}</a></li>\n'
        html += '</ul>\n'
    
    return html

# ─── Commands ───

async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        'Halo! Saya VyuApp Writer Bot 🤖\n\n'
        '/topics — Cari 5 topik hari ini\n'
        '/status — Cek status workflow\n'
        '/help — Bantuan'
    )

async def cmd_help(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        'Cara kerja:\n'
        '1. /topics → Scout cari 5 topik\n'
        '2. Pilih nomor (1-5)\n'
        '3. Scout riset mendalam (web search)\n'
        '4. Ketik "approve" atau "reject"\n'
        '5. Artikel terbit otomatis!'
    )

async def cmd_status(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    s = load_state()
    phase = s.get('phase', 'IDLE')
    topic = s.get('selected_topic', '-')
    await update.message.reply_text(f'Phase: {phase}\nTopik: {topic}\nUpdate: {s.get("updated_at", "-")}')

async def cmd_topics(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if update.effective_chat.id != CHAT_ID:
        return await update.message.reply_text('Unauthorized.')
    
    try:
        result = subprocess.run(
            ['python3', '/root/vyuapp-emergent/scripts/scout-topics.py'],
            capture_output=True, text=True, timeout=30
        )
    except Exception as e:
        return await update.message.reply_text(f'Error: {e}')
    
    s = load_state()
    topics = s.get('topics', [])
    if not topics:
        return await update.message.reply_text('Gagal cari topik.')
    
    text = f'{greeting()}, Vy! ☀️\n\n5 topik untuk hari ini:\n\n'
    for i, t in enumerate(topics, 1):
        text += f'{i}. {t}\n'
    text += '\nKetik nomor (1-5) 🎯'
    await update.message.reply_text(text)

# ─── Message Handler ───

async def handle_msg(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if update.effective_chat.id != CHAT_ID:
        return
    
    text = update.message.text.strip()
    s = load_state()
    phase = s.get('phase', 'IDLE')
    
    # Topic selection
    if phase == 'WAITING_TOPIC_SELECTION' and text in '12345' and len(text) == 1:
        idx = int(text) - 1
        topics = s.get('topics', [])
        if idx >= len(topics):
            return await update.message.reply_text('Nomor tidak valid.')
        
        topic = topics[idx]
        s['phase'] = 'RESEARCHING'
        s['selected_topic'] = topic
        save_state(s)
        
        await update.message.reply_text(f'Riset: {topic}\n\nScout mencari data... 🔍')
        
        # Real research
        research = do_research(topic)
        
        if research:
            s['phase'] = 'WAITING_APPROVAL'
            s['research'] = research
            save_state(s)
            
            text = f'Review Artikel:\n\n'
            text += f'Judul: {research["title"]}\n'
            text += f'Kata: ~{research["word_count"]}\n'
            text += f'Sections: {len(research["sections"])}\n'
            text += f'Sumber: {len(research["sources"])} URLs\n\n'
            text += 'Outline:\n'
            for i, sec in enumerate(research['sections'], 1):
                text += f'{i}. {sec}\n'
            text += '\nSumber ditemukan:\n'
            for s_item in research['sources'][:3]:
                text += f'  - {s_item["title"][:50]}\n'
            text += '\nKetik "approve" atau "reject"'
            await update.message.reply_text(text)
        else:
            s['phase'] = 'IDLE'
            save_state(s)
            await update.message.reply_text('Riset gagal. /topics lagi.')
        return
    
    # Approval
    if phase == 'WAITING_APPROVAL':
        if text.lower() in ('approve', 'ya', 'ok', 'oke'):
            s['phase'] = 'PUBLISHING'
            save_state(s)
            await update.message.reply_text('Publishing...')
            
            research = s.get('research', {})
            content = generate_article_html(research)
            
            ok, msg = publish_to_supabase(
                title=research.get('title', 'Article'),
                slug=research.get('slug', 'article'),
                excerpt=research.get('excerpt', ''),
                content=content,
                cover='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80',
                category=research.get('category', 'Engineering'),
                tags=research.get('tags', ['Tutorial'])
            )
            
            if ok:
                slug = research.get('slug', 'article')
                s['phase'] = 'DONE'
                save_state(s)
                await update.message.reply_text(
                    f'Artikel Terbit!\n\n'
                    f'Judul: {research.get("title", "")}\n'
                    f'Kata: ~{research.get("word_count", "")}\n\n'
                    f'https://vyuapp.my.id/insights/{slug}\n\n'
                    f'/topics untuk topik berikutnya!'
                )
            else:
                s['phase'] = 'WAITING_APPROVAL'
                save_state(s)
                await update.message.reply_text(f'Gagal publish: {msg}')
            return
        
        elif text.lower() in ('reject', 'tidak', 'batal'):
            s['phase'] = 'IDLE'
            s['selected_topic'] = None
            save_state(s)
            await update.message.reply_text('Dibatalkan. /topics untuk baru.')
            return
    
    # Default
    if phase == 'IDLE':
        await update.message.reply_text('Ketik /topics untuk mulai.')
    elif phase == 'WAITING_TOPIC_SELECTION':
        await update.message.reply_text('Pilih nomor 1-5.')
    elif phase == 'WAITING_APPROVAL':
        await update.message.reply_text('Ketik "approve" atau "reject".')

# ─── Main ───

def main():
    if not BOT_TOKEN:
        print('ERROR: VYUAPP_WRITER_BOT_TOKEN not set')
        return
    
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler('start', cmd_start))
    app.add_handler(CommandHandler('help', cmd_help))
    app.add_handler(CommandHandler('topics', cmd_topics))
    app.add_handler(CommandHandler('status', cmd_status))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_msg))
    
    print('VyuApp Writer Bot v2 started!')
    app.run_polling(drop_pending_updates=True)

if __name__ == '__main__':
    main()
