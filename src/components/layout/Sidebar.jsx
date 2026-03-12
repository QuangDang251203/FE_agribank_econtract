import '../../styles/sidebar.css';
import { sidebarItems } from './sidebarConfig';

function SidebarArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="home-sidebar__arrow-icon">
      <path
        d="M6 3.8 10.7 8 6 12.2l-.9-1L8.6 8 5.1 4.8 6 3.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SidebarIcon({ type }) {
  const props = {
    viewBox: '0 0 20 20',
    'aria-hidden': 'true',
    className: 'home-sidebar__menu-icon',
  };

  switch (type) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M3.2 9.1 10 3.5l6.8 5.6v7.2H11.8v-4.2H8.2v4.2h-5V9.1Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case 'account':
      return (
        <svg {...props}>
          <circle cx="10" cy="6.3" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4.5 15.8c.7-2.5 3-4 5.5-4s4.8 1.5 5.5 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'transaction':
      return (
        <svg {...props}>
          <path d="M5.3 6.2h7.9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="m10.5 3.9 2.8 2.3-2.8 2.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.7 13.8H6.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="m9.5 11.5-2.8 2.3 2.8 2.3" transform="translate(0 -2.3)" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'transfer-single':
      return (
        <svg {...props}>
          <path d="M4 7.1h9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="m10.5 4.4 3 2.7-3 2.7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 12.9H6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="m9.5 15.6-3-2.7 3-2.7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'transfer-bulk':
      return (
        <svg {...props}>
          <path d="M4 6.1h12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 10h9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 13.9h12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'loan':
      return (
        <svg {...props}>
          <path d="M6.1 5.2h8.7l-1.3 2.7H7.4L6.1 5.2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8 7.9 5.6 12a2.2 2.2 0 0 0 1.9 3.3h5.1A2.2 2.2 0 0 0 14.5 12L12 7.9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8.3 11h3.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'bill':
      return (
        <svg {...props}>
          <path d="M6 3.8h8v12.4l-2-1.2-2 1.2-2-1.2-2 1.2V3.8Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M7.8 7.1h4.4M7.8 9.9h4.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'tax':
      return (
        <svg {...props}>
          <path d="M6 4.3h6.5l2 2v9.4H6V4.3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12.5 4.3v2h2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8.1 10.2h4.4M8.1 12.8h4.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect x="5.2" y="4.2" width="9.6" height="11.6" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7.8 7.2h4.4M7.8 10h4.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

function Sidebar({ selectedKey, onSelect }) {
  return (
    <aside className="home-sidebar" aria-label="Sidebar navigation">
      <nav className="home-sidebar__nav">
        <ul className="home-sidebar__list">
          {sidebarItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isActive = item.key === selectedKey || item.children?.some((child) => child.key === selectedKey);

            return (
              <li
                key={item.key}
                className={`home-sidebar__item ${isActive ? 'home-sidebar__item--active' : ''} ${hasChildren ? 'home-sidebar__item--has-children' : ''}`}
              >
                <button
                  type="button"
                  className="home-sidebar__entry"
                  onClick={() => onSelect(item.key)}
                  aria-current={item.key === selectedKey ? 'page' : undefined}
                >
                  <span className="home-sidebar__entry-main">
                    <SidebarIcon type={item.icon} />
                    <span className="home-sidebar__label">{item.label}</span>
                  </span>

                  {hasChildren ? <SidebarArrowIcon /> : null}
                </button>

                {hasChildren ? (
                  <div className="home-sidebar__submenu" role="menu" aria-label={item.label}>
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        className={`home-sidebar__submenu-item ${selectedKey === child.key ? 'home-sidebar__submenu-item--active' : ''}`}
                        role="menuitem"
                        onClick={() => onSelect(child.key)}
                        aria-current={selectedKey === child.key ? 'page' : undefined}
                      >
                        <span className="home-sidebar__submenu-bullet" aria-hidden="true" />
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
