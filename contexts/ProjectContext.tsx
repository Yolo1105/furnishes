'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import type {
  ProjectState,
  StylePack,
  BudgetPlan,
  RoomConfig,
  PlacedItem,
  LayoutHealth,
  ProjectStep,
} from '@/types/project';
import { readVersionedJson, writeVersionedJson } from '@/lib/storage';

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

const PROJECT_STORAGE_KEY = 'furnishes_project_v1';
const LEGACY_PROJECT_KEY = 'furnishesProject';

// Create context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const saveTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount (versioned first, then legacy migration)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const restored = readVersionedJson<Partial<ProjectState>>(PROJECT_STORAGE_KEY);
    if (restored) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: restored });
    } else {
      try {
        const saved = window.localStorage.getItem(LEGACY_PROJECT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<ProjectState>;
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
          writeVersionedJson(PROJECT_STORAGE_KEY, { ...initialState, ...parsed });
          window.localStorage.removeItem(LEGACY_PROJECT_KEY);
        }
      } catch (error) {
        console.error('Failed to load project from localStorage:', error);
      }
    }
  }, []);

  // Debounced save to localStorage (300ms)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (saveTimeoutIdRef.current !== null) {
      clearTimeout(saveTimeoutIdRef.current);
    }

    saveTimeoutIdRef.current = setTimeout(() => {
      writeVersionedJson(PROJECT_STORAGE_KEY, state);
      saveTimeoutIdRef.current = null;
    }, 300);

    return () => {
      if (saveTimeoutIdRef.current !== null) {
        clearTimeout(saveTimeoutIdRef.current);
      }
    };
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
      window.localStorage.removeItem(PROJECT_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_PROJECT_KEY);
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
