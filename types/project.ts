export interface StylePack {
  direction: string;
  palette: string[]; // hex colors
  materials: string[];
  keepRules: string[];
  avoidRules: string[];
  evidence: string[];
}

export interface BudgetPlan {
  total: number;
  allocations: {
    seating: number;
    storage: number;
    lighting: number;
    bed_or_desk: number;
    rug_decor: number;
    buffer: number;
  };
  tradeoffStatement: string;
  confidence: 'on_track' | 'over_budget' | 'under_budget';
}

export interface RoomConfig {
  dimensions: { width: number; length: number; ceiling: number };
  openings: Array<{
    id: string;
    type: 'door' | 'window';
    position: { x: number; y: number };
    swing?: 'inward' | 'outward';
    size?: 'standard' | 'large';
  }>;
  usableArea: number;
}

export interface LayoutHealth {
  overall: 'green' | 'needs_attention' | 'blocked';
  issues: Array<{
    id: string;
    type: string;
    location: any;
    severity: 'warning' | 'error';
    fixAvailable: boolean;
    description: string;
    affectedItems?: string[];
  }>;
  checksPassed: string[];
}

export interface PlacedItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  customization?: Record<string, any>;
}

export interface FurnitureKit {
  id: string;
  name: string;
  description: string;
  image: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    position: [number, number, number];
    rotation: [number, number, number];
  }>;
  estimatedTotal: number;
}

export type ProjectStep = 'style' | 'budget' | 'room-setup' | 'kit-placer' | 'health' | 'export';

export interface ProjectState {
  currentStep: ProjectStep;
  stylePack: StylePack | null;
  budgetPlan: BudgetPlan | null;
  roomConfig: RoomConfig | null;
  placedItems: PlacedItem[];
  layoutHealth: LayoutHealth | null;
  selectedKit: string | null;
}
