'use client';
import { useEffect } from 'react';

export default function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  useEffect(() => {
    if (!clientId) return;
    if (document.querySelector(`script[data-vyu-adsense]`)) return;
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    s.setAttribute('data-vyu-adsense', '1');
    document.head.appendChild(s);
  }, [clientId]);
  return null;
}
