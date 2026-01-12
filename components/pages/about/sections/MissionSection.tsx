'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './MissionSection.module.css';

const roomStyles = [
  {
    title: "Modern Living Room",
    description: "Clean lines, neutral tones, and functional furniture create a sophisticated yet comfortable living space that adapts to modern lifestyles.",
    image: "/images/hero-modern-living-room.jpg"
  },
  {
    title: "Contemporary Bedroom",
    description: "Minimalist design with premium materials and smart storage solutions for a peaceful retreat.",
    image: "/images/hero-modern-room.jpg"
  },
  {
    title: "Urban Kitchen",
    description: "Efficient layouts with modern appliances and sustainable materials for the heart of your home.",
    image: "/images/hero-yellow-sofa.jpg"
  }
];

export default function MissionSection() {
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

  const currentItem = roomStyles[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % roomStyles.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + roomStyles.length) % roomStyles.length);
  };

  return (
    <div className={styles.missionSection} ref={ref}>
      <div className={styles.container}>
        {/* Orange Button */}
        <div className={`${styles.orangeButton} ${isVisible ? styles.animateIn : ''}`}>
          OUR MISSION
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Left Side - Text Content */}
          <div className={styles.leftSide}>
            <h2 className={`${styles.title} ${isVisible ? styles.animateIn : ''}`}>
              We have worked on various interior design styles 
            </h2>
            <p className={`${styles.description} ${isVisible ? styles.animateIn : ''}`}>
              We empower modern homeowners to effortlessly create personalized living environments 
              using AI design tools, immersive 3D planning, and seamless logistics—from initial 
              concept to final installation.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className={styles.rightSide}>
            <div className={styles.imageContainer}>
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                width={500}
                height={400}
                className={styles.mainImage}
              />
            </div>
          </div>
        </div>

        {/* Orange Container and Image - Below the main content */}
        <div className={styles.bottomSection}>
          {/* Orange Container */}
          <div className={`${styles.featureBox} ${isVisible ? styles.animateIn : ''}`}>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{currentItem.title}</h3>
              <p className={styles.featureDescription}>{currentItem.description}</p>
              
              {/* Navigation Arrows */}
              <div className={styles.navigation}>
                <button 
                  className={styles.navButton} 
                  onClick={prev}
                  aria-label="Previous room style"
                >
                  ‹
                </button>
                <button 
                  className={styles.navButton} 
                  onClick={next}
                  aria-label="Next room style"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* About-4 Image */}
          <div className={`${styles.aboutImageContainer} ${isVisible ? styles.animateIn : ''}`}>
            <Image
              src="/images/about-4.jpg"
              alt="About Furnishes"
              width={500}
              height={375}
              className={styles.aboutImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
