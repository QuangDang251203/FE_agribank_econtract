import { useState } from 'react';
import agribankLogo from '../../assets/images/agribank_logo.png';
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

function LoginArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="button-icon">
      <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8.4 12h6.7m-2.6-2.7 2.7 2.7-2.7 2.7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CaptchaRefreshIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mini-icon">
      <path
        d="M15.5 6.7A6 6 0 1 0 16 10h-1.6a4.4 4.4 0 1 1-1-2.8l-2 2h4.6V4.6l-1.5 2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CaptchaAudioIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mini-icon">
      <path
        d="M8 7.2H5.6v5.6H8l3.4 2.7V4.5L8 7.2Zm6.1.1a3.9 3.9 0 0 1 0 5.4m1.7-7.1a6.2 6.2 0 0 1 0 8.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoginRightPanel() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    window.history.pushState({}, '', '/layout');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <section className="login-right-panel">
      <div className="right-top-actions">
        <button type="button" className="language-button">
          VIE <span>▾</span>
        </button>
        <button type="button" className="contact-button">
          Liên hệ
        </button>
      </div>

      <div className="login-form-wrap">
        <img src={agribankLogo} alt="Agribank" className="right-logo" />
        <p className="welcome-text">Chào mừng đến với</p>
        <h2>Hệ thống Internet Banking - Khách hàng tổ chức</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="orgCode">
            Mã Tổ chức <span className="required-mark">*</span>
          </label>
          <input id="orgCode" type="text" autoComplete="organization" />

          <label htmlFor="userName">
            Tên đăng nhập <span className="required-mark">*</span>
          </label>
          <input id="userName" type="text" autoComplete="username" />

          <label htmlFor="password">
            Mật khẩu <span className="required-mark">*</span>
          </label>
          <div className="password-row">
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" />
            <button
              type="button"
              className="eye-button"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              onClick={() => setShowPassword((value) => !value)}
            >
              <EyeIcon />
            </button>
          </div>

          <label htmlFor="captcha">
            Mã ngẫu nhiên <span className="required-mark">*</span>
          </label>
          <input id="captcha" type="text" />

          <div className="captcha-row">
            <div className="captcha-image" aria-label="Captcha image">
              <span>D</span>
              <span>Y</span>
              <span>P</span>
              <span>S</span>
              <span>8</span>
              <span>E</span>
              <span>E</span>
            </div>
            <div className="captcha-actions">
              <button type="button" className="captcha-action" aria-label="Refresh captcha">
                <CaptchaRefreshIcon />
              </button>
              <button type="button" className="captcha-action" aria-label="Play captcha audio">
                <CaptchaAudioIcon />
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            <LoginArrowIcon />
            <span>Đăng nhập</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginRightPanel;

