'use client';

import React from 'react';
import styles from './ContactModal.module.css';

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.contactModalOverlay} onClick={onClose}>
      <div className={styles.contactModal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.contactCloseButton} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className={styles.contactContent}>
          <h2 className={styles.contactTitle}>Get in Touch</h2>
          <p className={styles.contactDescription}>
            Have questions about our furniture or design services? We&apos;d love to hear from you.
          </p>

          <div className={styles.contactInfo}>
            {/* Email */}
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className={styles.contactDetails}>
                <h3 className={styles.contactLabel}>Email</h3>
                <a href="mailto:hello@furnish.es" className={styles.contactLink}>
                  hello@furnish.es
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className={styles.contactDetails}>
                <h3 className={styles.contactLabel}>Phone</h3>
                <a href="tel:+6561234567" className={styles.contactLink}>
                  +65 6123 4567
                </a>
              </div>
            </div>

            {/* Address */}
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className={styles.contactDetails}>
                <h3 className={styles.contactLabel}>Address</h3>
                <p className={styles.contactText}>
                  123 Design Street, #05-01<br />
                  Singapore 018956
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
