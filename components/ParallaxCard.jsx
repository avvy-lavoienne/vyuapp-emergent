'use client';
import useScrollProgress from '@/hooks/useScrollProgress';

/**
 * ParallaxCard — Applies scroll-linked scale transform to its children.
 *
 * Scale formula: scale(1 + progress * 0.02)
 * Easing: cubic-bezier(0.25, 0.1, 0.25, 1)
 * Only animates when element is visible in viewport.
 *
 * Usage:
 *   <ParallaxCard>
 *     <div className="product-card">...</div>
 *   </ParallaxCard>
 */
export default function ParallaxCard({ children, className = '' }) {
  const { ref, progress, isVisible } = useScrollProgress({ threshold: 0.1 });

  const scale = 1 + progress * 0.02;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `scale(${scale})`,
        transition: isVisible
          ? 'transform 0.1s cubic-bezier(0.25, 0.1, 0.25, 1)'
          : 'none',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
