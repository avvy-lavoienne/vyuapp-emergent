'use client';
import { useRef, useEffect, useState } from 'react';

/**
 * ParallaxImage — Scroll-linked scale effect for product images.
 *
 * Wraps an image container and applies a subtle scale transform
 * based on how far the element has scrolled through the viewport.
 * Uses IntersectionObserver + passive scroll listener for performance.
 *
 * Usage:
 *   <ParallaxImage>
 *     <img src="/cover.jpg" alt="Product" className="w-full h-auto" />
 *   </ParallaxImage>
 *
 *   <ParallaxImage scale={1.06} className="rounded-2xl overflow-hidden">
 *     <img src="/cover.jpg" alt="Product" className="w-full h-auto" />
 *   </ParallaxImage>
 *
 * Respects prefers-reduced-motion — disables animation when set.
 */
export default function ParallaxImage({
  children,
  scale = 1.08,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handler = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const el = containerRef.current;
    if (!el) return;

    let ticking = false;

    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Element is not in viewport at all — skip
      if (rect.bottom < 0 || rect.top > vh) {
        ticking = false;
        return;
      }

      // Calculate progress: 0 = element top just entered viewport bottom,
      //                    1 = element bottom just left viewport top
      const total = rect.height + vh;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / total));

      // Map progress to scale: start at 1.0, peak at center (0.5 → scale),
      // return to 1.0 at end. Smooth ease-in-out curve.
      // Use a bell curve: scale = 1 + (scale - 1) * sin(progress * PI)
      const eased = Math.sin(progress * Math.PI);
      const s = 1 + (scale - 1) * eased;

      setCurrentScale(s);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(updateScale);
        ticking = true;
      }
    };

    // Initial calculation
    updateScale();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scale, prefersReduced]);

  const transform = prefersReduced ? 'scale(1)' : `scale(${currentScale})`;

  return (
    <div
      ref={containerRef}
      className={`parallax-image-container ${className}`}
      style={{
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        className="parallax-image-inner"
        style={{
          transform,
          willChange: 'transform',
          transition: prefersReduced ? 'none' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
