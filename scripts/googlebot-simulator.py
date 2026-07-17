#!/usr/bin/env python3
"""
Googlebot Simulator — Real crawl simulation for vyuapp.my.id
Simulates Googlebot's crawl behavior including:
- Real Googlebot user-agent string
- robots.txt compliance
- Sitemap discovery & parsing
- Response time measurement
- Content quality checks (title, meta, canonical)
- Redirect chain following
- Cache header analysis
"""

import sys
import time
import json
import xml.etree.ElementTree as ET
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import requests
except ImportError:
    print("Installing requests...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "-q"])
    import requests

# ── Googlebot User-Agents (real strings from Google) ──
GOOGLEBOT_USER_AGENTS = {
    "desktop": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "mobile": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "image": "Googlebot-Image/1.0; +http://www.google.com/bot.html",
}

# ── Config ──
SITEMAP_URL = "https://vyuapp.my.id/sitemap.xml"
ROBOTS_URL = "https://vyuapp.my.id/robots.txt"
CONCURRENCY = 5
TIMEOUT = 10  # Googlebot timeout ~5-10s
SESSION = requests.Session()
SESSION.headers.update({
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
})

# ── Colors ──
class C:
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RESET = "\033[0m"


def check_robots():
    """Fetch and parse robots.txt"""
    print(f"\n{C.BOLD}═══ STEP 1: robots.txt Compliance ═══{C.RESET}")
    try:
        r = SESSION.get(ROBOTS_URL, timeout=TIMEOUT)
        print(f"  {C.GREEN}✅ Fetched: {r.status_code} ({len(r.text)} bytes){C.RESET}")
        
        # Check for sitemap directive
        sitemap_lines = [l for l in r.text.split('\n') if 'sitemap:' in l.lower()]
        if sitemap_lines:
            for line in sitemap_lines:
                url = line.split(':', 1)[1].strip()
                print(f"  {C.GREEN}✅ Sitemap: {url}{C.RESET}")
        else:
            print(f"  {C.RED}❌ No Sitemap directive found in robots.txt{C.RESET}")
        
        # Check for Googlebot blocks
        lines = r.text.lower().split('\n')
        blocked = False
        for i, line in enumerate(lines):
            if 'user-agent:' in line and 'googlebot' in line:
                # Check next few lines for Disallow
                for j in range(i+1, min(i+5, len(lines))):
                    if 'disallow: /' == lines[j].strip():
                        print(f"  {C.RED}❌ Googlebot BLOCKED in robots.txt!{C.RESET}")
                        blocked = True
                        break
        if not blocked:
            print(f"  {C.GREEN}✅ Googlebot NOT blocked{C.RESET}")
        
        return sitemap_lines
    except Exception as e:
        print(f"  {C.RED}❌ Error: {e}{C.RESET}")
        return []


def fetch_sitemap():
    """Parse sitemap XML and extract URLs"""
    print(f"\n{C.BOLD}═══ STEP 2: Sitemap Parsing ═══{C.RESET}")
    try:
        r = SESSION.get(SITEMAP_URL, timeout=TIMEOUT)
        print(f"  {C.GREEN}✅ Fetched: {r.status_code} | Content-Type: {r.headers.get('content-type', 'unknown')}{C.RESET}")
        print(f"  {C.GREEN}✅ Size: {len(r.text)} bytes{C.RESET}")
        
        # Parse XML
        root = ET.fromstring(r.text)
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        urls = []
        for url_elem in root.findall('.//s:url', ns):
            loc = url_elem.find('s:loc', ns)
            lastmod = url_elem.find('s:lastmod', ns)
            priority = url_elem.find('s:priority', ns)
            if loc is not None:
                urls.append({
                    'loc': loc.text,
                    'lastmod': lastmod.text if lastmod is not None else None,
                    'priority': float(priority.text) if priority is not None else None,
                })
        
        print(f"  {C.GREEN}✅ Found {len(urls)} URLs{C.RESET}")
        return urls
    except Exception as e:
        print(f"  {C.RED}❌ Error: {e}{C.RESET}")
        return []


def crawl_url(url_info):
    """Crawl a single URL and analyze response"""
    url = url_info['loc']
    result = {
        'url': url,
        'status': None,
        'response_time': None,
        'redirects': 0,
        'redirect_chain': [],
        'content_type': None,
        'title': None,
        'meta_desc': None,
        'canonical': None,
        'h1': None,
        'og_tags': {},
        'cache_control': None,
        'x_robots_tag': None,
        'issues': [],
        'verdict': 'OK',
    }
    
    ua = GOOGLEBOT_USER_AGENTS["desktop"]
    
    try:
        start = time.time()
        r = SESSION.get(
            url,
            timeout=TIMEOUT,
            allow_redirects=True,
            headers={"User-Agent": ua},
        )
        elapsed = time.time() - start
        
        result['status'] = r.status_code
        result['response_time'] = round(elapsed * 1000)
        result['redirects'] = len(r.history)
        result['redirect_chain'] = [(h.url, h.status_code) for h in r.history]
        result['content_type'] = r.headers.get('content-type', '')
        result['cache_control'] = r.headers.get('cache-control', '')
        result['x_robots_tag'] = r.headers.get('x-robots-tag', '')
        
        # Only parse HTML
        if 'text/html' in result['content_type']:
            html = r.text
            
            # Title
            import re
            m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.I)
            result['title'] = m.group(1).strip() if m else None
            
            # Meta description
            m = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html, re.I)
            if not m:
                m = re.search(r'<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\']', html, re.I)
            result['meta_desc'] = m.group(1).strip() if m else None
            
            # Canonical
            m = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\']', html, re.I)
            if not m:
                m = re.search(r'<link[^>]*href=["\']([^"\']*)["\'][^>]*rel=["\']canonical["\']', html, re.I)
            result['canonical'] = m.group(1).strip() if m else None
            
            # H1
            m = re.search(r'<h1[^>]*>([\s\S]*?)</h1>', html, re.I)
            result['h1'] = re.sub(r'<[^>]+>', '', m.group(1)).strip() if m else None
            
            # OG tags
            result['og_tags'] = {
                'og:title': bool(re.search(r'property=["\']og:title["\']', html, re.I)),
                'og:description': bool(re.search(r'property=["\']og:description["\']', html, re.I)),
                'og:image': bool(re.search(r'property=["\']og:image["\']', html, re.I)),
                'og:url': bool(re.search(r'property=["\']og:url["\']', html, re.I)),
            }
        
        # ── Issue Detection ──
        if r.status_code >= 400:
            result['issues'].append(f"HTTP {r.status_code}")
            result['verdict'] = 'ERROR'
        if elapsed > 5:
            result['issues'].append(f"Slow ({elapsed:.1f}s > 5s Googlebot timeout)")
            result['verdict'] = 'SLOW'
        elif elapsed > 2:
            result['issues'].append(f"Medium ({elapsed:.1f}s)")
            if result['verdict'] == 'OK':
                result['verdict'] = 'WARN'
        if result['redirects'] > 2:
            result['issues'].append(f"Long redirect chain ({result['redirects']} hops)")
        if not result['title']:
            result['issues'].append("Missing <title>")
        if not result['meta_desc']:
            result['issues'].append("Missing meta description")
        if not result['canonical']:
            result['issues'].append("Missing canonical tag")
        if 'noindex' in result.get('x_robots_tag', ''):
            result['issues'].append("X-Robots-Tag: noindex")
        if not result['h1'] and 'text/html' in result.get('content_type', ''):
            result['issues'].append("Missing H1 tag")
            
    except requests.exceptions.Timeout:
        result['status'] = 0
        result['response_time'] = TIMEOUT * 1000
        result['issues'].append(f"Timeout ({TIMEOUT}s)")
        result['verdict'] = 'TIMEOUT'
    except Exception as e:
        result['status'] = 0
        result['issues'].append(f"Error: {str(e)[:80]}")
        result['verdict'] = 'ERROR'
    
    return result


def print_results(results, crawl_time):
    """Print detailed crawl results"""
    print(f"\n{C.BOLD}═══ STEP 3: Crawl Results ═══{C.RESET}")
    print(f"  {C.DIM}User-Agent: Googlebot/2.1{C.RESET}")
    print(f"  {C.DIM}Concurrency: {CONCURRENCY} | Timeout: {TIMEOUT}s{C.RESET}")
    print(f"  {C.DIM}Total crawl time: {crawl_time:.1f}s{C.RESET}")
    
    # Summary
    total = len(results)
    ok = sum(1 for r in results if r['verdict'] == 'OK')
    warn = sum(1 for r in results if r['verdict'] == 'WARN')
    slow = sum(1 for r in results if r['verdict'] == 'SLOW')
    errors = sum(1 for r in results if r['verdict'] in ('ERROR', 'TIMEOUT'))
    
    times = [r['response_time'] for r in results if r['response_time'] is not None]
    avg_time = sum(times) / len(times) if times else 0
    
    print(f"\n  {C.BOLD}Summary:{C.RESET}")
    print(f"  {'─' * 50}")
    print(f"  Total URLs:      {total}")
    print(f"  {C.GREEN}✅ OK (<2s):       {ok} ({ok/total*100:.0f}%){C.RESET}")
    print(f"  {C.YELLOW}⚠️  Warn (2-5s):   {warn} ({warn/total*100:.0f}%){C.RESET}")
    print(f"  {C.RED}🔴 Slow (>5s):    {slow} ({slow/total*100:.0f}%){C.RESET}")
    print(f"  {C.RED}❌ Error:         {errors} ({errors/total*100:.0f}%){C.RESET}")
    print(f"  ⏱️  Avg time:      {avg_time:.0f}ms")
    print(f"  {'─' * 50}")
    
    # SEO Analysis
    print(f"\n  {C.BOLD}SEO Quality:{C.RESET}")
    html_results = [r for r in results if 'text/html' in (r.get('content_type') or '')]
    with_title = sum(1 for r in html_results if r['title'])
    with_desc = sum(1 for r in html_results if r['meta_desc'])
    with_canonical = sum(1 for r in html_results if r['canonical'])
    with_h1 = sum(1 for r in html_results if r['h1'])
    with_og = sum(1 for r in html_results if all(r['og_tags'].values()))
    
    print(f"  Title:           {with_title}/{len(html_results)} pages ({with_title/len(html_results)*100:.0f}%)")
    print(f"  Meta description:{with_desc}/{len(html_results)} pages ({with_desc/len(html_results)*100:.0f}%)")
    print(f"  Canonical:       {with_canonical}/{len(html_results)} pages ({with_canonical/len(html_results)*100:.0f}%)")
    print(f"  H1 tag:          {with_h1}/{len(html_results)} pages ({with_h1/len(html_results)*100:.0f}%)")
    print(f"  Full OG tags:    {with_og}/{len(html_results)} pages ({with_og/len(html_results)*100:.0f}%)")
    
    # Issues detail
    all_issues = []
    for r in results:
        for issue in r['issues']:
            all_issues.append((r['url'], issue))
    
    if all_issues:
        print(f"\n  {C.BOLD}Issues Found ({len(all_issues)}):{C.RESET}")
        for url, issue in all_issues:
            short_url = url.replace('https://vyuapp.my.id', '')
            print(f"    {C.YELLOW}•{C.RESET} {short_url}: {issue}")
    else:
        print(f"\n  {C.GREEN}🎉 No issues found! Perfect crawl.{C.RESET}")
    
    # Verdict
    print(f"\n  {C.BOLD}{'═' * 50}{C.RESET}")
    if errors > 0:
        print(f"  {C.RED}{C.BOLD}❌ VERDICT: NOT READY — {errors} pages have errors{C.RESET}")
    elif slow > 0:
        print(f"  {C.YELLOW}{C.BOLD}⚠️  VERDICT: PARTIALLY READY — {slow} pages may timeout{C.RESET}")
    elif warn > 0:
        print(f"  {C.GREEN}{C.BOLD}✅ VERDICT: READY — {warn} pages slightly slow but crawlable{C.RESET}")
    else:
        print(f"  {C.GREEN}{C.BOLD}🎉 VERDICT: PERFECT — All pages Googlebot-compatible!{C.RESET}")
    print(f"  {C.BOLD}{'═' * 50}{C.RESET}\n")


def main():
    print(f"\n{C.BOLD}{'═' * 60}{C.RESET}")
    print(f"{C.BOLD}🤖 Googlebot Simulator — vyuapp.my.id{C.RESET}")
    print(f"{C.BOLD}{'═' * 60}{C.RESET}")
    
    # Step 1: Check robots.txt
    sitemap_lines = check_robots()
    
    # Step 2: Parse sitemap
    urls = fetch_sitemap()
    if not urls:
        print(f"\n{C.RED}❌ No URLs found. Aborting.{C.RESET}")
        sys.exit(1)
    
    # Step 3: Crawl all URLs
    print(f"\n{C.BOLD}═══ STEP 3: Crawling {len(urls)} URLs ═══{C.RESET}")
    print(f"  {C.DIM}Using real Googlebot user-agent...{C.RESET}")
    
    results = []
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = {executor.submit(crawl_url, url): url for url in urls}
        done = 0
        for future in as_completed(futures):
            done += 1
            result = future.result()
            results.append(result)
            
            # Progress indicator
            status = result['verdict']
            time_ms = result['response_time'] or 0
            short_url = result['url'].replace('https://vyuapp.my.id', '') or '/'
            
            if status == 'OK':
                color = C.GREEN
                icon = '✓'
            elif status == 'WARN':
                color = C.YELLOW
                icon = '⚠'
            elif status in ('SLOW', 'TIMEOUT'):
                color = C.RED
                icon = '✗'
            else:
                color = C.RED
                icon = '✗'
            
            print(f"  {color}{icon} [{done}/{len(urls)}] {time_ms:>5}ms | {short_url}{C.RESET}")
    
    crawl_time = time.time() - start_time
    
    # Sort by URL for consistent display
    results.sort(key=lambda r: r['url'])
    
    # Print results
    print_results(results, crawl_time)
    
    # Save report
    report_path = "/tmp/googlebot-crawl-report.json"
    with open(report_path, 'w') as f:
        json.dump({
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'user_agent': GOOGLEBOT_USER_AGENTS['desktop'],
            'total_urls': len(results),
            'results': results,
        }, f, indent=2)
    print(f"  {C.DIM}Report saved: {report_path}{C.RESET}\n")


if __name__ == '__main__':
    main()
