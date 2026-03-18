import { useMemo, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { DEFAULT_SIDEBAR_KEY } from './sidebarConfig';
import HomePage from '../../pages/layout/HomePage';
import AccountInfoPage from '../../pages/layout/AccountInfoPage';
import TransactionInfoPage from '../../pages/layout/TransactionInfoPage';
import SingleTransferPage from '../../pages/layout/SingleTransferPage';
import BulkTransferPage from '../../pages/layout/BulkTransferPage';
import SecuredLoanPage from '../../pages/layout/SecuredLoanPage';
import CreateSecuredLoanPage from '../../pages/layout/CreateSecuredLoanPage';
import LoanSigningPage from '../../pages/layout/LoanSigningPage';
import LoanHistoryPage from '../../pages/layout/LoanHistoryPage';
import LoanContractDetailPage from '../../pages/layout/LoanContractDetailPage';
import AdminContractsPage from '../../pages/layout/AdminContractsPage';
import BillPaymentPage from '../../pages/layout/BillPaymentPage';
import TaxPaymentPage from '../../pages/layout/TaxPaymentPage';
import OnlineAccountPage from '../../pages/layout/OnlineAccountPage';
import '../../styles/appLayout.css';

const pageComponentMap = {
  home: HomePage,
  account: AccountInfoPage,
  'account-payment': AccountInfoPage,
  'account-deposit': AccountInfoPage,
  transaction: TransactionInfoPage,
  'transaction-lookup': TransactionInfoPage,
  'transaction-statement': TransactionInfoPage,
  'transfer-single': SingleTransferPage,
  'transfer-single-internal': SingleTransferPage,
  'transfer-single-external': SingleTransferPage,
  'transfer-bulk': BulkTransferPage,
  'transfer-bulk-create': BulkTransferPage,
  'transfer-bulk-list': BulkTransferPage,
  loan: SecuredLoanPage,
  'loan-create': CreateSecuredLoanPage,
  'loan-signing': LoanSigningPage,
  'loan-history': LoanHistoryPage,
  'loan-history-detail': LoanContractDetailPage,
  'admin-contracts': AdminContractsPage,
  bill: BillPaymentPage,
  'bill-electricity': BillPaymentPage,
  'bill-water': BillPaymentPage,
  'bill-telecom': BillPaymentPage,
  tax: TaxPaymentPage,
  'tax-create': TaxPaymentPage,
  'tax-history': TaxPaymentPage,
  online: OnlineAccountPage,
  'online-open': OnlineAccountPage,
  'online-manage': OnlineAccountPage,
};

function AppLayout({ initialPageKey = DEFAULT_SIDEBAR_KEY }) {
  const [selectedKey, setSelectedKey] = useState(initialPageKey);
  const [pageState, setPageState] = useState({});
  const CurrentPage = useMemo(
    () => pageComponentMap[selectedKey] || HomePage,
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
    <div className="home-layout">
      <Header />
      <div className="home-layout__body">
        <Sidebar selectedKey={selectedKey} onSelect={handleSelect} />
        <CurrentPage onNavigate={handleNavigate} pageState={pageState} />
      </div>
    </div>
  );
}

export default AppLayout;
