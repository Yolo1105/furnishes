'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './CircleLoader.module.css';

interface CircleLoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  clickable?: boolean;
  href?: string;
}

const CircleLoader: React.FC<CircleLoaderProps> = ({
  size = 'medium',
  className = '',
  clickable = false,
  href = '/inspiration'
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (clickable) {
      router.push(href);
    }
  };

  return (
    <div
      className={`${styles.loader6} ${styles[size]} ${clickable ? styles.clickable : ''} ${className}`}
      onClick={handleClick}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      <span></span>
    </div>
  );
};

export default CircleLoader;
