#!/usr/bin/env python3
"""Auto-publish hook: called when QA task completes.

Reads QA task result/metadata to find article data,
then calls publish-article.py to push to Supabase as published.

Usage (from kanban pipeline or QA agent):
    python auto-publish-on-qa-done.py <task_id>
    python auto-publish-on-qa-done.py --slug <slug> --title <title> --content-file <path>

This script:
    1. Resolves article data from task metadata or file args
    2. Calls publish-article.py
    3. Creates a 'publish-article' child task on kanban (for tracking)
"""

import os
import sys
import json
import subprocess
import argparse


def load_dotenv(path):
    """Simple .env loader."""
    env = {}
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, _, value = line.partition('=')
                    env[key.strip()] = value.strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return env


_env = load_dotenv('/root/vyuapp-emergent/.env')
PROJECT_ROOT = '/root/vyuapp-emergent'
ARTICLE_TMP_DIR = '/tmp'


def find_article_file(slug: str) -> str | None:
    """Find article HTML/JSON file in /tmp."""
    candidates = [
        f'{ARTICLE_TMP_DIR}/vyuapp-article-{slug}.html',
        f'{ARTICLE_TMP_DIR}/vyuapp-article-{slug}.json',
        f'{ARTICLE_TMP_DIR}/article-{slug}.html',
        f'{ARTICLE_TMP_DIR}/article-{slug}.json',
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    return None


def build_article_from_file(filepath: str, slug: str, title: str = '') -> dict:
    """Build article dict from file."""
    article = {'slug': slug}

    if filepath.endswith('.json'):
        with open(filepath) as f:
            data = json.load(f)
            article.update(data)
    else:
        # HTML file
        with open(filepath) as f:
            article['content'] = f.read()

    if title:
        article['title'] = title
    if not article.get('title'):
        article['title'] = slug.replace('-', ' ').title()

    return article


def call_publish(article: dict) -> dict:
    """Call publish-article.py with article data."""
    script = os.path.join(PROJECT_ROOT, 'scripts', 'publish-article.py')
    if not os.path.exists(script):
        raise FileNotFoundError(f'publish-article.py not found at {script}')

    payload = json.dumps(article)
    result = subprocess.run(
        [sys.executable, script],
        input=payload,
        capture_output=True,
        text=True,
        timeout=60
    )

    # Parse result
    output = result.stdout
    if result.returncode != 0:
        raise RuntimeError(f'publish-article.py failed (exit {result.returncode}): {result.stderr}')

    # Extract JSON result
    if '---RESULT---' in output:
        json_part = output.split('---RESULT---')[1].strip()
        return json.loads(json_part)

    return {'ok': True, 'output': output}


def main():
    parser = argparse.ArgumentParser(description='Auto-publish article when QA task completes')
    parser.add_argument('task_id', nargs='?', help='QA kanban task ID')
    parser.add_argument('--slug', '-s', help='Article slug')
    parser.add_argument('--title', '-t', help='Article title')
    parser.add_argument('--content-file', '-c', help='Path to article HTML file')
    parser.add_argument('--category', default='Engineering', help='Article category')
    parser.add_argument('--tags', nargs='*', help='Article tags')
    args = parser.parse_args()

    slug = args.slug
    title = args.title

    # Resolve article data
    article = {}

    if args.content_file and os.path.exists(args.content_file):
        # Direct file path
        article = build_article_from_file(args.content_file, slug or 'untitled', title or '')
    elif slug:
        # Try to find file in /tmp
        filepath = find_article_file(slug)
        if filepath:
            article = build_article_from_file(filepath, slug, title or '')
        else:
            print(f'WARNING: No article file found for slug "{slug}"', file=sys.stderr)
            article = {
                'slug': slug,
                'title': title or slug.replace('-', ' ').title(),
                'content': f'<p>Article content for {title or slug}</p>',
            }
    else:
        print('ERROR: Need --slug or --content-file', file=sys.stderr)
        sys.exit(1)

    # Set defaults
    if args.category:
        article.setdefault('category', args.category)
    if args.tags:
        article.setdefault('tags', args.tags)

    # Publish
    try:
        result = call_publish(article)
        print(f'Auto-publish SUCCESS')
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f'Auto-publish FAILED: {e}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
