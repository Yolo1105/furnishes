'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../RightSidebar.module.css';
import { UserInfo } from './types';

type AuthModalProps = {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserInfo) => void;
  onSwitchMode: () => void;
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode, onClose, onSuccess, onSwitchMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Just pretend login/register succeeded
    const userName = mode === 'register' ? name : email.split('@')[0];
    onSuccess({ name: userName || 'User', email: email || 'user@example.com' });
  };

  return (
    <div className={styles.authModalOverlay} onClick={onClose}>
      <div className={styles.authModal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.authCloseButton} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left Side - Image & Text */}
        <div className={styles.authLeftSide}>
          <div className={styles.authImageWrapper}>
            <Image
              src="/images/hero-modern-room.jpg"
              alt="Beautiful interior"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className={styles.authImageOverlay}>
              <div className={styles.authBrandLogo}>FURNISHES</div>
              <h2 className={styles.authImageTitle}>
                {mode === 'login' ? 'Welcome Back!' : 'Join Our Community'}
              </h2>
              <p className={styles.authImageText}>
                {mode === 'login' 
                  ? 'Sign in to access your personalized dashboard, saved designs, and exclusive member benefits.'
                  : 'Create an account to save your favorite designs, get personalized recommendations, and unlock exclusive deals.'}
              </p>
              <div className={styles.authFeatures}>
                <div className={styles.authFeature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Personalized Recommendations</span>
                </div>
                <div className={styles.authFeature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Save Favorite Designs</span>
                </div>
                <div className={styles.authFeature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Exclusive Member Deals</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.authRightSide}>
          <div className={styles.authFormContainer}>
            <h2 className={styles.authFormTitle}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className={styles.authFormSubtitle}>
              {mode === 'login' 
                ? 'Enter your credentials to continue'
                : 'Fill in your details to get started'}
            </p>

            <form onSubmit={handleSubmit} className={styles.authForm}>
              {mode === 'register' && (
                <div className={styles.authInputGroup}>
                  <label className={styles.authLabel}>Full Name</label>
                  <input
                    type="text"
                    className={styles.authInput}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className={styles.authInputGroup}>
                <label className={styles.authLabel}>Email Address</label>
                <input
                  type="email"
                  className={styles.authInput}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.authInputGroup}>
                <label className={styles.authLabel}>Password</label>
                <input
                  type="password"
                  className={styles.authInput}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {mode === 'register' && (
                <div className={styles.authInputGroup}>
                  <label className={styles.authLabel}>Confirm Password</label>
                  <input
                    type="password"
                    className={styles.authInput}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className={styles.authForgotPassword}>
                  <button type="button" className={styles.authForgotLink}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className={styles.authSubmitButton}>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className={styles.authDivider}>
              <span>or</span>
            </div>

            <button type="button" className={styles.authSocialButton}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className={styles.authSwitchMode}>
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={onSwitchMode} className={styles.authSwitchLink}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
