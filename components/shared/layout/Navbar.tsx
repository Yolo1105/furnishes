'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import ContactModal from './ContactModal';
import GuidanceModal from './GuidanceModal';

const Navbar = () => {
  const [isInHero, setIsInHero] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const isPlaygroundPage = pathname === '/playground';
  const isChatbotPage = pathname === '/chatbot';
  const isCollectionsPage = pathname === '/collections';
  const isInspirationPage = pathname === '/inspiration';
  const isDetailPage = pathname?.startsWith('/collections/') && pathname !== '/collections';
  
  const menuItems = [
    { name: 'Furnishes', href: '/', isFurnishes: true },
    { name: 'Collections', href: '/collections' },
    { name: 'Inspiration', href: '/inspiration' },
    { name: 'Playground', href: '/playground' },
    { name: 'About', href: '/about' },
    // { name: 'Community', href: '/community' },
  ];

  // Trigger animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // For landing page: use IntersectionObserver with hero section
  useEffect(() => {
    if (!isLandingPage) return;
    
    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInHero(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px 0px 0px', // Consider navbar height
      }
    );

    observer.observe(heroSection);

    return () => {
      observer.disconnect();
    };
  }, [isLandingPage]);

  // For other pages: use scroll position to change colors
  // For detail pages: always use brown (don't change on scroll)
  useEffect(() => {
    if (isLandingPage) return;
    
    // Detail pages should always be brown
    if (isDetailPage) {
      setHasScrolled(true);
      return;
    }
    
    const handleScroll = () => {
      // Change color after scrolling 50px
      setHasScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage, isDetailPage]);

  // For playground, chatbot, and collections pages: hide navbar when scrolling past banner
  useEffect(() => {
    if (!isPlaygroundPage && !isChatbotPage && !isCollectionsPage) return;

    const handlePlaygroundScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      // Banner height is approximately 45vh or min 320px
      // We'll use a threshold of about 20% of typical banner height for much earlier slide up
      const bannerHeight = Math.max(window.innerHeight * 0.45, 320);
      const threshold = bannerHeight * 0.2; // Hide when scrolled past 20% of banner

      if (currentScrollY > threshold) {
        // Scrolling down past banner - hide navbar
        if (currentScrollY > lastScrollY) {
          setIsNavbarHidden(true);
        }
        // Scrolling up - show navbar
        else if (currentScrollY < lastScrollY) {
          setIsNavbarHidden(false);
        }
      } else {
        // Still in banner area - always show navbar
        setIsNavbarHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    // Check initial scroll position
    handlePlaygroundScroll();
    
    window.addEventListener('scroll', handlePlaygroundScroll, { passive: true });
    return () => window.removeEventListener('scroll', handlePlaygroundScroll);
  }, [isPlaygroundPage, isChatbotPage, isCollectionsPage]);

  // Color changes based on page and scroll state
  // Landing page: uses hero intersection
  // Detail pages: brown by default
  // Inspiration page: brown by default
  // Other pages: cream by default, brown after scrolling
  const shouldUseCreamColor = isLandingPage ? isInHero : (isDetailPage || isInspirationPage ? false : !hasScrolled);
  const creamColor = shouldUseCreamColor ? '#fef0e0' : '#8b5a3f';
  const orangeColor = '#E55E00';

  const leftMenuItems = menuItems; // Furnishes, Collections, Inspiration, Playground, About
  const rightMenuItems: typeof menuItems = []; // Empty

  // Function to determine which characters should be orange for each menu item
  // Choosing characters that don't break word readability - typically vowels or less critical positions
  const getOrangeChars = (itemName: string): Set<number> => {
    const orangeIndices = new Set<number>();
    
    // Different patterns for different items - 2 characters per item
    switch (itemName.toLowerCase()) {
      case 'collections':
        // Second 'O' (index 1) and 'I' (index 7)
        orangeIndices.add(1);
        orangeIndices.add(7);
        break;
      case 'inspiration':
        // 'A' (index 7) and 'O' (index 9)
        orangeIndices.add(7);
        orangeIndices.add(9);
        break;
      case 'playground':
        // 'Y' (index 3) and 'O' (index 6)
        orangeIndices.add(3);
        orangeIndices.add(6);
        break;
      case 'about':
        // 'A' (index 0) and 'U' (index 3)
        orangeIndices.add(0);
        orangeIndices.add(3);
        break;
      case 'about us':
        // 'U' (index 3) and 'S' (last character)
        orangeIndices.add(3);
        orangeIndices.add(itemName.length - 1);
        break;
      default:
        // Fallback: no orange
        break;
    }
    
    return orangeIndices;
  };

  const renderMenuItem = (item: typeof menuItems[0], idx: number, isLast: boolean) => {
    const allChars = item.name.split('');
    const orangeChars = item.isFurnishes ? null : getOrangeChars(item.name);
    
    return (
      <div 
        key={item.name} 
        className={`${styles.menuItemWrapper} ${isLoaded ? styles.menuItemAnimated : ''}`}
        style={{
          '--item-index': idx,
          '--animation-delay': `${idx * 0.15}s`,
        } as React.CSSProperties}
      >
        <Link href={item.href} className={styles.menuItem}>
          <span className={styles.menuText}>
            {allChars.map((char, charIndex) => {
              let charColor = creamColor;
              if (item.isFurnishes) {
                // For FURNISHES: U and ISH are orange, rest are cream/dark
                const charUpper = char.toUpperCase();
                if (charUpper === 'U' || (charIndex >= 4 && charIndex <= 6 && ['I', 'S', 'H'].includes(charUpper))) {
                  charColor = orangeColor;
                }
              } else {
                // For other items: use the orange pattern
                if (orangeChars && orangeChars.has(charIndex)) {
                  charColor = orangeColor;
                }
              }
              return (
                <span
                  key={charIndex}
                  className={styles.menuChar}
                  style={{
                    color: charColor,
                    '--char-index': charIndex,
                  } as React.CSSProperties}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </Link>
      </div>
    );
  };

  // Make navbar background more visible on inspiration page
  const navbarStyle = isInspirationPage ? {
    background: 'linear-gradient(to bottom, rgba(139, 90, 63, 0.15) 0%, rgba(139, 90, 63, 0.12) 20%, rgba(139, 90, 63, 0.08) 40%, rgba(139, 90, 63, 0.05) 60%, rgba(139, 90, 63, 0.03) 75%, rgba(139, 90, 63, 0.01) 88%, transparent 100%)',
  } : {};

  return (
    <nav 
      className={`${styles.navbar} ${(isPlaygroundPage || isChatbotPage || isCollectionsPage) && isNavbarHidden && !isInspirationPage ? styles.navbarHidden : ''}`} 
      style={navbarStyle}
      aria-label="Primary Navigation"
    >
      <div className={styles.navInner}>
        {/* Left Menu Items - Furnishes, Collections, Inspiration, Playground, About */}
        <div className={styles.leftMenu} role="menubar">
          {leftMenuItems.map((item, idx) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {renderMenuItem(item, idx, idx === 0)}
              {idx === 0 && (
                <button 
                  className={`${styles.infoButton} ${styles.infoButtonWrapper} ${isLoaded ? styles.infoButtonAnimated : ''}`}
                  style={{ '--animation-delay': '0s' } as React.CSSProperties}
                  aria-label="Guidance" 
                  title="Get Started Guide"
                  onClick={() => setIsGuidanceModalOpen(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={creamColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      
      {/* Guidance Modal */}
      <GuidanceModal 
        isOpen={isGuidanceModalOpen} 
        onClose={() => setIsGuidanceModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
