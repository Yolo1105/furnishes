'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './TeamSection.module.css';

const teamMembers = [
  {
    name: "Junxi",
    title: "CEO",
    image: "/images/junxi.jpeg",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
      pinterest: "#"
    }
  },
  {
    name: "Tingxiao",
    title: "COO",
    image: "/images/tingxiao.jpeg",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
      pinterest: "#"
    }
  },
  {
    name: "Mohan",
    title: "CTO",
    image: "/images/mohan.jpeg",
    socialLinks: {
      twitter: "#",
      linkedin: "#",
      pinterest: "#"
    }
  }
];

export default function TeamSection() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <div className={styles.teamSection} ref={ref}>
      <div className={styles.container}>
        {/* Orange Button */}
        <div className={`${styles.orangeButton} ${isVisible ? styles.animateIn : ''}`}>
          OUR TEAM
        </div>

        {/* Text Section - Top */}
        <div className={styles.textSection}>
          {/* Left Side - Large Heading */}
          <div className={styles.leftText}>
            <h2 className={`${styles.mainHeading} ${isVisible ? styles.animateIn : ''}`}>
              Behind every piece is a human hand — a team united by craft and attention to what truly matters.
            </h2>
          </div>
          
          {/* Right Side - Description */}
          <div className={styles.rightText}>
            <p className={`${styles.descriptionText} ${isVisible ? styles.animateIn : ''}`}>
              We are a studio of designers, artisans, and quiet thinkers — each dedicated to building objects that feel as good as they look. Ours is not a large team by size, but one held together by shared values: patience, precision, and emotional clarity.
            </p>
          </div>
        </div>
          
        {/* Team Members Grid */}
        <div className={`${styles.teamGrid} ${isVisible ? styles.animateIn : ''}`}>
          {teamMembers.map((member, index) => (
            <div key={index} className={`${styles.teamCard} ${isVisible ? styles.animateIn : ''}`} style={{ transitionDelay: `${0.4 + index * 0.2}s` }}>
              <div className={styles.memberImage}>
                <Image
                  src={member.image}
                  alt={member.name}
                  width={280}
                  height={350}
                  className={styles.image}
                />
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberTitle}>{member.title}</p>
              
              {/* Social Links */}
              <div className={styles.socialLinks}>
                <a href={member.socialLinks.twitter} className={styles.socialLink} aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a href={member.socialLinks.linkedin} className={styles.socialLink} aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a href={member.socialLinks.pinterest} className={styles.socialLink} aria-label="Pinterest">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
