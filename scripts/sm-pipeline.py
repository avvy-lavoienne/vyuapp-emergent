#!/usr/bin/env python3
"""sm-pipeline.py — Create social media pipeline tasks on kanban board.

Creates a Reach → Scout → Scribe → Image-gen → SM-QA pipeline
for social media content creation.

Usage:
    python3 sm-pipeline.py "topic string"
    python3 sm-pipeline.py --board tim-sosmed-mantapp "topic string"
    python3 sm-pipeline.py --platform instagram "topic string"

Output (stdout):
    JSON with task IDs and pipeline info.

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

BOARD = os.environ.get('HERMES_KANBAN_BOARD', 'tim-sosmed-mantapp')
SCRIPTS_DIR = '/root/vyuapp-emergent/scripts'


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
        print(f'WARNING: kanban link failed: {result.stderr.strip()}', file=sys.stderr)


def main():
    # Parse args
    args = sys.argv[1:]
    board = BOARD
    platform = None
    topic = None

    i = 0
    while i < len(args):
        if args[i] == '--board' and i + 1 < len(args):
            board = args[i + 1]
            i += 2
        elif args[i] == '--platform' and i + 1 < len(args):
            platform = args[i + 1]
            i += 2
        elif not args[i].startswith('--'):
            topic = args[i]
            i += 1
        else:
            i += 1

    if not topic:
        print('ERROR: No topic provided.', file=sys.stderr)
        print('Usage: python3 sm-pipeline.py "topic string"', file=sys.stderr)
        sys.exit(1)

    slug = slugify(topic)
    timestamp = datetime.now().strftime('%Y%m%d-%H%M')
    pipeline_id = f'sm-{slug}-{timestamp}'
    platform_note = f'\nPlatform: {platform}' if platform else ''

    try:
        # ── Step 1: Create Reach task (strategy & planning) ──
        reach = kanban_create(
            title=f'[Reach] Strategy: {topic}',
            body=(
                f'## Social Media Strategy\n\n'
                f'Topic: {topic}\n'
                f'Pipeline: {pipeline_id}\n'
                f'{platform_note}\n\n'
                f'### Instructions\n'
                f'1. Analyze topic for social media angles\n'
                f'2. Define target audience and platforms\n'
                f'3. Create content brief with key messages\n'
                f'4. Save strategy to /tmp/sm-strategy-{slug}.json\n'
                f'5. Complete task with strategy summary'
            ),
            assignee='reach',
            board=board,
        )
        reach_id = reach['id']

        # ── Step 2: Create Scout task (trend research, depends on Reach) ──
        scout = kanban_create(
            title=f'[Scout] Trends: {topic}',
            body=(
                f'## Trend Research\n\n'
                f'Topic: {topic}\n'
                f'Pipeline: {pipeline_id}\n'
                f'Depends on Reach task: {reach_id}\n'
                f'{platform_note}\n\n'
                f'### Instructions\n'
                f'1. Research trending hashtags and topics\n'
                f'2. Analyze competitor content\n'
                f'3. Find relevant statistics and data points\n'
                f'4. Save research to /tmp/sm-research-{slug}.json\n'
                f'5. Complete task with research summary'
            ),
            assignee='scout',
            parents=[reach_id],
            board=board,
        )
        scout_id = scout['id']

        # ── Step 3: Create Scribe task (content writing, depends on Scout) ──
        scribe = kanban_create(
            title=f'[Scribe] Content: {topic}',
            body=(
                f'## Content Writing\n\n'
                f'Topic: {topic}\n'
                f'Pipeline: {pipeline_id}\n'
                f'Depends on Scout task: {scout_id}\n'
                f'{platform_note}\n\n'
                f'### Instructions\n'
                f'1. Read research from /tmp/sm-research-{slug}.json\n'
                f'2. Write platform-specific content\n'
                f'3. Save captions/copy to /tmp/sm-content-{slug}.json\n'
                f'4. Include hashtags and CTAs\n'
                f'5. Complete task with content summary'
            ),
            assignee='scribe',
            parents=[scout_id],
            board=board,
        )
        scribe_id = scribe['id']

        # ── Step 4: Create Image-gen task (visual design, depends on Scribe) ──
        image_gen = kanban_create(
            title=f'[Image-gen] Visuals: {topic}',
            body=(
                f'## Visual Design\n\n'
                f'Topic: {topic}\n'
                f'Pipeline: {pipeline_id}\n'
                f'Depends on Scribe task: {scribe_id}\n'
                f'{platform_note}\n\n'
                f'### Instructions\n'
                f'1. Read content from /tmp/sm-content-{slug}.json\n'
                f'2. Generate image prompts for each platform\n'
                f'3. Create visual assets (carousel, story, etc.)\n'
                f'4. Save prompts to /tmp/sm-prompts-{slug}.json\n'
                f'5. Complete task with visual summary'
            ),
            assignee='image-gen',
            parents=[scribe_id],
            board=board,
        )
        image_gen_id = image_gen['id']

        # ── Step 5: Create SM-QA task (review, depends on Image-gen) ──
        sm_qa = kanban_create(
            title=f'[SM-QA] Review: {topic}',
            body=(
                f'## Pre-Publish QA Review\n\n'
                f'Topic: {topic}\n'
                f'Pipeline: {pipeline_id}\n'
                f'Depends on Image-gen task: {image_gen_id}\n'
                f'{platform_note}\n\n'
                f'### Instructions\n'
                f'1. Review content from /tmp/sm-content-{slug}.json\n'
                f'2. Review visuals from /tmp/sm-prompts-{slug}.json\n'
                f'3. Check platform compliance (limits, specs)\n'
                f'4. Verify brand consistency\n'
                f'5. If approved: complete with "APPROVED"\n'
                f'6. If rejected: block with revision notes'
            ),
            assignee='sm-qa',
            parents=[image_gen_id],
            board=board,
        )
        sm_qa_id = sm_qa['id']

        # ── Output ──
        output = {
            'ok': True,
            'pipeline_id': pipeline_id,
            'topic': topic,
            'slug': slug,
            'platform': platform,
            'board': board,
            'tasks': {
                'reach': {'id': reach_id, 'title': reach['title']},
                'scout': {'id': scout_id, 'title': scout['title']},
                'scribe': {'id': scribe_id, 'title': scribe['title']},
                'image_gen': {'id': image_gen_id, 'title': image_gen['title']},
                'sm_qa': {'id': sm_qa_id, 'title': sm_qa['title']},
            },
            'flow': f'Reach({reach_id}) → Scout({scout_id}) → Scribe({scribe_id}) → Image-gen({image_gen_id}) → SM-QA({sm_qa_id})',
            'created_at': datetime.now().isoformat(),
        }

        # Print structured output
        print(f'📋 SM Pipeline: {pipeline_id}')
        print(f'📌 Topik: {topic}')
        if platform:
            print(f'📱 Platform: {platform}')
        print(f'')
        print(f'📣 Reach: {reach_id} — Strategy for "{topic}"')
        print(f'🔍 Scout: {scout_id} — Trend research')
        print(f'✍️  Scribe: {scribe_id} — Content writing')
        print(f'🎨 Image-gen: {image_gen_id} — Visual design')
        print(f'✅ SM-QA: {sm_qa_id} — Pre-publish review')
        print(f'')
        print(f'Flow: Reach → Scout → Scribe → Image-gen → SM-QA → Publish')
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
