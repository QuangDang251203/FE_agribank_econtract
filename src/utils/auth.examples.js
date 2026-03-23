/**
 * EXAMPLE: Extended Authentication Features
 * This file shows common authentication extensions
 * Copy and modify these examples for your needs
 */

/**
 * ============================================
 * EXAMPLE 1: Add Input Validation
 * ============================================
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  // Validate business code
  if (!formData.businessCode?.trim()) {
    errors.businessCode = 'Mã doanh nghiệp không được trống';
  } else if (!/^\d{10}$/.test(formData.businessCode)) {
    errors.businessCode = 'Mã doanh nghiệp phải là 10 chữ số';
  }

  // Validate username
  if (!formData.username?.trim()) {
    errors.username = 'Tên đăng nhập không được trống';
  } else if (formData.username.length < 3) {
    errors.username = 'Tên đăng nhập ít nhất 3 ký tự';
  }

  // Validate password
  if (!formData.password) {
    errors.password = 'Mật khẩu không được trống';
  } else if (formData.password.length < 6) {
    errors.password = 'Mật khẩu ít nhất 6 ký tự';
  }

  return errors;
};

/**
 * ============================================
 * EXAMPLE 2: Add Remember Me Functionality
 * ============================================
 */
export const saveCredentials = (businessCode, username) => {
  localStorage.setItem('savedBusinessCode', businessCode);
  localStorage.setItem('savedUsername', username);
};

export const getSavedCredentials = () => {
  return {
    businessCode: localStorage.getItem('savedBusinessCode') || '',
    username: localStorage.getItem('savedUsername') || '',
  };
};

export const clearSavedCredentials = () => {
  localStorage.removeItem('savedBusinessCode');
  localStorage.removeItem('savedUsername');
};

/**
 * ============================================
 * EXAMPLE 3: Add Automatic Token Refresh
 * ============================================
 */
export const setupTokenRefresh = (refreshToken, expiresIn) => {
  // Refresh token 1 minute before expiration
  const refreshTime = (expiresIn - 60) * 1000;

  const timeoutId = setTimeout(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('authToken', data.data.token);
        // Recursively setup next refresh
        setupTokenRefresh(data.data.refreshToken, data.data.expiresIn);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }, refreshTime);

  return timeoutId;
};

/**
 * ============================================
 * EXAMPLE 4: Add 2FA (Two Factor Authentication)
 * ============================================
 */
export const initiate2FA = async (businessCode, username) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/accounts/initiate-2fa`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessCode, username }),
      }
    );

    return await response.json();
  } catch (error) {
    throw new Error('Failed to initiate 2FA: ' + error.message);
  }
};

export const verify2FA = async (tempToken, code) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/accounts/verify-2fa`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code }),
      }
    );

    return await response.json();
  } catch (error) {
    throw new Error('2FA verification failed: ' + error.message);
  }
};

/**
 * ============================================
 * EXAMPLE 5: Add Account Lockout Detection
 * ============================================
 */
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const checkAccountLockout = (businessCode) => {
  const key = `login_attempts_${businessCode}`;
  const data = JSON.parse(localStorage.getItem(key) || '{"attempts": 0, "lockedUntil": 0}');

  const now = Date.now();
  if (data.lockedUntil > now) {
    const remainingTime = Math.ceil((data.lockedUntil - now) / 1000 / 60);
    return {
      isLocked: true,
      remainingMinutes: remainingTime,
    };
  }

  return { isLocked: false };
};

export const recordFailedLogin = (businessCode) => {
  const key = `login_attempts_${businessCode}`;
  const data = JSON.parse(localStorage.getItem(key) || '{"attempts": 0, "lockedUntil": 0}');

  data.attempts += 1;

  if (data.attempts >= MAX_LOGIN_ATTEMPTS) {
    data.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }

  localStorage.setItem(key, JSON.stringify(data));
};

export const clearLoginAttempts = (businessCode) => {
  const key = `login_attempts_${businessCode}`;
  localStorage.setItem(key, JSON.stringify({ attempts: 0, lockedUntil: 0 }));
};

/**
 * ============================================
 * EXAMPLE 6: Add Audit Logging
 * ============================================
 */
export const logLoginAttempt = (businessCode, username, success, error = null) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    businessCode,
    username,
    success,
    error,
    userAgent: navigator.userAgent,
    ipAddress: null, // Backend should provide this
  };

  // Send to backend for audit trail
  fetch(`${process.env.REACT_APP_API_BASE_URL}/api/audit/log-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logEntry),
  }).catch((err) => console.error('Audit logging failed:', err));
};

/**
 * ============================================
 * EXAMPLE 7: How to Use in LoginRightPanel
 * ============================================
 */

/*
// In LoginRightPanel.jsx:

import { validateLoginForm, checkAccountLockout, recordFailedLogin, clearLoginAttempts } from './login.examples';

function LoginRightPanel() {
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  
  // ... other state

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Check for lockout
    const lockout = checkAccountLockout(formData.businessCode);
    if (lockout.isLocked) {
      setError(`Tài khoản bị khóa. Thử lại trong ${lockout.remainingMinutes} phút`);
      return;
    }

    // 2. Validate form
    const errors = validateLoginForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // 3. Login
    const success = await handleLogin(formData);

    if (success) {
      // Clear login attempts
      clearLoginAttempts(formData.businessCode);
      
      // Save credentials if needed
      if (rememberMe) {
        saveCredentials(formData.businessCode, formData.username);
      }

      // Navigate
      window.history.pushState({}, '', '/layout');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // Record failed attempt
      recordFailedLogin(formData.businessCode);
    }
  };

  // Load saved credentials on mount
  useEffect(() => {
    const saved = getSavedCredentials();
    if (saved.businessCode) {
      setFormData(prev => ({
        ...prev,
        businessCode: saved.businessCode,
        username: saved.username,
      }));
    }
  }, []);
}
*/

/**
 * ============================================
 * EXAMPLE 8: Create Protected API Hook
 * ============================================
 */
export const useProtectedFetch = () => {
  return async (url, options = {}) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 - token expired
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  };
};

