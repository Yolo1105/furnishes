'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MdLightbulbOutline, MdArrowUpward } from 'react-icons/md';
import { MESSAGE } from '@/constants/business';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  chatInput: string;
  setChatInput: (input: string) => void;
  onSendMessage: (message: string) => void;
  isSending: boolean;
  isTyping?: boolean;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  chatInput,
  setChatInput,
  onSendMessage,
  isSending,
  isTyping = false,
  suggestions,
  onSuggestionClick,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [validationError, setValidationError] = useState<string>('');

  const handleSend = () => {
    if (chatInput.trim() && !isSending && !isTyping) {
      // Basic validation
      if (chatInput.trim().length > 500) {
        setValidationError('Message is too long (max 500 characters)');
        return;
      }
      setValidationError('');
      onSendMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending && !isTyping && chatInput.trim()) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setChatInput('');
      inputRef.current?.blur();
      setValidationError('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isSending && !isTyping) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.suggestionsHeader}>
        <MdLightbulbOutline className={styles.suggestionIcon} />
        <span className={styles.suggestionTitle}>Quick suggestions</span>
        <span className={styles.suggestionSubtitle}>for your project:</span>
      </div>
      
      <div className={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <button 
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className={styles.suggestionButton}
            disabled={isSending || isTyping}
          >
            {suggestion}
          </button>
        ))}
      </div>
      
      <div className={styles.inputContainer}>
        <textarea
          ref={inputRef}
          value={chatInput}
          onChange={(e) => {
            setChatInput(e.target.value);
            setValidationError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask Eva"
          aria-label="Chat input"
          className={styles.input}
          maxLength={MESSAGE.MAX_LENGTH}
          rows={1}
          disabled={isSending || isTyping}
        />
        <button 
          onClick={handleSend}
          disabled={isSending || isTyping || !chatInput.trim()}
          className={`${styles.sendButton} ${isSending || isTyping || !chatInput.trim() ? styles.disabled : ''}`}
          aria-label="Send message"
        >
          <MdArrowUpward size={20} />
        </button>
      </div>
      
      {validationError && (
        <div className={styles.validationError}>
          {validationError}
        </div>
      )}
      
      <p className={styles.disclaimer}>
        The agents can sometimes make mistakes.<br />
        Double-check responses.
      </p>
    </div>
  );
};
