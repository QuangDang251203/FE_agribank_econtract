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
    CONTRACT: {
      CREATE: '/api/contract/createContract',
      CREATE_AND_GENERATE: '/api/contract/createAndGenerateContract',
      MONEY_TO_WORDS: '/api/contract/money-to-words',
      GENERATE_AND_DOWNLOAD: '/api/contract/generate-and-download',
      SEND_OTP: '/api/contract/send-otp',
      SIGN_CONTRACT: '/api/contract/signContract',
    },
    BANK_ACCOUNT: {
      GET_BY_BUSINESS_CODE: '/api/bank-accounts/getBankAccountByBusinessCode',
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

