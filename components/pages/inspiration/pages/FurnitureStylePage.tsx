'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import RatingButtons from '../components/RatingButtons';
import { sliderOptions } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function FurnitureStylePage() {
  const { state, setAnswer } = useStyleDiscovery();
  const ratingValues = (state.answers['page-7'] as Record<string, number>) || {};

  const handleRatingChange = (id: string, value: number) => {
    const newValues = {
      ...ratingValues,
      [id]: value,
    };
    setAnswer('page-7', newValues);
  };

  // Initialize default values on mount only
  React.useEffect(() => {
    if (Object.keys(ratingValues).length === 0) {
      const defaults: Record<string, number> = {};
      sliderOptions.forEach((option) => {
        defaults[option.id] = 5; // Default to middle of 1-10 scale
      });
      setAnswer('page-7', defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: set defaults once on mount
  }, []);

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>When it comes to furniture, some people want everything minimal and clean, while others love pieces that make a statement. How do you like your furniture to look and feel?</h2>
        <p className={styles.instruction}>For each category, rate your preference from 1 to 10 - where 1 leans toward the left description and 10 leans toward the right description.</p>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.slidersContainer}>
          {sliderOptions.map((option) => (
            <RatingButtons
              key={option.id}
              id={option.id}
              label={option.label}
              leftLabel={option.leftLabel}
              rightLabel={option.rightLabel}
              value={ratingValues[option.id] || 5}
              onChange={(value) => handleRatingChange(option.id, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
