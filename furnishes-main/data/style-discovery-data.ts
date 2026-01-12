// Style Discovery Questionnaire Data

export interface SpaceOption {
  id: string;
  name: string;
  image: string;
}

export interface MoodWord {
  id: string;
  word: string;
}

export interface SceneOption {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface QuickChoicePair {
  id: string;
  left: { id: string; label: string; image?: string };
  right: { id: string; label: string; image?: string };
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

export interface TextureOption {
  id: string;
  name: string;
  image: string;
}

export interface SliderOption {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
}

export interface RadioOption {
  id: string;
  label: string;
}

export interface CheckboxOption {
  id: string;
  label: string;
}

// Page 1: First Feeling - Spaces
export const spaceOptions: SpaceOption[] = [
  { id: 'cozy-nook', name: 'Cozy Nook', image: '/images/h-modern-living-room.jpg' },
  { id: 'open-loft', name: 'Open Loft', image: '/images/hero-modern-room.jpg' },
  { id: 'minimal-studio', name: 'Minimal Studio', image: '/images/s-modern-sofa.jpg' },
  { id: 'warm-library', name: 'Warm Library', image: '/images/h-yellow-sofa.jpg' },
  { id: 'sunny-balcony', name: 'Sunny Balcony', image: '/images/h-white-sofa.jpg' },
  { id: 'serene-bedroom', name: 'Serene Bedroom', image: '/images/room1.png' },
];

// Page 2: Mood Words
export const moodWords: MoodWord[] = [
  { id: 'calm', word: 'Calm' },
  { id: 'cozy', word: 'Cozy' },
  { id: 'airy', word: 'Airy' },
  { id: 'grounded', word: 'Grounded' },
  { id: 'warm', word: 'Warm' },
  { id: 'minimal', word: 'Minimal' },
  { id: 'layered', word: 'Layered' },
  { id: 'bright', word: 'Bright' },
  { id: 'moody', word: 'Moody' },
  { id: 'playful', word: 'Playful' },
  { id: 'organized', word: 'Organized' },
  { id: 'collected', word: 'Collected' },
  { id: 'natural', word: 'Natural' },
  { id: 'refined', word: 'Refined' },
  { id: 'simple', word: 'Simple' },
  { id: 'soft', word: 'Soft' },
  { id: 'textured', word: 'Textured' },
  { id: 'clean', word: 'Clean' },
  { id: 'balanced', word: 'Balanced' },
  { id: 'sanctuary', word: 'Sanctuary' },
  { id: 'quiet', word: 'Quiet' },
];

// Page 3: Morning Scene
export const sceneOptions: SceneOption[] = [
  {
    id: 'light-bath',
    name: 'The Light Bath',
    description: 'Soft light through linen curtains. White walls, natural wood, peaceful silence.',
    image: '/images/h-white-sofa.jpg',
  },
  {
    id: 'warm-embrace',
    name: 'The Warm Embrace',
    description: 'Rich textures, warm colors. Books, candles, a soft throw waiting for you.',
    image: '/images/h-yellow-sofa.jpg',
  },
  {
    id: 'green-retreat',
    name: 'The Green Retreat',
    description: 'Plants everywhere. Fresh air, natural light, life growing around you.',
    image: '/images/room2.png',
  },
  {
    id: 'quiet-study',
    name: 'The Quiet Study',
    description: 'Dark wood, leather, brass. A space that feels serious and grounding.',
    image: '/images/v-brown-sofa.jpg',
  },
];

// Page 4: Quick Fire Choices
export const quickChoices: QuickChoicePair[] = [
  { id: 'time-1', left: { id: 'sunrise', label: 'Sunrise' }, right: { id: 'sunset', label: 'Sunset' } },
  { id: 'nature-2', left: { id: 'mountains', label: 'Mountains' }, right: { id: 'ocean', label: 'Ocean' } },
  { id: 'light-3', left: { id: 'candles', label: 'Candles' }, right: { id: 'bright-lights', label: 'Bright lights' } },
  { id: 'place-4', left: { id: 'old-bookstore', label: 'Old bookstore' }, right: { id: 'modern-gallery', label: 'Modern gallery' } },
  { id: 'drink-5', left: { id: 'coffee', label: 'Coffee' }, right: { id: 'tea', label: 'Tea' } },
  { id: 'style-6', left: { id: 'statement-piece', label: 'One statement piece' }, right: { id: 'many-details', label: 'Many small details' } },
  { id: 'shape-7', left: { id: 'straight-lines', label: 'Straight lines' }, right: { id: 'soft-curves', label: 'Soft curves' } },
  { id: 'sound-8', left: { id: 'silence', label: 'Silence' }, right: { id: 'background-music', label: 'Background music' } },
];

// Page 5: Color Palettes
export const colorPalettes: ColorPalette[] = [
  {
    id: 'whisper',
    name: 'Whisper',
    colors: ['#FFFFFF', '#F5F5F0', '#E8E4DE', '#D4CFC7', '#C5BFB6'],
  },
  {
    id: 'earth',
    name: 'Earth',
    colors: ['#8B7355', '#A67C52', '#C4A77D', '#DBC4A0', '#EDE5D8'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#1E3A5F', '#3D5A80', '#7BA3C9', '#A8C5DB', '#E0EBF2'],
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#2D4A3E', '#3D5E4C', '#5B7B5F', '#8BA888', '#C8D9C5'],
  },
  {
    id: 'dusk',
    name: 'Dusk',
    colors: ['#2C2840', '#4A4063', '#6B5B7A', '#9B8BA5', '#D4CDD8'],
  },
  {
    id: 'blush',
    name: 'Blush',
    colors: ['#D4A5A5', '#E5C1C1', '#F0D9D9', '#F7EBEB', '#FDF7F7'],
  },
  {
    id: 'storm',
    name: 'Storm',
    colors: ['#2B2B2B', '#4A4A4A', '#6B6B6B', '#9B9B9B', '#CBCBCB'],
  },
  {
    id: 'desert',
    name: 'Desert',
    colors: ['#C17F59', '#D4A574', '#E5C9A0', '#F0DFC4', '#F8F0E3'],
  },
];

// Page 6: Textures
export const textureOptions: TextureOption[] = [
  { id: 'light-wood', name: 'Light Wood', image: '/images/design1.jpg' },
  { id: 'dark-wood', name: 'Dark Wood', image: '/images/v-brown-sofa.jpg' },
  { id: 'marble', name: 'Marble', image: '/images/floor-plan.jpg' },
  { id: 'concrete', name: 'Concrete', image: '/images/design1.jpg' },
  { id: 'linen', name: 'Linen', image: '/images/black-linen.png' },
  { id: 'velvet', name: 'Velvet', image: '/images/fabric-1-dark.png' },
  { id: 'leather', name: 'Leather', image: '/images/v-brown-sofa.jpg' },
  { id: 'rattan', name: 'Rattan', image: '/images/h-yellow-floating-chair.jpg' },
  { id: 'brass', name: 'Brass', image: '/images/v-color-lines.jpg' },
  { id: 'boucle', name: 'Bouclé', image: '/images/45-degree-fabric-dark.png' },
];

// Page 7: Furniture Style Sliders
export const sliderOptions: SliderOption[] = [
  { id: 'sofa', label: 'Sofa', leftLabel: 'Compact & Clean', rightLabel: 'Sculptural & Bold' },
  { id: 'coffee-table', label: 'Coffee Table', leftLabel: 'Glass & Light', rightLabel: 'Solid & Grounded' },
  { id: 'lighting', label: 'Lighting', leftLabel: 'Minimal & Hidden', rightLabel: 'Statement Piece' },
  { id: 'storage', label: 'Storage', leftLabel: 'Closed & Seamless', rightLabel: 'Open & Displayed' },
  { id: 'dining', label: 'Dining', leftLabel: 'Simple & Light', rightLabel: 'Substantial & Formal' },
];

// Page 8: Life Reality - Organization
export const organizationOptions: RadioOption[] = [
  { id: 'everything-place', label: 'Everything has its place' },
  { id: 'mostly-tidy', label: 'Mostly tidy, chaos corners' },
  { id: 'creative-mess', label: 'Creative mess, don\'t judge' },
];

// Page 8: Life Reality - Home Life
export const homeLifeOptions: RadioOption[] = [
  { id: 'no', label: 'No' },
  { id: 'pets', label: 'Pets' },
  { id: 'kids', label: 'Kids' },
  { id: 'both', label: 'Both' },
];

// Page 8: Life Reality - Plants
export const plantOptions: RadioOption[] = [
  { id: 'green-thumb', label: 'Yes, green thumb' },
  { id: 'sometimes', label: 'Sometimes' },
  { id: 'they-fear-me', label: 'They fear me' },
];

// Page 9: Space Struggles
export const spaceStrugglesOptions: CheckboxOption[] = [
  { id: 'cluttered', label: 'Feels cluttered even when it\'s clean' },
  { id: 'cant-relax', label: 'Can\'t relax or switch off' },
  { id: 'lighting-off', label: 'Lighting always feels off' },
  { id: 'wfh-hard', label: 'Working from home is hard' },
  { id: 'sleep-poorly', label: 'I sleep poorly' },
];

// Page 10: Wellness Goals
export const wellnessGoalOptions: RadioOption[] = [
  { id: 'better-sleep', label: 'Better sleep' },
  { id: 'calm-mind', label: 'A calm mind' },
  { id: 'more-focus', label: 'More focus' },
  { id: 'energy-motivation', label: 'Energy & motivation' },
];

// Page 11: Final Choice - Room Options
export const finalRoomOptions: SceneOption[] = [
  {
    id: 'room-1',
    name: 'Room Option 1',
    description: 'A warm, minimalist space',
    image: '/images/h-modern-living-room.jpg',
  },
  {
    id: 'room-2',
    name: 'Room Option 2',
    description: 'A cozy, collected space',
    image: '/images/h-yellow-sofa.jpg',
  },
  {
    id: 'room-3',
    name: 'Room Option 3',
    description: 'A light, airy space',
    image: '/images/h-white-sofa.jpg',
  },
];

// Style descriptions for results page
export interface StyleDescription {
  name: StyleType;
  description: string;
  dna: {
    minimal: number; // 0-5
    cool: number;
    bold: number;
    simple: number;
  };
  recommendations: string[];
  image: string;
  furnitureRecommendations?: string[];
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const styleDescriptions: Record<StyleType, StyleDescription> = {
  'Warm Minimalist': {
    name: 'Warm Minimalist',
    description: 'You crave simplicity but not coldness. Your ideal space feels edited, intentional, and quietly beautiful. Natural materials, soft textures, and warm neutral tones help you feel grounded and at ease.',
    dna: { minimal: 4, cool: 2, bold: 1, simple: 4 },
    recommendations: ['Sleep improvement', 'Natural light', 'Plants', 'Warm wood tones'],
    image: '/images/h-modern-living-room.jpg',
    furnitureRecommendations: [
      'Low-profile sofa with clean lines',
      'Oak or walnut coffee table',
      'Minimalist floor lamp with warm light',
      'Built-in storage solutions',
      'Simple dining table with natural wood finish'
    ],
    colorScheme: {
      primary: '#E8E4DE',
      secondary: '#D4CFC7',
      accent: '#C4A77D'
    },
  },
  'Soft Modern': {
    name: 'Soft Modern',
    description: 'You love contemporary design but need it to feel inviting. Curved lines, plush fabrics, and a muted color palette create a space that\'s both stylish and comfortable.',
    dna: { minimal: 3, cool: 2, bold: 2, simple: 3 },
    recommendations: ['Soft textures', 'Rounded furniture', 'Muted colors', 'Comfortable seating'],
    image: '/images/h-yellow-sofa.jpg',
    furnitureRecommendations: [
      'Curved sectional sofa in soft fabric',
      'Round marble or wood coffee table',
      'Oval dining table with rounded edges',
      'Plush armchairs with curved backs',
      'Soft pendant lighting fixtures'
    ],
    colorScheme: {
      primary: '#F0D9D9',
      secondary: '#E5C1C1',
      accent: '#D4A5A5'
    },
  },
  'Nordic Calm': {
    name: 'Nordic Calm',
    description: 'Function meets beauty in your ideal space. Clean lines, white walls, natural wood, and plenty of light create a serene environment that supports your daily life.',
    dna: { minimal: 5, cool: 4, bold: 1, simple: 5 },
    recommendations: ['White walls', 'Natural wood', 'Functional storage', 'Natural light'],
    image: '/images/h-white-sofa.jpg',
    furnitureRecommendations: [
      'Light wood dining table',
      'White or light gray sofa',
      'Functional wall-mounted storage',
      'Simple pendant lights',
      'Minimalist bookshelves'
    ],
    colorScheme: {
      primary: '#FFFFFF',
      secondary: '#F5F5F0',
      accent: '#E8E4DE'
    },
  },
  'Organic Natural': {
    name: 'Organic Natural',
    description: 'You feel most at home surrounded by nature. Plants, natural materials, earthy tones, and organic shapes bring life and energy to your space.',
    dna: { minimal: 2, cool: 1, bold: 2, simple: 3 },
    recommendations: ['Plants', 'Natural materials', 'Earthy colors', 'Organic shapes'],
    image: '/images/room2.png',
    furnitureRecommendations: [
      'Rattan or wicker furniture',
      'Live-edge wood dining table',
      'Natural fiber rugs',
      'Terracotta planters',
      'Organic-shaped lighting'
    ],
    colorScheme: {
      primary: '#8BA888',
      secondary: '#5B7B5F',
      accent: '#3D5E4C'
    },
  },
  'Collected Eclectic': {
    name: 'Collected Eclectic',
    description: 'Your space tells a story. You love mixing styles, eras, and textures to create a layered, personal environment that reflects your unique journey.',
    dna: { minimal: 1, cool: 2, bold: 3, simple: 1 },
    recommendations: ['Mix of styles', 'Personal items', 'Layered textures', 'Storytelling elements'],
    image: '/images/v-colorful-lines.jpg',
    furnitureRecommendations: [
      'Vintage statement pieces',
      'Mixed material coffee table',
      'Open shelving for collections',
      'Eclectic mix of chairs',
      'Layered rugs and textiles'
    ],
    colorScheme: {
      primary: '#9B8BA5',
      secondary: '#6B5B7A',
      accent: '#4A4063'
    },
  },
  'Quiet Luxury': {
    name: 'Quiet Luxury',
    description: 'Quality over quantity defines your space. Rich materials, deep colors, and thoughtful details create an atmosphere of understated elegance and sophistication.',
    dna: { minimal: 3, cool: 3, bold: 3, simple: 2 },
    recommendations: ['Quality materials', 'Deep colors', 'Thoughtful details', 'Elegant finishes'],
    image: '/images/v-brown-sofa.jpg',
    furnitureRecommendations: [
      'Leather sofa in rich brown',
      'Marble or brass coffee table',
      'Solid wood dining table',
      'Statement lighting fixtures',
      'Premium fabric upholstery'
    ],
    colorScheme: {
      primary: '#4A4A4A',
      secondary: '#2B2B2B',
      accent: '#6B6B6B'
    },
  },
  'Light & Airy': {
    name: 'Light & Airy',
    description: 'You need space to breathe. White walls, light colors, glass, and minimal furniture create an open, airy environment that feels freeing and uncluttered.',
    dna: { minimal: 5, cool: 5, bold: 1, simple: 5 },
    recommendations: ['White walls', 'Light colors', 'Glass elements', 'Minimal furniture'],
    image: '/images/s-modern-sofa.jpg',
    furnitureRecommendations: [
      'Glass coffee table',
      'Light-colored modular sofa',
      'Transparent acrylic chairs',
      'Floating wall shelves',
      'Minimalist floor lamps'
    ],
    colorScheme: {
      primary: '#FFFFFF',
      secondary: '#E0EBF2',
      accent: '#A8C5DB'
    },
  },
  'Cozy Retreat': {
    name: 'Cozy Retreat',
    description: 'Your home is your sanctuary. Soft fabrics, warm colors, comfortable furniture, and intimate lighting create a cocoon-like space where you can truly unwind.',
    dna: { minimal: 1, cool: 1, bold: 2, simple: 2 },
    recommendations: ['Soft fabrics', 'Warm colors', 'Comfortable furniture', 'Intimate lighting'],
    image: '/images/h-yellow-sunset-sofa.jpg',
    furnitureRecommendations: [
      'Oversized sectional sofa',
      'Plush velvet armchairs',
      'Soft throw blankets and pillows',
      'Warm-toned wood furniture',
      'Table lamps with warm glow'
    ],
    colorScheme: {
      primary: '#DBC4A0',
      secondary: '#C4A77D',
      accent: '#A67C52'
    },
  },
};
