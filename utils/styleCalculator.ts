import type { StyleType } from '@/contexts/StyleDiscoveryContext';
import { styleDescriptions } from '@/data/style-discovery-data';

interface Answers {
  'page-1'?: string[]; // Space selections
  'page-2'?: string[]; // Mood words
  'page-3'?: string; // Morning scene
  'page-4'?: string[]; // Quick fire choices
  'page-5'?: string; // Color palette
  'page-6'?: string[]; // Textures
  'page-7'?: Record<string, number>; // Rating values (1-10)
  'page-8'?: {
    organization?: string;
    homeLife?: string;
    plants?: string;
  };
  'page-9'?: string[]; // Space struggles
  'page-10'?: string; // Wellness goal
  'page-11'?: string; // Final room choice
}

export function calculateStyle(answers: Answers): StyleType {
  const scores: Record<StyleType, number> = {
    'Warm Minimalist': 0,
    'Soft Modern': 0,
    'Nordic Calm': 0,
    'Organic Natural': 0,
    'Collected Eclectic': 0,
    'Quiet Luxury': 0,
    'Light & Airy': 0,
    'Cozy Retreat': 0,
  };

  // Page 1: Space selections
  if (answers['page-1']) {
    const spaces = answers['page-1'];
    if (spaces.includes('minimal-studio')) scores['Nordic Calm'] += 3;
    if (spaces.includes('cozy-nook')) scores['Cozy Retreat'] += 3;
    if (spaces.includes('open-loft')) scores['Light & Airy'] += 3;
    if (spaces.includes('warm-library')) scores['Quiet Luxury'] += 2;
  }

  // Page 2: Mood words
  if (answers['page-2']) {
    const words = answers['page-2'];
    if (words.includes('minimal')) scores['Nordic Calm'] += 2;
    if (words.includes('warm')) scores['Warm Minimalist'] += 2;
    if (words.includes('cozy')) scores['Cozy Retreat'] += 2;
    if (words.includes('airy')) scores['Light & Airy'] += 2;
    if (words.includes('natural')) scores['Organic Natural'] += 2;
    if (words.includes('layered') || words.includes('collected')) scores['Collected Eclectic'] += 2;
    if (words.includes('refined')) scores['Quiet Luxury'] += 2;
    if (words.includes('soft')) scores['Soft Modern'] += 2;
  }

  // Page 3: Morning scene
  if (answers['page-3']) {
    const scene = answers['page-3'];
    if (scene === 'light-bath') scores['Light & Airy'] += 4;
    if (scene === 'warm-embrace') scores['Cozy Retreat'] += 4;
    if (scene === 'green-retreat') scores['Organic Natural'] += 4;
    if (scene === 'quiet-study') scores['Quiet Luxury'] += 4;
  }

  // Page 4: Quick fire choices
  if (answers['page-4']) {
    const choices = answers['page-4'];
    if (choices.includes('sunrise')) scores['Light & Airy'] += 1;
    if (choices.includes('sunset')) scores['Cozy Retreat'] += 1;
    if (choices.includes('mountains')) scores['Organic Natural'] += 1;
    if (choices.includes('candles')) scores['Cozy Retreat'] += 1;
    if (choices.includes('bright-lights')) scores['Light & Airy'] += 1;
    if (choices.includes('old-bookstore')) scores['Collected Eclectic'] += 1;
    if (choices.includes('modern-gallery')) scores['Nordic Calm'] += 1;
    if (choices.includes('tea')) scores['Warm Minimalist'] += 1;
    if (choices.includes('coffee')) scores['Quiet Luxury'] += 1;
    if (choices.includes('statement-piece')) scores['Quiet Luxury'] += 1;
    if (choices.includes('many-details')) scores['Collected Eclectic'] += 1;
    if (choices.includes('straight-lines')) scores['Nordic Calm'] += 1;
    if (choices.includes('soft-curves')) scores['Soft Modern'] += 1;
    if (choices.includes('silence')) scores['Nordic Calm'] += 1;
  }

  // Page 5: Color palette
  if (answers['page-5']) {
    const palette = answers['page-5'];
    if (palette === 'whisper' || palette === 'blush') scores['Light & Airy'] += 3;
    if (palette === 'earth' || palette === 'desert') scores['Warm Minimalist'] += 3;
    if (palette === 'ocean') scores['Nordic Calm'] += 3;
    if (palette === 'forest') scores['Organic Natural'] += 3;
    if (palette === 'dusk' || palette === 'storm') scores['Quiet Luxury'] += 3;
  }

  // Page 6: Textures
  if (answers['page-6']) {
    const textures = answers['page-6'];
    if (textures.includes('linen') || textures.includes('light-wood')) scores['Light & Airy'] += 2;
    if (textures.includes('velvet') || textures.includes('boucle')) scores['Cozy Retreat'] += 2;
    if (textures.includes('leather') || textures.includes('brass')) scores['Quiet Luxury'] += 2;
    if (textures.includes('rattan') || textures.includes('dark-wood')) scores['Organic Natural'] += 2;
    if (textures.includes('marble') || textures.includes('concrete')) scores['Nordic Calm'] += 2;
  }

  // Page 7: Furniture style ratings (1-10 scale)
  if (answers['page-7']) {
    const ratings = answers['page-7'];
    // Values 1-3 = minimal/simple
    // Values 4-7 = balanced
    // Values 8-10 = bold/complex
    Object.values(ratings).forEach((value) => {
      if (value <= 3) {
        scores['Nordic Calm'] += 1;
        scores['Light & Airy'] += 1;
      } else if (value >= 8) {
        scores['Collected Eclectic'] += 1;
        scores['Quiet Luxury'] += 1;
      } else {
        scores['Warm Minimalist'] += 1;
        scores['Soft Modern'] += 1;
      }
    });
  }

  // Page 8: Life reality
  if (answers['page-8']) {
    const reality = answers['page-8'];
    if (reality.organization === 'everything-place') scores['Nordic Calm'] += 2;
    if (reality.organization === 'creative-mess') scores['Collected Eclectic'] += 2;
    if (reality.plants === 'green-thumb') scores['Organic Natural'] += 3;
    if (reality.homeLife === 'kids' || reality.homeLife === 'both') {
      scores['Cozy Retreat'] += 1;
      scores['Soft Modern'] += 1;
    }
  }

  // Page 9: Space struggles
  if (answers['page-9']) {
    const struggles = answers['page-9'];
    if (struggles.includes('cluttered')) scores['Nordic Calm'] += 2;
    if (struggles.includes('cant-relax')) scores['Cozy Retreat'] += 2;
    if (struggles.includes('lighting-off')) scores['Light & Airy'] += 2;
    if (struggles.includes('wfh-hard')) scores['Nordic Calm'] += 1;
    if (struggles.includes('sleep-poorly')) scores['Cozy Retreat'] += 2;
  }

  // Page 10: Wellness goal
  if (answers['page-10']) {
    const goal = answers['page-10'];
    if (goal === 'better-sleep') scores['Cozy Retreat'] += 3;
    if (goal === 'calm-mind') scores['Nordic Calm'] += 3;
    if (goal === 'more-focus') scores['Nordic Calm'] += 2;
    if (goal === 'energy-motivation') scores['Light & Airy'] += 2;
  }

  // Find the style with the highest score
  let maxScore = 0;
  let result: StyleType = 'Warm Minimalist';

  Object.entries(scores).forEach(([style, score]) => {
    if (score > maxScore) {
      maxScore = score;
      result = style as StyleType;
    }
  });

  return result;
}
