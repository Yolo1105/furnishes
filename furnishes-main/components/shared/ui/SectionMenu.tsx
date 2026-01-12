'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SectionMenu.module.css';

type SectionItem = {
  id: string;
  label: string;
};

type SectionMenuProps = {
  items: SectionItem[];
  shouldAnimate?: boolean;
  initialInHero?: boolean;
};

export default function SectionMenu({ items, shouldAnimate = true, initialInHero = true }: SectionMenuProps) {
  const [active, setActive] = useState(!shouldAnimate);
  const initialId = useMemo(() => (items && items.length ? items[0].id : 'home'), [items]);
  const [activeId, setActiveId] = useState<string>(initialId);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [isInHero, setIsInHero] = useState(initialInHero);
  const isAnimatingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const setScrollTop = (y: number) => {
    const scroller = (document.scrollingElement || document.documentElement) as HTMLElement;
    scroller.scrollTop = y;
    document.documentElement.scrollTop = y;
    document.body.scrollTop = y;
    scroller.offsetHeight;
  };

  const getScrollContainer = (target: HTMLElement): HTMLElement => {
    let node: HTMLElement | null = target.parentElement;
    while (node && node !== document.body && node !== document.documentElement) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      const canScroll = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
      if (canScroll) return node;
      node = node.parentElement;
    }
    return (document.scrollingElement || document.documentElement) as HTMLElement;
  };

  useEffect(() => {
    if (shouldAnimate) {
      const t = window.setTimeout(() => setActive(true), 800);
      return () => window.clearTimeout(t);
    } else {
      setActive(true);
    }
  }, [shouldAnimate]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    setActiveId(id);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const originalHtmlScrollBehavior = htmlElement.style.scrollBehavior;
    const originalBodyScrollBehavior = bodyElement.style.scrollBehavior;
    
    // Only disable smooth scroll for programmatic scrolling, keep it for manual scrolling
    htmlElement.style.scrollBehavior = 'auto';
    bodyElement.style.scrollBehavior = 'auto';

    const offset = 0;
    
    const scroller = getScrollContainer(el);
    const isWindow = scroller === (document.scrollingElement || document.documentElement);
    let start = 0;
    let destination = 0;
    
    if (isWindow) {
      const rect = el.getBoundingClientRect();
      start = window.pageYOffset || window.scrollY || scroller.scrollTop || 0;
      destination = Math.max(0, rect.top + start - offset);
    } else {
      const targetTop = el.getBoundingClientRect().top;
      const containerTop = scroller.getBoundingClientRect().top;
      start = scroller.scrollTop;
      destination = Math.max(0, start + (targetTop - containerTop) - offset);
    }
    
    const distance = destination - start;
    if (Math.abs(distance) < 1) {
      htmlElement.style.scrollBehavior = originalHtmlScrollBehavior;
      bodyElement.style.scrollBehavior = originalBodyScrollBehavior;
      return;
    }

    isAnimatingRef.current = true;
    
    setTimeout(() => {
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const duration = Math.max(800, Math.min(1500, 400 + Math.abs(distance) * 0.4));
      let startTs: number | null = null;
      
      const step = (ts: number) => {
        if (startTs === null) startTs = ts;
        const elapsed = ts - startTs;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(progress);
        
        const currentPosition = start + distance * eased;
        
        if (isWindow) {
          setScrollTop(currentPosition);
        } else {
          (scroller as HTMLElement).scrollTop = currentPosition;
        }
        
        if (progress < 1) {
          rafRef.current = window.requestAnimationFrame(step);
        } else {
          const finalPosition = start + distance;
          
          const correctScrollPosition = () => {
            const currentScrollTop = isWindow ? 
              (window.pageYOffset || window.scrollY || scroller.scrollTop || 0) : 
              scroller.scrollTop;
            
            if (Math.abs(currentScrollTop - finalPosition) > 1) {
              if (isWindow) {
                setScrollTop(finalPosition);
              } else {
                (scroller as HTMLElement).scrollTop = finalPosition;
              }
            }
          };
          
          if (isWindow) {
            setScrollTop(finalPosition);
          } else {
            (scroller as HTMLElement).scrollTop = finalPosition;
          }
          
          setTimeout(correctScrollPosition, 10);
          
          isAnimatingRef.current = false;
          rafRef.current = null;
          
          setTimeout(() => {
            correctScrollPosition();
            htmlElement.style.scrollBehavior = originalHtmlScrollBehavior;
            bodyElement.style.scrollBehavior = originalBodyScrollBehavior;
          }, 150);
        }
      };
      
      rafRef.current = window.requestAnimationFrame(step);
    }, 10);
  };

  useEffect(() => {
    if (!items || !items.length || typeof window === 'undefined') return;

    const sectionIds = items.map((i) => i.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    let lastActive = activeId;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isAnimatingRef.current) return;
        let topCandidate: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          const ratio = entry.intersectionRatio;
          if (!topCandidate || ratio > topCandidate.ratio) {
            topCandidate = { id, ratio };
          }
        }
        if (topCandidate && topCandidate.id !== lastActive) {
          lastActive = topCandidate.id;
          setActiveId(topCandidate.id);
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.2, 0.33, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px -20% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, activeId]);

  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const totalPageHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      // Calculate when scroll has passed 5% of the total page height
      const passed5Percent = scrollTop > totalPageHeight * 0.03;
      
      setIsInHero(!passed5Percent);
    };

    // Check on scroll for accurate tracking
    const handleScroll = () => {
      checkScrollPosition();
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    checkScrollPosition(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // If initialInHero is false, always use brown for inactive items
  const creamColor = (!initialInHero) ? '#8b5a3f' : (isInHero ? '#fef0e0' : '#8b5a3f');

  // Calculate step number based on active section
  // "info" (About) = Step 0, "sofa" (Design) = Step 1, "grid" (Materials) = Step 2, "heritage" = Step 3
  const getStepNumber = (sectionId: string): number | null => {
    const stepMap: Record<string, number> = {
      'info': 0,
      'sofa': 1,
      'grid': 2,
      'heritage': 3,
    };
    return stepMap[sectionId] ?? null;
  };

  const stepNumber = getStepNumber(activeId);
  const showStepIndicator = stepNumber !== null;

  return (
    <nav 
      className={`${styles.menu} ${active ? styles.menuVisible : styles.menuHidden}`} 
      aria-label="Section navigation"
      style={!shouldAnimate ? { 
        opacity: 1,
        transform: 'translateX(0)',
        transition: 'none'
      } : {}}
    >
      {showStepIndicator && (
        <div 
          className={`${styles.stepIndicator} ${styles.fadeBase} ${active ? styles.fadeIn : styles.fadeOut}`}
          style={shouldAnimate ? { transitionDelay: '800ms' } : { 
            opacity: 1, 
            transform: 'translateX(0)',
            transition: 'none',
            transitionDelay: '0ms'
          }}
        >
          step {stepNumber}
        </div>
      )}
      <ul className={styles.list}>
        {items.map((item, idx) => {
          const isActive = item.id === activeId;
          const isActiveVisual = isActive && (!hoverId || hoverId === item.id);
          return (
            <li 
              key={item.id} 
              className={`${styles.item} ${styles.fadeBase} ${active ? styles.fadeIn : styles.fadeOut}`} 
              style={shouldAnimate ? { transitionDelay: `${800 + idx * 600}ms` } : { 
                opacity: 1, 
                transform: 'translateX(0)',
                transition: 'none',
                transitionDelay: '0ms'
              }}
            >
              <button
                type="button"
                onClick={(e) => handleClick(e, item.id)}
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                onTouchStart={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>, item.id);
                  }
                }}
                onMouseEnter={() => setHoverId(item.id)}
                onMouseLeave={() => setHoverId(null)}
                className={`${styles.link} ${isActiveVisual ? styles.linkActive : styles.linkInactive}`}
                aria-current={isActive ? 'true' : undefined}
                aria-controls={item.id}
                style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
              >
                <span className={styles.text}>
                  {(() => {
                    const isHighlighted = isActiveVisual || hoverId === item.id;
                    const textColor = isHighlighted ? '#E55E00' : creamColor;
                    return (
                      <span style={{ color: textColor, fontWeight: creamColor === '#8b5a3f' ? 500 : 400 }}>{item.label}</span>
                    );
                  })()}
                </span>
                {isActiveVisual && <span className={styles.underline} />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
