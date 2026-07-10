'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * useCountUp — Counts from 0 to `target` over `duration` ms when
 * the element scrolls into the viewport.
 *
 * Uses IntersectionObserver for visibility detection and
 * requestAnimationFrame for smooth 60fps animation.
 * Respects prefers-reduced-motion (shows target immediately).
 *
 * @param {Object} options
 * @param {number}  options.target   - Final number to count to
 * @param {number}  [options.duration=1200] - Animation duration in ms
 * @param {number}  [options.decimals=0]   - Decimal places
 * @param {number}  [options.threshold=0.2] - IntersectionObserver threshold
 * @returns {{ ref, value, displayValue }}
 */
export default function useCountUp({
  target = 0,
  duration = 1200,
  decimals = 0,
  threshold = 0.2,
} = {}) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
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

  // Easing: easeOutQuart — fast start, gentle deceleration
  const easeOutQuart = useCallback((t) => 1 - Math.pow(1 - t, 4), []);

  // Start animation
  const startAnimation = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    // If user prefers reduced motion, jump to final value
    if (prefersReduced) {
      setDisplayValue(target);
      return;
    }

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = easedProgress * target;

      setDisplayValue(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [hasAnimated, prefersReduced, target, duration, decimals, easeOutQuart]);

  // IntersectionObserver — trigger on scroll-into-view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startAnimation, threshold]);

  // Format display value
  const value = displayValue;

  return { ref, value, displayValue };
}
