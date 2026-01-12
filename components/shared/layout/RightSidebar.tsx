'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './RightSidebar.module.css';

// Import extracted sub-components
import {
  AuthModal,
  ProfileContent,
  SearchContent,
  SummaryUserChoices,
  SummaryContent,
  ChatContent,
  CartContent,
  UserInfo,
} from './sidebar';

type RightSidebarProps = {
  className?: string;
};

// Cart Icon Button Component
const CartIconButton: React.FC<{ isActive: boolean; onClick: () => void }> = ({ isActive, onClick }) => {
  
  return (
    <button
      className={`${styles.iconButtonWithLabel} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      aria-label="Cart"
      style={{ position: 'relative' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className={styles.iconLabel}>Cart</span>
    </button>
  );
};

const RightSidebar: React.FC<RightSidebarProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === '/';
  const isAboutPage = pathname === '/about';
  const isInspirationPage = pathname === '/inspiration';
  const isDetailPage = pathname?.startsWith('/collections/') && pathname !== '/collections';
  const isChatbotPage = pathname === '/chatbot';
  const isPlaygroundPage = pathname === '/playground';
  const shouldAutoExpand = !isLandingPage && !isAboutPage && !isInspirationPage && !isDetailPage && !isChatbotPage && !isPlaygroundPage;
  
  // Initialize state based on whether it's landing page or about
  const [isExpanded, setIsExpanded] = useState(shouldAutoExpand);
  const [activeItem, setActiveItem] = useState<string | null>(isLandingPage ? 'search' : (shouldAutoExpand ? 'summary' : 'search'));
  const [lastClickedItem, setLastClickedItem] = useState<string | null>(isLandingPage ? 'search' : (shouldAutoExpand ? 'summary' : 'search'));
  // Tooltip removed - state no longer needed

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Auto-expand summary tab on non-landing pages (except about, inspiration, detail, and playground pages)
  useEffect(() => {
    if (shouldAutoExpand) {
      setActiveItem('summary');
      setLastClickedItem('summary');
      setIsExpanded(true);
    } else {
      setActiveItem('search');
      setLastClickedItem('search');
      setIsExpanded(false);
    }
  }, [shouldAutoExpand, pathname]);

  // Specifically handle project pages (style, budget, room-planner, validate, report)
  useEffect(() => {
    const projectPages = ['/style', '/budget', '/room-planner', '/validate', '/report'];
    if (projectPages.includes(pathname || '')) {
      setIsExpanded(true);
      setActiveItem('summary');
      setLastClickedItem('summary');
    }
  }, [pathname]);

  // Tooltip removed - no longer showing

  // Auth handlers
  const handleOpenLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  const handleAuthSuccess = (userInfo: UserInfo) => {
    setUser(userInfo);
    setIsLoggedIn(true);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleSwitchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleItemClick = (itemId: string) => {
    // Always update the last clicked item to keep it highlighted
    setLastClickedItem(itemId);

    // If on chatbot page and clicking chatbot icon, do nothing
    if (itemId === 'planner' && pathname === '/chatbot') {
      return;
    }

    // Navigate to page for specific items
    const pageRoutes: { [key: string]: string } = {
      'style': '/style',
      'budget': '/budget',
      'room-planner': '/room-planner',
      'validate': '/validate',
      'report': '/report',
    };

    if (pageRoutes[itemId]) {
      // For project pages, expand sidebar and show summary tab
      setIsExpanded(true);
      setActiveItem('summary');
      setLastClickedItem('summary');
      router.push(pageRoutes[itemId]);
      return;
    }

    if (activeItem === itemId && isExpanded) {
      // Collapse when clicking the same icon while expanded
      setIsExpanded(false);
      setTimeout(() => {
        setActiveItem(null);
      }, 400);
    } else if (activeItem && isExpanded && activeItem !== itemId) {
      // Switch to different content while expanded
      setActiveItem(itemId);
    } else {
      // Expand (including first click)
      setActiveItem(itemId);
      setIsExpanded(true);
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'profile':
        return (
          <ProfileContent 
            isLoggedIn={isLoggedIn}
            user={user}
            onLoginClick={handleOpenLogin}
            onRegisterClick={handleOpenRegister}
            onLogout={handleLogout}
          />
        );
      case 'search':
        return <SearchContent />;
      case 'summary':
        return <SummaryUserChoices />;
      case 'planner':
        return <ChatContent />;
      case 'cart':
        return <CartContent />;
      case 'style':
        return (
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4c4b8" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h3 className={styles.placeholderTitle}>Style Preferences</h3>
            <p className={styles.placeholderText}>Set your style preferences to get personalized furniture recommendations.</p>
          </div>
        );
      case 'budget':
        return (
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="1.5">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className={styles.placeholderTitle}>Budget Planner</h3>
            <p className={styles.placeholderText}>Set your budget and get cost-effective furniture suggestions that match your style.</p>
          </div>
        );
      case 'validate':
        return (
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4c4b8" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <h3 className={styles.placeholderTitle}>Validate Design</h3>
            <p className={styles.placeholderText}>Run AI validation to check proportions, flow, and design harmony of your room.</p>
          </div>
        );
      case 'report':
        return (
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4c4b8" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className={styles.placeholderTitle}>Generate Report</h3>
            <p className={styles.placeholderText}>Get a detailed PDF report of your design plan including item list and costs.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={styles.sidebar} aria-label="Right sidebar">
      {/* Icon Bar */}
      <div className={styles.iconBar}>
        <nav className={styles.iconNav} role="navigation">
          {/* Summary */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'summary' ? styles.active : ''}`}
            onClick={() => handleItemClick('summary')}
            aria-label="Summary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'summary' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <span className={styles.iconLabel}>Summary</span>
          </button>

          {/* Separator */}
          <div className={styles.iconSeparator}></div>

          {/* Search */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'search' ? styles.active : ''}`}
            onClick={() => handleItemClick('search')}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'search' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className={styles.iconLabel}>Search</span>
          </button>

          {/* Chatbot */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'planner' ? styles.active : ''}`}
            onClick={() => handleItemClick('planner')}
            aria-label="Chatbot"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'planner' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className={styles.iconLabel}>Chatbot</span>
          </button>

          {/* Separator */}
          <div className={styles.iconSeparator}></div>

          {/* Style */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'style' ? styles.active : ''}`}
            onClick={() => handleItemClick('style')}
            aria-label="Style"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'style' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span className={styles.iconLabel}>Style</span>
          </button>

          {/* Budget */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'budget' ? styles.active : ''}`}
            onClick={() => handleItemClick('budget')}
            aria-label="Budget"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'budget' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className={styles.iconLabel}>Budget</span>
          </button>

          {/* Room Planner */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'room-planner' ? styles.active : ''}`}
            onClick={() => handleItemClick('room-planner')}
            aria-label="Room Planner"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'room-planner' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span className={styles.iconLabel}>Room Planner</span>
          </button>

          {/* Validate */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'validate' ? styles.active : ''}`}
            onClick={() => handleItemClick('validate')}
            aria-label="Validate"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'validate' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span className={styles.iconLabel}>Validate</span>
          </button>

          {/* Report */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'report' ? styles.active : ''}`}
            onClick={() => handleItemClick('report')}
            aria-label="Report"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'report' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className={styles.iconLabel}>Report</span>
          </button>

          {/* Cart - above profile */}
          <div style={{ marginTop: 'auto' }}></div>
          <CartIconButton
            isActive={lastClickedItem === 'cart'}
            onClick={() => handleItemClick('cart')}
          />

          {/* Profile - at bottom */}
          <button
            className={`${styles.iconButtonWithLabel} ${lastClickedItem === 'profile' ? styles.active : ''}`}
            onClick={() => handleItemClick('profile')}
            aria-label="Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lastClickedItem === 'profile' ? '#E55E00' : '#8b5a3f'} strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className={styles.iconLabel}>Profile</span>
          </button>
        </nav>
      </div>

      {/* Expanded Content */}
      <div className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}>
        {/* Eva Header - shown for all sections except profile, search, summary, and cart */}
        {activeItem && activeItem !== 'profile' && activeItem !== 'search' && activeItem !== 'summary' && activeItem !== 'cart' && (
          <div className={styles.evaHeader}>
            <div className={styles.evaAvatar}>E</div>
            <div className={styles.evaInfo}>
              <div className={styles.evaName}>Eva</div>
              <div className={styles.evaSubtitle}>[AI Assistant]</div>
            </div>
            <div className={styles.evaActions}>
              <button 
                className={styles.evaActionButton} 
                aria-label="Expand chat" 
                title="Expand to fullscreen"
                onClick={() => {
                  // Collapse sidebar first, then navigate
                  setIsExpanded(false);
                  setTimeout(() => {
                    setActiveItem(null);
                    router.push('/chatbot');
                  }, 400);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v6h-6M3 9V3h6M21 3v6h-6M3 15v6h6" />
                </svg>
              </button>
              <button className={styles.evaActionButton} aria-label="Change AI" title="Change AI assistant">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                  <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className={styles.contentBody}>
          {renderContent()}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={handleCloseAuth}
        onSuccess={handleAuthSuccess}
        onSwitchMode={handleSwitchAuthMode}
      />
    </aside>
  );
};

export default RightSidebar;
