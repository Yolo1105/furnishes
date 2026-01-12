/**
 * Business logic constants
 * Centralized constants for validation, limits, and business rules
 */

// Budget constants
export const BUDGET = {
  MIN_AMOUNT: 1000,
  PRESETS: [5000, 7500, 10000, 15000] as const,
} as const;

// Chat/Message constants
export const MESSAGE = {
  MAX_LENGTH: 500,
  COPY_FEEDBACK_TIMEOUT: 2000, // milliseconds
} as const;

// Timeout constants (in milliseconds)
export const TIMEOUTS = {
  COPY_FEEDBACK: 2000,
  GENERATION_DELAY: 2000,
  REFINEMENT_DELAY: 800,
  AI_RESPONSE_MIN: 1500,
  AI_RESPONSE_MAX: 2500,
} as const;

// Validation constants
export const VALIDATION = {
  MIN_BASE_COLORS: 2,
  MAX_BASE_COLORS: 4,
  MAX_ACCENT_COLORS: 2,
  MIN_WOOD_TONES: 1,
  MAX_ACCENT_STYLES: 2,
} as const;
