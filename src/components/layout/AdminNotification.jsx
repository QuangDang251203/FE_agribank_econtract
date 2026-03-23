import { useState } from 'react';
import '../../styles/adminNotification.css';

function AdminNotification() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="admin-notification">
      <div className="admin-notification__content">
        <div className="admin-notification__icon">
          <svg viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
          </svg>
        </div>
        <div className="admin-notification__text">
          <div className="admin-notification__title">Đăng nhập thành công</div>
          <div className="admin-notification__message">Chào mừng bạn đến với hệ thống quản trị!</div>
        </div>
        <button 
          className="admin-notification__close" 
          aria-label="Đóng thông báo"
          onClick={() => setIsVisible(false)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AdminNotification;


