import { useState } from 'react';
import agribankLogo from '../../assets/images/agribank_logo.png';
import { useAuth } from '../../context/AuthContext';
import { useLogin } from '../../hooks/useLogin';
import '../../styles/loginRightPanel.css';

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="login-icon">
      <path
        d="M12 5c5.2 0 9.4 4.3 10.8 6-1.4 1.7-5.6 6-10.8 6S2.6 12.7 1.2 11C2.6 9.3 6.8 5 12 5Zm0 2C8.2 7 4.8 10 3.6 11c1.2 1 4.6 4 8.4 4s7.2-3 8.4-4c-1.2-1-4.6-4-8.4-4Zm0 1.8a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LoginRightPanel() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessCode: '',
    username: '',
    password: '',
  });

  const { loading, error, clearError } = useAuth();
  const { handleLogin } = useLogin();

  /**
   * Handle input change
   */
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    
    // Map input IDs to formData keys
    const fieldMap = {
      orgCode: 'businessCode',
      userName: 'username',
      password: 'password',
    };

    const fieldName = fieldMap[id];
    if (fieldName) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();

    // Validate inputs
    if (!formData.businessCode || !formData.username || !formData.password) {
      // You can add a validation error here
      return;
    }

    // Call login handler
    const success = await handleLogin(formData);

    if (success) {
      // Navigate to layout page on successful login
      window.history.pushState({}, '', '/layout');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section className="login-right">
      <div className="login-right__content">
        <img src={agribankLogo} alt="Agribank" className="login-right__logo" />

        <div className="login-right__heading">
          <h1 className="login-right__title">Đăng nhập</h1>
          <p className="login-right__subtitle">Hệ thống Internet banking - Khách hàng doanh nghiệp</p>
        </div>

        {error && (
          <div className="login-right__error-message" role="alert">
            {error}
          </div>
        )}

        <form className="login-right__form" onSubmit={handleSubmit} noValidate>
          <div className="login-right__field">
            <label htmlFor="orgCode" className="login-right__label">
              Mã doanh nghiệp <span className="login-right__required">*</span>
            </label>
            <input
              id="orgCode"
              type="text"
              className="login-right__input"
              autoComplete="organization"
              placeholder="Vui lòng nhập mã doanh nghiệp"
              value={formData.businessCode}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div className="login-right__field">
            <label htmlFor="userName" className="login-right__label">
              Tên đăng nhập <span className="login-right__required">*</span>
            </label>
            <input
              id="userName"
              type="text"
              className="login-right__input"
              autoComplete="username"
              placeholder="Vui lòng nhập tài khoản"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div className="login-right__field">
            <label htmlFor="password" className="login-right__label">
              Mật khẩu <span className="login-right__required">*</span>
            </label>
            <div className="login-right__password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-right__input login-right__input--password"
                autoComplete="current-password"
                placeholder="Vui lòng nhập mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            <button
              type="button"
              className="login-right__password-toggle"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              onClick={() => setShowPassword((value) => !value)}
            >
              <EyeIcon />
            </button>
            </div>
          </div>

          <div className="login-right__captcha-row">
            <div className="login-right__captcha-column login-right__captcha-column--input">
              <label htmlFor="captcha" className="login-right__label">
                Mã xác thực <span className="login-right__required">*</span>
              </label>
              <input
                id="captcha"
                type="text"
                className="login-right__input login-right__input--captcha"
                placeholder="Nhập mã captcha"
              />
            </div>

            <div className="login-right__captcha-column login-right__captcha-column--visual">
              <span className="login-right__label">
                Mã xác thực <span className="login-right__required">*</span>
              </span>
              <div className="login-right__captcha-image" aria-label="Captcha image">
                <span>T</span>
                <span>d</span>
                <span>4</span>
                <span>e</span>
                <span>v</span>
                <span>a</span>
              </div>
            </div>
          </div>

          <button type="submit" className="login-right__submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginRightPanel;

