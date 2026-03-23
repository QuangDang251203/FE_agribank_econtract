# 🎯 Authentication Integration - Visual Guide

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN PAGE (UI)                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ LoginRightPanel.jsx                                      │  │
│  │ - Input fields                                           │  │
│  │ - Submit button                                          │  │
│  │ - Error message display                                  │  │
│  │ - Loading state indicator                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    User clicks "Đăng nhập"
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ handleSubmit() (in LoginRightPanel)                      │  │
│  │ 1. Prevent default form behavior                         │  │
│  │ 2. Validate inputs (basic check)                         │  │
│  │ 3. Clear previous errors                                 │  │
│  │ 4. Call handleLogin() from useLogin hook                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CUSTOM HOOK LAYER                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ useLogin Hook (src/hooks/useLogin.js)                    │  │
│  │                                                          │  │
│  │ 1. Set loading = true                                   │  │
│  │ 2. Clear previous errors                                │  │
│  │ 3. Call loginApi(credentials)                           │  │
│  │ 4. Handle response:                                     │  │
│  │    - If success: login(userData) & return true         │  │
│  │    - If error: setErrorState(message) & return false   │  │
│  │ 5. Set loading = false                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ AuthContext.jsx                                          │  │
│  │                                                          │  │
│  │ Updates:                                                │  │
│  │ - user = userData                                       │  │
│  │ - isAuthenticated = true                                │  │
│  │ - error = null                                          │  │
│  │ - loading = false                                       │  │
│  │                                                          │  │
│  │ Also saves token to localStorage                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NETWORK/API LAYER                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ accountApi.js → loginApi()                               │  │
│  │                                                          │  │
│  │ POST /api/accounts/login                                │  │
│  │ {                                                        │  │
│  │   "businessCode": "1234567890",                         │  │
│  │   "username": "admin",                                  │  │
│  │   "password": "password123"                             │  │
│  │ }                                                        │  │
│  │                                                          │  │
│  │ Using config from api.config.js                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                ┌────────────┴──────────────┐
                │                           │
            SUCCESS                      FAILURE
            (HTTP 200)                  (HTTP 400/401)
                │                           │
                ▼                           ▼
         ┌──────────────┐           ┌──────────────┐
         │ Response:    │           │ Response:    │
         │ {            │           │ {            │
         │  "success":  │           │  "success":  │
         │    true,     │           │    false,    │
         │  "data": {   │           │  "message":  │
         │    "token"   │           │    "error"   │
         │  }           │           │  }           │
         │ }            │           │ }            │
         └──────────────┘           └──────────────┘
                │                           │
                ▼                           ▼
         ┌──────────────┐           ┌──────────────┐
         │ Auth Context │           │ Auth Context │
         │ login()      │           │ setError()   │
         │ called       │           │ called       │
         │              │           │              │
         │ Updates:     │           │ Updates:     │
         │ - user       │           │ - error msg  │
         │ - isAuth=✓   │           │ - loading=✗  │
         │ - token      │           │              │
         └──────────────┘           └──────────────┘
                │                           │
                ▼                           ▼
         ┌──────────────┐           ┌──────────────┐
         │ Navigate to  │           │ Display      │
         │ /layout      │           │ error        │
         │              │           │ message      │
         │ App.js       │           │              │
         │ checks auth  │           │ User can     │
         │ → renders    │           │ retry        │
         │ AppLayout    │           │              │
         └──────────────┘           └──────────────┘
```

---

## Architecture Layers

```
                    ┌─────────────────────────────┐
                    │   React Components (UI)     │
                    │   LoginRightPanel.jsx       │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   Custom Hooks             │
                    │   useLogin.js              │
                    │   useAuth.js               │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   Context API              │
                    │   AuthContext.jsx          │
                    │   Global State             │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   API Services             │
                    │   accountApi.js            │
                    │   Call endpoints           │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   Configuration            │
                    │   api.config.js            │
                    │   Base URL, endpoints      │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   Backend API              │
                    │   Spring Boot              │
                    │   /api/accounts/login      │
                    └─────────────────────────────┘
```

---

## State Management

```
                   ┌─────────────────────────────┐
                   │  AuthContext State          │
                   │                             │
                   │  ┌───────────────────────┐  │
                   │  │ user                  │  │
                   │  │ {                     │  │
                   │  │   username: "admin"   │  │
                   │  │   businessCode: "..."│  │
                   │  │   token: "jwt..."     │  │
                   │  │   role: "ADMIN"       │  │
                   │  │ }                     │  │
                   │  └───────────────────────┘  │
                   │                             │
                   │  ┌───────────────────────┐  │
                   │  │ isAuthenticated       │  │
                   │  │ true/false            │  │
                   │  └───────────────────────┘  │
                   │                             │
                   │  ┌───────────────────────┐  │
                   │  │ loading               │  │
                   │  │ true = Login in progress
                   │  │ false = Ready         │  │
                   │  └───────────────────────┘  │
                   │                             │
                   │  ┌───────────────────────┐  │
                   │  │ error                 │  │
                   │  │ "Error message"       │  │
                   │  │ null = No error       │  │
                   │  └───────────────────────┘  │
                   │                             │
                   │  ┌───────────────────────┐  │
                   │  │ Methods:              │  │
                   │  │ - login()             │  │
                   │  │ - logout()            │  │
                   │  │ - setLoadingState()   │  │
                   │  │ - setErrorState()     │  │
                   │  │ - clearError()        │  │
                   │  └───────────────────────┘  │
                   │                             │
                   └─────────────────────────────┘
                              │
                 ┌────────────┴───────────────┐
                 │                            │
            Use in any Component         Access with
                 │                         useAuth()
                 │                            │
                 ▼                            ▼
         ┌──────────────────┐        ┌──────────────┐
         │ const { user,    │        │ if (isAuth)  │
         │   isAuthenticated,   │   { render page  │
         │   loading,       │        │ }            │
         │   error }        │        │              │
         │   = useAuth()    │        │ <Sidebar/>   │
         │                  │        │   shows      │
         │                  │        │ username:    │
         │                  │        │ {user.usern.}
         └──────────────────┘        └──────────────┘
```

---

## Login Form Flow

```
                     ┌─────────────────────┐
                     │   Login Form Render │
                     └──────────┬──────────┘
                                │
                    ┌───────────┴──────────┐
                    │                      │
              ┌─────▼─────┐        ┌──────▼────────┐
              │ Input 1:  │        │ Input 2:       │
              │ orgCode   │        │ userName       │
              │ ├─────────┼────────┤ ├──────────────┤
              │ value: "" │        │ value: ""      │
              │ onChange  │        │ onChange       │
              └─────┬─────┘        └───────┬────────┘
                    │                      │
                    └──────────┬───────────┘
                               │
                        ┌──────▼─────┐
                        │ Input 3:    │
                        │ password    │
                        ├─────────────┤
                        │ value: ""   │
                        │ onChange    │
                        └──────┬──────┘
                               │
                 ┌─────────────┴──────────────┐
                 │                            │
              [Show Pass]                 [Password]
              Click to toggle             toggle visibility
                 │                            │
                 └─────────────┬──────────────┘
                               │
                        ┌──────▼──────────┐
                        │ Click "Đăng nhập"│
                        └──────┬──────────┘
                               │
                        ┌──────▼──────────────────────┐
                        │ handleSubmit() triggered    │
                        │                             │
                        │ 1. preventDefault()         │
                        │ 2. clearError()             │
                        │ 3. Validate inputs          │
                        │ 4. handleLogin()            │
                        └──────┬──────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
         ┌──────▼──────┐            ┌────────▼─────┐
         │ Valid Input │            │ Invalid Input │
         └──────┬──────┘            └────────┬─────┘
                │                           │
                ▼                           ▼
          ┌─────────────┐           ┌──────────────┐
          │ API Request │           │ Show Error   │
          │ Set loading │           │ "Please fill │
          │ = true      │           │ all fields"  │
          │             │           │ loading=false
          │ Button:     │           │              │
          │ "Đang ..."  │           │ Return early │
          │ Inputs:     │           └──────────────┘
          │ disabled    │
          └──────┬──────┘
                 │
     ┌───────────┴────────────┐
     │                        │
  SUCCESS               FAILURE
  (valid response)    (error response)
     │                        │
     ▼                        ▼
 ┌─────────────┐        ┌───────────────┐
 │ login()     │        │ setErrorState()
 │ called      │        │               │
 │             │        │ error display │
 │ Updates:    │        │ button ready  │
 │ - user data │        │ inputs ready  │
 │ - token     │        │               │
 │ - isAuth=✓  │        │ User can retry
 │             │        │               │
 │ Navigate to │        └───────────────┘
 │ /layout     │
 └─────────────┘
```

---

## File Dependencies

```
LoginRightPanel.jsx
    │
    ├── imports useAuth()
    │   └── from AuthContext.jsx
    │
    ├── imports useLogin()
    │   └── from useLogin.js
    │       └── imports loginApi()
    │           └── from accountApi.js
    │               └── imports API_CONFIG
    │                   └── from api.config.js
    │
    └── imports styles
        └── loginRightPanel.css


App.js
    │
    ├── imports AuthProvider
    │   └── from AuthContext.jsx
    │
    ├── imports useAuth()
    │   └── from AuthContext.jsx
    │
    ├── wraps with <AuthProvider>
    │
    └── renders AppContent component


useLogin.js
    │
    ├── imports useAuth
    │   └── from AuthContext.jsx
    │
    └── imports loginApi
        └── from accountApi.js
            └── imports API_CONFIG
                └── from api.config.js


accountApi.js
    │
    └── imports API_CONFIG
        └── from api.config.js
```

---

## Response Format

```
┌─────────────────────────────────────────────────────────────┐
│                   LOGIN SUCCESS (200)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  {                                                          │
│    "success": true,                                         │
│    "code": 200,                                             │
│    "message": "Login successful",                           │
│    "data": {                                                │
│      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  │
│      "role": "ADMIN",                                       │
│      "username": "admin"                                    │
│    }                                                        │
│  }                                                          │
│                                                             │
│  ↓                                                          │
│                                                             │
│  Extracted to userData:                                     │
│  {                                                          │
│    businessCode: "1234567890"                              │
│    username: "admin"                                        │
│    token: "eyJhbGci..."                                     │
│    role: "ADMIN"                                            │
│  }                                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   LOGIN FAILURE (400/401)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  {                                                          │
│    "success": false,                                        │
│    "code": 400,                                             │
│    "message": "Password or username incorrect"              │
│  }                                                          │
│                                                             │
│  ↓                                                          │
│                                                             │
│  Error message displayed to user:                          │
│  "Password or username incorrect"                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

```
┌─────────────────────────────────────────────────────────────┐
│               api.config.js Configuration                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BASE_URL:                                                  │
│  ├─ Development: http://localhost:8080                     │
│  ├─ Staging: https://staging-api.agribank.com             │
│  └─ Production: https://api.agribank.com                  │
│                                                             │
│  ENDPOINTS:                                                │
│  ├─ AUTH:                                                  │
│  │  ├─ LOGIN: /api/accounts/login                          │
│  │  └─ LOGOUT: /api/accounts/logout (future)              │
│  │                                                         │
│  HEADERS:                                                  │
│  └─ Content-Type: application/json                        │
│                                                             │
│  TIMEOUT: 30000ms (30 seconds)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*Visual Guide Complete* ✅

