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
    <button onClick={onShare} className="vyu-btn-secondary text-sm">
      <Share2 className="w-4 h-4" /> Bagikan
    </button>
  );
}
