'use client';
import { useEffect, useState, useRef } from 'react';

export default function RotatingHeadline({
  staticText = 'bangun sistem yang',
  rotatingTexts = ['tahan lama', 'aman', 'skalabel'],
  tag = 'h1',
  className = '',
  staticClassName = 'text-[#1d1d1f] dark:text-[#f5f5f7]',
  rotatingClassName = 'text-[#2997ff]',
  rotationInterval = 2500,
  animationDuration = 500,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRotating, setShowRotating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const animationEndRef = useRef(null);
  const intervalRef = useRef(null);
  const isFirstRender = useRef(true);

  const Tag = tag;

  useEffect(() => {
    const timer = setTimeout(() => setShowRotating(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showRotating || isComplete) return;

    const runCycle = () => {
      // Skip animation on first render - just show first item
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      setIsAnimating(true);
      animationEndRef.current = setTimeout(() => {
        if (currentIndex + 1 < rotatingTexts.length) {
          setCurrentIndex((prev) => prev + 1);
          setIsAnimating(false);
        } else {
          setIsAnimating(false);
          setIsComplete(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, animationDuration);
    };

    intervalRef.current = setInterval(runCycle, rotationInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationEndRef.current) clearTimeout(animationEndRef.current);
    };
  }, [showRotating, currentIndex, rotatingTexts.length, rotationInterval, animationDuration, isComplete]);

  const currentRotatingText = rotatingTexts[currentIndex];

  return (
    <Tag className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <span className={staticClassName} style={{ whiteSpace: 'nowrap' }}>
        {staticText}
      </span>
      {showRotating && (
        <span
          style={{
            display: 'inline-block',
            minWidth: 'ch',
            verticalAlign: 'baseline',
          }}
        >
          <span
            className={`inline-block transition-all ease-out ${
              isAnimating ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'
            } ${rotatingClassName}`}
            style={{
              transitionDuration: `${animationDuration}ms`,
            }}
          >
            {currentRotatingText}
          </span>
        </span>
      )}
    </Tag>
  );
}