import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ArticleNav({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <nav className="border-t border-[#d2d2d7]">
      <div className="max-w-4xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2">
        {/* Previous Article */}
        {prev ? (
          <Link
            href={`/insights/${prev.slug}`}
            className="group flex items-start gap-4 py-8 px-2 md:pr-8 border-b md:border-b-0 md:border-r border-[#d2d2d7] transition-colors hover:bg-[#F4F3EE]/50"
          >
            <ArrowLeft className="w-4 h-4 mt-1 text-[#6e6e73] group-hover:text-[#2997ff] transition-colors flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-mono text-[#6e6e73] uppercase tracking-[0.1em] mb-1.5">
                ← Artikel sebelumnya
              </p>
              <p className="text-sm font-medium text-[#1d1d1f] group-hover:text-[#2997ff] transition-colors leading-snug line-clamp-2">
                {prev.title}
              </p>
              <p className="mt-1 text-[10px] font-mono text-[#2997ff] uppercase tracking-[0.15em]">
                {prev.category}
              </p>
            </div>
          </Link>
        ) : (
          <div className="py-8 px-2 md:pr-8 border-b md:border-b-0 md:border-r border-[#d2d2d7]" />
        )}

        {/* Next Article */}
        {next ? (
          <Link
            href={`/insights/${next.slug}`}
            className="group flex items-start gap-4 py-8 px-2 md:pl-8 md:text-right md:flex-row-reverse transition-colors hover:bg-[#F4F3EE]/50"
          >
            <ArrowRight className="w-4 h-4 mt-1 text-[#6e6e73] group-hover:text-[#2997ff] transition-colors flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-mono text-[#6e6e73] uppercase tracking-[0.1em] mb-1.5">
                Artikel selanjutnya →
              </p>
              <p className="text-sm font-medium text-[#1d1d1f] group-hover:text-[#2997ff] transition-colors leading-snug line-clamp-2">
                {next.title}
              </p>
              <p className="mt-1 text-[10px] font-mono text-[#2997ff] uppercase tracking-[0.15em]">
                {next.category}
              </p>
            </div>
          </Link>
        ) : (
          <div className="py-8 px-2 md:pl-8" />
        )}
      </div>
    </nav>
  );
}
