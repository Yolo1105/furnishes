'use client';

import React from 'react';
import styles from '../RightSidebar.module.css';
import { UserInfo } from './types';

type ProfileContentProps = {
  isLoggedIn: boolean;
  user: UserInfo | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
};

const ProfileContent: React.FC<ProfileContentProps> = ({ 
  isLoggedIn, 
  user, 
  onLoginClick, 
  onRegisterClick,
  onLogout 
}) => {
  if (isLoggedIn && user) {
    // Logged in state
    return (
      <div className={styles.profileContent}>
        {/* Header - Logged In */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatarLoggedIn}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileTitle}>Hello, {user.name}!</div>
          <p className={styles.profileSubtitle}>{user.email}</p>
        </div>

        {/* Quick Actions */}
        <div className={styles.profileActions}>
          <button className={styles.profileActionButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Saved Designs</span>
            <span className={styles.actionBadge}>12</span>
          </button>
          <button className={styles.profileActionButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>My Orders</span>
            <span className={styles.actionBadge}>3</span>
          </button>
          <button className={styles.profileActionButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Account Settings</span>
          </button>
          <button className={styles.profileActionButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Support</span>
          </button>
        </div>

        {/* Member Status */}
        <div className={styles.memberStatus}>
          <div className={styles.memberBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#E55E00" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Premium Member</span>
          </div>
          <p className={styles.memberText}>Enjoying all exclusive benefits</p>
        </div>

        {/* Logout Button */}
        <div className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={onLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Not logged in state
  return (
    <div className={styles.profileContent}>
      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatarLarge}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a89080" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className={styles.profileTitle}>Welcome!</div>
        <p className={styles.profileSubtitle}>
          Sign in to unlock personalized recommendations and save your favorite designs.
        </p>
      </div>

      {/* Buttons */}
      <div className={styles.profileButtons}>
        <button className={styles.loginButton} onClick={onLoginClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Login
        </button>
        <button className={styles.registerButton} onClick={onRegisterClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Create Account
        </button>
      </div>

      {/* Benefits */}
      <div className={styles.profileBenefits}>
        <h3 className={styles.benefitsTitle}>Member Benefits</h3>
        <div className={styles.benefitsList}>
          <div className={styles.benefitItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E55E00" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Save favorite furniture</span>
          </div>
          <div className={styles.benefitItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E55E00" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Get personalized recommendations</span>
          </div>
          <div className={styles.benefitItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E55E00" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Access exclusive deals</span>
          </div>
          <div className={styles.benefitItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E55E00" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Track your orders</span>
          </div>
          <div className={styles.benefitItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E55E00" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Early access to new collections</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
