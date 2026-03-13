import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSavingBooks } from '../../hooks/useSavingBooks';
import { useCreateContract } from '../../hooks/useCreateContract';
import '../../styles/loanCreatePage.css';
import '../../styles/loanCreateModal.css';


function MinusSquareIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="loan-create-page__section-icon">
      <rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="#E8A8B8" />
      <path d="M5 8h6" stroke="#B7123D" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="loan-create-page__button-icon">
      <path d="M5.3 7V5.9a2.7 2.7 0 1 1 5.4 0V7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="3.8" y="7" width="8.4" height="6.2" rx="1.2" fill="currentColor" opacity="0.95" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="loan-create-page__button-icon">
      <path d="M3.5 7.1 8 3.5l4.5 3.6v5.1H9.3V9.1H6.7v3.1H3.5V7.1Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="loan-create-modal__close-icon">
      <path d="M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function formatLoanValueInWords(value) {
  const compactValue = String(value).replace(/\./g, '').trim();

  if (compactValue === '900000000') {
    return 'Chín trăm triệu Việt Nam đồng chẵn';
  }

  return 'Giá trị khoản vay bằng chữ';
}

function resolveLoanTermLabel(value) {
  const termMap = {
    '3': '3 tháng',
    '6': '6 tháng',
    '12': '12 tháng',
  };

  return termMap[value] || '12 tháng';
}

function resolveRepaymentLabel(value) {
  const repaymentMap = {
    'end-term': 'Gốc, lãi cuối kỳ',
    'monthly-interest': 'Lãi hàng tháng',
  };

  return repaymentMap[value] || 'Gốc, lãi cuối kỳ';
}

function CollateralCard({ accountNumber, amount, term, maturityDate, selected, onClick }) {
  return (
    <button
      type="button"
      className={`loan-create-page__card ${selected ? 'loan-create-page__card--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected ? 'true' : 'false'}
    >
      <div className="loan-create-page__card-title">
        <span className={`loan-create-page__card-check ${selected ? 'loan-create-page__card-check--selected' : ''}`} aria-hidden="true" />
        <span>Sổ tiết kiệm {accountNumber}</span>
      </div>

      <dl className="loan-create-page__card-meta">
        <div className="loan-create-page__card-row">
          <dt>Số tiền gửi</dt>
          <dd>{amount}</dd>
        </div>
        <div className="loan-create-page__card-row">
          <dt>Thời hạn</dt>
          <dd>{term}</dd>
        </div>
        <div className="loan-create-page__card-row">
          <dt>Ngày gửi</dt>
          <dd>{maturityDate}</dd>
        </div>
      </dl>
    </button>
  );
}

function SummaryField({ label, value, wide = false }) {
  return (
    <div className={`loan-create-modal__field ${wide ? 'loan-create-modal__field--wide' : ''}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function LoanConfirmationModal({ selectedCollateral, formValues, onClose, onConfirm, confirming }) {
  const loanSummary = useMemo(
    () => ({
      amount: formValues.loanValue || '900.000.000',
      amountInWords: formatLoanValueInWords(formValues.loanValue || '900.000.000'),
      term: resolveLoanTermLabel(formValues.loanTerm),
      interestRate: formValues.interestRate || '7.9%',
      repaymentMethod: resolveRepaymentLabel(formValues.repaymentMethod),
      effectiveDate: '01/03/2026',
      dueDate: '01/03/2027',
    }),
    [formValues]
  );

  return (
    <div className="loan-create-modal" role="presentation">
      <div className="loan-create-modal__backdrop" onClick={onClose} />

      <section
        className="loan-create-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loan-confirmation-title"
      >
        <header className="loan-create-modal__header">
          <h2 id="loan-confirmation-title">Xác nhận thông tin</h2>
          <button type="button" className="loan-create-modal__close" aria-label="Đóng popup xác nhận" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        <div className="loan-create-modal__body">
          <section className="loan-create-modal__section" aria-labelledby="modal-collateral-title">
            <div className="loan-create-modal__section-heading">
              <h3 id="modal-collateral-title">Tài sản đảm bảo (sổ tiết kiệm)</h3>
            </div>

            <div className="loan-create-modal__section-content loan-create-modal__section-content--card">
              <div className="loan-create-modal__collateral-card">
                <div className="loan-create-modal__collateral-title">Sổ tiết kiệm {selectedCollateral.accountNumber}</div>
                <dl className="loan-create-modal__collateral-meta">
                  <div>
                    <dt>Số tiền gửi</dt>
                    <dd>{selectedCollateral.amount}</dd>
                  </div>
                  <div>
                    <dt>Thời hạn</dt>
                    <dd>{selectedCollateral.term}</dd>
                  </div>
                  <div>
                    <dt>Ngày đến hạn</dt>
                    <dd>{selectedCollateral.maturityDate}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <section className="loan-create-modal__section" aria-labelledby="modal-loan-title">
            <div className="loan-create-modal__section-heading">
              <h3 id="modal-loan-title">Thông tin khoản vay</h3>
            </div>

            <dl className="loan-create-modal__summary-grid">
              <SummaryField label="Giá trị khoản vay (VNĐ)" value={loanSummary.amount} />
              <SummaryField label="Bằng chữ" value={loanSummary.amountInWords} />
              <SummaryField label="Thời hạn vay" value={loanSummary.term} />
              <SummaryField label="Lãi suất" value={loanSummary.interestRate} />
              <SummaryField label="Phương thức trả" value={loanSummary.repaymentMethod} wide />
              <SummaryField label="Ngày hiệu lực" value={loanSummary.effectiveDate} />
              <SummaryField label="Hạn đến hạn" value={loanSummary.dueDate} />
            </dl>
          </section>
        </div>

        <footer className="loan-create-modal__footer">
          <button
            type="button"
            className="loan-create-modal__action loan-create-modal__action--primary"
            onClick={onConfirm}
            disabled={confirming}
          >
            <LockIcon />
            <span>{confirming ? 'Đang ký số...' : 'Ký số'}</span>
          </button>
          <button type="button" className="loan-create-modal__action loan-create-modal__action--secondary" onClick={onClose}>
            <HomeIcon />
            <span>Đóng</span>
          </button>
        </footer>
      </section>
    </div>
  );
}

function CreateSecuredLoanPage() {
  const { user } = useAuth();
  const { savingBooks, loading, error, fetchSavingBooks } = useSavingBooks();
  const { createContract } = useCreateContract();
  
  const [selectedCollateralId, setSelectedCollateralId] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [collateralAccounts, setCollateralAccounts] = useState([]);
  const [validationError, setValidationError] = useState('');
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState('');
  const [contractSuccess, setContractSuccess] = useState(false);
  const [contractCode, setContractCode] = useState('');
  const [formValues, setFormValues] = useState({
    loanValue: '',
    loanTerm: '',
    repaymentMethod: '',
    interestRate: '5.8%',
    disbursementAccount: 'default-account',
  });

  // Fetch saving books when component mounts
  useEffect(() => {
    if (user?.businessCode) {
      console.log('📌 Fetching saving books for businessCode:', user.businessCode);
      fetchSavingBooks(user.businessCode);
    }
  }, [user?.businessCode, fetchSavingBooks]);

  // Transform API data to collateral accounts format
  useEffect(() => {
    if (savingBooks && savingBooks.length > 0) {
      const accounts = savingBooks.map((book) => ({
        id: `saving-${book.id}`,
        accountNumber: book.client?.businessCode || 'N/A',
        amount: book.balance ? `${book.balance.toLocaleString('vi-VN')}` : '0',
        term: book.duration ? `${book.duration} tháng` : 'N/A',
        maturityDate: book.createdAt ? new Date(book.createdAt).toLocaleDateString('vi-VN') : 'N/A',
        status: book.status, // 0: inactive, 1: active, 2: closed
        originalData: book,
      }));

      setCollateralAccounts(accounts);
      
      // Select first active account by default
      const activeAccount = accounts.find(acc => acc.status === 1);
      if (activeAccount) {
        setSelectedCollateralId(activeAccount.id);
      } else if (accounts.length > 0) {
        setSelectedCollateralId(accounts[0].id);
      }

      console.log('✅ Collateral accounts transformed:', accounts);
    }
  }, [savingBooks, loading]);

  const selectedCollateral = useMemo(
    () => collateralAccounts.find((item) => item.id === selectedCollateralId) || collateralAccounts[0],
    [selectedCollateralId, collateralAccounts]
  );

  useEffect(() => {
    if (!isConfirmationOpen) {
      return undefined;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsConfirmationOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isConfirmationOpen]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    // Validate loan value if it's changed
    if (name === 'loanValue' && selectedCollateral) {
      validateLoanAmount(value, selectedCollateral);
    }
  };

  /**
   * Validate loan amount against 90% of collateral value
   */
  const validateLoanAmount = (loanValueStr, collateral) => {
    if (!loanValueStr) {
      setValidationError('');
      return;
    }

    // Remove spaces and commas, convert to number
    const loanValue = parseFloat(loanValueStr.replace(/[,\s]/g, ''));
    
    if (isNaN(loanValue)) {
      setValidationError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    // Get collateral amount (remove spaces and commas)
    const collateralValue = parseFloat(collateral.amount.replace(/[,\s.]/g, ''));
    const maxLoanValue = collateralValue * 0.9;

    if (loanValue > maxLoanValue) {
      setValidationError(
        `⚠️ Số tiền vay không được vượt quá 90% giá trị tài sản (${(maxLoanValue).toLocaleString('vi-VN')} VNĐ)`
      );
    } else {
      setValidationError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validate all required fields
    if (!formValues.loanValue || !formValues.loanTerm || !formValues.repaymentMethod) {
      setContractError('Vui lòng điền đầy đủ thông tin khoản vay');
      return;
    }

    if (!selectedCollateral) {
      setContractError('Vui lòng chọn tài sản đảm bảo');
      return;
    }

    setContractError('');
    setIsConfirmationOpen(true);
  };

  const handleSignContract = async () => {
    try {
      setContractLoading(true);
      setContractError('');
      setContractSuccess(false);

      // Convert form values to ContractDTO format
      const loanAmount = parseFloat(formValues.loanValue.replace(/[.,\s]/g, ''));
      const loanTerm = parseInt(formValues.loanTerm, 10);

      // Fixed default interest rate 5.8% (backend expects decimal 0.058)
      const interestRate = 0.058;

      // Map payment method
      const paymentMethodMap = {
        'end-term': 'end-term',
        'monthly-interest': 'monthly-interest',
      };

      const savingBookId = Number(selectedCollateral?.originalData?.id);
      if (!Number.isFinite(savingBookId)) {
        setContractError('Saving book id không hợp lệ');
        setContractLoading(false);
        return;
      }

      const contractData = {
        businessCode: user?.businessCode,
        loanAmount,
        loanTerm,
        interestRate,
        savingBookId,
        paymentMethod: paymentMethodMap[formValues.repaymentMethod] || formValues.repaymentMethod,
      };

      console.log('📋 Contract data to send:', contractData);

      // Call API to create contract
      const result = await createContract(contractData);

      if (result.success) {
        console.log('✅ Contract created successfully');
        setContractCode(result.contractCode || '');
        setContractSuccess(true);
        setIsConfirmationOpen(false);

        // Show success message for 3 seconds then reset
        setTimeout(() => {
          setContractSuccess(false);
          setFormValues({
            loanValue: '',
            loanTerm: '',
            repaymentMethod: '',
            interestRate: '5.8%',
            disbursementAccount: 'default-account',
          });
          setSelectedCollateralId(null);
        }, 3000);
      } else {
        setContractError(result.error || 'Tạo hợp đồng thất bại');
      }

      setContractLoading(false);
    } catch (err) {
      console.error('Contract creation error:', err);
      setContractError(err.message || 'Tạo hợp đồng thất bại');
      setContractLoading(false);
    }
  };

  return (
    <main className="loan-create-page">
      <section className="loan-create-page__panel">
        <div className="loan-create-page__titlebar">
          <h1>Vay có thế chấp tiền gửi</h1>
        </div>

        <div className="loan-create-page__workspace">
          <div className="loan-create-page__content">
            <div className="loan-create-page__section-title">
              <MinusSquareIcon />
              <h2>Tạo khoản vay mới</h2>
            </div>

            <section className="loan-create-page__block" aria-labelledby="collateral-title">
              <div className="loan-create-page__block-heading">
                <h3 id="collateral-title">Tài sản đảm bảo (sổ tiết kiệm)</h3>
              </div>

              {loading && (
                <div className="loan-create-page__cards" style={{ padding: '20px', textAlign: 'center' }}>
                  <p>Đang tải danh sách tài sản đảm bảo...</p>
                </div>
              )}

              {error && (
                <div className="loan-create-page__cards" style={{ padding: '20px', textAlign: 'center', color: '#c00' }}>
                  <p>⚠️ {error}</p>
                </div>
              )}

              {!loading && collateralAccounts.length === 0 && (
                <div className="loan-create-page__cards" style={{ padding: '20px', textAlign: 'center' }}>
                  <p>Không có tài sản đảm bảo nào</p>
                </div>
              )}

              {collateralAccounts.length > 0 && (
                <div className="loan-create-page__cards">
                  {collateralAccounts.map((item) => (
                    <CollateralCard
                      key={item.id}
                      {...item}
                      selected={item.id === selectedCollateralId}
                      onClick={() => setSelectedCollateralId(item.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="loan-create-page__block" aria-labelledby="loan-info-title">
              <div className="loan-create-page__block-heading">
                <h3 id="loan-info-title">Thông tin khoản vay</h3>
              </div>

              {contractError && (
                <div className="loan-create-page__alert loan-create-page__alert--error">
                  ⚠️ {contractError}
                </div>
              )}

              {contractSuccess && (
                <div className="loan-create-page__alert loan-create-page__alert--success">
                  ✅ Tạo hợp đồng thành công! Mã hợp đồng: {contractCode}
                </div>
              )}

              <form className="loan-create-page__form" onSubmit={handleSubmit}>
                <div className="loan-create-page__form-row">
                  <label htmlFor="loanValue" className="loan-create-page__label-group">
                    <span>Giá trị khoản vay (VNĐ)</span>
                    <small>Tối đa bằng 90% tổng giá trị tài sản thế chấp</small>
                  </label>
                  <input
                    id="loanValue"
                    name="loanValue"
                    type="text"
                    placeholder="Điền số tiền vay"
                    className={`loan-create-page__field ${validationError ? 'loan-create-page__field--error' : ''}`}
                    value={formValues.loanValue}
                    onChange={handleFieldChange}
                  />
                  {validationError && (
                    <div className="loan-create-page__error-message">{validationError}</div>
                  )}
                </div>

                <div className="loan-create-page__form-row">
                  <label htmlFor="loanTerm" className="loan-create-page__label-group">
                    <span>Thời hạn vay</span>
                  </label>
                  <div className="loan-create-page__select-wrap">
                    <select
                      id="loanTerm"
                      name="loanTerm"
                      value={formValues.loanTerm}
                      onChange={handleFieldChange}
                      className="loan-create-page__field loan-create-page__field--select"
                    >
                      <option value="">Chọn thời hạn vay</option>
                      <option value="3">3 tháng</option>
                      <option value="6">6 tháng</option>
                      <option value="12">12 tháng</option>
                    </select>
                  </div>
                </div>

                <div className="loan-create-page__form-row">
                  <label htmlFor="repaymentMethod" className="loan-create-page__label-group">
                    <span>Phương thức trả</span>
                  </label>
                  <div className="loan-create-page__select-wrap">
                    <select
                      id="repaymentMethod"
                      name="repaymentMethod"
                      value={formValues.repaymentMethod}
                      onChange={handleFieldChange}
                      className="loan-create-page__field loan-create-page__field--select"
                    >
                      <option value="">Chọn phương thức trả</option>
                      <option value="end-term">Gốc lãi cuối kỳ</option>
                      <option value="monthly-interest">Lãi hàng tháng</option>
                    </select>
                  </div>
                </div>

                <div className="loan-create-page__form-row">
                  <label htmlFor="interestRate" className="loan-create-page__label-group">
                    <span>Lãi suất</span>
                  </label>
                  <input
                    id="interestRate"
                    name="interestRate"
                    type="text"
                    className="loan-create-page__field"
                    value={formValues.interestRate}
                    readOnly
                    placeholder="5.8%"
                    aria-label="Lãi suất"
                  />
                </div>

                <div className="loan-create-page__form-row">
                  <label htmlFor="disbursementAccount" className="loan-create-page__label-group">
                    <span>Tài khoản nhận giải ngân</span>
                  </label>
                  <div className="loan-create-page__select-wrap">
                    <select
                      id="disbursementAccount"
                      name="disbursementAccount"
                      value={formValues.disbursementAccount}
                      onChange={handleFieldChange}
                      className="loan-create-page__field loan-create-page__field--select"
                    >
                      <option value="default-account">012348888 - Chi nhánh Ba Đình</option>
                      <option value="secondary-account">012349999 - Chi nhánh Hoàn Kiếm</option>
                    </select>
                  </div>
                </div>

                <div className="loan-create-page__actions">
                  <button 
                    type="submit" 
                    className="loan-create-page__button loan-create-page__button--primary"
                    disabled={!!validationError || contractLoading}
                  >
                    <LockIcon />
                    <span>{contractLoading ? 'Đang tạo hợp đồng...' : 'Xác nhận'}</span>
                  </button>
                  <button type="button" className="loan-create-page__button loan-create-page__button--secondary">
                    <HomeIcon />
                    <span>Đóng</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </section>

      {isConfirmationOpen ? (
        <LoanConfirmationModal
          selectedCollateral={selectedCollateral}
          formValues={formValues}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleSignContract}
          confirming={contractLoading}
        />
      ) : null}
    </main>
  );
}

export default CreateSecuredLoanPage;


