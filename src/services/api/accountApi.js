/**
 * Account API Service
 * Handles all account-related API calls (login, logout, etc.)
 */

import API_CONFIG from '../../config/api.config';

/**
 * Login API call
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.businessCode - Business code
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise} Response from backend
 */
export const loginApi = async (credentials) => {
  const { businessCode, username, password } = credentials;

  const requestBody = {
    businessCode,
    username,
    password,
  };

  try {
    console.log('📤 Sending login request:', requestBody);
    
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
      {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(requestBody),
        timeout: API_CONFIG.TIMEOUT,
      }
    );

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);

    const data = await response.json();
    
    console.log('📥 Backend Response Data:', data);

    if (!response.ok) {
      throw new Error(data.message || `Login failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ Login API error:', error);
    throw error;
  }
};

/**
 * Logout API call (if needed in the future)
 * @returns {Promise} Response from backend
 */
export const logoutApi = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/accounts/logout`,
      {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Logout failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  }
};

