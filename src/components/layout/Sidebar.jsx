import agribankLogo from '../../assets/images/agribank_logo.png';
import '../../styles/sidebar.css';

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="sidebar-menu-icon">
      <path
        d="M8 1.6 14.4 8 8 14.4 1.6 8 8 1.6Zm0 2.1L3.7 8 8 12.3 12.3 8 8 3.7Z"
        fill="currentColor"
      />
      <path d="M8 5.8 10.2 8 8 10.2 5.8 8 8 5.8Z" fill="currentColor" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="sidebar-chevron-icon">
      <path
        d="M4.2 6.3a.75.75 0 0 1 1.06 0L8 9.04l2.74-2.74a.75.75 0 0 1 1.06 1.06l-3.27 3.27a.75.75 0 0 1-1.06 0L4.2 7.36a.75.75 0 0 1 0-1.06Z"
        fill="currentColor"
      />
    </svg>
  );
}

const sidebarItems = [
  { id: 1, label: 'Danh sách khoản vay', active: true},
  { id: 2, label: 'Sổ tiết kiệm' },
  { id: 3, label: 'Content menu' },
  { id: 4, label: 'Content menu' },
  { id: 5, label: 'Content menu' },
  { id: 6, label: 'Content menu' },
  { id: 7, label: 'Content menu' },
  { id: 8, label: 'Content menu' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={agribankLogo} alt="Agribank" className="sidebar-brand-logo" />
      </div>
      <nav className="sidebar-nav" aria-label="Sidebar navigation">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
          >
            <MenuIcon />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
