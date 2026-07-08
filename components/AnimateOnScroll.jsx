'use client';
import { useRef, useEffect, useState } from 'react';

/**
 * Reusable scroll-reveal wrapper using IntersectionObserver.
 * Applies fade-up animation on the WRAPPER div itself (not children).
 * This avoids cloneElement issues with server component children.
 *
 * Usage:
 *   <AnimateOnScroll><Section /></AnimateOnScroll>
 *   <AnimateOnScroll delay={200}><Section /></AnimateOnScroll>
 */
export default function AnimateOnScroll({ children, delay = 0, threshold = 0.15 }) {
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
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`fade-up ${visible ? 'visible' : ''}`.trim()}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
