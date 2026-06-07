'use client';
import { useEffect, useRef } from 'react';

export default function AdSenseSlot({ slot, format = 'auto', responsive = true, label = 'Advertisement', style }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const ref = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!clientId || !slot || pushed.current) return;
    // Wait until adsbygoogle script is available
    let attempts = 0;
    const t = setInterval(() => {
      attempts += 1;
      if (window.adsbygoogle) {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); pushed.current = true; } catch {}
        clearInterval(t);
      } else if (attempts > 30) {
        clearInterval(t);
      }
    }, 200);
    return () => clearInterval(t);
  }, [clientId, slot]);

  // Fallback placeholder if no client id
  if (!clientId || !slot) {
    return (
      <div className="my-10">
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center px-6 py-12" style={style}>
          <p className="vyu-overline">// {label}</p>
          <p className="text-xs text-zinc-600 mt-2 font-[var(--font-mono)]">AdSense placeholder — set NEXT_PUBLIC_ADSENSE_CLIENT_ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <p className="vyu-overline text-center mb-3 opacity-60">// {label}</p>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={style || { display: 'block', minHeight: 100 }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
