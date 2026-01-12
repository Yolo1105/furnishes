'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { 
  ProjectState, 
  StylePack, 
  BudgetPlan, 
  RoomConfig, 
  PlacedItem, 
  LayoutHealth,
  ProjectStep 
} from '@/types/project';

// Action types
type ProjectAction =
  | { type: 'SET_STEP'; payload: ProjectStep }
  | { type: 'SET_STYLE_PACK'; payload: StylePack }
  | { type: 'SET_BUDGET_PLAN'; payload: BudgetPlan }
  | { type: 'SET_ROOM_CONFIG'; payload: RoomConfig }
  | { type: 'ADD_PLACED_ITEM'; payload: PlacedItem }
  | { type: 'UPDATE_PLACED_ITEM'; payload: { id: string; updates: Partial<PlacedItem> } }
  | { type: 'REMOVE_PLACED_ITEM'; payload: string }
  | { type: 'SET_PLACED_ITEMS'; payload: PlacedItem[] }
  | { type: 'SET_LAYOUT_HEALTH'; payload: LayoutHealth }
  | { type: 'SET_SELECTED_KIT'; payload: string | null }
  | { type: 'RESET_PROJECT' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<ProjectState> };

// Initial state
const initialState: ProjectState = {
  currentStep: 'style',
  stylePack: null,
  budgetPlan: null,
  roomConfig: null,
  placedItems: [],
  layoutHealth: null,
  selectedKit: null,
};

// Reducer
function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_STYLE_PACK':
      return { ...state, stylePack: action.payload };
    
    case 'SET_BUDGET_PLAN':
      return { ...state, budgetPlan: action.payload };
    
    case 'SET_ROOM_CONFIG':
      return { ...state, roomConfig: action.payload };
    
    case 'ADD_PLACED_ITEM':
      return { ...state, placedItems: [...state.placedItems, action.payload] };
    
    case 'UPDATE_PLACED_ITEM':
      return {
        ...state,
        placedItems: state.placedItems.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };
    
    case 'REMOVE_PLACED_ITEM':
      return {
        ...state,
        placedItems: state.placedItems.filter(item => item.id !== action.payload),
      };
    
    case 'SET_PLACED_ITEMS':
      return { ...state, placedItems: action.payload };
    
    case 'SET_LAYOUT_HEALTH':
      return { ...state, layoutHealth: action.payload };
    
    case 'SET_SELECTED_KIT':
      return { ...state, selectedKit: action.payload };
    
    case 'RESET_PROJECT':
      return initialState;
    
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Context interface
interface ProjectContextType {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  // Helper functions
  setStep: (step: ProjectStep) => void;
  setStylePack: (pack: StylePack) => void;
  setBudgetPlan: (plan: BudgetPlan) => void;
  setRoomConfig: (config: RoomConfig) => void;
  addPlacedItem: (item: PlacedItem) => void;
  updatePlacedItem: (id: string, updates: Partial<PlacedItem>) => void;
  removePlacedItem: (id: string) => void;
  setPlacedItems: (items: PlacedItem[]) => void;
  setLayoutHealth: (health: LayoutHealth) => void;
  setSelectedKit: (kitId: string | null) => void;
  resetProject: () => void;
}

// Create context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('furnishesProject');
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
        }
      } catch (error) {
        console.error('Failed to load project from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('furnishesProject', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save project to localStorage:', error);
      }
    }
  }, [state]);

  // Helper functions
  const setStep = (step: ProjectStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const setStylePack = (pack: StylePack) => {
    dispatch({ type: 'SET_STYLE_PACK', payload: pack });
  };

  const setBudgetPlan = (plan: BudgetPlan) => {
    dispatch({ type: 'SET_BUDGET_PLAN', payload: plan });
  };

  const setRoomConfig = (config: RoomConfig) => {
    dispatch({ type: 'SET_ROOM_CONFIG', payload: config });
  };

  const addPlacedItem = (item: PlacedItem) => {
    dispatch({ type: 'ADD_PLACED_ITEM', payload: item });
  };

  const updatePlacedItem = (id: string, updates: Partial<PlacedItem>) => {
    dispatch({ type: 'UPDATE_PLACED_ITEM', payload: { id, updates } });
  };

  const removePlacedItem = (id: string) => {
    dispatch({ type: 'REMOVE_PLACED_ITEM', payload: id });
  };

  const setPlacedItems = (items: PlacedItem[]) => {
    dispatch({ type: 'SET_PLACED_ITEMS', payload: items });
  };

  const setLayoutHealth = (health: LayoutHealth) => {
    dispatch({ type: 'SET_LAYOUT_HEALTH', payload: health });
  };

  const setSelectedKit = (kitId: string | null) => {
    dispatch({ type: 'SET_SELECTED_KIT', payload: kitId });
  };

  const resetProject = () => {
    dispatch({ type: 'RESET_PROJECT' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('furnishesProject');
    }
  };

  const value: ProjectContextType = {
    state,
    dispatch,
    setStep,
    setStylePack,
    setBudgetPlan,
    setRoomConfig,
    addPlacedItem,
    updatePlacedItem,
    removePlacedItem,
    setPlacedItems,
    setLayoutHealth,
    setSelectedKit,
    resetProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

// Custom hook
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
