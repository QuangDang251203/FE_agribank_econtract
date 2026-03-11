import { useEffect, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './components/login/LoginPage';

const validRoutes = ['/login', '/layout'];

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

function App() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  if (route === '/layout') {
    return <AppLayout />;
  }

  return <LoginPage />;
}

export default App;
