'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { VirtualPortfolio, Order, Position, Transaction, StockData } from '@/lib/types';

interface TradingState {
  portfolio: VirtualPortfolio | null;
  marketData: StockData[];
  watchlist: string[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  selectedSymbol: string | null;
}

type TradingAction =
  | { type: 'LOAD_PORTFOLIO_START' }
  | { type: 'LOAD_PORTFOLIO_SUCCESS'; payload: VirtualPortfolio }
  | { type: 'LOAD_PORTFOLIO_FAILURE'; payload: string }
  | { type: 'UPDATE_MARKET_DATA'; payload: StockData[] }
  | { type: 'PLACE_ORDER_START' }
  | { type: 'PLACE_ORDER_SUCCESS'; payload: Order }
  | { type: 'PLACE_ORDER_FAILURE'; payload: string }
  | { type: 'UPDATE_PORTFOLIO'; payload: Partial<VirtualPortfolio> }
  | { type: 'SET_SELECTED_SYMBOL'; payload: string | null }
  | { type: 'ADD_TO_WATCHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: TradingState = {
  portfolio: null,
  marketData: [],
  watchlist: [],
  orders: [],
  isLoading: false,
  error: null,
  selectedSymbol: null,
};

function tradingReducer(state: TradingState, action: TradingAction): TradingState {
  switch (action.type) {
    case 'LOAD_PORTFOLIO_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOAD_PORTFOLIO_SUCCESS':
      return {
        ...state,
        portfolio: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOAD_PORTFOLIO_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'UPDATE_MARKET_DATA':
      return {
        ...state,
        marketData: action.payload,
      };
    case 'PLACE_ORDER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'PLACE_ORDER_SUCCESS':
      return {
        ...state,
        orders: [...state.orders, action.payload],
        isLoading: false,
        error: null,
      };
    case 'PLACE_ORDER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'UPDATE_PORTFOLIO':
      return {
        ...state,
        portfolio: state.portfolio ? { ...state.portfolio, ...action.payload } : null,
      };
    case 'SET_SELECTED_SYMBOL':
      return {
        ...state,
        selectedSymbol: action.payload,
      };
    case 'ADD_TO_WATCHLIST':
      return {
        ...state,
        watchlist: [...new Set([...state.watchlist, action.payload])],
      };
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter(symbol => symbol !== action.payload),
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

interface TradingContextType extends TradingState {
  loadPortfolio: () => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateMarketData: () => Promise<void>;
  setSelectedSymbol: (symbol: string | null) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  clearError: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function useTrading() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}

interface TradingProviderProps {
  children: ReactNode;
}

export function TradingProvider({ children }: TradingProviderProps) {
  const [state, dispatch] = useReducer(tradingReducer, initialState);

  // Load portfolio and market data on mount with parallel loading
  useEffect(() => {
    // Load data in parallel for faster initial load
    Promise.all([
      loadPortfolio(),
      updateMarketData()
    ]).catch(error => {
      console.error('Error during initial data load:', error);
    });

    // Set up market data polling with reduced frequency to improve performance
    const interval = setInterval(updateMarketData, 60000); // Update every 60 seconds (reduced from 30)
    return () => clearInterval(interval);
  }, []);

  const loadPortfolio = async () => {
    dispatch({ type: 'LOAD_PORTFOLIO_START' });

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/trading/portfolio', {
        signal: controller.signal,
        // Add cache headers for better performance
        headers: {
          'Cache-Control': 'max-age=30', // Cache for 30 seconds
        },
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load portfolio');
      }

      dispatch({
        type: 'LOAD_PORTFOLIO_SUCCESS',
        payload: data.portfolio,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Portfolio loading timed out');
      }
      dispatch({
        type: 'LOAD_PORTFOLIO_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to load portfolio',
      });
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    dispatch({ type: 'PLACE_ORDER_START' });

    try {
      const response = await fetch('/api/trading/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      dispatch({
        type: 'PLACE_ORDER_SUCCESS',
        payload: data.order,
      });

      // Award XP for executing trade
      const xpAmount = orderData.side === 'buy' ? 15 : 20; // More XP for selling (potentially profitable)
      await fetch('/api/gamification/xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'trade_executed',
          amount: xpAmount,
          description: `Executed ${orderData.side} order for ${orderData.symbol}`,
          metadata: {
            symbol: orderData.symbol,
            side: orderData.side,
            quantity: orderData.quantity,
            price: orderData.price
          },
        }),
      });

      // Reload portfolio to get updated data
      await loadPortfolio();
    } catch (error) {
      dispatch({
        type: 'PLACE_ORDER_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to place order',
      });
    }
  };

  const updateMarketData = async () => {
    try {
      // Add timeout and caching for market data requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch('/api/trading/market-data', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=60', // Cache for 60 seconds
        },
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: 'UPDATE_MARKET_DATA',
          payload: data.marketData || data.data, // Handle different response formats
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Market data update timed out');
      } else {
        console.error('Error updating market data:', error);
      }
    }
  };

  const setSelectedSymbol = (symbol: string | null) => {
    dispatch({ type: 'SET_SELECTED_SYMBOL', payload: symbol });
  };

  const addToWatchlist = (symbol: string) => {
    dispatch({ type: 'ADD_TO_WATCHLIST', payload: symbol });
  };

  const removeFromWatchlist = (symbol: string) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: symbol });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: TradingContextType = {
    ...state,
    loadPortfolio,
    placeOrder,
    updateMarketData,
    setSelectedSymbol,
    addToWatchlist,
    removeFromWatchlist,
    clearError,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}
