'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { FurnitureItem, FurnitureTemplate, RoomDimensions } from '@/types/furniture';
import { furnitureTemplates } from '@/data/furniture-data';

// State interface
interface PlaygroundState {
  furnitureItems: FurnitureItem[];
  selectedItem: string | null;
  roomDimensions: RoomDimensions;
  showDimensions: boolean;
  showTutorial: boolean;
}

// Action types
type PlaygroundAction =
  | { type: 'ADD_FURNITURE'; payload: FurnitureTemplate }
  | { type: 'SELECT_ITEM'; payload: string | null }
  | { type: 'UPDATE_FURNITURE'; payload: { id: string; updates: Partial<FurnitureItem> } }
  | { type: 'UPDATE_COMPONENT'; payload: { furnitureId: string; componentId: string; selected: boolean } }
  | { type: 'RESET_SCENE' }
  | { type: 'UPDATE_ROOM_DIMENSIONS'; payload: RoomDimensions }
  | { type: 'TOGGLE_DIMENSIONS' }
  | { type: 'TOGGLE_TUTORIAL' }
  | { type: 'LOAD_SCENE'; payload: { furnitureItems: FurnitureItem[]; roomDimensions: RoomDimensions } }
  | { type: 'SAVE_SCENE' };

// Initial state
const initialState: PlaygroundState = {
  furnitureItems: [],
  selectedItem: null,
  roomDimensions: {
    width: 8,
    length: 10,
    height: 3.5,
  },
  showDimensions: false,
  showTutorial: false,
};

// Reducer function
function playgroundReducer(state: PlaygroundState, action: PlaygroundAction): PlaygroundState {
  switch (action.type) {
    case 'ADD_FURNITURE': {
      const template = action.payload;
      
      // Calculate better default position based on furniture type and existing items
      const getDefaultPosition = (type: string): [number, number, number] => {
        const existingItems = state.furnitureItems.length;
        const baseOffset = existingItems * 2; // Space items apart
        
        switch (type) {
          case 'table':
            return [0, 0, -2]; // Center, away from back wall
          case 'chair':
            return [0, 0, -1]; // In front of table
          case 'desk':
            return [-3, 0, -2]; // Left side of room
          case 'shelf':
            return [3, 0, -2]; // Right side of room
          case 'cabinet':
            return [0, 0, 2]; // Back of room
          case 'sofa':
            return [0, 0, 1]; // Center of room
          case 'bed':
            return [-3, 0, 1]; // Left side, for bedroom feel
          case 'lamp':
            return [baseOffset, 0, baseOffset]; // Spread out lamps
          default:
            return [baseOffset, 0, baseOffset];
        }
      };

      const newItem: FurnitureItem = {
        id: `${template.type}-${Date.now()}`,
        type: template.type,
        position: getDefaultPosition(template.type),
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: template.defaultColor,
        material: 'wood',
        customization: {},
        components: template.components.map(comp => ({ ...comp })),
      };
      return {
        ...state,
        furnitureItems: [...state.furnitureItems, newItem],
        selectedItem: newItem.id,
      };
    }

    case 'SELECT_ITEM': {
      return {
        ...state,
        selectedItem: action.payload,
      };
    }

    case 'UPDATE_FURNITURE': {
      const { id, updates } = action.payload;
      return {
        ...state,
        furnitureItems: state.furnitureItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        ),
      };
    }

    case 'UPDATE_COMPONENT': {
      const { furnitureId, componentId, selected } = action.payload;
      return {
        ...state,
        furnitureItems: state.furnitureItems.map(item => {
          if (item.id === furnitureId && item.components) {
            const updatedComponents = item.components.map(comp => {
              if (comp.type === item.components.find(c => c.id === componentId)?.type) {
                return { ...comp, selected: comp.id === componentId ? selected : false };
              }
              return comp;
            });
            return { ...item, components: updatedComponents };
          }
          return item;
        }),
      };
    }

    case 'RESET_SCENE': {
      return {
        ...state,
        furnitureItems: [],
        selectedItem: null,
      };
    }

    case 'UPDATE_ROOM_DIMENSIONS': {
      return {
        ...state,
        roomDimensions: action.payload,
      };
    }

    case 'TOGGLE_DIMENSIONS': {
      return {
        ...state,
        showDimensions: !state.showDimensions,
      };
    }

    case 'TOGGLE_TUTORIAL': {
      return {
        ...state,
        showTutorial: !state.showTutorial,
      };
    }

    case 'LOAD_SCENE': {
      return {
        ...state,
        furnitureItems: action.payload.furnitureItems,
        roomDimensions: action.payload.roomDimensions,
      };
    }

    case 'SAVE_SCENE': {
      // In a real application, you would save the state to localStorage or an API
      // For now, we'll just return the current state
      return state;
    }

    default:
      return state;
  }
}

// Context interface
interface PlaygroundContextType {
  state: PlaygroundState;
  dispatch: React.Dispatch<PlaygroundAction>;
  // Helper functions
  addFurniture: (template: FurnitureTemplate) => void;
  selectItem: (id: string | null) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  updateComponent: (furnitureId: string, componentId: string, selected: boolean) => void;
  resetScene: () => void;
  updateRoomDimensions: (dimensions: RoomDimensions) => void;
  toggleDimensions: () => void;
  toggleTutorial: () => void;
  calculateTotalCost: () => number;
  getSelectedFurniture: () => FurnitureItem | undefined;
  getFurnitureName: (item: FurnitureItem) => string;
  loadScene: (data: { furnitureItems: FurnitureItem[]; roomDimensions: RoomDimensions }) => void;
  saveScene: () => void;
  exportScene: () => void;
  importScene: (file: File) => void;
}

// Create context
const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

// Provider component
export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playgroundReducer, initialState);

  // Helper functions
  const addFurniture = (template: FurnitureTemplate) => {
    dispatch({ type: 'ADD_FURNITURE', payload: template });
  };

  const selectItem = (id: string | null) => {
    dispatch({ type: 'SELECT_ITEM', payload: id });
  };

  const updateFurniture = (id: string, updates: Partial<FurnitureItem>) => {
    dispatch({ type: 'UPDATE_FURNITURE', payload: { id, updates } });
  };

  const updateComponent = (furnitureId: string, componentId: string, selected: boolean) => {
    dispatch({ type: 'UPDATE_COMPONENT', payload: { furnitureId, componentId, selected } });
  };

  const resetScene = () => {
    dispatch({ type: 'RESET_SCENE' });
  };

  const updateRoomDimensions = (dimensions: RoomDimensions) => {
    dispatch({ type: 'UPDATE_ROOM_DIMENSIONS', payload: dimensions });
  };

  const toggleDimensions = () => {
    dispatch({ type: 'TOGGLE_DIMENSIONS' });
  };

  const toggleTutorial = () => {
    dispatch({ type: 'TOGGLE_TUTORIAL' });
  };

  const calculateTotalCost = () => {
    return state.furnitureItems.reduce((total, item) => {
      if (!item.components) return total;
      return total + item.components.filter(c => c.selected).reduce((sum, comp) => sum + (comp.price || 0), 0);
    }, 0);
  };

  const getSelectedFurniture = () => {
    return state.furnitureItems.find(item => item.id === state.selectedItem);
  };

  const getFurnitureName = (item: FurnitureItem) => {
    const template = furnitureTemplates.find(t => t.type === item.type);
    const materialName = item.material.charAt(0).toUpperCase() + item.material.slice(1);
    return `${materialName} ${template?.name || item.type}`;
  };

  const loadScene = (data: { furnitureItems: FurnitureItem[]; roomDimensions: RoomDimensions }) => {
    dispatch({ type: 'LOAD_SCENE', payload: data });
  };

  const saveScene = () => {
    dispatch({ type: 'SAVE_SCENE' });
  };

  const exportScene = () => {
    const sceneData = {
      furnitureItems: state.furnitureItems,
      roomDimensions: state.roomDimensions,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(sceneData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `room-design-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importScene = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sceneData = JSON.parse(e.target?.result as string);
        if (sceneData.furnitureItems && sceneData.roomDimensions) {
          loadScene({
            furnitureItems: sceneData.furnitureItems,
            roomDimensions: sceneData.roomDimensions
          });
        }
      } catch (error) {
        console.error('Error importing scene:', error);
        alert('Invalid file format. Please select a valid room design file.');
      }
    };
    reader.readAsText(file);
  };

  const value: PlaygroundContextType = {
    state,
    dispatch,
    addFurniture,
    selectItem,
    updateFurniture,
    updateComponent,
    resetScene,
    updateRoomDimensions,
    toggleDimensions,
    toggleTutorial,
    calculateTotalCost,
    getSelectedFurniture,
    getFurnitureName,
    loadScene,
    saveScene,
    exportScene,
    importScene,
  };

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
}

// Custom hook to use the context
export function usePlaygroundContext() {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw new Error('usePlaygroundContext must be used within a PlaygroundProvider');
  }
  return context;
}
