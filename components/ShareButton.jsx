'use client';
import { Share2 } from 'lucide-react';

export default function ShareButton({ title }) {
  const onShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert('Link tersalin.'); }
    } catch {}
  };
  return (
    <button
      onClick={onShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#1d1d1f] border border-[#D1D0C9] hover:border-[#B0AFAA] hover:bg-black/[0.02] transition-all duration-200"
    >
      <Share2 className="w-4 h-4" /> Bagikan
    </button>
  );
}
