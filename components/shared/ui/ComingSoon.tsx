'use client';

import React from 'react';
import PageHero from '@/components/shared/ui/PageHero';
import styles from './ComingSoon.module.css';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className={styles.wrapper}>
      <PageHero
        imageSrc="/images/hero-modern-room.jpg"
        imageAlt=""
        titleLines={[title]}
        description={description ?? "We're working on this. Check back soon."}
      />
      <section className={styles.content}>
        <p className={styles.message}>Coming soon.</p>
      </section>
    </div>
  );
}
