import heroImage from '../../assets/images/images-login.png';
import '../../styles/loginLeftPanel.css';

function LoginLeftPanel() {
  return (
    <section className="login-left" aria-label="Giới thiệu Agribank eBanking">
      <div className="login-left__frame">
        <div className="login-left__visual">
          <img src={heroImage} alt="Agribank Corporate eBanking" className="login-left__image" />
        </div>
      </div>
    </section>
  );
}

export default LoginLeftPanel;

