import heroImage from '../../assets/images/Login.png';
import '../../styles/loginLeftPanel.css';

function QuickLinkIcon({ type }) {
  switch (type) {
    case 'exchange':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" className="quick-link-svg">
          <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16 16h16M16 32h16M24 10v5M24 33v5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M21 20c0-1.8 1.4-3 3.6-3 1.8 0 3 .9 3.8 2.1M27 28c0 1.8-1.5 3-3.9 3-1.9 0-3.3-.9-4.1-2.3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'rate':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" className="quick-link-svg">
          <path d="M14 34h20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M17 34V20m7 14V14m7 20V24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="24" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M24 7v12M19 10.5h10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'guarantee':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" className="quick-link-svg">
          <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M24 12v24M18 16h9.2c3 0 4.8 1.6 4.8 4.2 0 2.8-2.1 4.3-4.8 4.3H18m0 0h10.4c2.6 0 4.6 1.3 4.6 4 0 2.5-1.9 4-4.7 4H18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'service':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" className="quick-link-svg">
          <path d="M10 17.5 24 11l14 6.5v16L24 40l-14-6.5v-16Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M24 11v29M10 17.5l14 7 14-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'atm':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" className="quick-link-svg">
          <path d="M15 36h18l-2.5-14h-13L15 36Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M19 22V15.5c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5V22M24 25v6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      );
    default:
      return null;
  }
}

const quickLinks = [
  { id: 1, type: 'exchange', label: 'Truy vấn\nthông tin tỷ\ngiá hối đoái' },
  { id: 2, type: 'rate', label: 'Truy vấn\nthông tin lãi\nsuất' },
  { id: 3, type: 'guarantee', label: 'Truy vấn\nthông tin thư\nbảo lãnh' },
  { id: 4, type: 'service', label: 'Sản phẩm\ndịch vụ' },
  { id: 5, type: 'atm', label: 'Điểm ATM và\nchi nhánh' },
];

function LoginLeftPanel() {
  return (
    <section className="login-left-panel">
      <h1 className="left-bank-title">
        <span>NGÂN HÀNG NÔNG NGHIỆP</span>
        <span>VÀ PHÁT TRIỂN NÔNG THÔN VIỆT NAM</span>
      </h1>

      <div className="left-hero-frame">
        <img src={heroImage} alt="Agribank login visual" className="left-hero-image" />
      </div>

      <ul className="left-quick-links" aria-label="Quick links">
        {quickLinks.map((item) => (
          <li key={item.id} className="quick-link-item">
            <span className="quick-link-icon">
              <QuickLinkIcon type={item.type} />
            </span>
            <span className="quick-link-text">{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="left-footer">
        <p>© 2019 Bản quyền thuộc về Ngân hàng Nông Nghiệp và Phát triển Nông thôn Việt Nam.</p>
      </div>
    </section>
  );
}

export default LoginLeftPanel;

