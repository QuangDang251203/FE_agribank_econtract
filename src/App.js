import { useEffect, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import AdminLoginPage from './components/admin-login/AdminLoginPage';
import LoginPage from './components/login/LoginPage';
import LoanSigningPage from './pages/layout/LoanSigningPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const validRoutes = ['/login', '/admin/login', '/layout', '/signing', '/admin/contracts'];

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
  const [showAdminSuccessNotification, setShowAdminSuccessNotification] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Show success notification when admin logs in
  useEffect(() => {
    if (isAuthenticated && user?.businessCode === 'ADMIN' && route === '/admin/contracts') {
      setShowAdminSuccessNotification(true);
      const timer = setTimeout(() => {
        setShowAdminSuccessNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, route]);

  // Redirect user flow to the correct login page when unauthenticated.
  if (!isAuthenticated && route === '/layout') {
    window.history.replaceState({}, '', '/login');
    return <LoginPage />;
  }

  if (!isAuthenticated && route === '/admin/contracts') {
    window.history.replaceState({}, '', '/admin/login');
    return <AdminLoginPage />;
  }

  if (route === '/admin/login') {
    return <AdminLoginPage />;
  }

  if (route === '/layout' && isAuthenticated) {
    return <AppLayout />;
  }

  if (route === '/admin/contracts' && isAuthenticated) {
    return <AdminLayout showSuccessNotification={showAdminSuccessNotification} />;
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
