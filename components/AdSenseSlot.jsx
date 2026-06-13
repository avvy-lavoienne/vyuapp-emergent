'use client';
import { useEffect, useRef } from 'react';

export default function AdSenseSlot({ slot, format = 'auto', responsive = true, label = 'Advertisement', style }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const ref = useRef(null);
  const pushed = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!clientId || !slot || pushed.current) return;
    let attempts = 0;
    intervalRef.current = setInterval(() => {
      attempts += 1;
      if (window.adsbygoogle) {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); pushed.current = true; } catch {}
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (attempts > 30) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 200);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [clientId, slot]);

  if (!clientId || !slot) {
    return (
      <div className="my-10">
        <div className="rounded-xl border border-dashed border-[#E5E4E0] bg-[#F8F7F4] flex flex-col items-center justify-center text-center px-6 py-12" style={style}>
          <p className="font-mono text-xs text-[#B0AFAA] uppercase tracking-[0.15em]">// {label}</p>
          <p className="text-xs text-[#B0AFAA] mt-2">AdSense placeholder — set NEXT_PUBLIC_ADSENSE_CLIENT_ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <p className="font-mono text-xs text-[#B0AFAA] uppercase tracking-[0.15em] text-center mb-3 opacity-60">// {label}</p>
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
