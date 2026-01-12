export interface BudgetTemplate {
  comfortLevel: 'value' | 'balanced' | 'premium';
  range: { min: number; max: number };
  defaultAllocation: {
    seating: number;
    storage: number;
    lighting: number;
    bed_or_desk: number;
    rug_decor: number;
    buffer: number;
  };
}

export const budgetTemplates: Record<string, BudgetTemplate> = {
  value: {
    comfortLevel: 'value',
    range: { min: 4000, max: 6000 },
    defaultAllocation: {
      seating: 0.30,
      storage: 0.18,
      lighting: 0.11,
      bed_or_desk: 0.20,
      rug_decor: 0.12,
      buffer: 0.09
    }
  },
  balanced: {
    comfortLevel: 'balanced',
    range: { min: 6000, max: 9000 },
    defaultAllocation: {
      seating: 0.30,
      storage: 0.18,
      lighting: 0.11,
      bed_or_desk: 0.20,
      rug_decor: 0.12,
      buffer: 0.09
    }
  },
  premium: {
    comfortLevel: 'premium',
    range: { min: 9000, max: 15000 },
    defaultAllocation: {
      seating: 0.30,
      storage: 0.18,
      lighting: 0.11,
      bed_or_desk: 0.20,
      rug_decor: 0.12,
      buffer: 0.09
    }
  }
};

export function calculateBudgetAllocation(
  total: number,
  comfortLevel: 'value' | 'balanced' | 'premium',
  protectedPriorities: string[]
): {
  allocations: Record<string, number>;
  tradeoffStatement: string;
  confidence: 'on_track' | 'over_budget' | 'under_budget';
} {
  const template = budgetTemplates[comfortLevel];
  const baseAllocation = { ...template.defaultAllocation };
  
  // Adjust allocations if priorities are protected
  // Protected categories get their full allocation
  // Non-protected categories can be reduced if needed
  
  const allocations: Record<string, number> = {
    seating: Math.round(total * baseAllocation.seating),
    storage: Math.round(total * baseAllocation.storage),
    lighting: Math.round(total * baseAllocation.lighting),
    bed_or_desk: Math.round(total * baseAllocation.bed_or_desk),
    rug_decor: Math.round(total * baseAllocation.rug_decor),
    buffer: Math.round(total * baseAllocation.buffer)
  };
  
  // Generate tradeoff statement
  const protectedList = protectedPriorities.join(' and ');
  const tradeoffStatement = protectedPriorities.length > 0
    ? `We'll flex decor before touching your protected categories (${protectedList}). You get comfort where it counts.`
    : 'We balance all categories to maximize value across your space.';
  
  // Determine confidence
  const confidence: 'on_track' | 'over_budget' | 'under_budget' = 
    total >= template.range.min && total <= template.range.max
      ? 'on_track'
      : total > template.range.max
      ? 'over_budget'
      : 'under_budget';
  
  return { allocations, tradeoffStatement, confidence };
}
