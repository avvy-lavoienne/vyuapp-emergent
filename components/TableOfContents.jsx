'use client';
import { useState } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

export default function TableOfContents({ html }) {
  const [open, setOpen] = useState(false);
  const headings = [];
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    headings.push({ id, text });
  }
  if (headings.length < 2) return null;
  return (
    <div className="my-8 p-5 rounded-2xl border border-[#E5E4E0] dark:border-[#2A2A2D] bg-white dark:bg-[#1A1A1D]">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <span className="flex items-center gap-2 text-sm font-semibold text-[#141413] dark:text-[#F0F0F0]">
          <List className="w-4 h-4 text-[#6D5BA0]" /> Daftar Isi
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-[#636360] dark:text-[#8A8A8A]" /> : <ChevronDown className="w-4 h-4 text-[#636360] dark:text-[#8A8A8A]" />}
      </button>
      {open && (
        <nav className="mt-4 space-y-2">
          {headings.map((h, i) => (
            <a key={i} href={`#${h.id}`} className="block text-sm text-[#6B6B68] dark:text-[#B0B0B0] hover:text-[#6D5BA0] transition pl-4 border-l-2 border-[#E5E4E0] dark:border-[#2A2A2D] hover:border-[#6D5BA0]">
              {h.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
