import { useEffect, useMemo, useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminNotification from './AdminNotification';
import AdminContractsPage from '../../pages/layout/AdminContractsPage';
import LoanContractDetailPage from '../../pages/layout/LoanContractDetailPage';
import '../../styles/adminLayout.css';

const pageComponentMap = {
  'admin-contracts': AdminContractsPage,
  'loan-history-detail': LoanContractDetailPage,
};

function AdminLayout({ showSuccessNotification = false }) {
  const [selectedKey, setSelectedKey] = useState('admin-contracts');
  const [pageState, setPageState] = useState({});
  const [showNotification, setShowNotification] = useState(showSuccessNotification);

  useEffect(() => {
    if (showSuccessNotification) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  const CurrentPage = useMemo(
    () => pageComponentMap[selectedKey] || AdminContractsPage,
    [selectedKey]
  );

  const handleSelect = (key) => {
    setSelectedKey(key);
    setPageState({});
  };

  const handleNavigate = (key, nextPageState = {}) => {
    setSelectedKey(key);
    setPageState(nextPageState);
  };

  return (
    <div className="admin-layout">
      {showNotification && <AdminNotification />}
      <AdminHeader />
      <div className="admin-layout__body">
        <AdminSidebar selectedKey={selectedKey} onSelect={handleSelect} />
        <div className="admin-layout__content">
          <CurrentPage onNavigate={handleNavigate} pageState={pageState} />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

