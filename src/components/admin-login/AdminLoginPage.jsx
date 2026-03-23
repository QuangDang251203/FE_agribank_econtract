import { useState } from 'react';
import agribankLogo from '../../assets/images/agribank_logo.png';
import adminLoginBackground from '../../assets/images/background_formLogin.png';
import { useAuth } from '../../context/AuthContext';
import '../../styles/adminLoginPage.css';

const ADMIN_LOGIN_STORAGE_KEY = 'adminLoginRemember';

function getRememberedAdminLogin() {
  try {
    const rawData = localStorage.getItem(ADMIN_LOGIN_STORAGE_KEY);
    if (!rawData) {
      return null;
    }

    const parsedData = JSON.parse(rawData);
    if (!parsedData?.username || !parsedData?.password) {
      return null;
    }

    return parsedData;
  } catch {
    return null;
  }
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="admin-login-eye-icon">
      <path
        d="M12 5c5.2 0 9.4 4.3 10.8 6-1.4 1.7-5.6 6-10.8 6S2.6 12.7 1.2 11C2.6 9.3 6.8 5 12 5Zm0 2C8.2 7 4.8 10 3.6 11c1.2 1 4.6 4 8.4 4s7.2-3 8.4-4c-1.2-1-4.6-4-8.4-4Zm0 1.8a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AdminLoginPage() {
  const [username, setUsername] = useState(() => getRememberedAdminLogin()?.username || '');
  const [password, setPassword] = useState(() => getRememberedAdminLogin()?.password || '');
  const [rememberMe, setRememberMe] = useState(() => Boolean(getRememberedAdminLogin()));
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login } = useAuth();

  const canSubmit = Boolean(username.trim() && password.trim());

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (username.trim() === 'admin' && password === 'admin') {
      if (rememberMe) {
        localStorage.setItem(
          ADMIN_LOGIN_STORAGE_KEY,
          JSON.stringify({
            username: 'admin',
            password: 'admin',
          })
        );
      } else {
        localStorage.removeItem(ADMIN_LOGIN_STORAGE_KEY);
      }

      login({
        businessCode: 'ADMIN',
        username: 'admin',
        role: 0,
      });

      window.history.pushState({}, '', '/admin/contracts');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    setLoginError('Sai thông tin tài khoản hoặc mật khẩu');
  };

  return (
    <main className="admin-login-page" style={{ backgroundImage: `url(${adminLoginBackground})` }}>
      <section className="admin-login-card" aria-label="Admin login">
        <img src={agribankLogo} alt="Agribank" className="admin-login-logo" />

        <h1 className="admin-login-title">Đăng nhập tài khoản</h1>

        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-login-field">
            <label htmlFor="admin-username" className="admin-login-label">
              Tài khoản Agribank
            </label>
            <input
              id="admin-username"
              type="text"
              className="admin-login-input"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                if (loginError) {
                  setLoginError('');
                }
              }}
              autoComplete="username"
              placeholder="admin"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password" className="admin-login-label">
              Mật khẩu
            </label>
            <div className="admin-login-password-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="admin-login-input admin-login-input--password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (loginError) {
                    setLoginError('');
                  }
                }}
                autoComplete="current-password"
                placeholder="*****"
              />
              <button
                type="button"
                className="admin-login-password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <EyeIcon />
              </button>
            </div>
            {loginError && (
              <p className="admin-login-error" role="alert">
                {loginError}
              </p>
            )}
          </div>

          <label className="admin-login-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            Ghi nhớ đăng nhập
          </label>

          <button type="submit" className="admin-login-submit" disabled={!canSubmit}>
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;



