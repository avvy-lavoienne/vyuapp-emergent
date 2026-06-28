#!/usr/bin/env python3
"""VyuApp Writer Bot v2 — Conversational workflow with Scout.

Workflow:
  Phase 1: /topics → Scout finds 5 topics → Send to Vy
  Phase 2: Vy selects → Scout researches → Send approval
  Phase 3: Vy approves → Publish → Send link
"""

import os, json, subprocess, logging, requests
from datetime import datetime
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

load_dotenv('/root/vyuapp-emergent/.env')

BOT_TOKEN = os.getenv('VYUAPP_WRITER_BOT_TOKEN', '')
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
        '3. Scout riset mendalam\n'
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
    
    # Run scout-topics.py
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
        return await update.message.reply_text('❌ Gagal cari topik.')
    
    text = f'{greeting()}, Vy! ☀️\n\n🔍 5 topik untuk hari ini:\n\n'
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
    
    # Phase 1: Topic selection
    if phase == 'WAITING_TOPIC_SELECTION' and text in '12345' and len(text) == 1:
        idx = int(text) - 1
        topics = s.get('topics', [])
        if idx >= len(topics):
            return await update.message.reply_text('Nomor tidak valid.')
        
        topic = topics[idx]
        s['phase'] = 'RESEARCHING'
        s['selected_topic'] = topic
        save_state(s)
        
        await update.message.reply_text(f'🔍 Riset: {topic}\n\nScout bekerja... ⏳')
        
        # Do research
        research = do_research(topic)
        if research:
            s['phase'] = 'WAITING_APPROVAL'
            s['research'] = research
            save_state(s)
            
            text = f'📝 Review Artikel:\n\n'
            text += f'Judul: {research["title"]}\n'
            text += f'Kata: ~{research["word_count"]}\n'
            text += f'Sections: {len(research["sections"])}\n\n'
            for i, sec in enumerate(research['sections'], 1):
                text += f'{i}. {sec}\n'
            text += f'\nSumber: {len(research["sources"])} URLs\n\n'
            text += 'Ketik "approve" atau "reject"'
            await update.message.reply_text(text)
        else:
            s['phase'] = 'IDLE'
            save_state(s)
            await update.message.reply_text('❌ Riset gagal. /topics lagi.')
        return
    
    # Phase 2: Approval
    if phase == 'WAITING_APPROVAL':
        if text.lower() in ('approve', 'ya', 'ok', 'oke'):
            s['phase'] = 'PUBLISHING'
            save_state(s)
            await update.message.reply_text('🚀 Publishing...')
            ok, msg = do_publish(s)
            if ok:
                slug = s['research'].get('slug', 'article')
                s['phase'] = 'DONE'
                save_state(s)
                await update.message.reply_text(
                    f'✅ Artikel Terbit!\n\n'
                    f'🔗 https://vyuapp.my.id/insights/{slug}\n\n'
                    f'/topics untuk topik berikutnya!'
                )
            else:
                s['phase'] = 'WAITING_APPROVAL'
                save_state(s)
                await update.message.reply_text(f'❌ Gagal: {msg}')
            return
        elif text.lower() in ('reject', 'tidak', 'batal'):
            s['phase'] = 'IDLE'
            s['selected_topic'] = None
            save_state(s)
            await update.message.reply_text('❌ Dibatalkan. /topics untuk baru.')
            return
    
    # Default responses
    if phase == 'IDLE':
        await update.message.reply_text('Ketik /topics untuk mulai.')
    elif phase == 'WAITING_TOPIC_SELECTION':
        await update.message.reply_text('Pilih nomor 1-5.')
    elif phase == 'WAITING_APPROVAL':
        await update.message.reply_text('Ketik "approve" atau "reject".')

# ─── Research ───

def do_research(topic):
    """Simple research — in production calls Scout agent."""
    slug = topic.lower().replace(' ', '-').replace('/', '-').replace(':', '')[:60]
    return {
        'title': topic,
        'slug': slug,
        'excerpt': f'Panduan lengkap {topic} untuk developer Indonesia.',
        'sections': [
            'Pendahuluan',
            f'Mengapa {topic} Penting',
            'Konsep Dasar',
            'Best Practices',
            'Studi Kasus',
            'Kesimpulan'
        ],
        'sources': ['https://nextjs.org/docs', 'https://vercel.com/blog'],
        'word_count': 2500,
        'category': 'Engineering',
        'tags': [topic.split()[0], 'Tutorial', 'Web Dev']
    }

# ─── Publish ───

def do_publish(s):
    r = s.get('research', {})
    title = r.get('title', 'Article')
    slug = r.get('slug', 'article')
    
    content = f'<h1>{title}</h1>\n<p>{r.get("excerpt", "")}</p>\n'
    for sec in r.get('sections', []):
        content += f'<h2>{sec}</h2>\n<p>Bagian {sec.lower()}.</p>\n'
    
    ok, msg = publish_to_supabase(
        title=title, slug=slug, excerpt=r.get('excerpt', ''),
        content=content,
        cover='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80',
        category=r.get('category', 'Engineering'),
        tags=r.get('tags', ['Tutorial'])
    )
    return ok, msg

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
    
    print('VyuApp Writer Bot v2 started! 🚀')
    app.run_polling(drop_pending_updates=True)

if __name__ == '__main__':
    main()
