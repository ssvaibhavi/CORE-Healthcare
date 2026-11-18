import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // stagger delay in ms (e.g., 120, 240, 360)
  variant?: 'editorial' | 'bloom';
  className?: string;
}

/**
 * Signature Living Interface reveal wrapper.
 * - editorial: 900ms upward fade (20px) with smooth cubic-bezier easing.
 * - bloom: 880ms subtle scale (0.965 -> 1) and opacity reveal like a flower opening.
 * - Supports Full Elegance, Gentle Motion (.gentle-motion), and No Motion (.reduce-motion / OS reduced-motion).
 * - Never hides content once revealed, and includes a guaranteed failsafe timer.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  variant = 'editorial',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const noMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduce-motion');

    if (noMotion) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -16px 0px' }
    );

    observer.observe(el);

    const failsafe = window.setTimeout(() => {
      setVisible(true);
      observer.disconnect();
    }, 1350 + delay);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [delay, visible]);

  const isGentle =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('gentle-motion');

  const isNone =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('reduce-motion');

  const hiddenTransform =
    isNone
      ? 'none'
      : isGentle
      ? 'translateY(4px)'
      : variant === 'bloom'
      ? 'scale(0.965) translateY(10px)'
      : 'translateY(20px)';

  const visibleTransform =
    variant === 'bloom' && !isNone && !isGentle ? 'scale(1) translateY(0px)' : 'translateY(0px)';

  return (
    <div
      ref={ref}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: isNone ? '0ms' : isGentle ? '420ms' : '900ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: isNone ? '0ms' : `${delay}ms`,
        opacity: visible || isNone ? 1 : 0,
        transform: visible || isNone ? visibleTransform : hiddenTransform,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

interface WordRevealProps {
  text: string;
  className?: string;
}

/**
 * Delicate word-by-word editorial headline bloom (non-blocking, gentle settle).
 */
export const WordReveal: React.FC<WordRevealProps> = ({ text, className = '' }) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, idx) => (
        <React.Fragment key={`${word}-${idx}`}>
          <span
            className="word-bloom"
            style={{
              animationDelay: `${Math.min(idx * 70, 560)}ms`,
            }}
          >
            {word}
          </span>
          {idx < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </span>
  );
};

interface GracefulExpandProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Smooth grid-row card expansion wrapper that avoids abrupt screen jumps.
 */
export const GracefulExpand: React.FC<GracefulExpandProps> = ({
  isOpen,
  children,
  className = '',
}) => {
  return (
    <div className={`graceful-expand ${className}`} data-open={isOpen ? 'true' : 'false'}>
      <div>{children}</div>
    </div>
  );
};
