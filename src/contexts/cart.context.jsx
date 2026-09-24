'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { addItemToCart, removeItemFromCart } from './cart.utils';

const STORAGE_KEY = 'crwn-cart';

const CartContext = createContext(null);

const INITIAL_STATE = {
  hidden: true,
  cartItems: [],
  hydrated: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, cartItems: action.payload, hydrated: true };
    case 'TOGGLE_CART_HIDDEN':
      return { ...state, hidden: !state.hidden };
    case 'ADD_ITEM':
      return { ...state, cartItems: addItemToCart(state.cartItems, action.payload) };
    case 'REMOVE_ITEM':
      return { ...state, cartItems: removeItemFromCart(state.cartItems, action.payload) };
    case 'CLEAR_ITEM_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(cartItem => cartItem.id !== action.payload.id)
      };
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    default:
      return state;
  }
};

const readStoredCart = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);
  const { hidden, cartItems, hydrated } = state;

  // The cart lives in localStorage, which only exists in the browser, so load it after mount.
  useEffect(() => {
    dispatch({ type: 'HYDRATE', payload: readStoredCart() });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage can be unavailable (private mode, quota); the cart still works in memory.
    }
  }, [cartItems, hydrated]);

  const value = useMemo(
    () => ({
      hidden,
      cartItems,
      itemCount: cartItems.reduce((count, cartItem) => count + cartItem.quantity, 0),
      total: cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0),
      toggleCartHidden: () => dispatch({ type: 'TOGGLE_CART_HIDDEN' }),
      addItem: item => dispatch({ type: 'ADD_ITEM', payload: item }),
      removeItem: item => dispatch({ type: 'REMOVE_ITEM', payload: item }),
      clearItemFromCart: item => dispatch({ type: 'CLEAR_ITEM_FROM_CART', payload: item }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' })
    }),
    [hidden, cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
};
