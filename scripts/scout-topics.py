#!/usr/bin/env python3
"""VyuApp Scout — finds 5 topics daily for Vy to choose from."""

import os, json, requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv('/root/vyuapp-emergent/.env')

HERMES_URL = os.getenv('HERMES_GATEWAY_URL', 'http://localhost:9090')
STATE_FILE = '/root/vyuapp-emergent/scripts/scout-state.json'

# Topic pool — rotate and vary
TOPIC_POOLS = [
    # Next.js ecosystem
    ["Next.js 16 Server Components best practices", "Next.js middleware patterns 2026", "Next.js image optimization guide", "Next.js 16 caching strategies", "App Router vs Pages Router migration"],
    # Supabase
    ["Supabase RLS policies guide", "Supabase Auth with Next.js", "Supabase Edge Functions tutorial", "Supabase Realtime subscriptions", "Supabase vs PlanetScale comparison"],
    # Web Dev General
    ["TypeScript advanced patterns 2026", "Tailwind CSS 4 new features", "Web security checklist 2026", "Progressive Web Apps guide", "Web Performance optimization"],
    # DevOps
    ["Docker for Next.js production", "CI/CD with GitHub Actions", "Vercel deployment optimization", "Monitoring web apps in production", "Database migration strategies"],
    # AI/Modern
    ["AI integration in web apps", "Building chatbots with Next.js", "LLM API best practices", "AI-powered form validation", "Smart search implementation"],
]

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {}

def save_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2, default=str)

def find_topics():
    """Pick 5 diverse topics from pools."""
    import random
    state = load_state()
    last_pool = state.get('last_pool_index', -1)
    next_pool = (last_pool + 1) % len(TOPIC_POOLS)
    
    # Pick 5 topics from current pool
    pool = TOPIC_POOLS[next_pool]
    topics = random.sample(pool, min(5, len(pool)))
    
    state['last_pool_index'] = next_pool
    state['phase'] = 'WAITING_TOPIC_SELECTION'
    state['topics'] = topics
    state['created_at'] = datetime.now().isoformat()
    state['selected_topic'] = None
    save_state(state)
    
    return topics

def get_topic_for_research(topic_index):
    """Get the selected topic from state."""
    state = load_state()
    topics = state.get('topics', [])
    if 0 <= topic_index < len(topics):
        return topics[topic_index]
    return None

if __name__ == '__main__':
    topics = find_topics()
    print("=== TOPICS FOUND ===")
    for i, t in enumerate(topics, 1):
        print(f"{i}. {t}")
    print(f"\nState saved to {STATE_FILE}")
