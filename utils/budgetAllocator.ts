import { calculateBudgetAllocation } from '@/data/budget-templates';
import type { BudgetPlan } from '@/types/project';

export function generateBudgetPlan(
  total: number,
  comfortLevel: 'value' | 'balanced' | 'premium',
  protectedPriorities: string[]
): BudgetPlan {
  const { allocations, tradeoffStatement, confidence } = calculateBudgetAllocation(
    total,
    comfortLevel,
    protectedPriorities
  );

  return {
    total,
    allocations: {
      seating: allocations.seating,
      storage: allocations.storage,
      lighting: allocations.lighting,
      bed_or_desk: allocations.bed_or_desk,
      rug_decor: allocations.rug_decor,
      buffer: allocations.buffer
    },
    tradeoffStatement,
    confidence
  };
}
