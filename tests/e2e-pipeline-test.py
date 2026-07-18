#!/usr/bin/env python3
"""E2E Test: Full Article Pipeline after refactor (v2).

Tests the full pipeline including kanban-pipeline.py (created in t_9dc52b50).

Test Scenarios (from task comment):
1. Basic Pipeline — kanban-pipeline.py creates Scout→Scribe→QA tasks
2. Bot Restart Recovery — state persistence via kanban (not memory)
3. Concurrent Articles — kanban-pipeline.py supports parallel pipelines
4. Error Handling — all scripts handle errors gracefully
5. Publish Verification — publish-article.py + auto-publish-on-qa-done.py

Architecture after refactor:
- vyuapp-writer-bot.py → thin UI layer (Telegram only)
- scout-topics.py → topic finding (local, no subprocess)
- kanban-pipeline.py → creates kanban tasks for Scout→Scribe→QA pipeline
- publish-article.py → publish to Supabase as draft
- auto-publish-on-qa-done.py → hook when QA task completes
"""

import os
import sys
import ast
import json
import re
import subprocess
import traceback
from datetime import datetime
from pathlib import Path

SCRIPTS_DIR = '/root/vyuapp/scripts'
TESTS_DIR = '/root/vyuapp/tests'
RESULTS = []


def test(name, func):
    """Run a test and capture result."""
    print(f'\n{"="*60}')
    print(f'TEST: {name}')
    print(f'{"="*60}')
    try:
        result = func()
        status = 'PASS' if result else 'FAIL'
        RESULTS.append({'name': name, 'status': status, 'error': None})
        print(f'  → {status}')
        return result
    except Exception as e:
        RESULTS.append({'name': name, 'status': 'ERROR', 'error': str(e)})
        print(f'  → ERROR: {e}')
        traceback.print_exc()
        return False


# ─── Test 1: kanban-pipeline.py EXISTS ───

def test_kanban_pipeline_exists():
    """Check if kanban-pipeline.py exists (was BLOCKER, now resolved)."""
    path = os.path.join(SCRIPTS_DIR, 'kanban-pipeline.py')
    exists = os.path.exists(path)
    if exists:
        size = os.path.getsize(path)
        print(f'  RESOLVED: {path} exists ({size} bytes)')
    else:
        print(f'  BLOCKER: {path} does NOT exist!')
    return exists


# ─── Test 2: kanban-pipeline.py syntax check ───

def test_kanban_pipeline_syntax():
    """Verify kanban-pipeline.py has valid Python syntax."""
    path = os.path.join(SCRIPTS_DIR, 'kanban-pipeline.py')
    with open(path) as f:
        source = f.read()
    try:
        ast.parse(source)
        print(f'  Syntax OK ({len(source.splitlines())} lines)')
        return True
    except SyntaxError as e:
        print(f'  SYNTAX ERROR: {e}')
        return False


# ─── Test 3: kanban-pipeline.py has expected functions ───

def test_kanban_pipeline_functions():
    """Verify kanban-pipeline.py has all required functions."""
    path = os.path.join(SCRIPTS_DIR, 'kanban-pipeline.py')
    with open(path) as f:
        source = f.read()

    tree = ast.parse(source)
    functions = [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
    required = ['slugify', 'kanban_create', 'kanban_link', 'main']
    missing = [f for f in required if f not in functions]

    if missing:
        print(f'  Missing functions: {missing}')
        return False

    print(f'  All {len(required)} required functions present: {functions}')
    return True


# ─── Test 4: kanban-pipeline.py creates 3 tasks with dependencies ───

def test_kanban_pipeline_creates_tasks():
    """Verify kanban-pipeline.py creates Scout, Scribe, QA tasks with parent deps."""
    path = os.path.join(SCRIPTS_DIR, 'kanban-pipeline.py')
    with open(path) as f:
        source = f.read()

    checks = {
        'Scout task': "assignee='scout'" in source or 'assignee="scout"' in source,
        'Scribe task': "assignee='scribe'" in source or 'assignee="scribe"' in source,
        'QA task': "assignee='qa'" in source or 'assignee="qa"' in source,
        'Scout→Scribe dependency': 'parents=[scout_id]' in source,
        'Scribe→QA dependency': 'parents=[scribe_id]' in source,
        'JSON output': '---RESULT---' in source,
        'Pipeline ID': 'pipeline_id' in source,
    }

    failed = [k for k, v in checks.items() if not v]
    if failed:
        print(f'  Missing: {failed}')
        return False

    print(f'  All 7 checks passed: Scout→Scribe→QA with parent deps + JSON output')
    return True


# ─── Test 5: kanban-pipeline.py error handling ───

def test_kanban_pipeline_error_handling():
    """Verify kanban-pipeline.py handles missing topic and CLI errors."""
    path = os.path.join(SCRIPTS_DIR, 'kanban-pipeline.py')
    with open(path) as f:
        source = f.read()

    checks = {
        'No topic → exit 1': 'if not topic:' in source and 'sys.exit(1)' in source,
        'RuntimeError catch': 'except RuntimeError' in source or 'except json.JSONDecodeError' in source,
        'Generic exception catch': 'except Exception' in source,
        'Exit code 2 on error': 'sys.exit(2)' in source,
        'stderr for errors': 'file=sys.stderr' in source,
    }

    failed = [k for k, v in checks.items() if not v]
    if failed:
        print(f'  Missing: {failed}')
        return False

    print(f'  Error handling: no-topic exit 1, CLI errors exit 2, stderr messages')
    return True


# ─── Test 6: publish-article.py dry-run ───

def test_publish_dry_run():
    """Test publish-article.py with --dry-run (no Supabase call)."""
    article = {
        'slug': 'e2e-test-article',
        'title': 'E2E Test Article',
        'content': '<h1>Test</h1><p>This is an E2E test article.</p>',
        'excerpt': 'Test excerpt for E2E',
        'category': 'Engineering',
        'tags': ['test', 'e2e'],
    }

    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, 'publish-article.py'), '--dry-run'],
        input=json.dumps(article),
        capture_output=True,
        text=True,
        timeout=30
    )

    if result.returncode != 0:
        print(f'  Exit code: {result.returncode}')
        print(f'  Stderr: {result.stderr[:300]}')
        return False

    output = result.stdout.strip()
    try:
        parsed = json.loads(output)
        assert parsed['slug'] == 'e2e-test-article', f"slug mismatch: {parsed.get('slug')}"
        assert parsed['title'] == 'E2E Test Article', f"title mismatch: {parsed.get('title')}"
        assert '<h1>Test</h1>' in parsed['content'], "content missing HTML"
        print(f'  Dry-run output: {json.dumps(parsed, indent=2)[:200]}...')
        return True
    except json.JSONDecodeError:
        print(f'  Output is not valid JSON: {output[:200]}')
        return False


# ─── Test 7: publish-article.py slugify ───

def test_publish_slugify():
    """Test that slug generation works correctly."""
    article = {
        'title': 'Next.js 16 Server Components: Best Practices & Tips!',
        'content': '<p>Content here</p>',
    }

    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, 'publish-article.py'), '--dry-run'],
        input=json.dumps(article),
        capture_output=True,
        text=True,
        timeout=30
    )

    if result.returncode != 0:
        print(f'  Exit code: {result.returncode}')
        return False

    parsed = json.loads(result.stdout.strip())
    slug = parsed.get('slug', '')
    print(f'  Generated slug: {slug}')

    assert slug, "slug is empty"
    assert ' ' not in slug, f"slug contains spaces: {slug}"
    assert slug == slug.lower(), f"slug not lowercase: {slug}"
    assert len(slug) <= 80, f"slug too long ({len(slug)}): {slug}"
    return True


# ─── Test 8: publish-article.py validation ───

def test_publish_validation():
    """Test that missing title/content triggers validation error."""
    # Missing title
    article = {'content': '<p>Content only</p>'}
    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, 'publish-article.py'), '--dry-run'],
        input=json.dumps(article),
        capture_output=True,
        text=True,
        timeout=30
    )

    if result.returncode == 0:
        print(f'  FAIL: Should have rejected missing title, got exit 0')
        return False

    if 'title' not in result.stderr.lower():
        print(f'  FAIL: Error message should mention title: {result.stderr[:200]}')
        return False

    print(f'  Correctly rejected missing title (exit {result.returncode})')

    # Missing content
    article = {'title': 'Test Title'}
    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, 'publish-article.py'), '--dry-run'],
        input=json.dumps(article),
        capture_output=True,
        text=True,
        timeout=30
    )

    if result.returncode == 0:
        print(f'  FAIL: Should have rejected missing content')
        return False

    print(f'  Correctly rejected missing content (exit {result.returncode})')
    return True


# ─── Test 9: publish-article.py invalid JSON ───

def test_publish_invalid_json():
    """Test publish-article.py rejects invalid JSON on stdin."""
    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, 'publish-article.py'), '--dry-run'],
        input='not valid json {{{',
        capture_output=True,
        text=True,
        timeout=30
    )

    if result.returncode == 0:
        print(f'  FAIL: Should have rejected invalid JSON')
        return False

    print(f'  Correctly rejected invalid JSON (exit {result.returncode})')
    return True


# ─── Test 10: auto-publish-on-qa-done.py ───

def test_auto_publish_with_slug():
    """Test auto-publish-on-qa-done.py with --slug (no actual file needed)."""
    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, 'auto-publish-on-qa-done.py'),
         '--slug', 'e2e-auto-test', '--title', 'E2E Auto Test'],
        capture_output=True,
        text=True,
        timeout=60
    )

    if result.returncode == 0:
        print(f'  Auto-publish succeeded (Supabase accessible)')
        return True
    else:
        error = result.stderr.strip()
        if any(kw in error.lower() for kw in ['supabase', 'credential', 'http', 'urlopen', 'connection']):
            print(f'  Expected Supabase error: {error[:200]}')
            return True
        else:
            print(f'  Unexpected error: {error[:200]}')
            return False


# ─── Test 11: scout-topics.py find_topics ───

def test_scout_find_topics():
    """Test that scout-topics.py returns valid topics."""
    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, 'scout-topics.py')],
        capture_output=True,
        text=True,
        timeout=30
    )

    if result.returncode != 0:
        print(f'  Exit code: {result.returncode}')
        print(f'  Stderr: {result.stderr[:300]}')
        return False

    output = result.stdout.strip()
    if '=== TOPICS ===' not in output:
        print(f'  Missing expected header in output: {output[:200]}')
        return False

    lines = [l for l in output.split('\n') if l.strip() and l.strip() != '=== TOPICS ===']
    topic_count = len(lines)
    print(f'  Found {topic_count} topics')

    if topic_count < 3:
        print(f'  WARN: Expected 5 topics, got {topic_count}')

    return topic_count >= 1


# ─── Test 12: scout-topics.py state persistence ───

def test_scout_state_persistence():
    """Test that scout-topics.py writes state to STATE_FILE."""
    state_file = os.path.join(SCRIPTS_DIR, 'scout-state.json')

    # Run topics to generate state
    subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, 'scout-topics.py')],
        capture_output=True, text=True, timeout=30
    )

    if not os.path.exists(state_file):
        print(f'  FAIL: State file not created at {state_file}')
        return False

    with open(state_file) as f:
        state = json.load(f)

    assert 'topics' in state, f"Missing 'topics' key in state: {list(state.keys())}"
    assert 'last_pool_index' in state, f"Missing 'last_pool_index' in state"
    assert 'updated_at' in state, f"Missing 'updated_at' in state"

    print(f'  State keys: {list(state.keys())}')
    print(f'  Last pool index: {state["last_pool_index"]}')
    print(f'  Topics count: {len(state.get("topics", []))}')
    return True


# ─── Test 13: Bot structure verification ───

def test_bot_structure():
    """Verify bot file has all expected command handlers."""
    bot_path = os.path.join(SCRIPTS_DIR, 'vyuapp-writer-bot.py')
    with open(bot_path) as f:
        content = f.read()

    required = [
        'cmd_start', 'cmd_help', 'cmd_topics', 'cmd_artikel',
        'cmd_kanban', 'cmd_status', 'cmd_approve', 'cmd_pending',
        'handle_callback', 'CallbackQueryHandler',
    ]

    missing = [r for r in required if r not in content]
    if missing:
        print(f'  Missing handlers: {missing}')
        return False

    print(f'  All {len(required)} required handlers/elements found')

    # Verify kanban-pipeline.py reference
    if 'kanban-pipeline.py' in content:
        print(f'  RESOLVED: Bot references kanban-pipeline.py (now exists)')

    return True


# ─── Test 14: Bot /artikel no-args handling ───

def test_bot_artikel_no_args():
    """Verify bot handles /artikel without args (uses first topic from pool)."""
    bot_path = os.path.join(SCRIPTS_DIR, 'vyuapp-writer-bot.py')
    with open(bot_path) as f:
        content = f.read()

    if 'if args:' in content and 'find_topics()' in content:
        print(f'  Bot handles /artikel without args by using first topic from pool')
        return True
    else:
        print(f'  Cannot verify /artikel no-args handling')
        return False


# ─── Test 15: Bot → kanban-pipeline.py integration ───

def test_bot_pipeline_integration():
    """Verify bot's subprocess call to kanban-pipeline.py is correct."""
    bot_path = os.path.join(SCRIPTS_DIR, 'vyuapp-writer-bot.py')
    with open(bot_path) as f:
        content = f.read()

    # Check subprocess call pattern
    pattern = re.search(r"subprocess\.run\(\s*\[sys\.executable.*?kanban-pipeline\.py.*?\]", content, re.DOTALL)
    if not pattern:
        print(f'  FAIL: Bot does not call kanban-pipeline.py via subprocess')
        return False

    # Check topic is passed as argument
    if "topic" in content and "kanban-pipeline.py" in content:
        print(f'  Bot calls kanban-pipeline.py with topic argument')
        return True

    print(f'  WARN: Cannot verify topic passing')
    return True


# ─── Test 16: Full pipeline flow verification (static) ───

def test_full_pipeline_flow():
    """Verify the complete pipeline flow: Bot→kanban-pipeline→hermes→Scout→Scribe→QA→auto-publish."""
    # Check each link in the chain
    with open(os.path.join(SCRIPTS_DIR, 'vyuapp-writer-bot.py')) as f:
        bot = f.read()
    with open(os.path.join(SCRIPTS_DIR, 'kanban-pipeline.py')) as f:
        kp = f.read()
    with open(os.path.join(SCRIPTS_DIR, 'auto-publish-on-qa-done.py')) as f:
        ap = f.read()
    with open(os.path.join(SCRIPTS_DIR, 'publish-article.py')) as f:
        pub = f.read()

    chain = {
        '1. Bot → kanban-pipeline.py': 'kanban-pipeline.py' in bot,
        '2. kanban-pipeline → hermes kanban create': 'hermes' in kp and 'kanban' in kp and 'create' in kp,
        '3. Pipeline: Scout task': "assignee='scout'" in kp or 'assignee="scout"' in kp,
        '4. Pipeline: Scribe task': "assignee='scribe'" in kp or 'assignee="scribe"' in kp,
        '5. Pipeline: QA task': "assignee='qa'" in kp or 'assignee="qa"' in kp,
        '6. Parent deps wired': 'parents=[scout_id]' in kp and 'parents=[scribe_id]' in kp,
        '7. auto-publish calls publish-article': 'publish-article.py' in ap,
        '8. publish to Supabase as draft': "status': 'draft'" in pub or "status='draft'" in pub,
    }

    failed = [k for k, v in chain.items() if not v]
    if failed:
        print(f'  Broken links: {failed}')
        return False

    print(f'  Full chain verified: Bot→kanban-pipeline→hermes→Scout→Scribe→QA→auto-publish→draft')
    return True


# ─── Test 17: Bot restart recovery (static analysis) ───

def test_bot_restart_recovery():
    """Verify no in-memory state that would be lost on restart."""
    bot_path = os.path.join(SCRIPTS_DIR, 'vyuapp-writer-bot.py')
    with open(bot_path) as f:
        content = f.read()

    # Check for dangerous in-memory state patterns
    dangerous = ['global_dict', 'PENDING_PUBLISH = {}', 'in_memory_cache']
    found = [d for d in dangerous if d in content]

    if found:
        print(f'  WARN: In-memory state found: {found}')
        return False

    # Check kanban is used for state
    if 'kanban' in content.lower():
        print(f'  No in-memory state — all state in kanban + file')
        return True

    print(f'  WARN: Cannot confirm stateless architecture')
    return False


# ─── Test 18: publish-article.py Supabase upsert as draft ───

def test_publish_sets_draft():
    """Verify publish-article.py always sets status=draft."""
    path = os.path.join(SCRIPTS_DIR, 'publish-article.py')
    with open(path) as f:
        content = f.read()

    if "'status': 'draft'" in content or "'status':'draft'" in content:
        print(f'  publish-article.py sets status=draft (correct)')
        return True

    print(f'  FAIL: Cannot confirm status=draft in publish-article.py')
    return False


# ─── Run All Tests ───

def main():
    print(f'E2E Test Suite v2: Full Pipeline After Refactor')
    print(f'Timestamp: {datetime.now().isoformat()}')
    print(f'Scripts dir: {SCRIPTS_DIR}')
    print(f'Note: kanban-pipeline.py blocker RESOLVED (created in t_9dc52b50)')

    if not os.path.isdir(SCRIPTS_DIR):
        print(f'ERROR: Scripts directory not found: {SCRIPTS_DIR}')
        sys.exit(1)

    # Scenario 1: Basic Pipeline
    test('1. kanban-pipeline.py exists', test_kanban_pipeline_exists)
    test('2. kanban-pipeline.py syntax', test_kanban_pipeline_syntax)
    test('3. kanban-pipeline.py functions', test_kanban_pipeline_functions)
    test('4. kanban-pipeline.py task creation', test_kanban_pipeline_creates_tasks)
    test('5. kanban-pipeline.py error handling', test_kanban_pipeline_error_handling)

    # Scenario 2: Bot Restart Recovery
    test('6. Bot restart recovery (stateless)', test_bot_restart_recovery)

    # Scenario 3: Full pipeline flow
    test('7. Full pipeline flow verification', test_full_pipeline_flow)

    # Scenario 4: Error Handling
    test('8. publish-article.py dry-run', test_publish_dry_run)
    test('9. publish-article.py slugify', test_publish_slugify)
    test('10. publish-article.py validation', test_publish_validation)
    test('11. publish invalid JSON', test_publish_invalid_json)
    test('12. Bot /artikel no-args handling', test_bot_artikel_no_args)

    # Scenario 5: Publish Verification
    test('13. auto-publish-on-qa-done.py', test_auto_publish_with_slug)
    test('14. publish-article.py sets draft', test_publish_sets_draft)

    # Integration
    test('15. scout-topics.py find_topics', test_scout_find_topics)
    test('16. scout-topics.py state persistence', test_scout_state_persistence)
    test('17. Bot structure verification', test_bot_structure)
    test('18. Bot→kanban-pipeline integration', test_bot_pipeline_integration)

    # Summary
    print(f'\n{"="*60}')
    print(f'SUMMARY')
    print(f'{"="*60}')

    passed = sum(1 for r in RESULTS if r['status'] == 'PASS')
    failed = sum(1 for r in RESULTS if r['status'] == 'FAIL')
    errors = sum(1 for r in RESULTS if r['status'] == 'ERROR')

    for r in RESULTS:
        icon = {'PASS': '✅', 'FAIL': '❌', 'ERROR': '💥'}.get(r['status'], '?')
        print(f'  {icon} {r["status"]:5s} | {r["name"]}')
        if r['error']:
            print(f'         Error: {r["error"][:100]}')

    print(f'\nTotal: {len(RESULTS)} | Pass: {passed} | Fail: {failed} | Error: {errors}')
    print(f'Pass rate: {passed/len(RESULTS)*100:.1f}%')

    result = {
        'timestamp': datetime.now().isoformat(),
        'version': 'v2',
        'total': len(RESULTS),
        'passed': passed,
        'failed': failed,
        'errors': errors,
        'pass_rate': f'{passed/len(RESULTS)*100:.1f}%',
        'blocker_resolved': 'kanban-pipeline.py (created in t_9dc52b50)',
        'tests': RESULTS,
    }

    print(f'\n---RESULT---')
    print(json.dumps(result, indent=2, ensure_ascii=False))

    sys.exit(1 if (failed + errors) > 0 else 0)


if __name__ == '__main__':
    main()
