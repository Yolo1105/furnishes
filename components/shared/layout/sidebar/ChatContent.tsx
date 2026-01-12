'use client';

import React, { useState } from 'react';
import styles from '../RightSidebar.module.css';

const ChatContent: React.FC = () => {
  const [message, setMessage] = useState('');

  return (
    <div className={styles.chatContent}>
      <div className={styles.chatMessages}>
        <h2 className={styles.chatGreeting}>Good morning!</h2>
        
        <p className={styles.chatDescription}>
          First step is complete. Control Center Configured! This will be the central hub for managing your Workflows...
        </p>
        
        <p className={styles.chatStatus}>Working on Workflows...</p>
        
        <div className={styles.workflowItem}>
          <div className={styles.workflowDot} />
          <div className={styles.workflowText}>
            Management shift report that goes on the second line
          </div>
          <button className={styles.bookmarkButton} aria-label="Bookmark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        <div className={styles.feedbackRow}>
          <span className={styles.feedbackText}>This looks good</span>
          <div className={styles.feedbackBadge}>U</div>
        </div>
      </div>

      <div className={styles.chatInputArea}>
        <div className={styles.chatInputWrapper}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder="Ask Eva"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className={styles.sendButton} aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className={styles.chatDisclaimer}>
          The agents can sometimes make mistakes.<br />
          Double-check responses.
        </p>
      </div>
    </div>
  );
};

export default ChatContent;
