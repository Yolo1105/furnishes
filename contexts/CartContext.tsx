'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Cart item interface
export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  name: string;
  designer: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  ref?: string;
}

// Saved for later item (same structure)
export interface SavedForLaterItem extends CartItem {}

// Cart state interface
export interface CartState {
  items: CartItem[];
  savedForLater: SavedForLaterItem[];
  promoCode: string | null;
  discount: number; // Discount amount in dollars
  isInitialized: boolean;
}

// Action types
type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string } // cart item ID
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SAVE_FOR_LATER'; payload: string } // cart item ID
  | { type: 'MOVE_TO_CART'; payload: string } // saved item ID
  | { type: 'REMOVE_FROM_SAVED'; payload: string } // saved item ID
  | { type: 'MOVE_TO_WISHLIST'; payload: string } // cart item ID
  | { type: 'APPLY_PROMO_CODE'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_PROMO_CODE' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<CartState> }
  | { type: 'SET_INITIALIZED' };

// Initial state
const initialState: CartState = {
  items: [],
  savedForLater: [],
  promoCode: null,
  discount: 0,
  isInitialized: false,
};

// Reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedColor === action.payload.selectedColor &&
          item.selectedSize === action.payload.selectedSize
      );

      if (existingItem) {
        // Update quantity if item already exists
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }
    case 'SAVE_FOR_LATER': {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return state;

      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
        savedForLater: [...state.savedForLater, item],
      };
    }
    case 'MOVE_TO_CART': {
      const item = state.savedForLater.find((i) => i.id === action.payload);
      if (!item) return state;

      return {
        ...state,
        savedForLater: state.savedForLater.filter((i) => i.id !== action.payload),
        items: [...state.items, item],
      };
    }
    case 'REMOVE_FROM_SAVED': {
      return {
        ...state,
        savedForLater: state.savedForLater.filter((i) => i.id !== action.payload),
      };
    }
    case 'MOVE_TO_WISHLIST': {
      // For now, just remove from cart. Wishlist can be implemented separately later.
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    }
    case 'APPLY_PROMO_CODE': {
      return {
        ...state,
        promoCode: action.payload.code,
        discount: action.payload.discount,
      };
    }
    case 'REMOVE_PROMO_CODE': {
      return {
        ...state,
        promoCode: null,
        discount: 0,
      };
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
interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeFromSaved: (id: string) => void;
  moveToWishlist: (id: string) => void;
  applyPromoCode: (code: string, discount: number) => void;
  removePromoCode: () => void;
  // Calculated values
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('furnishes_cart');
        const savedForLater = localStorage.getItem('furnishes_saved_for_later');
        const savedPromo = localStorage.getItem('furnishes_promo_code');
        const savedDiscount = localStorage.getItem('furnishes_discount');

        const payload: Partial<CartState> = {};

        if (savedCart) {
          payload.items = JSON.parse(savedCart);
        }
        if (savedForLater) {
          payload.savedForLater = JSON.parse(savedForLater);
        }
        if (savedPromo) {
          payload.promoCode = savedPromo;
        }
        if (savedDiscount) {
          payload.discount = parseFloat(savedDiscount);
        }

        if (Object.keys(payload).length > 0) {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload });
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
      dispatch({ type: 'SET_INITIALIZED' });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem('furnishes_cart', JSON.stringify(state.items));
        localStorage.setItem('furnishes_saved_for_later', JSON.stringify(state.savedForLater));
        if (state.promoCode) {
          localStorage.setItem('furnishes_promo_code', state.promoCode);
        } else {
          localStorage.removeItem('furnishes_promo_code');
        }
        localStorage.setItem('furnishes_discount', state.discount.toString());
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [state.items, state.savedForLater, state.promoCode, state.discount, state.isInitialized]);

  // Helper function to generate unique ID
  const generateId = () => {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...item,
        id: generateId(),
      },
    });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const saveForLater = (id: string) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: id });
  };

  const moveToCart = (id: string) => {
    dispatch({ type: 'MOVE_TO_CART', payload: id });
  };

  const removeFromSaved = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_SAVED', payload: id });
  };

  const moveToWishlist = (id: string) => {
    dispatch({ type: 'MOVE_TO_WISHLIST', payload: id });
  };

  const applyPromoCode = (code: string, discount: number) => {
    dispatch({ type: 'APPLY_PROMO_CODE', payload: { code, discount } });
  };

  const removePromoCode = () => {
    dispatch({ type: 'REMOVE_PROMO_CODE' });
  };

  // Calculate totals
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 50; // Free shipping over $500
  const tax = subtotal * 0.08; // 8% tax estimate
  const total = subtotal + shipping + tax - state.discount;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCart,
        removeFromSaved,
        moveToWishlist,
        applyPromoCode,
        removePromoCode,
        subtotal,
        shipping,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
