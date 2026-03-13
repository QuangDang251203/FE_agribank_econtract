/**
 * Authentication Context
 * Provides global authentication state management
 */

import { createContext, useState, useCallback, useContext } from 'react';

// Create AuthContext
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Login handler
   * @param {Object} userData - User data from backend
   */
  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
    
    // Store token in localStorage
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
    
    // Store businessCode in localStorage for later use
    if (userData.businessCode) {
      localStorage.setItem('businessCode', userData.businessCode);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
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

