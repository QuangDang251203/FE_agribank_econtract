/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

const API_CONFIG = {
  // Base URL - Change this based on your environment
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',

  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/accounts/login',
    },
  },

  // HTTP Headers
  HEADERS: {
    'Content-Type': 'application/json',
  },

  // Timeout (ms)
  TIMEOUT: 30000,
};

export default API_CONFIG;

