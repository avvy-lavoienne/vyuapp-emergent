'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'vyuapp_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        backgroundColor: 'var(--bg-primary, #fff)',
        borderTop: '1px solid var(--border, #E5E4E0)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-primary, #141413)', lineHeight: '1.5', margin: 0 }}>
            🍪 Kami menggunakan <strong>cookie</strong> dan <strong>localStorage</strong> untuk:
          </p>
          <ul style={{ fontSize: '12px', color: 'var(--text-secondary, #4A4A48)', lineHeight: '1.6', margin: '6px 0 0 0', paddingLeft: '16px' }}>
            <li>Menyimpan riwayat chat dengan Hana</li>
            <li>Menampilkan iklan yang relevan (Google AdSense)</li>
            <li>Mengingat preferensi Anda</li>
          </ul>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary, #636360)', margin: '6px 0 0 0' }}>
            Dengan melanjutkan, Anda menyetujui penggunaan cookie sesuai{' '}
            <a href="/privacy" style={{ color: '#6D5BA0', textDecoration: 'underline' }}>Kebijakan Privasi</a> kami.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignSelf: 'center' }}>
          <button
            onClick={decline}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border, #E5E4E0)',
              backgroundColor: 'var(--bg-primary, #fff)',
              color: 'var(--text-secondary, #4A4A48)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D0C9'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E4E0'; }}
          >
            Tolak
          </button>
          <button
            onClick={accept}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#6D5BA0',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#574886'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6D5BA0'; }}
          >
            Terima Semua
          </button>
        </div>
      </div>
    </div>
  );
}
