/**
 * Utility functions for working with preferences
 */
import type { ProjectInfo } from '@/components/pages/chatbot/ProjectInfoPanel';

/**
 * Get a preference value from ProjectInfo
 */
export function getPreferenceValue(
  projectInfo: ProjectInfo,
  field: keyof ProjectInfo
): string | string[] | null {
  const value = projectInfo[field];
  return value || null;
}

/**
 * Check if a preference field has a value
 */
export function hasPreference(
  projectInfo: ProjectInfo,
  field: keyof ProjectInfo
): boolean {
  const value = projectInfo[field];
  if (field === 'colorTheme' || field === 'mustBuyFurniture') {
    return Array.isArray(value) && value.length > 0;
  }
  return Boolean(value && String(value).trim());
}

/**
 * Format confidence as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Get confidence level as string (high/medium/low)
 */
export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}
