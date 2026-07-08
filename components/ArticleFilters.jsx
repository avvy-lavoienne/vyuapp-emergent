'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Engineering',
  'AI',
  'DevOps',
  'Cloud',
  'Security',
  'Productivity',
  'Design',
  'Mobile',
  'Backend',
  'Database',
  'Testing',
  'Career',
  'Web3',
  'Performance',
  'IndoTech',
];

const MAX_VISIBLE_TAGS = 20;

export default function ArticleFilters({ availableTags = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAllTags, setShowAllTags] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const activeTags = searchParams.get('tags')
    ? searchParams.get('tags').split(',').filter(Boolean)
    : [];

  const updateParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/insights?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const toggleTag = useCallback(
    (tag) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get('tags')
        ? params.get('tags').split(',').filter(Boolean)
        : [];
      const next = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      if (next.length > 0) {
        params.set('tags', next.join(','));
      } else {
        params.delete('tags');
      }
      router.push(`/insights?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push('/insights', { scroll: false });
  }, [router]);

  const hasFilters = activeCategory || activeTags.length > 0 || !!searchParams.get('q');

  return (
    <div className="mb-8 space-y-5">
      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-[#6e6e73] dark:text-[#8A8A8A] mb-3">
          Kategori
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('category', activeCategory === cat ? '' : cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-[#2997ff] text-white border-[#2997ff] shadow-sm'
                  : 'bg-white dark:bg-[#1d1d1f] text-[#4A4A48] dark:text-[#86868b] border-[#d2d2d7] dark:border-[#333336] hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filter */}
      {availableTags.length > 0 && (
        <div>
          <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-[#6e6e73] dark:text-[#8A8A8A] mb-3">
            Tag
          </h3>
          <div className="flex flex-wrap gap-2">
            {(showAllTags ? availableTags : availableTags.slice(0, MAX_VISIBLE_TAGS)).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 border ${
                  activeTags.includes(tag)
                    ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                    : 'bg-white dark:bg-[#1d1d1f] text-[#737370] dark:text-[#8A8A8A] border-[#d2d2d7] dark:border-[#333336] hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D] hover:text-[#6e6e73] dark:hover:text-[#86868b]'
                }`}
              >
                #{tag}
              </button>
            ))}
            {availableTags.length > MAX_VISIBLE_TAGS && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-[#2997ff] border border-[#2997ff]/30 hover:bg-[#2997ff]/5 transition-all"
              >
                {showAllTags ? 'Sembunyikan' : `+${availableTags.length - MAX_VISIBLE_TAGS} lainnya`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Summary + Clear */}
      {hasFilters && (
        <div className="flex items-center gap-3 pt-2 border-t border-[#d2d2d7] dark:border-[#333336]">
          <span className="text-xs text-[#6e6e73] dark:text-[#8A8A8A]">
            Filter aktif:
            {searchParams.get('q') && (
              <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2997ff]/10 text-[#2997ff] font-medium">
                &ldquo;{searchParams.get('q')}&rdquo;
              </span>
            )}
            {activeCategory && (
              <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2997ff]/10 text-[#2997ff] font-medium">
                {activeCategory}
              </span>
            )}
            {activeTags.map((tag) => (
              <span key={tag} className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1d1d1f]/5 dark:bg-[#f5f5f7]/10 text-[#4A4A48] dark:text-[#86868b] font-mono text-[10px] uppercase">
                #{tag}
              </span>
            ))}
          </span>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-[#6e6e73] dark:text-[#8A8A8A] hover:text-[#2997ff] dark:hover:text-[#5BA3FF] transition-colors"
          >
            <X className="w-3 h-3" /> Hapus semua
          </button>
        </div>
      )}
    </div>
  );
}
