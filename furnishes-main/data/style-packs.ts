import type { StylePack } from '@/types/project';

// Predefined style packs based on goal + challenge + visual selections
export const stylePackTemplates: Record<string, StylePack> = {
  'calm-clutter': {
    direction: 'Modern Calm',
    palette: ['#F5F5F0', '#E8DDD4', '#4A3F38', '#6B8E6B'],
    materials: ['Light Oak', 'Matte Black Metal', 'Textured Linen'],
    keepRules: ['Low contrast', 'Soft textures', 'One focal point max'],
    avoidRules: ['Glossy finishes', 'Busy patterns', 'High saturation'],
    evidence: [
      'Lower contrast reduces visual noise and supports calm',
      'Natural textures add warmth without competing for attention',
      'Limited focal points let your eye rest'
    ]
  },
  'calm-lighting': {
    direction: 'Soft Minimal',
    palette: ['#FFFFFF', '#F0E6D2', '#8B7355', '#A8B5A0'],
    materials: ['White Oak', 'Brass Accents', 'Linen Textiles'],
    keepRules: ['Light colors', 'Layered lighting', 'Reflective surfaces'],
    avoidRules: ['Dark woods', 'Heavy fabrics', 'Single light source'],
    evidence: [
      'Light colors maximize natural light reflection',
      'Layered lighting creates depth without harshness',
      'Reflective surfaces amplify available light'
    ]
  },
  'focus-clutter': {
    direction: 'Clean Focus',
    palette: ['#FAFAFA', '#2C2C2C', '#4A90E2', '#E0E0E0'],
    materials: ['Matte White', 'Black Metal', 'Smooth Surfaces'],
    keepRules: ['Minimal decor', 'Clear sight lines', 'Organized storage'],
    avoidRules: ['Decorative items', 'Visual distractions', 'Open clutter'],
    evidence: [
      'Minimal decor reduces cognitive load',
      'Clear sight lines maintain visual order',
      'Organized storage keeps surfaces clean'
    ]
  },
  'cozy-rest': {
    direction: 'Cozy Retreat',
    palette: ['#8B6F47', '#D4A574', '#5C4A37', '#A0826D'],
    materials: ['Warm Wood', 'Soft Textiles', 'Natural Fibers'],
    keepRules: ['Layered textures', 'Warm tones', 'Comfortable seating'],
    avoidRules: ['Cool colors', 'Hard surfaces', 'Minimal furniture'],
    evidence: [
      'Warm tones signal safety and comfort',
      'Layered textures create depth and interest',
      'Comfortable seating invites relaxation'
    ]
  },
  'social-distractions': {
    direction: 'Social Hub',
    palette: ['#E55E00', '#F5A623', '#4A4A4A', '#FFFFFF'],
    materials: ['Bold Accents', 'Durable Fabrics', 'Mixed Materials'],
    keepRules: ['Conversation areas', 'Flexible seating', 'Accent colors'],
    avoidRules: ['Single focal point', 'Formal arrangements', 'Monochrome'],
    evidence: [
      'Conversation areas encourage interaction',
      'Flexible seating adapts to group size',
      'Accent colors create energy and warmth'
    ]
  },
  'default': {
    direction: 'Balanced Modern',
    palette: ['#F5F5F0', '#8B7355', '#4A3F38', '#A8B5A0'],
    materials: ['Oak Wood', 'Neutral Textiles', 'Metal Accents'],
    keepRules: ['Neutral base', 'Natural materials', 'Functional design'],
    avoidRules: ['Trendy pieces', 'Over-styling', 'Impractical choices'],
    evidence: [
      'Neutral base provides flexibility',
      'Natural materials add warmth',
      'Functional design ensures longevity'
    ]
  }
};

export function generateStylePack(
  goal: string,
  challenge: string,
  selectedImages: string[]
): StylePack {
  // Create a deterministic key from inputs
  const key = `${goal}-${challenge}`;
  
  // If exact match exists, use it
  if (stylePackTemplates[key]) {
    return { ...stylePackTemplates[key] };
  }
  
  // Otherwise, use default and adjust based on selections
  const base = { ...stylePackTemplates['default'] };
  
  // Adjust palette based on selected images (simplified logic)
  if (selectedImages.some(img => img.includes('warm'))) {
    base.palette[0] = '#F5E6D3';
  }
  if (selectedImages.some(img => img.includes('cool'))) {
    base.palette[0] = '#F0F4F8';
  }
  
  return base;
}
