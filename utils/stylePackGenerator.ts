import type { StylePack } from '@/types/project';
import { generateStylePack } from '@/data/style-packs';

export function generateStylePackFromInputs(
  goal: string,
  challenge: string,
  selectedImages: string[]
): StylePack {
  return generateStylePack(goal, challenge, selectedImages);
}
