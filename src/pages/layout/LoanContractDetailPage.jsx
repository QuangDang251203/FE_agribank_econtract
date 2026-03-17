import { useEffect, useMemo, useState } from 'react';
import { useCreateContract } from '../../hooks/useCreateContract';
import '../../styles/loanContractDetailPage.css';

const STATUS_META = {
  1: { label: 'Cho ky', tone: 'pending' },
  2: { label: 'Hoan thanh', tone: 'success' },
  99: { label: 'Da huy', tone: 'danger' },
};

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function formatCurrency(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 'N/A';
  return num.toLocaleString('vi-VN');
}

function formatRate(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 'N/A';
  const pct = num <= 1 ? num * 100 : num;
  return `${pct.toFixed(pct % 1 === 0 ? 0 : 1)}%`;
}

function toPayment(value) {
  if (!value) return 'N/A';
  if (value === 'end-term') return 'Goc, lai cuoi ky';
  return value;
}

function Field({ label, value }) {
  return (
    <div className="loan-contract-detail__field">
      <div className="loan-contract-detail__label">{label}</div>
      <div className="loan-contract-detail__value">{value || 'N/A'}</div>
    </div>
  );
}

function LoanContractDetailPage({ onNavigate, pageState }) {
  const { fetchContractByCode } = useCreateContract();
  const [detail, setDetail] = useState(pageState?.contractData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const contractCode = pageState?.contractCode || detail?.contractCode || '';

  useEffect(() => {
    if (!contractCode) {
      setError('Khong tim thay ma hop dong');
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetchContractByCode(contractCode);
        if (!mounted) return;
        const resolved = response?.data || response?.result || response;
        if (!resolved?.contractCode) {
          throw new Error('Khong lay duoc chi tiet hop dong');
        }
        setDetail(resolved);
      } catch (e) {
        if (mounted) {
          setError(e.message || 'Khong the tai chi tiet hop dong');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [contractCode, fetchContractByCode]);

  const status = useMemo(() => {
    const code = Number(detail?.status);
    return STATUS_META[code] || { label: `Trang thai ${code}`, tone: 'draft' };
  }, [detail?.status]);

  return (
    <main className="loan-contract-detail">
      <section className="loan-contract-detail__panel">
        <div className="loan-contract-detail__titlebar">
          <button type="button" className="loan-contract-detail__back" onClick={() => onNavigate?.('loan-history')} aria-label="Quay lai">&lsaquo;</button>
          <h1>Chi tiet hop dong</h1>
        </div>

        {loading ? <p className="loan-contract-detail__notice">Dang tai du lieu...</p> : null}
        {error ? <p className="loan-contract-detail__notice loan-contract-detail__notice--error">{error}</p> : null}

        {!loading && !error && detail ? (
          <div className="loan-contract-detail__workspace">
            <section className="loan-contract-detail__card">
              <header className="loan-contract-detail__card-header">
                <div className="loan-contract-detail__header-left">
                  <span className="loan-contract-detail__section-icon" />
                  <h2>Thong tin hop dong</h2>
                  <span className={`loan-contract-detail__status loan-contract-detail__status--${status.tone}`}>{status.label}</span>
                </div>
                <button type="button" className="loan-contract-detail__action-btn">Lich su</button>
              </header>

              <div className="loan-contract-detail__row-title">
                <h3 className="loan-contract-detail__section-title"><span className="loan-contract-detail__section-icon" />Thong tin ben vay</h3>
                <span className="loan-contract-detail__created-at">Duoc khoi tao {formatDate(detail.createdAt)}</span>
              </div>

              <div className="loan-contract-detail__grid loan-contract-detail__grid--two">
                <Field label="Ben vay" value={detail?.client?.businessName} />
                <Field label="Dia chi" value={detail?.client?.address} />
                <Field label="So dien thoai" value={detail?.client?.phone} />
                <Field label="Ma so thue" value={detail?.client?.businessCode} />
                <Field label="So tai khoan" value={detail?.bankAccount?.bankAccountNumber} />
                <Field label="Chi nhanh" value={detail?.bankAccount?.branchName} />
              </div>

              <h3 className="loan-contract-detail__section-title"><span className="loan-contract-detail__section-icon" />Thong tin Nguoi dai dien</h3>
              <div className="loan-contract-detail__grid loan-contract-detail__grid--two">
                <Field label="Nguoi dai dien" value={detail?.client?.businessName} />
                <Field label="Chuc vu" value="Tong giam doc" />
                <Field label="So CCCD/Ho chieu" value={detail?.client?.businessCode} />
                <Field label="Noi cap" value={detail?.client?.address} />
              </div>
            </section>

            <section className="loan-contract-detail__card">
              <header className="loan-contract-detail__card-header">
                <div className="loan-contract-detail__header-left">
                  <span className="loan-contract-detail__section-icon" />
                  <h2>Thong tin khoan vay</h2>
                </div>
                <button type="button" className="loan-contract-detail__action-btn">▦</button>
              </header>

              <h3 className="loan-contract-detail__section-title">Thong tin khoan vay</h3>
              <div className="loan-contract-detail__grid loan-contract-detail__grid--two">
                <Field label="Gia tri khoan vay (VND)" value={formatCurrency(detail?.loanAmount)} />
                <Field label="Lai suat" value={formatRate(detail?.interestRate)} />
                <Field label="Thoi han vay" value={`${Number(detail?.loanTerm) || 0} thang`} />
                <Field label="Phuong thuc tra" value={toPayment(detail?.paymentMethod)} />
                <Field label="Ngay hieu luc" value={formatDate(detail?.createdAt)} />
                <Field label="Han den han" value={formatDate(detail?.createdAt)} />
              </div>

              <h3 className="loan-contract-detail__section-title">Thong tin the chap</h3>
              <div className="loan-contract-detail__grid loan-contract-detail__grid--two">
                <Field label="Loai hinh the chap" value="So tiet kiem tien gui" />
                <Field label="Thoi han" value={`${Number(detail?.savingBook?.duration) || 0} thang`} />
                <Field label="Gia tri so (VND)" value={formatCurrency(detail?.savingBook?.balance)} />
                <Field label="Ngay den han" value={formatDate(detail?.savingBook?.createdAt)} />
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default LoanContractDetailPage;
