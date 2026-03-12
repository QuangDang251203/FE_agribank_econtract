import { useEffect, useMemo, useState } from 'react';
import '../../styles/loanCreatePage.css';
import '../../styles/loanCreateModal.css';

const collateralAccounts = [
  {
    id: 'deposit-011023089-1',
    accountNumber: '011023089',
    amount: '300.000.000',
    term: '12 tháng',
    maturityDate: '02/12/2026',
  },
  {
    id: 'deposit-011023089-2',
    accountNumber: '011023089',
    amount: '500.000.000',
    term: '12 tháng',
    maturityDate: '06/12/2026',
  },
  {
    id: 'deposit-011023089-3',
    accountNumber: '011023089',
    amount: '1.000.000.000',
    term: '12 tháng',
    maturityDate: '11/09/2026',
  },
];

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
          <dt>Ngày đến hạn</dt>
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

function LoanConfirmationModal({ selectedCollateral, formValues, onClose }) {
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
          <button type="button" className="loan-create-modal__action loan-create-modal__action--primary">
            <LockIcon />
            <span>Ký số</span>
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
  const [selectedCollateralId, setSelectedCollateralId] = useState(collateralAccounts[2].id);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    loanValue: '900.000.000',
    loanTerm: '12',
    repaymentMethod: 'end-term',
    interestRate: '7.9%',
    disbursementAccount: 'default-account',
  });

  const selectedCollateral = useMemo(
    () => collateralAccounts.find((item) => item.id === selectedCollateralId) || collateralAccounts[2],
    [selectedCollateralId]
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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsConfirmationOpen(true);
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
            </section>

            <section className="loan-create-page__block" aria-labelledby="loan-info-title">
              <div className="loan-create-page__block-heading">
                <h3 id="loan-info-title">Thông tin khoản vay</h3>
              </div>

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
                    placeholder="Vui lòng nhập"
                    className="loan-create-page__field"
                    value={formValues.loanValue}
                    onChange={handleFieldChange}
                  />
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
                      <option value="" disabled>
                        Chọn thời hạn vay
                      </option>
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
                  <button type="submit" className="loan-create-page__button loan-create-page__button--primary">
                    <LockIcon />
                    <span>Xác nhận</span>
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
        />
      ) : null}
    </main>
  );
}

export default CreateSecuredLoanPage;


