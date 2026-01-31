'use client';

import React, { useState, useEffect, useRef } from 'react';
import FeatureCard from './FeatureCard';
import styles from './InspirationHub.module.css';

interface Feature {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  category: 'discover' | 'plan' | 'create';
}

const features: Feature[] = [
  {
    id: 'style',
    number: '01',
    title: 'Style Explorer',
    subtitle: 'Find Your Aesthetic',
    description: 'Curated looks that resonate with who you are',
    image: '/images/h-modern-living-room.jpg',
    href: '/style',
    category: 'discover',
  },
  {
    id: 'budget',
    number: '02',
    title: 'Budget Planner',
    subtitle: 'Smart Investments',
    description: 'Plan thoughtfully, spend wisely on what matters',
    image: '/images/h-modern-room.jpg',
    href: '/budget',
    category: 'plan',
  },
  {
    id: 'planner',
    number: '03',
    title: 'Room Planner',
    subtitle: 'Visualize & Create',
    description: 'See your vision come to life in immersive 3D',
    image: '/images/hero-modern-room.jpg',
    href: '/room-planner',
    category: 'create',
  },
  {
    id: 'ai',
    number: '04',
    title: 'AI Assistant',
    subtitle: 'Personal Guide',
    description: 'Science-backed recommendations tailored to your life',
    image: '/images/landing-banner.jpg',
    href: '/chatbot',
    category: 'discover',
  },
  {
    id: 'quiz',
    number: '05',
    title: 'Design Quiz',
    subtitle: 'Start Here',
    description: 'Discover your unique space personality in 3 minutes',
    image: '/images/hero-yellow-sofa.jpg',
    href: '/quiz',
    category: 'discover',
  },
];

const filters = [
  { id: 'all', label: 'All Tools' },
  { id: 'discover', label: 'Discover' },
  { id: 'plan', label: 'Plan' },
  { id: 'create', label: 'Create' },
];

export default function InspirationHub() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'discover' | 'plan' | 'create'>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const filteredFeatures =
    activeFilter === 'all'
      ? features
      : features.filter((f) => f.category === activeFilter);

  const getColSpan = (index: number, total: number): number => {
    if (total === 1) return 6;
    if (total === 2) return 3;
    if (total === 3) return 2;
    if (total === 4) return 3;
    if (total === 5) {
      return index < 3 ? 2 : 3;
    }
    return 2;
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Ambient glow */}
      <div
        className={styles.ambientGlow}
        style={{
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      {/* Main Content */}
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.titleSection}>
              <h1
                className={`${styles.title} ${loaded ? styles.loaded : ''}`}
              >
                Design <span className={styles.titleItalic}>your</span> space
              </h1>

              <p
                className={`${styles.subtitle} ${loaded ? styles.loaded : ''}`}
              >
                Five pathways to create a home that truly supports your
                wellbeing
              </p>
            </div>

            {/* Filter Tabs */}
            <div
              className={`${styles.filters} ${loaded ? styles.loaded : ''}`}
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() =>
                    setActiveFilter(
                      filter.id as 'all' | 'discover' | 'plan' | 'create'
                    )
                  }
                  className={`${styles.filterButton} ${
                    activeFilter === filter.id ? styles.active : ''
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Cards Grid */}
        <section className={styles.gridSection}>
          <div className={styles.gridContainer}>
            <div className={styles.grid}>
              {filteredFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className={styles.gridItem}
                  style={{
                    gridColumn: `span ${getColSpan(index, filteredFeatures.length)}`,
                    transitionDelay: `${index * 50}ms`,
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                  }}
                >
                  <FeatureCard
                    {...feature}
                    isHovered={hoveredCard === feature.id}
                    onMouseEnter={() => setHoveredCard(feature.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`${styles.footer} ${loaded ? styles.loaded : ''}`}
        >
          <div className={styles.footerInner}>
            <p className={styles.footerQuote}>
              "Your home deserves to be taken seriously."
            </p>

            <div className={styles.footerStats}>
              <div className={styles.colorDots}>
                <div
                  className={styles.dot}
                  style={{ backgroundColor: 'var(--accent-secondary)' }}
                />
                <div
                  className={styles.dot}
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                />
                <div
                  className={styles.dot}
                  style={{ backgroundColor: '#FFCBA4' }}
                />
              </div>
              <div className={styles.statsText}>
                <span className={styles.statsNumber}>2,400+ </span>
                <span className={styles.statsLabel}>spaces transformed</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
