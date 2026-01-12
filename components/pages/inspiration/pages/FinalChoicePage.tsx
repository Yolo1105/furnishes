'use client';

import React from 'react';
import Image from 'next/image';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import { finalRoomOptions } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function FinalChoicePage() {
  const { state, setAnswer } = useStyleDiscovery();
  const selected = (state.answers['page-11'] as string) || null;

  const handleSelect = (id: string) => {
    setAnswer('page-11', id);
  };

  const selectedOption = finalRoomOptions.find((opt) => opt.id === selected) || finalRoomOptions[0];

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>Last question. Imagine someone just walked up and handed you the keys to one of these rooms - &quot;here you go, this is yours now, move in whenever you want.&quot;</h2>
        <p className={styles.instruction}>
          Which one would you be most excited about? Which one feels like it could actually be your space, where you&apos;d feel comfortable and happy?
        </p>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.finalChoiceContainer}>
          <div className={styles.mainImage}>
            <Image
              src={selectedOption.image}
              alt={selectedOption.name}
              fill
              className={styles.image}
              sizes="60vw"
            />
          </div>
          <div className={styles.thumbnails}>
            {finalRoomOptions.map((option) => (
              <div
                key={option.id}
                className={`${styles.thumbnail} ${selected === option.id ? styles.selected : ''}`}
                onClick={() => handleSelect(option.id)}
              >
                <Image
                  src={option.image}
                  alt={option.name}
                  fill
                  className={styles.thumbnailImage}
                  sizes="64px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
