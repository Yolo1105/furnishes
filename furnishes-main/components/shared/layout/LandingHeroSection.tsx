'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './LandingHeroSection.module.css';
import CircleLoader from '../ui/CircleLoader';
import Popup from '../ui/Popup';

const LandingHeroSection: React.FC = () => {
  const topRightLoaderRef = useRef<HTMLDivElement>(null);
  const bottomLeftLoaderRef = useRef<HTMLDivElement>(null);
  const bottomRightLoaderRef = useRef<HTMLDivElement>(null);
  const bottomLeftDownLoaderRef = useRef<HTMLDivElement>(null);

  // Entrance animation flags
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [startCircles, setStartCircles] = useState<boolean>(false);
  const [showHashItems, setShowHashItems] = useState<boolean>(false);
  const [showWelcomeText, setShowWelcomeText] = useState<boolean>(false);
  const [showEmotionCare, setShowEmotionCare] = useState<boolean>(false);
  
  // Popup state - track which circle should show popup
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [popupIsVisible, setPopupIsVisible] = useState<boolean>(false);
  const [popupPositions, setPopupPositions] = useState<Record<string, { top: number; left: number }>>({});

  // Initial animation sequence
  useEffect(() => {
    // Show the "Take a seat" CTA after a short delay
    const t1 = window.setTimeout(() => setShowAbout(true), 800);
    
    // Show welcome text before hash items (fade in from left to right)
    const t2 = window.setTimeout(() => setShowWelcomeText(true), 1500);
    
    // Show hash items after 2 seconds (as requested)
    const t3 = window.setTimeout(() => setShowHashItems(true), 2000);
    
    // Show "Emotion Does Care" after hash items animation completes
    // Hash items start at 2000ms, last item delay is 0.5s, animation duration is 1s
    // So last item finishes at 2000 + 500 + 1000 = 3500ms, but show it quicker at 2800ms
    const t4 = window.setTimeout(() => setShowEmotionCare(true), 2800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, []);

  // After the about link entrance completes, reveal circles
  useEffect(() => {
    if (!showAbout) return;
    const delayMs = 1400;
    const to = window.setTimeout(() => setStartCircles(true), delayMs);
    return () => window.clearTimeout(to);
  }, [showAbout]);

  // Calculate and update popup positions when circles become visible
  useEffect(() => {
    if (!startCircles) return;

    const updatePopupPositions = () => {
      const positions: Record<string, { top: number; left: number }> = {};
      
      if (topRightLoaderRef.current) {
        const rect = topRightLoaderRef.current.getBoundingClientRect();
        positions.playground = {
          top: rect.top + rect.height / 2 - 5,
          left: rect.left + rect.width / 2,
        };
      }
      
      if (bottomLeftLoaderRef.current) {
        const rect = bottomLeftLoaderRef.current.getBoundingClientRect();
        positions.about = {
          top: rect.top + rect.height / 2 - 5,
          left: rect.left + rect.width / 2,
        };
      }
      
      if (bottomRightLoaderRef.current) {
        const rect = bottomRightLoaderRef.current.getBoundingClientRect();
        positions.contact = {
          top: rect.top + rect.height / 2 - 5,
          left: rect.left + rect.width / 2,
        };
      }
      
      if (bottomLeftDownLoaderRef.current) {
        const rect = bottomLeftDownLoaderRef.current.getBoundingClientRect();
        positions.collections = {
          top: rect.top + rect.height / 2 - 5,
          left: rect.left + rect.width / 2,
        };
      }
      
      setPopupPositions(positions);
    };

    // Wait a bit for circles to be positioned, then calculate
    const timer = setTimeout(updatePopupPositions, 500);
    
    // Use requestAnimationFrame for smooth updates
    let rafId: number | null = null;
    let ticking = false;
    
    const throttledUpdate = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          updatePopupPositions();
          ticking = false;
        });
      }
    };
    
    // Also update on window resize and scroll with throttling
    window.addEventListener('resize', throttledUpdate, { passive: true });
    window.addEventListener('scroll', throttledUpdate, { passive: true, capture: true });
    document.addEventListener('scroll', throttledUpdate, { passive: true, capture: true });
    
    return () => {
      clearTimeout(timer);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('scroll', throttledUpdate, { capture: true });
      document.removeEventListener('scroll', throttledUpdate, { capture: true });
    };
  }, [startCircles]);

  // Auto-show popups in sequence after circles appear
  useEffect(() => {
    if (!startCircles) return;
    if (Object.keys(popupPositions).length === 0) return;

    const circleIds = ['playground', 'about', 'contact', 'collections'];
    let currentIndex = 0;
    let hideTimer: NodeJS.Timeout | null = null;
    let nextTimer: NodeJS.Timeout | null = null;
    let restartTimer: NodeJS.Timeout | null = null;

    const showNextPopup = () => {
      if (currentIndex < circleIds.length) {
        const circleId = circleIds[currentIndex];
        currentIndex++;
        
        // Show the popup - let the Popup component handle positioning via targetRef
        setActivePopup(circleId);
        // Trigger fade in after a tiny delay to ensure DOM is ready
        setTimeout(() => setPopupIsVisible(true), 10);
        
        // Show popup for 2.5 seconds, then fade out
        hideTimer = setTimeout(() => {
          setPopupIsVisible(false);
          
          // Wait for fade out animation (0.5s) before removing from DOM
          setTimeout(() => {
            setActivePopup(null);
            
            // Wait a bit more before showing next popup
            nextTimer = setTimeout(() => {
              if (currentIndex < circleIds.length) {
                showNextPopup();
              } else {
                // After all popups shown, restart the cycle
                restartTimer = setTimeout(() => {
                  currentIndex = 0;
                  showNextPopup();
                }, 2000);
              }
            }, 200);
          }, 500);
        }, 2500);
      }
    };

    // Start showing popups after a short delay
    const startTimer = setTimeout(showNextPopup, 1000);

    return () => {
      clearTimeout(startTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (nextTimer) clearTimeout(nextTimer);
      if (restartTimer) clearTimeout(restartTimer);
    };
  }, [startCircles, popupPositions]);

  // Circle animation chaos effect
  useEffect(() => {
    if (!startCircles) return;
    
    let isMounted = true;
    
    // EXTREME randomness with chaos theory and multiple entropy layers
    const getChaosSeed = () => {
      const timestamp = Date.now();
      const random1 = Math.random();
      const random2 = Math.random();
      const chaos = Math.sin(timestamp) * Math.cos(random1 * 1000) * Math.tan(random2 * 100);
      return timestamp + random1 * 1000000 + random2 * 500000 + chaos * 100000;
    };
    
    const chaosSeed = getChaosSeed();
    let chaosCounter = 0;
    
    // Chaos-driven random number generator
    const getChaosRandom = () => {
      chaosCounter++;
      const base = Math.random();
      const chaos1 = Math.sin(chaosSeed + chaosCounter * 137.5) * 0.5 + 0.5;
      const chaos2 = Math.cos(chaosSeed * 0.618 + chaosCounter * 2.618) * 0.5 + 0.5;
      return (base + chaos1 + chaos2) / 3;
    };
    
    // EXTREME delay variation: 3-15 seconds with chaos patterns
    const generateChaosDelay = () => {
      const base = 3 + getChaosRandom() * 12;
      const wave = Math.sin(getChaosRandom() * Math.PI * 2) * 2.5;
      const spike = Math.random() > 0.7 ? Math.random() * 5 : 0;
      return Math.max(3, base + wave + spike);
    };
    
    // EXTREME offset variation: 0.5-4.0 seconds with unpredictable gaps
    const generateChaosOffset = () => {
      const base = 0.5 + getChaosRandom() * 3.5;
      const multiplier = Math.random() > 0.6 ? 1 + Math.random() * 1.5 : 1;
      return base * multiplier;
    };
    
    // CONSISTENT duration for all circles
    const CONSISTENT_DURATION = 2.5;
    
    // Advanced shuffling with multiple passes and chaos injection
    const chaosShuffleArray = (array: number[]) => {
      let shuffled = [...array];
      
      for (let pass = 0; pass < 3; pass++) {
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(getChaosRandom() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      }
      
      shuffled = shuffled.map(val => {
        if (getChaosRandom() > 0.8) {
          const chaosFactor = 0.8 + getChaosRandom() * 0.4;
          return val * chaosFactor;
        }
        return val;
      });
      
      return shuffled;
    };

    // Generate arrays with EXTREME variation
    const chaosDelays = chaosShuffleArray([
      generateChaosDelay(),
      generateChaosDelay(),
      generateChaosDelay(),
      generateChaosDelay(),
    ]);

    const chaosOffsets = chaosShuffleArray([
      generateChaosOffset(),
      generateChaosOffset(),
      generateChaosOffset(),
      generateChaosOffset(),
    ]);

    // All circles use the same consistent duration
    const consistentDurations = Array.from({ length: 4 }, () => CONSISTENT_DURATION);

    // Random assignment order
    const circleRefs = [topRightLoaderRef, bottomLeftLoaderRef, bottomRightLoaderRef, bottomLeftDownLoaderRef];
    const shuffledRefs = [...circleRefs];
    for (let i = shuffledRefs.length - 1; i > 0; i--) {
      const j = Math.floor(getChaosRandom() * (i + 1));
      [shuffledRefs[i], shuffledRefs[j]] = [shuffledRefs[j], shuffledRefs[i]];
    }

    // Apply EXTREME chaos patterns
    const applyChaosDelay = (ref: React.RefObject<HTMLDivElement>, delay1: number, delay2: number, duration: number, scale: number) => {
      if (!isMounted || !ref.current) return;
      ref.current.style.setProperty('--loader-delay-1', `${delay1}s`);
      ref.current.style.setProperty('--loader-delay-2', `${delay2}s`);
      ref.current.style.setProperty('--loader-duration', `${duration}s`);
      ref.current.style.setProperty('--loader-scale', `${scale}`);
    };

    // Generate random scale variations for each circle
    const scaleVariations = chaosShuffleArray(
      Array.from({ length: 4 }, () => 0.7 + getChaosRandom() * 0.6)
    );

    // Apply to shuffled circle references with chaos patterns
    shuffledRefs.forEach((ref, index) => {
      const delay1 = chaosDelays[index];
      const delay2 = delay1 + chaosOffsets[index];
      const duration = consistentDurations[index];
      const scale = scaleVariations[index];
      
      applyChaosDelay(ref, delay1, delay2, duration, scale);
    });

    return () => {
      isMounted = false;
    };
  }, [startCircles]);

  const handleClosePopup = () => {
    setActivePopup(null);
  };

  // Handle circle click to show popup immediately
  const handleCircleClick = (e: React.MouseEvent<HTMLDivElement>, circleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePopup(circleId);
    setTimeout(() => setPopupIsVisible(true), 10);
  };

  // Get the circle ref based on activePopup ID
  const getCircleRef = (circleId: string | null): React.RefObject<HTMLDivElement> | null => {
    if (!circleId) return null;
    switch (circleId) {
      case 'playground':
        return topRightLoaderRef;
      case 'about':
        return bottomLeftLoaderRef;
      case 'contact':
        return bottomRightLoaderRef;
      case 'collections':
        return bottomLeftDownLoaderRef;
      default:
        return null;
    }
  };

  // Get href for navigation based on circle ID
  const getCircleHref = (circleId: string): string => {
    switch (circleId) {
      case 'playground':
        return '/playground';
      case 'about':
        return '/about';
      case 'contact':
        return '/contact';
      case 'collections':
        return '/collections';
      default:
        return '/';
    }
  };

  // Popup content definitions - Left picture, right text layout (smaller consistent size)
  const getPopupContent = (circleId: string) => {
    switch (circleId) {
      case 'playground':
        return (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: '0 0 90px', width: '90px', height: '90px' }}>
              <img 
                src="/images/hero-modern-room.jpg" 
                alt="Playground" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '0.5rem',
                  objectFit: 'cover'
                }} 
              />
            </div>
            <div style={{ flex: '1', minWidth: 0 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.375rem', color: '#111', fontFamily: 'var(--font-manrope), sans-serif', lineHeight: 1.2 }}>
                Playground
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: '#333', fontFamily: 'var(--font-manrope), sans-serif', margin: 0 }}>
                Explore our interactive design playground where you can experiment with different furniture layouts.
              </p>
            </div>
          </div>
        );
      case 'about':
        return (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: '0 0 90px', width: '90px', height: '90px' }}>
              <img 
                src="/images/hero-modern-room.jpg" 
                alt="About Us" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '0.5rem',
                  objectFit: 'cover'
                }} 
              />
            </div>
            <div style={{ flex: '1', minWidth: 0 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.375rem', color: '#111', fontFamily: 'var(--font-manrope), sans-serif', lineHeight: 1.2 }}>
                About Us
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: '#333', fontFamily: 'var(--font-manrope), sans-serif', margin: 0 }}>
                Discover our vision for creating thoughtfully designed furniture that fits your urban lifestyle.
              </p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: '0 0 90px', width: '90px', height: '90px' }}>
              <img 
                src="/images/hero-modern-room.jpg" 
                alt="Contact" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '0.5rem',
                  objectFit: 'cover'
                }} 
              />
            </div>
            <div style={{ flex: '1', minWidth: 0 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.375rem', color: '#111', fontFamily: 'var(--font-manrope), sans-serif', lineHeight: 1.2 }}>
                Get in Touch
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: '#333', fontFamily: 'var(--font-manrope), sans-serif', margin: 0 }}>
                Have questions about our furniture or design services? We&apos;d love to hear from you.
              </p>
            </div>
          </div>
        );
      case 'collections':
        return (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: '0 0 90px', width: '90px', height: '90px' }}>
              <img 
                src="/images/hero-modern-room.jpg" 
                alt="Collections" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '0.5rem',
                  objectFit: 'cover'
                }} 
              />
            </div>
            <div style={{ flex: '1', minWidth: 0 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.375rem', color: '#111', fontFamily: 'var(--font-manrope), sans-serif', lineHeight: 1.2 }}>
                Collections
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: '#333', fontFamily: 'var(--font-manrope), sans-serif', margin: 0 }}>
                Browse our curated collections of thoughtfully designed furniture for every space.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      id="home"
      className={styles.heroSection}
    >
      <div className={styles.heroBgWrap}>
        <div className={styles.heroMediaBox}>
          <img src="/images/landing-banner.jpg" alt="Modern interior design space" className={styles.heroBgImage} />
          <div className={styles.heroVideoOverlay}></div>
        </div>
      </div>
      
      <div className={styles.heroContent}>
        {/* Top Right Loader */}
        <div 
          ref={topRightLoaderRef} 
          className={`${styles.topRightLoader} ${styles.circlesEntranceBase} ${startCircles ? styles.circlesVisible : styles.circlesHidden}`}
          onClick={(e) => handleCircleClick(e, 'playground')}
          onMouseDown={(e) => e.preventDefault()}
          style={{ cursor: 'pointer' }}
        >
          <CircleLoader size="large" clickable={false} href="/playground" />
        </div>
        
        {/* Bottom Left Loader */}
        <div 
          ref={bottomLeftLoaderRef} 
          className={`${styles.bottomLeftLoader} ${styles.circlesEntranceBase} ${startCircles ? styles.circlesVisible : styles.circlesHidden}`}
          onClick={(e) => handleCircleClick(e, 'about')}
          onMouseDown={(e) => e.preventDefault()}
          style={{ cursor: 'pointer' }}
        >
          <CircleLoader size="large" clickable={false} href="/about" />
        </div>
        
        {/* Bottom Right Loader */}
        <div 
          ref={bottomRightLoaderRef} 
          className={`${styles.bottomRightLoader} ${styles.circlesEntranceBase} ${startCircles ? styles.circlesVisible : styles.circlesHidden}`}
          onClick={(e) => handleCircleClick(e, 'contact')}
          onMouseDown={(e) => e.preventDefault()}
          style={{ cursor: 'pointer' }}
        >
          <CircleLoader size="large" clickable={false} href="/contact" />
        </div>

        {/* Bottom Left Down Loader - positioned left and down from leftmost circle */}
        <div 
          ref={bottomLeftDownLoaderRef} 
          className={`${styles.bottomLeftDownLoader} ${styles.circlesEntranceBase} ${startCircles ? styles.circlesVisible : styles.circlesHidden}`}
          onClick={(e) => handleCircleClick(e, 'collections')}
          onMouseDown={(e) => e.preventDefault()}
          style={{ cursor: 'pointer' }}
        >
          <CircleLoader size="large" clickable={false} href="/collections" />
        </div>

        {/* Start Journey Section */}
        <div className={styles.startJourneySection}>
          {/* Start Journey Link */}
          <div className={styles.startJourneyLinkWrapper}>
            <Link href="/playground" className={styles.startJourneyLink}>
              <span className={styles.startJourneyBracket}>[</span>
              <span className={styles.startJourneyText}>start journey</span>
              <span className={styles.startJourneyBracket}>]</span>
            </Link>
          </div>

          {/* Welcome Text */}
          <div 
            className={`${styles.welcomeText} ${showWelcomeText ? styles.welcomeTextAnimated : ''}`}
          >
            Hello<span style={{ color: '#E55E00' }}>!</span> Welcome h<span style={{ color: '#E55E00' }}>o</span>me<span style={{ color: '#E55E00' }}>.</span>
          </div>

          {/* Three # Items */}
          <div className={styles.hashItems}>
            <div className={styles.hashItemsInner}>
              <div 
                className={`${styles.hashItem} ${showHashItems ? styles.hashItemAnimated : ''}`}
                style={{
                  '--animation-delay': '0s',
                } as React.CSSProperties}
              >
                <span className={styles.hashSymbol}>#</span> <span className={styles.hashText}>AI Interior Design Assistant</span>
              </div>
              <div 
                className={`${styles.hashItem} ${showHashItems ? styles.hashItemAnimated : ''}`}
                style={{
                  '--animation-delay': '0.25s',
                } as React.CSSProperties}
              >
                <span className={styles.hashSymbol}>#</span> <span className={styles.hashText}>3D Room Layout Visualizer</span>
              </div>
              <div 
                className={`${styles.hashItem} ${showHashItems ? styles.hashItemAnimated : ''}`}
                style={{
                  '--animation-delay': '0.5s',
                } as React.CSSProperties}
              >
                <span className={styles.hashSymbol}>#</span> <span className={styles.hashText}>Craft personalized furniture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Two-Line Text */}
        <div className={styles.heroRightTextSection}>
          <div className={`${styles.heroRightLine1} ${showEmotionCare ? styles.heroRightLineAnimated : ''}`}>
            Em<span style={{ color: '#E55E00' }}>o</span>tion
          </div>
          <div className={`${styles.heroRightLine2} ${showEmotionCare ? styles.heroRightLineAnimated : ''}`} style={{ '--animation-delay': '0.2s' } as React.CSSProperties}>
            Does C<span style={{ color: '#E55E00' }}>a</span>re<span style={{ color: '#E55E00' }}>.</span>
          </div>
        </div>

        {/* About Link - Take a seat */}
        <div className={`${styles.heroAboutLinkWrapper} ${styles.aboutEntranceBase} ${showAbout ? styles.aboutVisible : styles.aboutHidden}`}>
          <Link href="/about" className={styles.aboutLink}>
            <span className={styles.aboutText}>
              <span>Take a seat.<br />Discover our </span>
              <span className={styles.ctaIconOrange}>vision</span>.
            </span>
            <span className={styles.aboutIcon} style={{ opacity: 0.9 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </div>

      </div>

      {/* Popup Component - Auto-showing above circles */}
      {activePopup && getCircleRef(activePopup)?.current && (
        <Popup
          isOpen={popupIsVisible}
          onClose={handleClosePopup}
          targetRef={getCircleRef(activePopup)}
          position={popupPositions[activePopup]}
          href={getCircleHref(activePopup)}
        >
          {getPopupContent(activePopup)}
        </Popup>
      )}
    </section>
  );
};

export default LandingHeroSection;
