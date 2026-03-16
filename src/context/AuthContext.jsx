/**
 * Authentication Context
 * Provides global authentication state management
 */

import { createContext, useState, useCallback, useContext } from 'react';

// Create AuthContext
const AuthContext = createContext();

const AUTH_USER_STORAGE_KEY = 'authUser';

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!rawUser) {
      return null;
    }

    const parsedUser = JSON.parse(rawUser);
    if (!parsedUser?.businessCode || !parsedUser?.username) {
      return null;
    }

    return parsedUser;
  } catch {
    return null;
  }
}

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredUser()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Login handler
   * @param {Object} userData - User data from backend
   */
  const login = useCallback((userData) => {
    const normalizedUser = {
      businessCode: userData?.businessCode || '',
      username: userData?.username || '',
      token: userData?.token || null,
      role: userData?.role ?? 1,
    };

    const canAuthenticate = Boolean(normalizedUser.businessCode && normalizedUser.username);

    setUser(normalizedUser);
    setIsAuthenticated(canAuthenticate);
    setError(null);

    if (canAuthenticate) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(normalizedUser));
    }
    
    // Store token in localStorage
    if (normalizedUser.token) {
      localStorage.setItem('authToken', normalizedUser.token);
    } else {
      localStorage.removeItem('authToken');
    }
    
    // Store businessCode in localStorage for later use
    if (normalizedUser.businessCode) {
      localStorage.setItem('businessCode', normalizedUser.businessCode);
    } else {
      localStorage.removeItem('businessCode');
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem('authToken');
    localStorage.removeItem('businessCode');
  }, []);

  /**
   * Set loading state
   */
  const setLoadingState = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  /**
   * Set error state
   */
  const setErrorState = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    setLoadingState,
    setErrorState,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use AuthContext
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

