'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem, Order, User, OrderStatus, PaymentStatus, PaymentMethod } from '../types';

// State interface
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  cart: CartItem[];
  orders: Order[];
  menuItems: MenuItem[];
  categories: any[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_ITEM'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'SET_CATEGORIES'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  orders: [],
  menuItems: [],
  categories: [],
  isLoading: false,
  error: null,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        cart: [], 
        orders: [] 
      };
    
    case 'SET_CART':
      return { ...state, cart: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.itemId === action.payload.itemId);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.itemId === action.payload.itemId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return { ...state, cart: [...state.cart, action.payload] };
      }
    
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.itemId !== action.payload) };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.itemId === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date() }
            : order
        )
      };
    
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addToCart: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const loadState = () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const savedCart = localStorage.getItem('cart');
        const savedOrders = localStorage.getItem('orders');
        const savedUser = localStorage.getItem('user');

        if (authToken) {
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        }

        if (savedCart) {
          const cart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: cart });
        }

        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          dispatch({ type: 'SET_ORDERS', payload: orders });
        }

        if (savedUser) {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'SET_USER', payload: user });
        }
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    };

    loadState();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [state.cart]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (state.orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(state.orders));
    } else {
      localStorage.removeItem('orders');
    }
  }, [state.orders]);

  // Helper functions
  const addToCart = (item: MenuItem, quantity: number = 1, specialInstructions?: string) => {
    const cartItem: CartItem = {
      itemId: item.id,
      item,
      quantity,
      specialInstructions
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };

  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      
      // Mock order creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: `ORD-${String(Date.now()).slice(-6)}`,
        items: state.cart,
        totalAmount: getCartTotal(),
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        pickupLocation: orderData.pickupLocation || 'Main Counter',
        estimatedPickupTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        createdAt: new Date(),
        updatedAt: new Date(),
        ...orderData
      };

      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      dispatch({ type: 'CLEAR_CART' });
      
      return newOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to place order' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });

      // Mock login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'user-1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        studentId: 'STU001',
        phone: '+91 98765 43210',
        role: 'student',
        isActive: true
      };

      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signup = async (userData: Partial<User> & { password: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });

      // Mock signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        studentId: userData.studentId!,
        phone: userData.phone || '',
        role: 'student',
        isActive: true
      };

      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(newUser));
      
      dispatch({ type: 'SET_USER', payload: newUser });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Signup failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuth = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } else {
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    }
  };

  const value: AppContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    placeOrder,
    updateOrderStatus,
    login,
    signup,
    logout,
    checkAuth
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
