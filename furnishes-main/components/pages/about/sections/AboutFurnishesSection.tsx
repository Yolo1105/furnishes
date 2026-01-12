'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './AboutFurnishesSection.module.css';

export default function AboutFurnishesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [modularCount, setModularCount] = useState(100);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const animationTimer = setInterval(() => {
        step++;
        const progress = step / steps;
        // Animate modular combinations from 100 to 200
        setModularCount(Math.floor(100 + progress * 100));
        // Animate testimonials from 0 to 120
        setTestimonialsCount(Math.floor(progress * 120));
        
        if (step >= steps) clearInterval(animationTimer);
      }, interval);

      return () => {
        clearInterval(animationTimer);
      };
    }
  }, [isVisible]);

  return (
    <section className={styles.aboutFurnishesSection} ref={ref} aria-labelledby="about-title">
      <div className={styles.container}>
        {/* Orange Button */}
        <div className={`${styles.orangeButton} ${isVisible ? styles.animateIn : ''}`}>
          ABOUT FURNISHES
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Left Side */}
          <div className={styles.leftSide}>
            <h2 id="about-title" className={`${styles.title} ${isVisible ? styles.animateIn : ''}`}>
              Crafting Aesthetic Harmony and Wellness: The Expertise of Interior Designers 
              in Enhancing Spaces for a Pleasurable Environment
            </h2>
          </div>

          {/* Right Side */}
          <div className={styles.rightSide}>
            <p className={`${styles.description} ${isVisible ? styles.animateIn : ''}`}>
              Furnishes is a Singapore-based platform that seamlessly blends technology with interior design. 
              We empower you to create personalized furniture solutions through AI-generated layouts and 
              real-time 3D visualizations. Simply upload your room, choose your aesthetic, and watch our 
              system bring your vision to life.
            </p>
            
            {/* Statistics - Now positioned below the paragraph */}
            <div className={`${styles.statistics} ${isVisible ? styles.animateIn : ''}`}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{modularCount}+</div>
                <div className={styles.statLabel}>Modular Combinations</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{testimonialsCount}+</div>
                <div className={styles.statLabel}>Total Testimonials</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
