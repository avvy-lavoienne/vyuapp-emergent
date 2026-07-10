'use client';
import React, { useRef, useEffect, useState } from 'react';

/**
 * Client-side wrapper that adds slide-in animation to SectionHeader elements.
 * Uses IntersectionObserver to trigger staggered reveal when the header enters viewport.
 *
 * Wraps the output of the server-rendered SectionHeader component.
 * Usage:
 *   <AnimatedSectionHeader>
 *     <SectionHeader overline="..." title="..." />
 *   </AnimatedSectionHeader>
 */
export default function AnimatedSectionHeader({ children, align = 'left', threshold = 0.2 }) {
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

  const alignCls = align === 'center' ? 'section-headline-center' : '';

  return (
    <div ref={ref} className={alignCls}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // Clone the SectionHeader and wrap its internal elements with animation divs
        return React.cloneElement(child, {
          overline: child.props.overline ? (
            <span
              className={`section-headline-overline${visible ? ' visible' : ''}`}
              style={{ transitionDelay: '0ms' }}
            >
              {child.props.overline}
            </span>
          ) : undefined,
          title: (
            <span
              className={`section-headline-title${visible ? ' visible' : ''}`}
              style={{ transitionDelay: '150ms' }}
            >
              {child.props.title}
            </span>
          ),
          description: child.props.description ? (
            <span
              className={`section-headline-desc${visible ? ' visible' : ''}`}
              style={{ transitionDelay: '300ms' }}
            >
              {child.props.description}
            </span>
          ) : undefined,
        });
      })}
    </div>
  );
}
