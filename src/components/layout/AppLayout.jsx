import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import '../../styles/appLayout.css';

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

export default AppLayout;

