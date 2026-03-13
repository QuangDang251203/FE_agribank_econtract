import { useAuth } from '../../context/AuthContext';
import agribankLogo from '../../assets/images/agribank_logo.png';
import '../../styles/header.css';

function SearchIcon() {
  return (
	<svg viewBox="0 0 16 16" aria-hidden="true" className="topbar__icon">
	  <path
		d="M11.2 10.2 14 13l-1 1-2.8-2.8a5 5 0 1 1 1-1ZM6.9 11a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"
		fill="currentColor"
	  />
	</svg>
  );
}

function BellIcon() {
  return (
	<svg viewBox="0 0 20 20" aria-hidden="true" className="topbar__icon topbar__icon--bell">
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
  const { user, logout } = useAuth();
  const username = user?.username || 'User';
  const firstLetter = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    window.history.replaceState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
	<header className="home-header">
	  <div className="home-header__brand-group">
		<img src={agribankLogo} alt="Agribank" className="home-header__logo" />
		<div className="home-header__divider" aria-hidden="true" />
		<div className="home-header__title">Hệ thống Khách hàng doanh nghiệp</div>
	  </div>

	  <div className="home-header__actions">
		<label className="home-header__search" aria-label="Search">
		  <SearchIcon />
		  <input type="text" placeholder="Search..." />
		</label>

		<button type="button" className="home-header__icon-button" aria-label="Notifications">
		  <BellIcon />
		</button>

		<button type="button" className="home-header__profile-button" aria-label="User profile">
		  <span className="home-header__profile-avatar">{firstLetter}</span>
		  <span className="home-header__profile-name">{username}</span>
		</button>

		<button 
		  type="button" 
		  className="home-header__logout-button"
		  onClick={handleLogout}
		  aria-label="Logout"
		>
		  Logout
		</button>
	  </div>
	</header>
  );
}

export default Header;

