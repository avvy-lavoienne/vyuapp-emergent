'use client';

import { useEffect, useRef, useCallback } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, any>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Reusable Cloudflare Turnstile widget.
 * @param onVerify - Callback with the token string when challenge passes.
 */
export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.error('Turnstile: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set');
      return;
    }

    function renderWidget() {
      if (!containerRef.current || !window.turnstile) return;
      cleanup();
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerify(token),
        'error-callback': () => onVerify(''),
        'expired-callback': () => onVerify(''),
      });
    }

    // Load script if not already present
    if (!window.turnstile) {
      const existing = document.querySelector(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      );
      if (existing) {
        existing.addEventListener('load', renderWidget);
      } else {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.onload = renderWidget;
        document.head.appendChild(script);
      }
    } else {
      renderWidget();
    }

    return cleanup;
  }, [onVerify, cleanup]);

  return <div ref={containerRef} className="turnstile-widget" />;
}
