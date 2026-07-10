'use client';
import { useEffect, useState } from 'react';

/**
 * Word Reveal Animation — Blur + TranslateY Stagger
 *
 * Splits text into words and animates each with a staggered delay.
 * Each word starts blurred (8px) and translated down (100%),
 * then animates to clear (0px blur, translateY(0)).
 *
 * Usage:
 *   <WordReveal
 *     text="build systems that last."
 *     tag="h1"
 *     className="..."
 *     staggerDelay={80}
 *   />
 *
 * For partial highlighting, pass highlightLast={true} to apply
 * a separate className to the last word.
 */
export default function WordReveal({
  text,
  tag: Tag = 'h1',
  className = '',
  staggerDelay = 80,
  blurClassName = '',
  highlightLast = false,
  highlightClassName = 'text-[#2997ff]',
  animationDelay = 300,
}) {
  const [animate, setAnimate] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <Tag className={className}>
      {words.map((word, i) => {
        const isLastWord = i === words.length - 1;
        const strippedWord = isLastWord ? word.replace('.', '') : word;
        const hasDot = isLastWord && word.endsWith('.');
        const wordDelay = animationDelay + i * staggerDelay;

        return (
          <span key={`${word}-${i}`} style={{ display: 'inline' }}>
            <span className="word-reveal-word">
              <span
                className={`word-reveal-inner ${animate ? 'animate' : ''} ${
                  highlightLast && isLastWord ? highlightClassName : blurClassName
                }`}
                style={{ animationDelay: `${wordDelay}ms` }}
              >
                {strippedWord}
              </span>
            </span>
            {hasDot && (
              <span className="word-reveal-word">
                <span
                  className={`word-reveal-inner ${animate ? 'animate' : ''} ${
                    highlightLast && isLastWord ? highlightClassName : blurClassName
                  }`}
                  style={{
                    animationDelay: `${wordDelay + staggerDelay * 0.3}ms`,
                  }}
                >
                  .
                </span>
              </span>
            )}
            {i < words.length - 1 && ' '}
          </span>
        );
      })}
    </Tag>
  );
}
