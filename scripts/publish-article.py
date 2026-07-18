#!/usr/bin/env python3
"""Publish article to Supabase and notify Telegram.

Usage:
    # From pipeline (JSON on stdin):
    echo '{"slug":"my-article","title":"My Article","content":"<html>..."}' | python publish-article.py

    # From file:
    python publish-article.py --file /tmp/vyuapp-article-{slug}.json

    # With args:
    python publish-article.py --slug my-article --title "My Article" --content-file /tmp/article.html

Flow:
    1. Read article data (JSON or args)
    2. Upsert to Supabase articles table (status=published) with retry
    3. Send Telegram notification: "Artikel siap review: {title}"
    4. Output article ID + slug

Exit codes:
    0 = success
    1 = validation error
    2 = Supabase error (after retries exhausted)
    3 = Telegram error (article still published)
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.error
import time
import logging
from datetime import datetime, timezone

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
log = logging.getLogger('publish-article')

# Load .env from project root
def load_dotenv(path):
    """Simple .env loader (no external deps)."""
    env = {}
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, _, value = line.partition('=')
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    env[key] = value
    except FileNotFoundError:
        pass
    return env

# Load env
_env = load_dotenv('/root/vyuapp/.env')
SUPABASE_URL = _env.get('NEXT_PUBLIC_SUPABASE_URL', os.getenv('NEXT_PUBLIC_SUPABASE_URL', ''))
SUPABASE_KEY = _env.get('SUPABASE_SERVICE_ROLE_KEY', os.getenv('SUPABASE_SERVICE_ROLE_KEY', ''))
BOT_TOKEN=_env.get('VYUAPP_WRITER_BOT_TOKEN', os.getenv('VYUAPP_WRITER_BOT_TOKEN', ''))
CHAT_ID = _env.get('VYUAPP_WRITER_CHAT_ID', os.getenv('VYUAPP_WRITER_CHAT_ID', ''))


def slugify(text: str) -> str:
    """Generate URL-friendly slug from text."""
    import re
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text[:80].strip('-')


def validate_article(data: dict) -> list[str]:
    """Validate article data. Returns list of errors."""
    errors = []
    if not data.get('title'):
        errors.append('Missing required field: title')
    if not data.get('content'):
        errors.append('Missing required field: content')
    return errors


def supabase_upsert(article: dict, max_retries: int = 3) -> dict:
    """Upsert article to Supabase with retry logic. Returns response data.

    Retries up to max_retries times with exponential backoff (1s, 2s, 4s).
    Only retries on transient errors (timeout, connection, 5xx).
    Raises ValueError on permanent failure after all retries exhausted.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError('Supabase credentials not configured')

    url = f"{SUPABASE_URL}/rest/v1/articles"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation',
    }

    # Prepare payload
    slug = article.get('slug') or slugify(article.get('title', 'untitled'))
    payload = {
        'slug': slug,
        'title': article.get('title', ''),
        'excerpt': article.get('excerpt', ''),
        'content': article.get('content', ''),
        'cover': article.get('cover', ''),
        'category': article.get('category', 'Engineering'),
        'tags': article.get('tags', []),
        'status': 'published',
    }

    # Upsert on slug conflict — with retry
    data = json.dumps([payload]).encode('utf-8')
    last_error = None

    for attempt in range(1, max_retries + 1):
        req = urllib.request.Request(
            url,
            data=data,
            headers=headers,
            method='POST'
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                body = json.loads(resp.read().decode('utf-8'))
                result = body[0] if body else payload
                log.info(f'Supabase upsert OK (attempt {attempt}): slug={slug}, id={result.get("id", "unknown")}')
                return result

        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8') if e.fp else str(e)
            last_error = f'Supabase HTTP {e.code}: {error_body}'
            log.warning(f'Supabase upsert FAILED (attempt {attempt}/{max_retries}): {last_error}')

            # Don't retry on client errors (4xx except 429)
            if 400 <= e.code < 500 and e.code != 429:
                raise ValueError(f'Supabase client error (no retry): {last_error}')

        except urllib.error.URLError as e:
            last_error = f'Supabase connection error: {e.reason}'
            log.warning(f'Supabase upsert FAILED (attempt {attempt}/{max_retries}): {last_error}')

        except TimeoutError:
            last_error = 'Supabase request timed out (30s)'
            log.warning(f'Supabase upsert FAILED (attempt {attempt}/{max_retries}): {last_error}')

        except Exception as e:
            last_error = f'Unexpected error: {type(e).__name__}: {e}'
            log.warning(f'Supabase upsert FAILED (attempt {attempt}/{max_retries}): {last_error}')

        # Backoff before retry (1s, 2s, 4s)
        if attempt < max_retries:
            backoff = 2 ** (attempt - 1)
            log.info(f'Retrying in {backoff}s...')
            time.sleep(backoff)

    # All retries exhausted
    raise ValueError(f'Supabase upsert FAILED after {max_retries} attempts. Last error: {last_error}')


def send_telegram_notification(title: str, slug: str, article_id: str = ''):
    """Send Telegram notification about new published article."""
    if not BOT_TOKEN or not CHAT_ID:
        log.warning('Telegram credentials not set, skipping notification')
        return False

    preview_url = f'https://vyuapp.my.id/insights/{slug}'
    admin_url = f'https://vyuapp.my.id/admin/articles/{article_id}' if article_id else ''

    text = (
        f'✅ Artikel berhasil publish!\n\n'
        f'Judul: {title}\n'
        f'Status: published\n\n'
        f'Preview: {preview_url}\n'
    )
    if admin_url:
        text += f'Admin: {admin_url}\n'

    url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
    payload = json.dumps({
        'chat_id': CHAT_ID,
        'text': text,
        'parse_mode': 'HTML',
    }).encode('utf-8')

    req = urllib.request.Request(
        url,
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode('utf-8'))
            return result.get('ok', False)
    except Exception as e:
        log.warning(f'Telegram notification failed: {e}')
        return False


def read_from_stdin() -> dict:
    """Read article JSON from stdin."""
    data = sys.stdin.read().strip()
    if not data:
        raise ValueError('No data on stdin')
    return json.loads(data)


def read_from_file(path: str) -> dict:
    """Read article JSON from file."""
    with open(path) as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(description='Publish article to Supabase as published')
    parser.add_argument('--file', '-f', help='Read article JSON from file')
    parser.add_argument('--slug', '-s', help='Article slug (auto-generated from title if omitted)')
    parser.add_argument('--title', '-t', help='Article title')
    parser.add_argument('--excerpt', '-e', help='Article excerpt')
    parser.add_argument('--content-file', '-c', help='Read HTML content from file')
    parser.add_argument('--category', default='Engineering', help='Article category')
    parser.add_argument('--tags', nargs='*', help='Article tags')
    parser.add_argument('--no-notify', action='store_true', help='Skip Telegram notification')
    parser.add_argument('--dry-run', action='store_true', help='Print payload without publishing')
    args = parser.parse_args()

    # 1. Read article data
    try:
        if args.file:
            article = read_from_file(args.file)
        elif not sys.stdin.isatty():
            article = read_from_stdin()
        else:
            # Build from args
            article = {}
            if args.title:
                article['title'] = args.title
            if args.slug:
                article['slug'] = args.slug
            if args.excerpt:
                article['excerpt'] = args.excerpt
            if args.content_file:
                with open(args.content_file) as f:
                    article['content'] = f.read()
            if args.category:
                article['category'] = args.category
            if args.tags:
                article['tags'] = args.tags

            if not article:
                parser.print_help()
                sys.exit(1)
    except json.JSONDecodeError as e:
        log.error(f'Invalid JSON: {e}')
        sys.exit(1)
    except Exception as e:
        log.error(f'Failed to read input: {e}')
        sys.exit(1)

    # 2. Validate
    errors = validate_article(article)
    if errors:
        for err in errors:
            log.error(err)
        sys.exit(1)

    # Generate slug if missing
    if not article.get('slug'):
        article['slug'] = slugify(article['title'])

    slug = article['slug']
    title = article['title']

    # 3. Dry run
    if args.dry_run:
        print(json.dumps(article, indent=2, ensure_ascii=False))
        sys.exit(0)

    # 4. Publish to Supabase (with retry)
    log.info(f'Publishing article: slug={slug}, title={title}')
    try:
        result = supabase_upsert(article)
        article_id = result.get('id', '')
        log.info(f'Published OK: id={article_id}, slug={slug}')
        print(f'OK: Published as published')
        print(f'ID: {article_id}')
        print(f'Slug: {slug}')
        print(f'Title: {title}')
    except Exception as e:
        log.error(f'Supabase publish FAILED after retries: {e}')
        sys.exit(2)

    # 5. Telegram notification (non-blocking — article already published)
    if not args.no_notify:
        try:
            sent = send_telegram_notification(title, slug, article_id)
            if sent:
                log.info('Telegram notification sent')
            else:
                log.warning('Telegram notification not sent (check credentials)')
        except Exception as e:
            log.warning(f'Telegram error: {e}')
            # Don't exit with error — article was published successfully
    else:
        log.info('Telegram notification skipped (--no-notify)')

    # 6. Output result as JSON (for pipeline consumption)
    result_data = {
        'ok': True,
        'article_id': article_id,
        'slug': slug,
        'title': title,
        'status': 'published',
        'preview_url': f'https://vyuapp.my.id/insights/{slug}',
    }
    print(f'\n---RESULT---')
    print(json.dumps(result_data, ensure_ascii=False))


if __name__ == '__main__':
    main()
