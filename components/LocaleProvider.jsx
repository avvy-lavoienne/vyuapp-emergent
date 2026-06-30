'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { locales } from '@/lib/locales';

const LocaleContext = createContext(null);

export function LocaleProvider({ children, initialLocale = 'id' }) {
  const [locale, setLocale] = useState(initialLocale);

  useEffect(() => {
    // Read from localStorage on client, override initialLocale if stored
    const stored = localStorage.getItem('vyu-locale');
    if (stored === 'en' || stored === 'id') setLocale(stored);
  }, []);

  const toggle = () => {
    const next = locale === 'id' ? 'en' : 'id';
    // Persist to both localStorage and cookie
    localStorage.setItem('vyu-locale', next);
    document.cookie = `vyu-locale=${next};path=/;max-age=31536000;SameSite=Lax`;
    // Reload to re-render server components with the new locale
    window.location.reload();
  };

  const t = locales[locale] || locales.id;

  return (
    <LocaleContext.Provider value={{ locale, toggle, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) return { locale: 'id', toggle: () => {}, t: locales.id };
  return ctx;
}
