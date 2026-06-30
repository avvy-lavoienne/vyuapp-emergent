/**
 * Auto-Link Engine
 * Scans article HTML content and converts mentions of other article titles
 * into clickable internal links. Safe for existing HTML — only modifies text nodes.
 */

interface ArticleRef {
  title: string;
  slug: string;
}

export function autoLinkContent(
  htmlContent: string,
  allArticles: ArticleRef[],
  maxLinks: number = 3
): string {
  if (!htmlContent || !allArticles.length) return htmlContent;

  // Sort by title length descending — match longer titles first
  const sorted = [...allArticles]
    .filter(a => a.title && a.slug)
    .sort((a, b) => b.title.length - a.title.length);

  let linkCount = 0;
  let result = htmlContent;

  for (const article of sorted) {
    if (linkCount >= maxLinks) break;

    const title = article.title;
    // Skip short titles to avoid false positives
    if (title.length < 15) continue;

    // Escape special regex chars in the title
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Match title in text that is:
    // - NOT inside an <a> tag (not preceded by > without a closing </a>)
    // - NOT inside heading tags (h1-h6)
    // - NOT inside an HTML attribute
    const regex = new RegExp(
      `(?<!<[^>]*?)` +          // not inside an opening tag's attributes
      `(?<![>])` +               // not right after > (simplistic tag boundary)
      `(?!<\\/a>)` +            // not followed by </a>
      `(${escaped})` +          // capture the title
      `(?![^<]*?<\\/a>)` +     // title must not be inside an existing <a>...</a>
      `(?![^<]*?<\\/h[1-6])`,  // title must not be inside a heading
      'gi'
    );

    // More robust approach: split by HTML tags, only replace in text segments
    const segments = result.split(/(<[^>]+>)/);
    let replaced = false;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      // Skip HTML tags
      if (segment.startsWith('<')) continue;

      // Skip if this text segment is inside a heading or link
      // Check surrounding tags
      const prevTag = i > 0 ? segments[i - 1] : '';
      if (prevTag.match(/<a\s/i) || prevTag.match(/<h[1-6][\s>]/i)) continue;
      // Also check if we're between <a> and </a>
      const beforeTags = segments.slice(0, i).filter(s => s.startsWith('<'));
      let insideLink = false;
      for (const tag of beforeTags) {
        if (tag.match(/<a\s/i)) insideLink = true;
        if (tag.match(/<\/a>/i)) insideLink = false;
      }
      if (insideLink) continue;

      // Check if inside heading
      let insideHeading = false;
      for (const tag of beforeTags) {
        if (tag.match(/<h[1-6][\s>]/i)) insideHeading = true;
        if (tag.match(/<\/h[1-6]>/i)) insideHeading = false;
      }
      if (insideHeading) continue;

      // Try to replace the first occurrence in this text segment
      const titleRegex = new RegExp(`(${escaped})`, 'i');
      if (titleRegex.test(segment)) {
        const replacement = `<a href="/insights/${article.slug}">$1</a>`;
        segments[i] = segment.replace(titleRegex, replacement);
        linkCount++;
        replaced = true;
        break; // One replacement per article title
      }
    }

    if (replaced) {
      result = segments.join('');
    }
  }

  return result;
}
