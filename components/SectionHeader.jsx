'use client';
import { useRef, useEffect, useState } from 'react';

export default function SectionHeader({ overline, title, description, align = 'left', highlight, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const centerCls = align === 'center' ? 'section-headline-center' : '';
  const vis = visible ? 'visible' : '';

  const renderTitle = () => {
    if (!highlight) return title;
    const parts = title.split(highlight);
    if (parts.length < 2) return title;
    return parts.map((part, i) =>
      i < parts.length - 1 ? (
        <span key={i}>
          {part}
          <em className="italic text-clay">{highlight}</em>
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div ref={ref} className={`max-w-3xl ${alignCls} ${centerCls}`}>
      <div className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
        {index && <span className="index-mark">{index}</span>}
        <span className="h-px w-8 bg-rule" aria-hidden="true" />
        {overline && (
          <p className={`section-headline-overline ${vis} eyebrow`} style={{ transitionDelay: '0ms' }}>
            {overline}
          </p>
        )}
      </div>
      <h2
        className={`section-headline-title ${vis} display mt-5 text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] text-ink`}
        style={{ transitionDelay: '150ms' }}
      >
        {renderTitle()}
      </h2>
      {description && (
        <p
          className={`section-headline-desc ${vis} mt-5 text-ink2 text-base leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
          style={{ transitionDelay: '300ms' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
