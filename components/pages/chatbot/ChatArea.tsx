'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { MdPerson, MdSmartToy, MdContentCopy, MdCheck } from 'react-icons/md';
import type { Message } from '@/types/chat';
import styles from './ChatArea.module.css';
import { renderMarkdown } from '@/utils/renderMarkdown';
import { PreferenceBubble } from './PreferenceBubble';
import { SourceHighlightedMessage } from './SourceHighlightedMessage';
import { TaskCard } from './TaskCard';
import { FeedbackRow } from './FeedbackRow';
import type { PreferenceExtraction, PreferenceRemoval, SourceHighlight } from '@/types/preferences';
import type { MessageType, TaskCard as TaskCardType, FeedbackMessage } from '@/types/chat';

const TIMEOUTS = { COPY_FEEDBACK: 2000 } as const;

export interface ChatAreaMessage extends Omit<Message, 'content'> {
  type?: MessageType;
  content?: string;
  taskCard?: TaskCardType;
  feedback?: FeedbackMessage;
  preferenceExtractions?: PreferenceExtraction[];
  preferenceRemovals?: PreferenceRemoval[];
  sourceHighlights?: SourceHighlight[];
}

export interface ChatAreaProps {
  messages: ChatAreaMessage[];
  formatTime: (date: Date) => string;
  onScrollToBottom: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  formatTime: formatTimeProp,
  onScrollToBottom,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopyMessage = useCallback(async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), TIMEOUTS.COPY_FEEDBACK);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
    onScrollToBottom();
  }, [onScrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages, scrollToBottom]);

  if (messages.length === 0) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.welcomeContainer}>
          <div className={styles.welcomeIcon}></div>
          <h2 className={styles.welcomeTitle}>Welcome to Interior Design Assistant</h2>
          <div className={styles.welcomeDescription}>
            Start a new conversation and I&apos;ll guide you through your design journey! 
            I&apos;ll ask the right questions and automatically track your preferences to provide personalized recommendations.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.chatContainer}>
        <div 
          ref={chatContainerRef}
          className={styles.messagesContainer}
        >
          {messages.map((message) => {
            const messageType = message.type || 'text';
            
            // Render greeting message
            if (messageType === 'greeting') {
              return (
                <div key={message.id} className={styles.greetingWrapper}>
                  <div className={styles.avatar}>
                    <MdSmartToy />
                  </div>
                  <h2 className={styles.greetingMessage}>{message.content || 'Good morning!'}</h2>
                </div>
              );
            }
            
            // Render status message
            if (messageType === 'status') {
              return (
                <div key={message.id} className={styles.statusWrapper}>
                  <div className={styles.avatar}>
                    <MdSmartToy />
                  </div>
                  <p className={styles.statusMessage}>{message.content || ''}</p>
                </div>
              );
            }
            
            // Render task card
            if (messageType === 'taskCard' && message.taskCard) {
              return (
                <div key={message.id} className={styles.taskCardWrapper}>
                  <div className={styles.avatar}>
                    <MdSmartToy />
                  </div>
                  <TaskCard
                    id={message.taskCard.id}
                    text={message.taskCard.text}
                    isBookmarked={message.taskCard.isBookmarked}
                  />
                </div>
              );
            }
            
            // Render feedback row
            if (messageType === 'feedback' && message.feedback) {
              return (
                <div key={message.id} className={styles.feedbackWrapper}>
                  <FeedbackRow
                    text={message.feedback.text}
                    badge={message.feedback.badge}
                  />
                </div>
              );
            }
            
            // Render regular text messages
            return (
              <React.Fragment key={message.id}>
                <div 
                  className={`${styles.messageWrapper} ${message.sender === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper}`}
                  data-message-id={message.id}
                >
                  {message.sender === 'assistant' && (
                    <div className={styles.avatar}>
                      <MdSmartToy />
                    </div>
                  )}
                  <div className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.assistantMessage} ${message.isEssential ? styles.essentialMessage : ''}`}>
                    {message.sender === 'user' && message.sourceHighlights && message.sourceHighlights.length > 0 ? (
                      <div className={styles.messageContent}>
                        <SourceHighlightedMessage
                          message={message.content || ''}
                          highlights={message.sourceHighlights}
                        />
                      </div>
                    ) : (
                      <div 
                        className={styles.messageContent}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content || '') }}
                      />
                    )}
                    <div className={styles.messageFooter}>
                      <div className={styles.messageTime}>
                        {formatTimeProp(message.timestamp)}
                      </div>
                      <button
                        className={styles.copyButton}
                        onClick={() => handleCopyMessage(message.id, message.content || '')}
                        aria-label="Copy message"
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <MdCheck className={styles.copyIcon} />
                        ) : (
                          <MdContentCopy className={styles.copyIcon} />
                        )}
                      </button>
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className={styles.avatar}>
                      <MdPerson />
                    </div>
                  )}
                </div>
                {message.sender === 'assistant' && (message.preferenceExtractions?.length || message.preferenceRemovals?.length) && (
                  <div className={styles.preferenceBubbles}>
                    {message.preferenceExtractions?.map((extraction, idx) => (
                      <PreferenceBubble
                        key={`extraction-${message.id}-${idx}`}
                        extraction={extraction}
                      />
                    ))}
                    {message.preferenceRemovals?.map((removal, idx) => (
                      <PreferenceBubble
                        key={`removal-${message.id}-${idx}`}
                        removal={removal}
                      />
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </main>
  );
};
