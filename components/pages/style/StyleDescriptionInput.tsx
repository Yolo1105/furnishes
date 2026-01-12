'use client';

import React from 'react';
import styles from './StyleDescriptionInput.module.css';

interface StyleDescriptionInputProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export default function StyleDescriptionInput({
  description,
  onDescriptionChange
}: StyleDescriptionInputProps) {
  return (
    <div className={styles.descriptionInput}>
      <label className={styles.label}>I&apos;ll describe it in my own words</label>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="loft-y but warm, cafe-like lounge"
        className={styles.textarea}
        rows={4}
      />
    </div>
  );
}
