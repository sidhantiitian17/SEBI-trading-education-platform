'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthTokens, LoginForm, RegisterForm } from '@/lib/types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
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

interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        if (typeof window === 'undefined') return; // SSR safety check
        
        const storedUser = localStorage.getItem('user');
        const storedTokens = localStorage.getItem('tokens');

        if (storedUser && storedTokens) {
          const user = JSON.parse(storedUser);
          const tokens = JSON.parse(storedTokens);

          // Check if token is still valid
          if (tokens.expiresIn && tokens.expiresIn > Date.now()) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user, tokens },
            });
          } else {
            // Token expired, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('tokens');
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
        }
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage when authenticated
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safety check
    
    if (state.isAuthenticated && state.user && state.tokens) {
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('tokens', JSON.stringify(state.tokens));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
    }
  }, [state.isAuthenticated, state.user, state.tokens]);

  const login = async (credentials: LoginForm) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: data.user,
          tokens: data.tokens,
        },
      });

      // Award XP for daily login
      let xpAmount = 50; // Base daily login XP
      const lastLogin = new Date(data.user.lastLogin);
      const today = new Date();
      const daysSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

      // Bonus for consecutive days
      if (daysSinceLastLogin === 1) {
        xpAmount = 75; // Consecutive day bonus
      } else if (daysSinceLastLogin === 0) {
        xpAmount = 25; // Same day login (reduced)
      }

      await fetch('/api/gamification/xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'daily_login',
          amount: xpAmount,
          description: daysSinceLastLogin === 1 ? 'Consecutive daily login bonus!' : 'Daily login bonus',
          metadata: { consecutiveDays: daysSinceLastLogin === 1 },
        }),
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  const register = async (userData: RegisterForm) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: data.user,
          tokens: data.tokens,
        },
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user || !state.tokens) return;

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.tokens.accessToken}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Profile update failed');
      }

      dispatch({
        type: 'UPDATE_USER',
        payload: data.user,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      // You might want to show a toast notification here
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
