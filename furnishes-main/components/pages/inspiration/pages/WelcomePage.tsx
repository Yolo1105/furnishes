'use client';

import React from 'react';
import Image from 'next/image';
import styles from './WelcomePage.module.css';

export default function WelcomePage() {
  return (
    <div className={styles.welcomePage}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>
          Discover your<br />space personality
        </h1>
        <p className={styles.subtitle}>
          A 3-minute journey to understand how your home can support you better.
        </p>
        <ul className={styles.features}>
          <li>12 questions</li>
          <li>No right or wrong</li>
          <li>Trust your instincts</li>
        </ul>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/landing_banner.jpg"
            alt="Welcome image"
            fill
            className={styles.image}
            sizes="60vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
