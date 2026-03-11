import '../../styles/header.css';

function SearchIcon() {
  return (
	<svg viewBox="0 0 16 16" aria-hidden="true" className="header-icon">
	  <path
		d="M11.2 10.2 14 13l-1 1-2.8-2.8a5 5 0 1 1 1-1ZM6.9 11a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"
		fill="currentColor"
	  />
	</svg>
  );
}

function BellIcon() {
  return (
	<svg viewBox="0 0 20 20" aria-hidden="true" className="header-icon bell-icon">
	  <path
		d="M10 2.5a3.5 3.5 0 0 0-3.5 3.5v1.2c0 .7-.2 1.4-.6 2L5 10.7c-.4.7-.6 1.4-.6 2.2V14h11.2v-1.1c0-.8-.2-1.5-.6-2.2l-.9-1.5c-.4-.6-.6-1.3-.6-2V6A3.5 3.5 0 0 0 10 2.5Zm-1.9 13a1.9 1.9 0 0 0 3.8 0H8.1Z"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	  />
	</svg>
  );
}

function Header() {
  return (
	<header className="topbar">
	  <div className="topbar-title">Hệ thống Ngân hàng số</div>

	  <div className="topbar-actions">
		<label className="search-box" aria-label="Search">
		  <SearchIcon />
		  <input type="text" placeholder="Search..." />
		</label>

		<button type="button" className="icon-button" aria-label="Notifications">
		  <BellIcon />
		</button>

		<button type="button" className="profile-button">
		  <span className="profile-avatar">AB</span>
		  <span className="profile-name">Admin</span>
		</button>
	  </div>
	</header>
  );
}

export default Header;

