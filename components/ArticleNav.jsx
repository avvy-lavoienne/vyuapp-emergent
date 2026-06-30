import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ArticleNav({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <nav className="border-t border-[#E5E4E0]">
      <div className="max-w-4xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2">
        {/* Previous Article */}
        {prev ? (
          <Link
            href={`/insights/${prev.slug}`}
            className="group flex items-start gap-4 py-8 px-2 md:pr-8 border-b md:border-b-0 md:border-r border-[#E5E4E0] transition-colors hover:bg-[#F4F3EE]/50"
          >
            <ArrowLeft className="w-4 h-4 mt-1 text-[#636360] group-hover:text-[#6D5BA0] transition-colors flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-mono text-[#636360] uppercase tracking-[0.1em] mb-1.5">
                ← Artikel sebelumnya
              </p>
              <p className="text-sm font-medium text-[#141413] group-hover:text-[#6D5BA0] transition-colors leading-snug line-clamp-2">
                {prev.title}
              </p>
              <p className="mt-1 text-[10px] font-mono text-[#6D5BA0] uppercase tracking-[0.15em]">
                {prev.category}
              </p>
            </div>
          </Link>
        ) : (
          <div className="py-8 px-2 md:pr-8 border-b md:border-b-0 md:border-r border-[#E5E4E0]" />
        )}

        {/* Next Article */}
        {next ? (
          <Link
            href={`/insights/${next.slug}`}
            className="group flex items-start gap-4 py-8 px-2 md:pl-8 md:text-right md:flex-row-reverse transition-colors hover:bg-[#F4F3EE]/50"
          >
            <ArrowRight className="w-4 h-4 mt-1 text-[#636360] group-hover:text-[#6D5BA0] transition-colors flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-mono text-[#636360] uppercase tracking-[0.1em] mb-1.5">
                Artikel selanjutnya →
              </p>
              <p className="text-sm font-medium text-[#141413] group-hover:text-[#6D5BA0] transition-colors leading-snug line-clamp-2">
                {next.title}
              </p>
              <p className="mt-1 text-[10px] font-mono text-[#6D5BA0] uppercase tracking-[0.15em]">
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
