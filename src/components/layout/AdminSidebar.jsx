import { useState } from 'react';
import '../../styles/adminSidebar.css';

function AdminSidebar({ selectedKey, onSelect }) {
  const [expandedItems, setExpandedItems] = useState({
    'business-customers': true, // Mở mặc định theo ảnh
  });

  const toggleExpand = (itemKey) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const handleSelect = (key) => {
    onSelect(key);
  };

  const menuItems = [
    {
      key: 'home',
      label: 'Trang chủ',
      icon: 'home',
      onClick: () => handleSelect('home'),
    },
    {
      key: 'personal-customers',
      label: 'Khách hàng cá nhân',
      icon: 'person',
      hasArrow: true,
      children: [
        { key: 'personal-list', label: 'Danh sách khách hàng' },
        { key: 'personal-create', label: 'Thêm khách hàng' },
      ],
    },
    {
      key: 'business-customers',
      label: 'Khách hàng doanh nghiệp',
      icon: 'business',
      hasArrow: true,
      children: [
        { key: 'business-list', label: 'Hợp đồng mở tài khoản' },
        { key: 'business-contract', label: 'Hợp đồng vay có thế chấp' },
        { key: 'business-support', label: 'Hợp đồng tài trợ thương mại' },
        { key: 'business-credit', label: 'Hợp đồng tín dụng khung' },
      ],
    },
    {
      key: 'documents',
      label: 'Quản lý văn bản',
      icon: 'document',
    },
    {
      key: 'settings',
      label: 'Cấu hình chung',
      icon: 'settings',
      hasArrow: true,
      children: [
        { key: 'settings-users', label: 'Quản lý người dùng' },
        { key: 'settings-permissions', label: 'Quyền hạn' },
      ],
    },
  ];

  const renderIcon = (iconName) => {
    const iconMap = {
      home: (
        <svg viewBox="0 0 24 24" className="admin-sidebar__icon">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      person: (
        <svg viewBox="0 0 24 24" className="admin-sidebar__icon">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      business: (
        <svg viewBox="0 0 24 24" className="admin-sidebar__icon">
          <path d="M12 7V3H2v18h20V7h-10zm6 10h-4v4h-4v-4H6v-4h4V9h4v4h4v4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      document: (
        <svg viewBox="0 0 24 24" className="admin-sidebar__icon">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      settings: (
        <svg viewBox="0 0 24 24" className="admin-sidebar__icon">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.1-.62l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    };
    return iconMap[iconName] || null;
  };

  return (
    <aside className="admin-sidebar">
      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => (
          <div key={item.key} className="admin-sidebar__item">
            <button
              className={`admin-sidebar__button ${
                selectedKey === item.key ? 'admin-sidebar__button--active' : ''
              }`}
              onClick={() => {
                if (item.children) {
                  toggleExpand(item.key);
                } else if (item.onClick) {
                  item.onClick();
                }
              }}
            >
              {renderIcon(item.icon)}
              <span className="admin-sidebar__label">{item.label}</span>
              {item.hasArrow && (
                <span className={`admin-sidebar__arrow ${expandedItems[item.key] ? 'admin-sidebar__arrow--open' : ''}`}>
                  <svg viewBox="0 0 24 24" className="admin-sidebar__arrow-icon">
                    <path d="M7 10l5 5 5-5z" fill="currentColor" />
                  </svg>
                </span>
              )}
            </button>

            {item.children && expandedItems[item.key] && (
              <div className="admin-sidebar__submenu">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    className={`admin-sidebar__subbutton ${selectedKey === child.key ? 'admin-sidebar__subbutton--active' : ''}`}
                    onClick={() => handleSelect(child.key)}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
