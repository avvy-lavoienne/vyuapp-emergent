#!/usr/bin/env python3
"""kanban-pipeline.py — Create article pipeline tasks on kanban board.

Called by vyuapp-writer-bot.py cmd_artikel() to create a Scout → Scribe → QA
pipeline with proper parent dependencies.

Usage:
    python3 kanban-pipeline.py "topic string"
    python3 kanban-pipeline.py --board tim-artikel-hore "topic string"

Output (stdout):
    JSON with task IDs and pipeline info for the bot to display.

Exit codes:
    0 = success
    1 = usage error (no topic)
    2 = kanban CLI error
"""

import json
import os
import subprocess
import sys
import re
from datetime import datetime

BOARD = os.environ.get('HERMES_KANBAN_BOARD', 'tim-artikel-hore')
SCRIPTS_DIR = '/root/vyuapp/scripts'


def slugify(text: str, max_len: int = 50) -> str:
    """Create a URL-safe slug from text."""
    slug = re.sub(r'[^\w\s-]', '', text.lower())
    slug = re.sub(r'[\s_]+', '-', slug).strip('-')
    return slug[:max_len].rstrip('-')


def kanban_create(title: str, body: str = None, assignee: str = None,
                  parents: list = None, board: str = BOARD) -> dict:
    """Create a kanban task and return the JSON result."""
    cmd = ['hermes', 'kanban', 'create', title, '--json']
    if board:
        cmd.extend(['--board', board])
    if body:
        cmd.extend(['--body', body])
    if assignee:
        cmd.extend(['--assignee', assignee])
    if parents:
        for parent_id in parents:
            cmd.extend(['--parent', parent_id])

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if result.returncode != 0:
        raise RuntimeError(
            f'kanban create failed (exit {result.returncode}): {result.stderr.strip()}'
        )
    return json.loads(result.stdout)


def kanban_link(parent_id: str, child_id: str, board: str = BOARD) -> None:
    """Link a parent-child dependency between two tasks."""
    cmd = ['hermes', 'kanban', 'link', parent_id, child_id]
    if board:
        cmd.extend(['--board', board])
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        # Non-fatal — log warning but don't crash
        print(f'WARNING: kanban link failed: {result.stderr.strip()}', file=sys.stderr)


def main():
    # Parse args
    args = sys.argv[1:]
    board = BOARD
    topic = None

    i = 0
    while i < len(args):
        if args[i] == '--board' and i + 1 < len(args):
            board = args[i + 1]
            i += 2
        elif not args[i].startswith('--'):
            topic = args[i]
            i += 1
        else:
            i += 1

    if not topic:
        print('ERROR: No topic provided.', file=sys.stderr)
        print('Usage: python3 kanban-pipeline.py "topic string"', file=sys.stderr)
        sys.exit(1)

    slug = slugify(topic)
    timestamp = datetime.now().strftime('%Y%m%d-%H%M')
    pipeline_id = f'{slug}-{timestamp}'

    try:
        # ── Step 1: Create Scout task (research) ──
        scout = kanban_create(
            title=f'[Scout] Research: {topic}',
            body=(
                f'## Research Task\n\n'
                f'Topic: {topic}\n'
                f'Pipeline: {pipeline_id}\n\n'
                f'### Instructions\n'
                f'1. Research the topic using web search\n'
                f'2. Gather key points, stats, and references\n'
                f'3. Write research notes to /tmp/vyuapp-research-{slug}.json\n'
                f'4. Complete task with summary of findings'
            ),
            assignee='scout',
            board=board,
        )
        scout_id = scout['id']

        # ── Step 2: Create Scribe task (write article, depends on Scout) ──
        scribe = kanban_create(
            title=f'[Scribe] Write: {topic}',
            body=(
                f'## Writing Task\n\n'
                f'Topic: {topic}\n'
                f'Pipeline: {pipeline_id}\n'
                f'Depends on Scout task: {scout_id}\n\n'
                f'### Instructions\n'
                f'1. Read research from /tmp/vyuapp-research-{slug}.json\n'
                f'2. Write a well-structured article (800-1500 words)\n'
                f'3. Save HTML content to /tmp/vyuapp-article-{slug}.html\n'
                f'4. Save article metadata (title, slug, excerpt, category, tags) to /tmp/vyuapp-article-{slug}.json\n'
                f'5. Complete task with article summary'
            ),
            assignee='scribe',
            parents=[scout_id],
            board=board,
        )
        scribe_id = scribe['id']

        # ── Step 3: Create QA task (review article, depends on Scribe) ──
        qa = kanban_create(
            title=f'[QA] Review: {topic}',
            body=(
                f'## QA Review Task\n\n'
                f'Topic: {topic}\n'
                f'Pipeline: {pipeline_id}\n'
                f'Depends on Scribe task: {scribe_id}\n\n'
                f'### Instructions\n'
                f'1. Read article from /tmp/vyuapp-article-{slug}.html\n'
                f'2. Check for:\n'
                f'   - Factual accuracy\n'
                f'   - Grammar and readability\n'
                f'   - Proper HTML structure\n'
                f'   - SEO-friendliness (title, headings, meta)\n'
                f'3. If approved: complete task with "APPROVED" in result\n'
                f'4. If rejected: block task with revision notes\n'
                f'5. On approval, auto-publish hook will publish to Supabase with status=published'
            ),
            assignee='qa',
            parents=[scribe_id],
            board=board,
        )
        qa_id = qa['id']

        # ── Output ──
        output = {
            'ok': True,
            'pipeline_id': pipeline_id,
            'topic': topic,
            'slug': slug,
            'board': board,
            'tasks': {
                'scout': {'id': scout_id, 'title': scout['title']},
                'scribe': {'id': scribe_id, 'title': scribe['title']},
                'qa': {'id': qa_id, 'title': qa['title']},
            },
            'flow': f'Scout({scout_id}) → Scribe({scribe_id}) → QA({qa_id})',
            'created_at': datetime.now().isoformat(),
        }

        # Print structured output for bot consumption
        print(f'📋 Pipeline: {pipeline_id}')
        print(f'📌 Topik: {topic}')
        print(f'')
        print(f'🔍 Scout: {scout_id} — Research "{topic}"')
        print(f'✍️  Scribe: {scribe_id} — Write article')
        print(f'✅ QA: {qa_id} — Review & approve')
        print(f'')
        print(f'Flow: Scout → Scribe → QA → Auto-publish')
        print(f'')
        print(f'---RESULT---')
        print(json.dumps(output, indent=2, ensure_ascii=False))

        sys.exit(0)

    except json.JSONDecodeError as e:
        print(f'ERROR: Failed to parse kanban CLI output: {e}', file=sys.stderr)
        sys.exit(2)
    except RuntimeError as e:
        print(f'ERROR: {e}', file=sys.stderr)
        sys.exit(2)
    except Exception as e:
        print(f'ERROR: Unexpected error: {e}', file=sys.stderr)
        sys.exit(2)


if __name__ == '__main__':
    main()
