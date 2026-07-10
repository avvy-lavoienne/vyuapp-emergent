'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * useScrollProgress — Returns a progress value (0→1) as the element
 * scrolls through the viewport.
 *
 * 0 = element top just entered viewport bottom
 * 1 = element bottom just left viewport top
 *
 * Uses IntersectionObserver for visibility detection and passive
 * scroll listener for performance. Respects prefers-reduced-motion.
 *
 * @param {Object} options
 * @param {number} options.threshold - IntersectionObserver threshold (default: 0)
 * @returns {{ ref, progress, isVisible }}
 */
export default function useScrollProgress({ threshold = 0 } = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const calculateProgress = useCallback(() => {
    if (prefersReduced) {
      setProgress(0);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;

    // Element not in viewport — skip
    if (rect.bottom < 0 || rect.top > vh) {
      return;
    }

    // Calculate progress: 0 = element top at viewport bottom,
    //                    1 = element bottom at viewport top
    const total = rect.height + vh;
    const raw = (vh - rect.top) / total;
    const clamped = Math.max(0, Math.min(1, raw));

    setProgress(clamped);
  }, [prefersReduced]);

  // IntersectionObserver for visibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // Scroll listener — only when visible
  useEffect(() => {
    if (prefersReduced) return;
    if (!isVisible) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    calculateProgress();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isVisible, prefersReduced, calculateProgress]);

  return { ref, progress, isVisible };
}
