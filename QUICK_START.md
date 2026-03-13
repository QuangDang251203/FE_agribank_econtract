# 🚀 Quick Start - Authentication Integration

## 📦 Files Created/Modified

### ✅ Created Files
```
src/
├── config/
│   └── api.config.js                    # API configuration
├── context/
│   └── AuthContext.jsx                  # Auth state management
├── services/
│   └── api/
│       └── accountApi.js                # API calls
├── hooks/
│   └── useLogin.js                      # Login hook
├── utils/
│   └── auth.examples.js                 # Extension examples
└── AUTH_INTEGRATION_GUIDE.md            # Full documentation
```

### 📝 Modified Files
- `src/components/login/LoginRightPanel.jsx` - Added login logic
- `src/App.js` - Added AuthProvider wrapper
- `src/styles/loginRightPanel.css` - Added error message styles

---

## 🔌 Setup .env File

```env
# .env (create in project root)
REACT_APP_API_BASE_URL=http://localhost:8080
```

---

## 📚 Key Components

### 1. Use Auth Context in Any Component
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, loading, error } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome {user.username}</p>}
    </div>
  );
}
```

### 2. Use Login Hook in Forms
```javascript
import { useLogin } from '../hooks/useLogin';

function MyLoginForm() {
  const { handleLogin } = useLogin();
  
  const handleSubmit = async (credentials) => {
    const success = await handleLogin(credentials);
    if (success) {
      // Do something
    }
  };
}
```

### 3. Call API Directly
```javascript
import { loginApi } from '../services/api/accountApi';

async function loginUser() {
  const response = await loginApi({
    businessCode: '1234567890',
    username: 'admin',
    password: 'password123'
  });
}
```

---

## 🔄 Common Tasks

### Change API Base URL
Edit `src/config/api.config.js`:
```javascript
BASE_URL: 'https://api.yourdomain.com'
```

### Add New API Endpoint
1. Add to `api.config.js`:
```javascript
ENDPOINTS: {
  AUTH: {
    LOGIN: '/api/accounts/login',
    REGISTER: '/api/accounts/register', // NEW
  },
},
```

2. Add function in `accountApi.js`:
```javascript
export const registerApi = async (data) => {
  // Implementation
};
```

### Add Form Validation
Update `LoginRightPanel.jsx` `handleSubmit()`:
```javascript
if (!formData.businessCode) {
  setErrorState('Mã doanh nghiệp không được trống');
  return;
}
```

### Protect Routes
In `App.js`, routes automatically redirect to login if not authenticated.

### Add Remember Me
See `src/utils/auth.examples.js` → Example 2

### Add 2FA Support
See `src/utils/auth.examples.js` → Example 4

---

## 🛠️ Troubleshooting

### Backend CORS Issue
Backend needs to allow requests from frontend:
```java
// In Spring Boot
@Configuration
public class CorsConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
          .allowedOrigins("http://localhost:3000")
          .allowedMethods("GET", "POST", "PUT", "DELETE")
          .allowedHeaders("*")
          .allowCredentials(true);
      }
    };
  }
}
```

### Can't Login
1. Check `.env` file has correct `REACT_APP_API_BASE_URL`
2. Check backend is running
3. Open DevTools → Network → check login request/response
4. Check error message in browser console

### Token Not Persisting
Token is stored in `localStorage`. Check:
1. Browser's localStorage is enabled
2. No errors in console
3. Check if token is returned from backend

---

## 📊 Data Flow

```
User Input (Form)
    ↓
LoginRightPanel.handleSubmit()
    ↓
useLogin.handleLogin()
    ↓
accountApi.loginApi()
    ↓
Backend API Response
    ↓
Success: Auth Context.login(userData)
         → localStorage authToken
         → Navigate to /layout
         
Failure: Auth Context.setErrorState(error)
         → Display error message
```

---

## 🔒 Security Notes

✅ Token stored in localStorage (update to secure cookie if needed)
✅ Password sent over HTTPS (ensure in production)
✅ CORS validation on backend
⚠️ Implement token refresh if using JWT
⚠️ Add 2FA for higher security
⚠️ Validate all inputs on both frontend & backend

---

## 📞 Support

For detailed information, see:
- `AUTH_INTEGRATION_GUIDE.md` - Full documentation
- `auth.examples.js` - Code examples for extensions
- Backend code provided - AccountController, AccountService, AccountDTO

---

**Last Updated**: March 13, 2026

