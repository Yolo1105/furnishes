'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import styles from './Popup.module.css';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: { top: number; left: number } | null;
  targetRef?: React.RefObject<HTMLElement> | null;
  href?: string;
  className?: string;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position,
  targetRef,
  href,
  className = '',
}) => {
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting' | 'hidden'>('hidden');
  const [shouldRender, setShouldRender] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationState('entering');
      // Wait for slide-up animation to complete before transitioning to visible state
      const timer = setTimeout(() => {
        setAnimationState('visible');
      }, 500); // Match animation duration to allow full slide-up animation
      return () => clearTimeout(timer);
    } else if (shouldRender) {
      // Only animate out if we're currently rendered
      setAnimationState('exiting');
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
        setAnimationState('hidden');
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Update position immediately when props change
  useEffect(() => {
    const calculatePosition = (): { top: number; left: number } | null => {
      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        return {
          top: rect.top + rect.height / 2 - 5,
          left: rect.left + rect.width / 2,
        };
      }
      return position || null;
    };

    const newPosition = calculatePosition();
    if (newPosition) {
      setCurrentPosition(newPosition);
    }
  }, [position, targetRef]);

  // Continuously update position on scroll/resize when popup is visible
  useEffect(() => {
    if (!isOpen) return;

    let rafId: number | null = null;
    let ticking = false;

    const updatePosition = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          // Calculate position from targetRef or use position prop
          let newPosition: { top: number; left: number } | null = null;
          if (targetRef?.current) {
            const rect = targetRef.current.getBoundingClientRect();
            newPosition = {
              top: rect.top + rect.height / 2 - 5,
              left: rect.left + rect.width / 2,
            };
          } else if (position) {
            newPosition = position;
          }

          if (newPosition) {
            setCurrentPosition(newPosition);
          }
          ticking = false;
        });
      }
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', updatePosition, { passive: true, capture: true });
    window.addEventListener('resize', updatePosition, { passive: true });
    document.addEventListener('scroll', updatePosition, { passive: true, capture: true });

    // Update position continuously when visible to ensure smooth tracking
    const intervalId = setInterval(updatePosition, 16); // ~60fps

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      clearInterval(intervalId);
      window.removeEventListener('scroll', updatePosition, { capture: true });
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('scroll', updatePosition, { capture: true });
    };
  }, [isOpen, targetRef, position]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Don't block body scroll - popup is non-modal

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle popup content click to navigate
  const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (href) {
      router.push(href);
      onClose();
    }
  };

  // If targetRef is provided, use absolute positioning relative to the circle
  // Otherwise, use fixed positioning with the position prop
  const wrapperStyle: React.CSSProperties = targetRef?.current && typeof window !== 'undefined'
    ? {
        position: 'absolute',
        top: '-5px',
        left: '50%',
        transform: 'translate(-50%, -100%)',
      }
    : currentPosition && typeof window !== 'undefined'
    ? {
        position: 'fixed',
        top: `${Math.max(50, Math.min(currentPosition.top, window.innerHeight - 50))}px`,
        left: `${Math.max(150, Math.min(currentPosition.left, window.innerWidth - 150))}px`,
        transform: 'translate(-50%, -10%)',
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };

  if (!shouldRender) {
    return null;
  }

  const popupContent = (
    <div
      style={wrapperStyle}
      className={styles.popupWrapper}
    >
      <div
        ref={popupRef}
        className={`${styles.popup} ${className} ${href ? styles.popupClickable : ''} ${
          animationState === 'visible' ? styles.popupVisible :
          animationState === 'exiting' ? styles.popupExiting :
          styles.popupEntering
        }`}
        role="dialog"
        aria-modal="false"
        aria-labelledby={title ? 'popup-title' : undefined}
        onClick={handlePopupClick}
        style={href ? { cursor: 'pointer' } : {}}
      >
      {title && (
        <div className={styles.popupHeader}>
          <h2 id="popup-title" className={styles.popupTitle}>
            {title}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close popup"
          >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
          </button>
        </div>
      )}
      <div className={styles.popupContent}>{children}</div>
      </div>
    </div>
  );

  // If targetRef is provided, render inside the circle container (absolute positioning)
  // Otherwise, use Portal to render at document body level (fixed positioning)
  if (targetRef?.current && typeof window !== 'undefined') {
    return createPortal(popupContent, targetRef.current);
  }

  // Use Portal to render at document body level to avoid z-index/overflow issues
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(popupContent, document.body);
  }

  return popupContent;
};

export default Popup;
