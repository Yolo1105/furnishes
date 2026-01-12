'use client';

import React from 'react';
import styles from './ChatSidebar.module.css';

// Types
export interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive: boolean;
}

interface ChatSidebarProps {
  chatHistory: ChatHistoryItem[];
  currentChatId: string | null;
  onStartNewChat: () => void;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  formatDate: (date: Date) => string;
  getChatDescription: (chat: ChatHistoryItem) => string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatHistory = [],
  currentChatId,
  onStartNewChat,
  onChatSelect,
  onDeleteChat,
  formatDate,
  getChatDescription,
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Chat History</h2>
        <button 
          onClick={onStartNewChat}
          className={styles.newChatButton}
        >
          + New Chat
        </button>
      </div>
      
      <div className={styles.content}>
        {!chatHistory || chatHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className={styles.emptyTitle}>No conversations yet</div>
            <div className={styles.emptySubtitle}>Start your first design project</div>
          </div>
        ) : (
          <ul className={styles.chatList}>
            {chatHistory.map((chat) => (
              <li key={chat.id} className={styles.chatItem}>
                <div 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (chat.id !== currentChatId) {
                      onChatSelect(chat.id);
                    }
                  }}
                  className={`${styles.chatCard} ${chat.isActive ? styles.active : ''}`}
                >
                  <div className={styles.chatContent}>
                    <svg className={styles.chatIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <div className={styles.chatInfo}>
                      <div className={styles.chatTitle}>{chat.title}</div>
                      <div className={styles.chatDescription}>
                        {getChatDescription(chat)}
                      </div>
                      <div className={styles.chatDate}>
                        {formatDate(chat.timestamp)}
                      </div>
                    </div>
                  </div>
                  <button 
                    className={styles.deleteButton}
                    onClick={(e) => onDeleteChat(chat.id, e)}
                    aria-label="Delete chat"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
