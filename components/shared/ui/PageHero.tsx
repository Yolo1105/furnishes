import React from 'react';
import Image from 'next/image';
import styles from './PageHero.module.css';

interface PageHeroProps {
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  titleLines?: string[]; // Array of lines for the big text (e.g., ["Curated", "Furniture", "Collections"])
  titleHighlight?: string; // Optional word to emphasize (used with title; display uses title)
  description?: string;
}

// Helper function to choose a character for highlighting that doesn't affect readability
// Prefers vowels in the middle or end of the word, avoids first letter
const chooseHighlightChar = (word: string): number => {
  if (word.length === 0) return 0;
  if (word.length === 1) return 0;
  
  const vowels = 'aeiouAEIOU';
  
  // For short words (2-3 chars), use the last character
  if (word.length <= 3) {
    return word.length - 1;
  }
  
  // For longer words, prefer a vowel in the middle or end (but not first)
  // Check from middle to end
  const startCheck = Math.floor(word.length / 2);
  for (let i = startCheck; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      return i;
    }
  }
  
  // If no vowel found in middle/end, check from start+1 to middle
  for (let i = 1; i < startCheck; i++) {
    if (vowels.includes(word[i])) {
      return i;
    }
  }
  
  // Fallback: use a character in the middle (not first or last)
  return Math.max(1, Math.floor(word.length / 2));
};

// Helper function to add orange accent to one character per word (chosen to not affect readability)
const addOrangeAccents = (text: string): React.ReactNode => {
  const words = text.split(' ');
  return words.map((word, wordIndex) => {
    if (word.length === 0) return ' ';
    
    const highlightIndex = chooseHighlightChar(word);
    const before = word.slice(0, highlightIndex);
    const highlightChar = word[highlightIndex];
    const after = word.slice(highlightIndex + 1);
    
    return (
      <React.Fragment key={wordIndex}>
        {wordIndex > 0 && ' '}
        {before}
        <span style={{ color: '#E55E00' }}>{highlightChar}</span>
        {after}
      </React.Fragment>
    );
  });
};

export default function PageHero({ imageSrc, imageAlt = 'Page hero image', title, titleLines, titleHighlight: _titleHighlight, description }: PageHeroProps) {
  const hasContent = (titleLines && titleLines.length > 0) || description;
  
  // Use titleLines if provided, otherwise fall back to title
  const displayLines = titleLines || (title ? [title] : []);
  
  return (
    <section className={styles.heroSection}>
      {/* Background Image */}
      <div className={styles.heroBackground}>
        <Image 
          src={imageSrc} 
          alt={imageAlt}
          fill
          className={styles.heroImage}
          priority
          sizes="100vw"
        />
        <div className={styles.heroOverlay} />
      </div>
      
      {/* Hero Content */}
      {hasContent && (
        <div className={styles.heroContent}>
          <div className={styles.heroTextContainer}>
            {/* Left: Big text lines */}
            {displayLines.length > 0 && (
              <div className={styles.heroLeftText}>
                <h1>
                  {displayLines.map((line, index) => (
                    <span
                      key={index}
                      className={styles.heroBigLine}
                      style={{ display: "block" }}
                    >
                      {addOrangeAccents(line)}
                    </span>
                  ))}
                </h1>
              </div>
            )}
            {/* Right: Small descriptive text */}
            {description && (
              <div className={styles.heroRightText}>
                <p className={styles.heroSmallText}>
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
