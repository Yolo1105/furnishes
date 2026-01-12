'use client';

import React, { useState } from 'react';
import styles from './AboutUsSection.module.css';

const AboutUsSection = () => {
  const [currentPage, setCurrentPage] = useState(3);

  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9v12h18V9M3 9l9-6 9 6M3 9h18"/>
          <path d="M9 21V9M15 21V9"/>
        </svg>
      ),
      title: 'Thoughtful Design',
      description: "Clever, comfy furniture that you're proud to show off but not precious about using everyday."
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
      ),
      title: 'Everyday Value',
      description: "Our direct-to-consumer model cuts out the middlemen, hidden costs and showroom expenses that charge you extra."
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 3h15v13H1z"/>
          <path d="M16 8h4l3 3v5h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      title: 'Effortless Experiences',
      description: "Fast and flexible delivery, tool-free assembly and a 120 night risk-free trial."
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <path d="M12 6v4M10 10h4"/>
          <path d="M14 16c-1-1-2-1-2-1s-1 0-2 1"/>
        </svg>
      ),
      title: 'Designed With The World In Mind',
      description: "Ethically made and designed to last. Every purchase helps save koalas and protect endangered Australian species and habitats."
    }
  ];

  const handlePrev = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : 5));
  };

  const handleNext = () => {
    setCurrentPage(prev => (prev < 5 ? prev + 1 : 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Pagination - Above the peach section */}
      <div className={styles.paginationWrapper}>
        <div className={styles.pagination}>
          <button className={styles.paginationButton} onClick={handlePrev} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className={styles.paginationNumbers}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`${styles.paginationNumber} ${currentPage === num ? styles.active : ''}`}
                onClick={() => handlePageClick(num)}
                aria-label={`Page ${num}`}
              >
                {num}
              </button>
            ))}
          </div>
          <button className={styles.paginationButton} onClick={handleNext} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Peach Background Section */}
      <section className={styles.aboutUsSection}>
        <div className={styles.container}>
          {/* Heading */}
          <h2 className={styles.heading}>A Little About Us</h2>

        {/* Introductory Text */}
        <p className={styles.introText}>
          Taking cues from mid-century designs at Soho House 40 Greek Street, our Theodore chair remains a House favorite.
        </p>

        {/* Feature Cards */}
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      </section>
    </>
  );
};

export default AboutUsSection;
