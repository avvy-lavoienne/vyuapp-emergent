'use client';
import { useRef, useEffect, useState, Children, cloneElement } from 'react';

/**
 * StaggerGroup — wraps a grid of cards and applies 100ms cascade entry animation.
 *
 * Usage:
 *   <StaggerGroup>
 *     &lt;Card /&gt;  (each child gets --stagger-index CSS var automatically)
 *   &lt;Card /&gt;
 *   &lt;Card /&gt;
 *   &lt;Card /&gt;
 *   &lt;/StaggerGroup&gt;
 *
 * CSS pairing (globals.css):
 *   .stagger-child { opacity:0; transform: translateY(20px); transition: ... }
 *   .stagger-visible .stagger-child { opacity:1; transform: translateY(0); transition-delay: calc(var(--stagger-index, 0) * 100ms) }
 */
export default function StaggerGroup({ children, threshold = 0.1, className = '' }) {
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

  const childArray = Children.toArray(children);

  return (
    <div
      ref={ref}
      className={`${visible ? 'stagger-visible' : ''} ${className}`.trim()}
    >
      {childArray.map((child, i) =>
        cloneElement(child, {
          className: `${child.props.className || ''} stagger-child`.trim(),
          style: {
            ...child.props.style,
            '--stagger-index': i,
          },
        })
      )}
    </div>
  );
}
