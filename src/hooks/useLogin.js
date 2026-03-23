/**
 * useLogin Hook
 * Custom hook for handling login logic
 * Provides a clean interface for components to use login functionality
 */

import { useCallback } from 'react';
import { loginApi } from '../services/api/accountApi';
import { useAuth } from '../context/AuthContext';

/**
 * useLogin hook
 * @returns {Object} Login handler and state
 */
export function useLogin() {
  const { login, setLoadingState, setErrorState, clearError } = useAuth();

  /**
   * Handle login submission
   * @param {Object} credentials - User credentials
   * @returns {Promise<boolean>} Success status
   */
  const handleLogin = useCallback(
    async (credentials) => {
      try {
        setLoadingState(true);
        clearError();

        // Call login API
        const response = await loginApi(credentials);

        // Debug: Log response to see what backend returns
        console.log('✅ Backend Response:', response);

        // Check if response is successful - flexible checking
        const isSuccess = 
          response?.success === true || 
          response?.code === 200 || 
          response?.code === '200' ||
          (response?.message && response.message.toLowerCase().includes('success'));

        if (isSuccess) {
          // Extract user data from response (flexible extraction)
          const userData = {
            businessCode: credentials.businessCode,
            username: credentials.username,
            token: response?.data?.token || response?.token || null,
            role: response?.data?.role || response?.role || 1,
          };

          console.log('✅ User Data Set:', userData);

          // Update auth context
          login(userData);
          setLoadingState(false);

          return true;
        } else {
          // Not success - throw error
          const errorMsg = response?.message || response?.error || 'Đăng nhập thất bại';
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error('❌ Login error:', error);
        const errorMessage = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        setErrorState(errorMessage);
        setLoadingState(false);

        return false;
      }
    },
    [login, setLoadingState, setErrorState, clearError]
  );

  return {
    handleLogin,
  };
}

