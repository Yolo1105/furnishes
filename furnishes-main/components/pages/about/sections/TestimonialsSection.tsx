'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './TestimonialsSection.module.css';

const testimonials = [
  {
    id: 1,
    quote: "Furnishes transformed my first home setup. The AR preview was absolutely magical - I could see exactly how everything would look before buying.",
    author: "Chloe L.",
    role: "First-Time Homeowner"
  },
  {
    id: 2,
    quote: "The AI design suggestions were spot-on for my minimalist style. The entire process was seamless from concept to delivery.",
    author: "Marcus T.",
    role: "Interior Designer"
  },
  {
    id: 3,
    quote: "Incredible customer service and the 3D visualization helped me make confident decisions about my living room layout.",
    author: "Sarah K.",
    role: "Tech Professional"
  }
];

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

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

  const currentItem = testimonials[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.testimonialsSection} ref={ref}>
      <div className={styles.container}>
        {/* Orange Button */}
        <div className={`${styles.orangeButton} ${isVisible ? styles.animateIn : ''}`}>
          TESTIMONIALS
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Left Side */}
          <div className={styles.leftSide}>
            <h2 className={`${styles.title} ${isVisible ? styles.animateIn : ''}`}>
              Discover what clients are saying about us
            </h2>
            
            {/* Navigation Arrows */}
            <div className={`${styles.navigation} ${isVisible ? styles.animateIn : ''}`}>
              <button 
                className={styles.navButton} 
                onClick={prev}
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <button 
                className={styles.navButton} 
                onClick={next}
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          </div>

          {/* Right Side - Testimonial Card */}
          <div className={styles.rightSide}>
            <div className={`${styles.testimonialCard} ${isVisible ? styles.animateIn : ''}`}>
              <p className={styles.quote}>{currentItem.quote}</p>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <div className={styles.avatarPlaceholder}>
                    {currentItem.author.charAt(0)}
                  </div>
                </div>
                <div className={styles.authorDetails}>
                  <div className={styles.authorName}>{currentItem.author}</div>
                  <div className={styles.authorRole}>{currentItem.role}</div>
                </div>
              </div>
            </div>
            
            {/* Pagination Dots */}
            <div className={styles.pagination}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => goTo(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
