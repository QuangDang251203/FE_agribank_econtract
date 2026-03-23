# Authentication Integration Guide

## 📋 Tổng Quan Cấu Trúc

Hệ thống authentication đã được tích hợp với cấu trúc rõ ràng, dễ bảo trì và mở rộng.

### Cây Thư Mục
```
src/
├── config/
│   └── api.config.js              # Cấu hình API (endpoints, base URL, headers)
├── context/
│   └── AuthContext.jsx             # Auth Context Provider (quản lý state auth)
├── services/
│   └── api/
│       └── accountApi.js           # API calls cho Account (login, logout)
├── hooks/
│   └── useLogin.js                 # Custom hook cho login logic
├── components/
│   └── login/
│       ├── LoginPage.jsx           # Login page container
│       └── LoginRightPanel.jsx     # Form đăng nhập (updated)
└── App.js                          # Main app (updated with AuthProvider)
```

---

## 🔧 Chi Tiết Từng File

### 1. **config/api.config.js**
**Mục đích**: Tập trung hóa cấu hình API

```javascript
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/accounts/login',
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
  TIMEOUT: 30000,
};
```

**Cách sử dụng khi cần thay đổi**:
- Thay đổi `BASE_URL` để chuyển sang server khác
- Thêm endpoint mới vào `ENDPOINTS` khi cần
- Cập nhật `HEADERS` nếu cần thêm authorization

### 2. **context/AuthContext.jsx**
**Mục đích**: Quản lý global authentication state

**State bao gồm**:
- `user` - Thông tin user đã đăng nhập
- `isAuthenticated` - Trạng thái xác thực
- `loading` - Trạng thái đang tải
- `error` - Thông báo lỗi

**Functions cung cấp**:
- `login(userData)` - Set user sau khi đăng nhập thành công
- `logout()` - Xóa user và reset state
- `setLoadingState(boolean)` - Cập nhật loading state
- `setErrorState(message)` - Set error message
- `clearError()` - Xóa error message

**Sử dụng**:
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, loading, error } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome {user.username}</p>}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### 3. **services/api/accountApi.js**
**Mục đích**: Xử lý tất cả API calls liên quan tới account

**Functions**:
- `loginApi(credentials)` - Gọi API login
  - Input: `{ businessCode, username, password }`
  - Output: Response từ backend
  
- `logoutApi()` - Gọi API logout (chuẩn bị cho tương lai)

**Cách mở rộng**:
```javascript
// Thêm function mới
export const changePasswordApi = async (oldPassword, newPassword) => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/api/accounts/change-password`,
    {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ oldPassword, newPassword }),
    }
  );
  // ... xử lý response
};
```

### 4. **hooks/useLogin.js**
**Mục đích**: Custom hook chứa logic đăng nhập

**Điểm chính**:
- Gọi API thông qua `loginApi()`
- Cập nhật auth context sau khi đăng nhập thành công
- Xử lý error messages
- Trả về hàm `handleLogin()` để sử dụng trong form

**Ví dụ sử dụng**:
```javascript
function MyLoginForm() {
  const { handleLogin } = useLogin();
  
  const onSubmit = async (credentials) => {
    const success = await handleLogin(credentials);
    if (success) {
      // Chuyển trang hoặc làm gì đó
    }
  };
}
```

### 5. **components/login/LoginRightPanel.jsx** (Updated)
**Thay đổi**:
- ✅ Thêm state `formData` để lưu input
- ✅ Thêm `handleInputChange()` để cập nhật form
- ✅ Thêm `handleSubmit()` để gọi login API
- ✅ Thêm error message display
- ✅ Thêm loading state trên button
- ✅ Bind input values với formData

### 6. **App.js** (Updated)
**Thay đổi**:
- ✅ Wrap ứng dụng với `<AuthProvider>`
- ✅ Tách `AppContent` component để sử dụng `useAuth()` hook
- ✅ Thêm route protection: redirect to login nếu chưa auth

---

## 🚀 Hướng Dẫn Sử Dụng

### Setup Môi Trường
Tạo file `.env` trong project root:
```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

### Quy Trình Đăng Nhập
1. User nhập credentials vào form
2. Click "Đăng nhập"
3. `handleSubmit()` validate input
4. Gọi `handleLogin(formData)`
5. `handleLogin()` gọi API `loginApi()`
6. Response xử lý:
   - ✅ Success: Lưu user vào context, navigate to `/layout`
   - ❌ Error: Hiển thị error message

### Kiểm Tra Auth Trong Component
```javascript
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <h1>Welcome {user.username}</h1>;
}
```

---

## 📝 Backend Integration Notes

### Expected Response Format

**Success (200/201)**:
```json
{
  "success": true,
  "code": 200,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN_HERE",
    "role": "ADMIN",
    "username": "admin"
  }
}
```

**Error (4xx/5xx)**:
```json
{
  "success": false,
  "code": 400,
  "message": "Password or username incorrect"
}
```

### Nếu Backend Response Format Khác

Update hàm `handleLogin()` trong `useLogin.js`:

```javascript
// Ví dụ: nếu backend return khác format
const response = await loginApi(credentials);

// Thay đổi logic check response
if (response.status === 'OK' || response.isSuccess) {  // Thay 'success' thành field khác
  const userData = {
    businessCode: credentials.businessCode,
    username: credentials.username,
    token: response.accessToken,  // Thay 'data.token' thành field khác
    role: response.userRole,       // Thay đổi field khác nếu cần
  };
  // ... rest of code
}
```

---

## 🔒 Security Best Practices

### 1. **Token Storage**
Hiện tại token được lưu trong localStorage. Nếu cần bảo mật cao hơn:
```javascript
// Dùng secure cookie thay vì localStorage
// import { useCookies } from 'react-cookie';

const [cookies, setCookie] = useCookies(['authToken']);
setCookie('authToken', userData.token, { 
  httpOnly: true,  // Ko thể access từ JS
  secure: true,    // Chỉ HTTPS
  sameSite: 'strict'
});
```

### 2. **Token Trong Headers**
Cần thêm Authorization header cho các API calls:
```javascript
// Cập nhật accountApi.js
const token = localStorage.getItem('authToken');
const headers = {
  ...API_CONFIG.HEADERS,
  'Authorization': `Bearer ${token}`,
};
```

### 3. **Refresh Token**
Nếu backend support refresh token:
```javascript
// Tạo interceptor để auto refresh
export const fetchWithAuth = async (url, options = {}) => {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (response.status === 401) {
    // Refresh token
    await refreshToken();
    // Retry request
    response = await fetch(url, { /* ... */ });
  }

  return response;
};
```

---

## 🐛 Troubleshooting

### Problem: "AuthContext must be used within AuthProvider"
**Giải pháp**: 
- Kiểm tra App.js có wrap component bằng `<AuthProvider>` không

### Problem: Login button không work
**Kiểm tra**:
1. Kiểm tra API_CONFIG.BASE_URL có đúng không
2. Backend server có chạy không
3. CORS policy - backend cần cho phép requests từ frontend
4. Mở DevTools → Network tab → xem request/response

### Problem: Form inputs không update
**Giải pháp**:
- Kiểm tra `handleInputChange()` có gán đúng field name không
- Check fieldMap object ánh xạ đúng input ID

---

## 🔄 Cách Update Sau Này

### Thêm Field Mới Vào Login Form
1. Thêm field vào LoginRightPanel.jsx
2. Thêm key vào formData state
3. Update fieldMap trong handleInputChange()
4. Update loginApi() để gửi field mới

### Thêm Endpoint Mới
1. Thêm vào `API_CONFIG.ENDPOINTS`
2. Tạo function mới trong `services/api/accountApi.js`
3. Tạo custom hook nếu cần (ví dụ `useRegister`)

### Thêm Validation
```javascript
// Trong LoginRightPanel.jsx handleSubmit()
const validate = () => {
  if (!formData.businessCode.trim()) {
    setErrorState('Mã doanh nghiệp không được trống');
    return false;
  }
  if (formData.password.length < 6) {
    setErrorState('Mật khẩu ít nhất 6 ký tự');
    return false;
  }
  return true;
};

if (!validate()) return;
```

---

## 📚 Tham Khảo

- **React Context API**: https://react.dev/reference/react/useContext
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **localStorage**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Last Updated**: March 13, 2026
**Author**: AI Assistant

