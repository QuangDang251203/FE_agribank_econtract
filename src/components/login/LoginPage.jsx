    import LoginLeftPanel from './LoginLeftPanel';
import LoginRightPanel from './LoginRightPanel';
import '../../styles/loginPage.css';

function LoginPage() {
  return (
    <main className="login-page">
      <LoginLeftPanel />
      <LoginRightPanel />
    </main>
  );
}

export default LoginPage;

