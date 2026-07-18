#!/usr/bin/env python3
"""VyuApp Writer Bot v4 — Thin Telegram UI Layer.

Bot handles Telegram conversation ONLY.
All business logic lives in:
- topic-selector.py (topics)
- kanban-pipeline.py (article generation)
- hermes kanban (task management)

Architecture:
- /start, /help → static text
- /topics → call topic-selector.py, display results
- /artikel [topik] → call kanban-pipeline.py, display task IDs
- /kanban → call hermes kanban list, format output
- /status → read from kanban + file state
- Inline buttons → trigger kanban actions (not in-memory)
"""

import os, json, logging, subprocess, sys, importlib.util
from datetime import datetime
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes

load_dotenv('/root/vyuapp/.env')

BOT_TOKEN = os.getenv('VYUAPP_WRITER_BOT_TOKEN', '')
CHAT_ID = int(os.getenv('VYUAPP_WRITER_CHAT_ID', '0'))
STATE_FILE = '/root/vyuapp/scripts/scout-state.json'
REPO_PATH = '/root/vyuapp'

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('vyuapp-writer')

# Import topics from scout-topics.py (local, no subprocess)
_spec = importlib.util.spec_from_file_location('scout_topics', '/root/vyuapp/scripts/scout-topics.py')
_scout_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_scout_mod)
find_topics = _scout_mod.find_topics


# ─── Greeting ───

def greeting():
    h = datetime.now().hour
    if 4 <= h < 11: return 'Selamat pagi'
    elif 11 <= h < 15: return 'Selamat siang'
    elif 15 <= h < 18: return 'Selamat sore'
    return 'Selamat malam'


# ─── Kanban Helper ───

def kanban_list(limit=10):
    """Call hermes kanban list and parse output."""
    try:
        result = subprocess.run(
            ['hermes', 'kanban', 'list', '--limit', str(limit), '--json'],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            return json.loads(result.stdout)
    except Exception as e:
        logger.error(f'kanban list error: {e}')
    return None


def kanban_status():
    """Get kanban board status summary."""
    try:
        result = subprocess.run(
            ['hermes', 'kanban', 'list', '--json'],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            tasks = data.get('tasks', [])
            status_counts = {}
            for t in tasks:
                s = t.get('status', 'unknown')
                status_counts[s] = status_counts.get(s, 0) + 1
            return {'total': len(tasks), 'counts': status_counts, 'tasks': tasks}
    except Exception as e:
        logger.error(f'kanban status error: {e}')
    return None


# ─── Commands ───

async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        'Halo! Saya VyuApp Writer Bot v4 🤖\n\n'
        '/topics — Lihat 5 topik artikel\n'
        '/artikel [topik] — Generate artikel via pipeline\n'
        '/kanban — Lihat task board\n'
        '/status — Cek status pipeline\n'
        '/pending — Lihat draft artikel\n'
        '/approve [slug] — Publish draft artikel\n'
        '/help — Bantuan'
    )


async def cmd_help(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        'Cara kerja:\n'
        '1. /topics → Lihat topik hari ini\n'
        '2. /artikel [topik] → Trigger pipeline Scout→Scribe→QA\n'
        '3. /kanban → Lihat progress di task board\n'
        '4. Artikel otomatis masuk draft setelah QA pass\n'
        '5. /pending → Lihat draft menunggu approval\n'
        '6. /approve [slug] → Publish artikel\n\n'
        'Semua business logic di pipeline, bukan di bot.'
    )


async def cmd_topics(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Show topics from local scout-topics pool (no subprocess)."""
    if update.effective_chat.id != CHAT_ID:
        return await update.message.reply_text('Unauthorized.')

    topics = find_topics()

    if not topics:
        return await update.message.reply_text('❌ Gagal ambil topik. Coba lagi.')

    text = f'{greeting()}, Vy! ☀️\n\n5 topik hari ini:\n\n'
    for i, t in enumerate(topics, 1):
        text += f'{i}. {t}\n'
    text += '\nGunakan /artikel [topik] untuk generate via pipeline 🎯'
    await update.message.reply_text(text)


async def cmd_artikel(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Trigger article generation via kanban pipeline."""
    if update.effective_chat.id != CHAT_ID:
        return await update.message.reply_text('Unauthorized.')

    # Get topic from args or use first topic from pool
    args = ctx.args
    if args:
        topic = ' '.join(args)
    else:
        topics = find_topics()
        topic = topics[0] if topics else 'Next.js best practices'

    # Call kanban-pipeline.py to create task
    try:
        result = subprocess.run(
            [sys.executable, '/root/vyuapp/scripts/kanban-pipeline.py', topic],
            capture_output=True, text=True, timeout=60
        )
        if result.returncode == 0:
            output = result.stdout.strip()
            await update.message.reply_text(
                f'🚀 Artikel pipeline triggered!\n\n'
                f'Topik: {topic}\n\n'
                f'{output}\n\n'
                f'Gunakan /kanban untuk cek progress.'
            )
        else:
            await update.message.reply_text(
                f'❌ Gagal trigger pipeline.\n\n'
                f'Error: {result.stderr[:500]}'
            )
    except Exception as e:
        await update.message.reply_text(f'❌ Error: {str(e)[:200]}')


async def cmd_kanban(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Show kanban board status."""
    if update.effective_chat.id != CHAT_ID:
        return await update.message.reply_text('Unauthorized.')

    status = kanban_status()
    if not status:
        return await update.message.reply_text('❌ Gagal ambil status kanban.')

    counts = status['counts']
    total = status['total']

    text = f'📋 Kanban Board\n\n'
    text += f'Total: {total} tasks\n\n'

    if counts:
        for status_name, count in sorted(counts.items()):
            emoji = {'done': '✅', 'running': '🔄', 'todo': '📝', 'blocked': '🚫'}.get(status_name, '•')
            text += f'{emoji} {status_name}: {count}\n'

    # Show recent tasks (up to 5)
    tasks = status.get('tasks', [])
    if tasks:
        text += '\n--- Recent ---\n'
        for t in tasks[:5]:
            task_id = t.get('id', '?')[:8]
            title = t.get('title', '?')[:40]
            task_status = t.get('status', '?')
            text += f'• [{task_id}] {title} ({task_status})\n'

    await update.message.reply_text(text)


async def cmd_status(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Show pipeline status from kanban."""
    if update.effective_chat.id != CHAT_ID:
        return await update.message.reply_text('Unauthorized.')

    # Read local state for basic info
    state = {}
    try:
        if os.path.exists(STATE_FILE):
            with open(STATE_FILE) as f:
                state = json.load(f)
    except:
        pass

    text = f'📊 Status\n\n'
    text += f'Phase: {state.get("phase", "IDLE")}\n'
    text += f'Topik: {state.get("selected_topic", "-")}\n'
    text += f'Update: {state.get("updated_at", "-")}\n'

    # Get kanban summary
    status = kanban_status()
    if status:
        counts = status['counts']
        text += f'\n--- Kanban ---\n'
        text += f'Total: {status["total"]} tasks\n'
        for s, c in sorted(counts.items()):
            emoji = {'done': '✅', 'running': '🔄', 'todo': '📝', 'blocked': '🚫'}.get(s, '•')
            text += f'{emoji} {s}: {c}\n'

    await update.message.reply_text(text)


async def cmd_approve(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Approve (publish) a draft article — change status from draft to published."""
    if update.effective_chat.id != CHAT_ID:
        return await update.message.reply_text('Unauthorized.')

    args = ctx.args
    if not args:
        return await update.message.reply_text(
            'Gunakan: /approve [slug]\n'
            'Contoh: /approve nextjs-best-practices\n\n'
            'Artikel akan diubah dari draft → published.'
        )

    slug = args[0]

    # Update Supabase: draft → published
    import urllib.request, urllib.error
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL', '')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')
    if not supabase_url or not supabase_key:
        return await update.message.reply_text('❌ Supabase credentials not configured.')

    url = f'{supabase_url}/rest/v1/articles?slug=eq.{slug}'
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
    }
    payload = json.dumps({
        'status': 'published',
        'published_at': datetime.now().isoformat(),
    }).encode('utf-8')

    try:
        req = urllib.request.Request(url, data=payload, headers=headers, method='PATCH')
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read().decode('utf-8'))
            if body:
                article = body[0]
                title = article.get('title', slug)
                await update.message.reply_text(
                    f'✅ Artikel dipublish!\n\n'
                    f'Judul: {title}\n'
                    f'Slug: {slug}\n'
                    f'Status: published\n\n'
                    f'🔗 https://vyuapp.my.id/insights/{slug}'
                )
            else:
                await update.message.reply_text(f'❌ Artikel dengan slug "{slug}" tidak ditemukan.')
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else str(e)
        await update.message.reply_text(f'❌ Gagal publish: {error_body[:300]}')
    except Exception as e:
        await update.message.reply_text(f'❌ Error: {str(e)[:200]}')


async def cmd_pending(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Show draft articles awaiting approval."""
    if update.effective_chat.id != CHAT_ID:
        return await update.message.reply_text('Unauthorized.')

    import urllib.request
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL', '')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')
    if not supabase_url or not supabase_key:
        return await update.message.reply_text('❌ Supabase credentials not configured.')

    url = f'{supabase_url}/rest/v1/articles?status=eq.draft&order=created_at.desc&limit=10&select=slug,title,created_at'
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
    }

    try:
        req = urllib.request.Request(url, headers=headers, method='GET')
        with urllib.request.urlopen(req, timeout=30) as resp:
            articles = json.loads(resp.read().decode('utf-8'))
            if not articles:
                return await update.message.reply_text('📭 Tidak ada artikel draft.')

            text = '📝 Draft Articles:\n\n'
            for i, a in enumerate(articles, 1):
                title = a.get('title', '?')[:40]
                slug = a.get('slug', '?')
                created = a.get('created_at', '?')[:10]
                text += f'{i}. {title}\n   Slug: {slug} | {created}\n'

            text += '\n/approve [slug] untuk publish'
            await update.message.reply_text(text)
    except Exception as e:
        await update.message.reply_text(f'❌ Error: {str(e)[:200]}')


# ─── Callback Query Handler (Inline Buttons) ───

async def handle_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Handle inline button callbacks - trigger kanban actions."""
    query = update.callback_query
    await query.answer()

    data = query.data
    if not data:
        return

    # Parse callback data: action:task_id
    parts = data.split(':', 1)
    if len(parts) != 2:
        return await query.edit_message_text('❌ Invalid callback data.')

    action, task_id = parts

    if action == 'approve':
        # Trigger kanban approve
        try:
            result = subprocess.run(
                ['hermes', 'kanban', 'update', task_id, '--status', 'done'],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode == 0:
                await query.edit_message_text(f'✅ Task {task_id[:8]} approved!')
            else:
                await query.edit_message_text(f'❌ Gagal approve: {result.stderr[:200]}')
        except Exception as e:
            await query.edit_message_text(f'❌ Error: {str(e)[:200]}')

    elif action == 'reject':
        # Trigger kanban reject/block
        try:
            result = subprocess.run(
                ['hermes', 'kanban', 'update', task_id, '--status', 'blocked', '--reason', 'Rejected by user'],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode == 0:
                await query.edit_message_text(f'🚫 Task {task_id[:8]} rejected.')
            else:
                await query.edit_message_text(f'❌ Gagal reject: {result.stderr[:200]}')
        except Exception as e:
            await query.edit_message_text(f'❌ Error: {str(e)[:200]}')

    elif action == 'view':
        # Show task details
        try:
            result = subprocess.run(
                ['hermes', 'kanban', 'show', task_id, '--json'],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode == 0:
                task = json.loads(result.stdout)
                text = f'📋 Task Details\n\n'
                text += f'ID: {task.get("id", "?")}\n'
                text += f'Title: {task.get("title", "?")}\n'
                text += f'Status: {task.get("status", "?")}\n'
                text += f'Assignee: {task.get("assignee", "?")}\n'
                if task.get('body'):
                    text += f'\n{task["body"][:500]}'
                await query.edit_message_text(text)
            else:
                await query.edit_message_text(f'❌ Gagal ambil detail: {result.stderr[:200]}')
        except Exception as e:
            await query.edit_message_text(f'❌ Error: {str(e)[:200]}')


# ─── Message Handler ───

async def handle_msg(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if update.effective_chat.id != CHAT_ID:
        return

    text = update.message.text.strip()

    # Simple responses based on keywords
    text_lower = text.lower()
    if any(word in text_lower for word in ['status', 'progress', 'update']):
        await cmd_status(update, ctx)
    elif any(word in text_lower for word in ['topik', 'topic', 'topics']):
        await cmd_topics(update, ctx)
    elif any(word in text_lower for word in ['kanban', 'task', 'board']):
        await cmd_kanban(update, ctx)
    elif any(word in text_lower for word in ['artikel', 'article', 'generate']):
        await cmd_artikel(update, ctx)
    elif any(word in text_lower for word in ['pending', 'draft', 'review', 'approval']):
        await cmd_pending(update, ctx)
    else:
        await update.message.reply_text(
            'Gunakan command:\n'
            '/topics — Lihat topik\n'
            '/artikel — Generate artikel\n'
            '/kanban — Lihat task board\n'
            '/pending — Lihat draft\n'
            '/approve [slug] — Publish draft'
        )


# ─── Main ───

def main():
    if not BOT_TOKEN:
        print('ERROR: VYUAPP_WRITER_BOT_TOKEN not set')
        return

    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler('start', cmd_start))
    app.add_handler(CommandHandler('help', cmd_help))
    app.add_handler(CommandHandler('topics', cmd_topics))
    app.add_handler(CommandHandler('artikel', cmd_artikel))
    app.add_handler(CommandHandler('kanban', cmd_kanban))
    app.add_handler(CommandHandler('status', cmd_status))
    app.add_handler(CommandHandler('approve', cmd_approve))
    app.add_handler(CommandHandler('pending', cmd_pending))
    app.add_handler(CallbackQueryHandler(handle_callback))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_msg))

    print('VyuApp Writer Bot v4 started! (Thin UI Layer)')
    app.run_polling(drop_pending_updates=True)


if __name__ == '__main__':
    main()
