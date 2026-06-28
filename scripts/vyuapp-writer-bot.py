#!/usr/bin/env python3
"""VyuApp Writer Bot v2 — Telegram UI, Scout does the work.

Bot handles Telegram conversation.
Scout (Hermes) does research, writing, and publishing.
"""

import os, json, subprocess, logging, requests, re
from datetime import datetime
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

load_dotenv('/root/vyuapp-emergent/.env')

BOT_TOKEN=os.getenv('VYUAPP_WRITER_BOT_TOKEN', '')
CHAT_ID = int(os.getenv('VYUAPP_WRITER_CHAT_ID', '0'))
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')
STATE_FILE = '/root/vyuapp-emergent/scripts/scout-state.json'
REPO_PATH = '/root/vyuapp-emergent'

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
    return r.status_code in (200, 201)

# ─── Greeting ───

def greeting():
    h = datetime.now().hour
    if 4 <= h < 11: return 'Selamat pagi'
    elif 11 <= h < 15: return 'Selamat siang'
    elif 15 <= h < 18: return 'Selamat sore'
    return 'Selamat malam'

# ─── Scout: Find Topics ───

def scout_find_topics():
    """Ask Scout to find 5 quality topics."""
    prompt = (
        'Find 5 trending tech topics for a Indonesian web development blog. '
        'Topics should be about: Next.js, Supabase, TypeScript, Docker, or AI in web dev. '
        'Return ONLY a numbered list of 5 topics, nothing else. Example:\n'
        '1. Next.js 16 Server Components best practices\n'
        '2. Supabase RLS policies guide\n'
        '3. TypeScript advanced patterns 2026\n'
        '4. Docker for Next.js production deployment\n'
        '5. AI integration in web applications'
    )
    try:
        result = subprocess.run(
            ['hermes', '-z', prompt, '--yolo'],
            capture_output=True, text=True, timeout=60,
            cwd=REPO_PATH
        )
        output = result.stdout.strip()
        # Parse numbered list
        topics = []
        for line in output.split('\n'):
            line = line.strip()
            for prefix in ['1.', '2.', '3.', '4.', '5.']:
                if line.startswith(prefix):
                    topic = line[len(prefix):].strip()
                    if topic:
                        topics.append(topic)
                    break
        return topics[:5]
    except Exception as e:
        logger.error(f'Scout find topics error: {e}')
        return []

# ─── Scout: Research + Write + Publish ───

def scout_research_and_write(topic):
    """Ask Scout to research, write, and save article to a file."""
    prompt = f'''You are writing an article for vyuapp.my.id blog.

TOPIC: {topic}

YOUR TASK — Do ALL of these steps:

1. RESEARCH: Use web_search to find 3-5 real sources about "{topic}". Get real data, statistics, examples.

2. WRITE: Write a comprehensive article in Indonesian (NO English sentences, only technical terms kept in English).
   - Format: HTML (<h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <a>, <img>)
   - Minimum 2000 words
   - 8-10 sections with H2 headings
   - Include 2-3 internal links to existing articles:
     * /insights/studio-kecil-mengalahkan-agensi-besar
     * /insights/sellica-mesin-intelijen-pasar
     * /insights/avalon-estetika-sebagai-strategi
   - Include 3-5 Unsplash images via <img> tags with descriptive alt text
   - End with FAQ section (3 questions)
   - Include a Sources section with the URLs you found

3. SAVE: Write the complete article to /tmp/vyuapp-article.json as JSON:
   {{
     "title": "Article Title Here",
     "slug": "article-slug-here",
     "excerpt": "150 char summary",
     "content": "<h1>Full HTML content here</h1>",
     "cover": "https://images.unsplash.com/photo-XXXX?w=1600&q=80",
     "category": "Engineering",
     "tags": ["tag1", "tag2", "tag3"]
   }}

IMPORTANT: The article content must be REAL paragraphs written from your research, NOT template text.
Each section must have 2-3 paragraphs of actual content.

Write the file using the write_file tool or terminal echo command.'''

    try:
        result = subprocess.run(
            ['hermes', '-z', prompt, '--yolo', '--toolsets', 'web,terminal,file'],
            capture_output=True, text=True, timeout=300,
            cwd=REPO_PATH
        )
        output = result.stdout.strip()
        logger.info(f'Scout output length: {len(output)} chars')
        
        # Try to read the saved article file
        if os.path.exists('/tmp/vyuapp-article.json'):
            with open('/tmp/vyuapp-article.json') as f:
                article = json.load(f)
            return article, output
        
        # Fallback: try to extract JSON from Scout output
        json_match = re.search(r'\{[^{}]*"title"[^{}]*"content"[^{}]*\}', output, re.DOTALL)
        if json_match:
            try:
                article = json.loads(json_match.group())
                return article, output
            except:
                pass
        
        return None, output
    except Exception as e:
        logger.error(f'Scout research error: {e}')
        return None, str(e)

# ─── Commands ───

async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        'Halo! Saya VyuApp Writer Bot 🤖\n\n'
        '/topics — Scout cari 5 topik\n'
        '/status — Cek status\n'
        '/help — Bantuan'
    )

async def cmd_help(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        'Cara kerja:\n'
        '1. /topics → Scout cari topik\n'
        '2. Pilih nomor (1-5)\n'
        '3. Scout riset + tulis artikel\n'
        '4. Ketik "approve" atau "reject"\n'
        '5. Artikel terbit!'
    )

async def cmd_status(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    s = load_state()
    await update.message.reply_text(
        f'Phase: {s.get("phase", "IDLE")}\n'
        f'Topik: {s.get("selected_topic", "-")}\n'
        f'Update: {s.get("updated_at", "-")}'
    )

async def cmd_topics(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if update.effective_chat.id != CHAT_ID:
        return await update.message.reply_text('Unauthorized.')
    
    await update.message.reply_text('🔍 Scout mencari topik...')
    
    topics = scout_find_topics()
    
    if not topics:
        return await update.message.reply_text('❌ Scout gagal cari topik. Coba lagi.')
    
    s = load_state()
    s['phase'] = 'WAITING_TOPIC_SELECTION'
    s['topics'] = topics
    save_state(s)
    
    text = f'{greeting()}, Vy! ☀️\n\n5 topik hari ini:\n\n'
    for i, t in enumerate(topics, 1):
        text += f'{i}. {t}\n'
    text += '\nPilih nomor (1-5) 🎯'
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
        s['phase'] = 'SCOUT_RESEARCHING'
        s['selected_topic'] = topic
        save_state(s)
        
        await update.message.reply_text(
            f'🔍 Scout sedang riset & tulis artikel:\n\n'
            f'{topic}\n\n'
            f'⏳ Estimasi: 2-5 menit...\n'
            f'(Scout akan riset web, tulis 2000+ kata, simpan ke file)'
        )
        
        # Scout does everything
        article, scout_output = scout_research_and_write(topic)
        
        if article and article.get('content'):
            # Check if content is real (not template)
            content = article.get('content', '')
            content_words = len(re.sub(r'<[^>]+>', ' ', content).split())
            
            if content_words < 200:
                s['phase'] = 'WAITING_TOPIC_SELECTION'
                save_state(s)
                await update.message.reply_text(
                    '❌ Artikel terlalu pendek. Scout perlu tulis lebih banyak.\n'
                    'Ketik /topics untuk topik baru.'
                )
                return
            
            s['phase'] = 'WAITING_APPROVAL'
            s['article'] = article
            s['word_count'] = content_words
            save_state(s)
            
            preview = re.sub(r'<[^>]+>', ' ', content[:800]).strip()
            text = f'📝 Review Artikel:\n\n'
            text += f'Judul: {article.get("title", "")}\n'
            text += f'Kata: ~{content_words}\n'
            text += f'Sumber: {len(article.get("tags", []))} tags\n\n'
            text += f'Preview:\n{preview[:500]}...\n\n'
            text += 'Ketik "approve" atau "reject"'
            await update.message.reply_text(text)
        else:
            s['phase'] = 'WAITING_TOPIC_SELECTION'
            save_state(s)
            preview = scout_output[:500] if scout_output else 'No output'
            await update.message.reply_text(
                f'❌ Scout gagal generate artikel.\n\n'
                f'Output: {preview}\n\n'
                f'Ketik /topics untuk coba lagi.'
            )
        return
    
    # Approval
    if phase == 'WAITING_APPROVAL':
        if text.lower() in ('approve', 'ya', 'ok', 'oke'):
            s['phase'] = 'PUBLISHING'
            save_state(s)
            await update.message.reply_text('🚀 Publishing...')
            
            article = s.get('article', {})
            ok = publish_to_supabase(
                title=article.get('title', 'Article'),
                slug=article.get('slug', 'article'),
                excerpt=article.get('excerpt', ''),
                content=article.get('content', ''),
                cover=article.get('cover', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80'),
                category=article.get('category', 'Engineering'),
                tags=article.get('tags', ['Tutorial'])
            )
            
            if ok:
                slug = article.get('slug', 'article')
                s['phase'] = 'DONE'
                save_state(s)
                await update.message.reply_text(
                    f'✅ Artikel Terbit!\n\n'
                    f'Judul: {article.get("title", "")}\n'
                    f'Kata: ~{s.get("word_count", "?")}\n\n'
                    f'https://vyuapp.my.id/insights/{slug}\n\n'
                    f'/topics untuk topik berikutnya!'
                )
            else:
                s['phase'] = 'WAITING_APPROVAL'
                save_state(s)
                await update.message.reply_text('❌ Gagal publish. Coba lagi.')
            return
        
        elif text.lower() in ('reject', 'tidak', 'batal'):
            s['phase'] = 'IDLE'
            s['selected_topic'] = None
            save_state(s)
            await update.message.reply_text('❌ Dibatalkan. /topics untuk baru.')
            return
    
    # Default
    if phase == 'IDLE':
        await update.message.reply_text('Ketik /topics untuk mulai.')
    elif phase == 'WAITING_TOPIC_SELECTION':
        await update.message.reply_text('Pilih nomor 1-5.')
    elif phase == 'WAITING_APPROVAL':
        await update.message.reply_text('Ketik "approve" atau "reject".')
    elif phase == 'SCOUT_RESEARCHING':
        await update.message.reply_text('⏳ Scout sedang kerja...')

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
