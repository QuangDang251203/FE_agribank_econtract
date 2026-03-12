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
  'loan-history': SecuredLoanPage,
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

function AppLayout() {
  const [selectedKey, setSelectedKey] = useState(DEFAULT_SIDEBAR_KEY);
  const CurrentPage = useMemo(
    () => pageComponentMap[selectedKey] || HomePage,
    [selectedKey]
  );

  return (
    <div className="home-layout">
      <Header />
      <div className="home-layout__body">
        <Sidebar selectedKey={selectedKey} onSelect={setSelectedKey} />
        <CurrentPage />
      </div>
    </div>
  );
}

export default AppLayout;

