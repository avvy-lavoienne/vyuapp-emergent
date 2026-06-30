'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function NavigationLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Listen for link clicks to show loader immediately
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      if (href === pathname) return;
      setLoading(true);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(250, 250, 248, 0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      animation: 'navFadeIn 0.15s ease-out',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Spinning VyuApp logo */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          border: '1.5px solid #E5E4E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'navSpin 1s linear infinite',
          boxShadow: '0 4px 12px rgba(109, 91, 160, 0.15)',
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#6D5BA0',
            fontFamily: 'Satoshi, system-ui, sans-serif',
          }}>V</span>
        </div>
        {/* Loading dots */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: '#6D5BA0',
            animation: 'navDot 1.2s infinite',
            animationDelay: '0s',
          }} />
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: '#6D5BA0',
            animation: 'navDot 1.2s infinite',
            animationDelay: '0.2s',
          }} />
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: '#6D5BA0',
            animation: 'navDot 1.2s infinite',
            animationDelay: '0.4s',
          }} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes navSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes navFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes navDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationLoaderInner />
    </Suspense>
  );
}
