'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  return (
    <section className={styles.heroSection} ref={ref} aria-labelledby="hero-title">
      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.content}>
          {/* Left Content */}
          <div className={styles.leftContent}>
            <h1 id="hero-title" className={`${styles.title} ${isVisible ? styles.animateIn : ''}`}>
              Design Your Dream Space With <span className={styles.highlight}>AI Assistant</span>
            </h1>
            <p className={`${styles.description} ${isVisible ? styles.animateIn : ''}`}>
              Furnishes redefines interior design with real-time customization, AR/3D visualization, 
              and intelligent design tools tailored specifically for your lifestyle.
            </p>
          </div>

          {/* Right Images */}
          <div className={styles.rightImages}>
            <div className={`${styles.imageContainer} ${styles.topLeft} ${isVisible ? styles.animateIn : ''}`}>
              <Image
                src="/images/about-1.jpg"
                alt="About Us 1"
                width={300}
                height={200}
                className={styles.image}
                priority
              />
            </div>
            <div className={`${styles.imageContainer} ${styles.topRight} ${isVisible ? styles.animateIn : ''}`}>
              <Image
                src="/images/about-2.jpg"
                alt="About Us 2"
                width={300}
                height={200}
                className={styles.image}
              />
            </div>
            <div className={`${styles.imageContainer} ${styles.bottom} ${isVisible ? styles.animateIn : ''}`}>
              <Image
                src="/images/about-3.jpg"
                alt="About Us 3"
                width={300}
                height={200}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
