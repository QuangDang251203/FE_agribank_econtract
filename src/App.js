import { useEffect, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './components/login/LoginPage';
import LoanSigningPage from './pages/layout/LoanSigningPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const validRoutes = ['/login', '/layout', '/signing', '/admin/contracts'];

function getCurrentRoute() {
  const { pathname } = window.location;

  if (pathname === '/') {
    window.history.replaceState({}, '', '/login');
    return '/login';
  }

  if (!validRoutes.includes(pathname)) {
    window.history.replaceState({}, '', '/login');
    return '/login';
  }

  return pathname;
}

/**
 * Main App Content Component
 * Separated to use useAuth hook
 */
function AppContent() {
  const [route, setRoute] = useState(getCurrentRoute);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Redirect to login if not authenticated
  if (!isAuthenticated && (route === '/layout' || route === '/admin/contracts')) {
    window.history.replaceState({}, '', '/login');
    return <LoginPage />;
  }

  if (route === '/layout' && isAuthenticated) {
    return <AppLayout />;
  }

  if (route === '/admin/contracts' && isAuthenticated) {
    return <AppLayout initialPageKey="admin-contracts" />;
  }

  if (route === '/signing') {
    return <LoanSigningPage />;
  }

  return <LoginPage />;
}

/**
 * Main App Component
 * Provides AuthProvider wrapper
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
