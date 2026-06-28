#!/usr/bin/env python3
"""VyuApp Scout — finds topics and does real research."""

import os, json, requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv('/root/vyuapp-emergent/.env')

STATE_FILE = '/root/vyuapp-emergent/scripts/scout-state.json'

TOPIC_POOLS = [
    ["Next.js 16 Server Components best practices", "Next.js middleware patterns 2026", "Next.js image optimization guide", "Next.js 16 caching strategies", "App Router vs Pages Router migration"],
    ["Supabase RLS policies guide", "Supabase Auth with Next.js", "Supabase Edge Functions tutorial", "Supabase Realtime subscriptions", "Supabase vs PlanetScale comparison"],
    ["TypeScript advanced patterns 2026", "Tailwind CSS 4 new features", "Web security checklist 2026", "Progressive Web Apps guide", "Web Performance optimization"],
    ["Docker for Next.js production", "CI/CD with GitHub Actions", "Vercel deployment optimization", "Monitoring web apps in production", "Database migration strategies"],
    ["AI integration in web apps", "Building chatbots with Next.js", "LLM API best practices", "AI-powered form validation", "Smart search implementation"],
]

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

def find_topics():
    import random
    state = load_state()
    last_pool = state.get('last_pool_index', -1)
    next_pool = (last_pool + 1) % len(TOPIC_POOLS)
    pool = TOPIC_POOLS[next_pool]
    topics = random.sample(pool, min(5, len(pool)))
    state['last_pool_index'] = next_pool
    state['phase'] = 'WAITING_TOPIC_SELECTION'
    state['topics'] = topics
    state['created_at'] = datetime.now().isoformat()
    save_state(state)
    return topics

def research_topic(topic):
    """Real research using DuckDuckGo search."""
    from duckduckgo_search import DDGS
    
    results = {'urls': [], 'snippets': []}
    
    try:
        with DDGS() as ddgs:
            for r in ddgs.text(topic, max_results=5):
                results['urls'].append(r.get('href', ''))
                results['snippets'].append(r.get('body', ''))
    except Exception as e:
        print(f'Search error: {e}')
    
    # Fetch content from top 3 URLs
    contents = []
    for url in results['urls'][:3]:
        try:
            resp = requests.get(url, timeout=10, headers={'User-Agent': 'Mozilla/5.0'})
            if resp.status_code == 200:
                # Simple text extraction
                text = resp.text
                # Remove script/style tags
                import re
                text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL)
                text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
                text = re.sub(r'<[^>]+>', ' ', text)
                text = re.sub(r'\s+', ' ', text).strip()
                contents.append(text[:3000])  # First 3000 chars
        except:
            pass
    
    return {
        'topic': topic,
        'search_results': results,
        'contents': contents,
        'timestamp': datetime.now().isoformat()
    }

def get_topic_for_research(topic_index):
    state = load_state()
    topics = state.get('topics', [])
    if 0 <= topic_index < len(topics):
        return topics[topic_index]
    return None

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'research':
        topic = sys.argv[2] if len(sys.argv) > 2 else 'Next.js best practices'
        result = research_topic(topic)
        print(json.dumps(result, indent=2, default=str))
    else:
        topics = find_topics()
        print("=== TOPICS ===")
        for i, t in enumerate(topics, 1):
            print(f"{i}. {t}")
