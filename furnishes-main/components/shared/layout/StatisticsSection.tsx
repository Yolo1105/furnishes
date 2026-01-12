'use client';

import React from 'react';
import styles from './StatisticsSection.module.css';

const statistics = [
  { count: '25+', label: 'Items', category: 'Living Room' },
  { count: '10+', label: 'Items', category: 'Outdoor Furniture' },
  { count: '15+', label: 'Items', category: 'Dining Room' },
  { count: '18+', label: 'Items', category: 'Bedroom Furniture' },
  { count: '12+', label: 'Items', category: 'Office Furniture' },
];

const StatisticsSection: React.FC = () => {
  return (
    <section className={styles.statisticsSection}>
      <div className={styles.statisticsContainer}>
        {statistics.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.statCount}>
              <span className={styles.countNumber}>{stat.count}</span>
              <span className={styles.countLabel}>{stat.label}</span>
            </div>
            <div className={styles.statCategory}>{stat.category}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsSection;
