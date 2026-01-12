'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { calculateStyle } from '@/utils/styleCalculator';

// Style types
export type StyleType = 
  | 'Warm Minimalist'
  | 'Soft Modern'
  | 'Nordic Calm'
  | 'Organic Natural'
  | 'Collected Eclectic'
  | 'Quiet Luxury'
  | 'Light & Airy'
  | 'Cozy Retreat';

// State interface
export interface StyleDiscoveryState {
  currentPage: number; // 0-12 (0 = welcome, 1-11 = questions, 12 = results)
  answers: Record<string, any>; // Answers keyed by page/question ID
  styleResult: StyleType | null;
  isInitialized: boolean;
}

// Action types
type StyleDiscoveryAction =
  | { type: 'SET_ANSWER'; payload: { pageId: string; answer: any } }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'GO_TO_PAGE'; payload: number }
  | { type: 'SET_STYLE_RESULT'; payload: StyleType }
  | { type: 'RESET' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<StyleDiscoveryState> }
  | { type: 'SET_INITIALIZED' };

// Initial state
const initialState: StyleDiscoveryState = {
  currentPage: 0,
  answers: {},
  styleResult: null,
  isInitialized: false,
};

// Reducer function
function styleDiscoveryReducer(
  state: StyleDiscoveryState,
  action: StyleDiscoveryAction
): StyleDiscoveryState {
  switch (action.type) {
    case 'SET_ANSWER': {
      const newAnswers = {
        ...state.answers,
        [action.payload.pageId]: action.payload.answer,
      };
      return {
        ...state,
        answers: newAnswers,
      };
    }
    case 'NEXT_PAGE': {
      const nextPage = Math.min(state.currentPage + 1, 12);
      return {
        ...state,
        currentPage: nextPage,
      };
    }
    case 'PREV_PAGE': {
      const prevPage = Math.max(state.currentPage - 1, 0);
      return {
        ...state,
        currentPage: prevPage,
      };
    }
    case 'GO_TO_PAGE': {
      return {
        ...state,
        currentPage: Math.max(0, Math.min(action.payload, 12)),
      };
    }
    case 'SET_STYLE_RESULT': {
      return {
        ...state,
        styleResult: action.payload,
      };
    }
    case 'RESET': {
      return initialState;
    }
    case 'LOAD_FROM_STORAGE': {
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'SET_INITIALIZED': {
      return {
        ...state,
        isInitialized: true,
      };
    }
    default:
      return state;
  }
}

// Context interface
interface StyleDiscoveryContextType {
  state: StyleDiscoveryState;
  setAnswer: (pageId: string, answer: any) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  calculateResult: () => void;
  reset: () => void;
}

// Create context
const StyleDiscoveryContext = createContext<StyleDiscoveryContextType | undefined>(undefined);

// Provider component
export function StyleDiscoveryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(styleDiscoveryReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('styleDiscoveryAnswers');
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
      dispatch({ type: 'SET_INITIALIZED' });
    }
  }, []);

  // Save to localStorage whenever answers change
  useEffect(() => {
    if (state.isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'styleDiscoveryAnswers',
          JSON.stringify({
            currentPage: state.currentPage,
            answers: state.answers,
            styleResult: state.styleResult,
          })
        );
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
  }, [state.currentPage, state.answers, state.styleResult, state.isInitialized]);

  const setAnswer = (pageId: string, answer: any) => {
    dispatch({ type: 'SET_ANSWER', payload: { pageId, answer } });
  };

  const nextPage = () => {
    dispatch({ type: 'NEXT_PAGE' });
  };

  const prevPage = () => {
    dispatch({ type: 'PREV_PAGE' });
  };

  const goToPage = (page: number) => {
    dispatch({ type: 'GO_TO_PAGE', payload: page });
  };

  const calculateResult = () => {
    const result = calculateStyle(state.answers);
    dispatch({ type: 'SET_STYLE_RESULT', payload: result });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('styleDiscoveryAnswers');
    }
  };

  return (
    <StyleDiscoveryContext.Provider
      value={{
        state,
        setAnswer,
        nextPage,
        prevPage,
        goToPage,
        calculateResult,
        reset,
      }}
    >
      {children}
    </StyleDiscoveryContext.Provider>
  );
}

// Hook to use context
export function useStyleDiscovery() {
  const context = useContext(StyleDiscoveryContext);
  if (context === undefined) {
    throw new Error('useStyleDiscovery must be used within a StyleDiscoveryProvider');
  }
  return context;
}
