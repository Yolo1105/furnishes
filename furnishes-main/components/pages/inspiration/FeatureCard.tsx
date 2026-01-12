'use client';

import React from 'react';
import Link from 'next/link';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function FeatureCard({
  id,
  number,
  title,
  subtitle,
  description,
  image,
  href,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={styles.card}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Background Image */}
      <div
        className={styles.imageContainer}
        style={{
          backgroundImage: `url(${image})`,
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        {/* Top Row */}
        <div className={styles.topRow}>
          <span
            className={styles.subtitle}
            style={{
              color: isHovered ? 'var(--accent-primary)' : 'var(--gray-600)',
            }}
          >
            {subtitle}
          </span>
          <span
            className={styles.number}
            style={{
              color: isHovered ? 'var(--accent-primary)' : 'rgba(229, 94, 0, 0.25)',
            }}
          >
            {number}
          </span>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          {/* Arrow indicator */}
          <div
            className={styles.exploreIndicator}
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
            }}
          >
            <span className={styles.exploreText}>Explore</span>
            <svg
              className={styles.arrow}
              fill="none"
              viewBox="0 0 24 24"
              stroke="var(--accent-primary)"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
