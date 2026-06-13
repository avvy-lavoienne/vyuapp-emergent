'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { locales } from '@/lib/locales';

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('id');

  useEffect(() => {
    const stored = localStorage.getItem('vyu-locale');
    if (stored === 'en' || stored === 'id') setLocale(stored);
  }, []);

  const toggle = () => {
    setLocale(prev => {
      const next = prev === 'id' ? 'en' : 'id';
      localStorage.setItem('vyu-locale', next);
      return next;
    });
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
