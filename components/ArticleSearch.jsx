'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

export default function ArticleSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const initialQuery = searchParams.get('q') || '';
  const [value, setValue] = useState(initialQuery);

  // Sync input when URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== value) {
      setValue(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateSearch = useCallback(
    (query) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query && query.trim()) {
        params.set('q', query.trim());
      } else {
        params.delete('q');
      }
      router.push(`/insights?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSearch(newValue);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      updateSearch(value);
    }
  };

  const handleClear = () => {
    setValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e6e73] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Cari artikel…"
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] rounded-full text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-none focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff]/20 transition-all duration-200"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#6e6e73] hover:text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#F4F3EE] transition-colors"
            aria-label="Hapus pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
