'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, basePath = '/insights' }) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page) {
    const sp = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      sp.delete('page');
    } else {
      sp.set('page', String(page));
    }
    const qs = sp.toString();
    return `${basePath}${qs ? `?${qs}` : ''}`;
  }

  // Generate page numbers with ellipsis
  function getPageNumbers() {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-14" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-[#6e6e73] dark:text-[#86868b] bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] hover:border-[#c8c8cd] dark:hover:border-[#444447] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-[#d2d2d7] dark:text-[#333336] bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </span>
      )}

      {/* Page numbers */}
      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex items-center justify-center w-10 h-10 text-sm text-[#86868b] dark:text-[#6e6e73] select-none"
          >
            …
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold text-white bg-[#2997ff] shadow-sm"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium text-[#6e6e73] dark:text-[#86868b] bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] hover:border-[#c8c8cd] dark:hover:border-[#444447] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all duration-200"
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-[#6e6e73] dark:text-[#86868b] bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] hover:border-[#c8c8cd] dark:hover:border-[#444447] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all duration-200"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-[#d2d2d7] dark:text-[#333336] bg-white dark:bg-[#1d1d1f] border border-[#d2d2d7] dark:border-[#333336] cursor-not-allowed">
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
