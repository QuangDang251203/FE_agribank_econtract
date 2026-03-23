import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCreateContract } from '../../hooks/useCreateContract';
import '../../styles/loanHistoryPage.css';

const STATUS_META = {
  1: { label: 'Chờ ký', tone: 'pending' },
  2: { label: 'Chờ phê duyệt', tone: 'pending' },
  200: { label: 'Hoàn thành', tone: 'success' },
  400: { label: 'Từ chối', tone: 'danger' },
};

function formatDateTime(value) {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatCurrencyVnd(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString('vi-VN');
}

function formatInterestRate(value) {
  const interestValue = Number(value);
  if (!Number.isFinite(interestValue)) {
    return 'N/A';
  }

  const percent = interestValue <= 1 ? interestValue * 100 : interestValue;
  return `${percent.toFixed(percent % 1 === 0 ? 0 : 1)}%`;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="loan-history-page__eye-icon">
      <path d="M1.8 8c1.7-2.7 3.8-4 6.2-4s4.5 1.3 6.2 4c-1.7 2.7-3.8 4-6.2 4S3.5 10.7 1.8 8Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function LoanHistoryPage({ onNavigate }) {
  const { user } = useAuth();
  const { fetchContractsByBusinessCode } = useCreateContract();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    createdAt: '',
    unit: '',
    loanAmount: '',
    loanTerm: '',
    status: '',
  });

  useEffect(() => {
    const businessCode = user?.businessCode || localStorage.getItem('businessCode') || '';

    if (!businessCode) {
      setError('Không tìm thấy mã doanh nghiệp để tải lịch sử khoản vay');
      return;
    }

    let mounted = true;

    const loadLoanHistory = async () => {
      try {
        setLoading(true);
        setError('');

        const contracts = await fetchContractsByBusinessCode(businessCode);
        if (!mounted) {
          return;
        }

        const normalizedRows = contracts.map((item, index) => {
          const status = Number(item?.status);
          const statusMeta = STATUS_META[status] || { label: `Trạng thái ${status}`, tone: 'draft' };

          return {
            id: `${item?.contractCode || 'contract'}-${index}`,
            stt: index + 1,
            contractCode: item?.contractCode || '',
            rawContract: item,
            createdAtRaw: item?.createdAt || '',
            createdAtDisplay: formatDateTime(item?.createdAt),
            unitBranch: item?.bankAccount?.branchName || 'N/A',
            unitAccountNumber: item?.bankAccount?.bankAccountNumber || 'N/A',
            loanAmountRaw: Number(item?.loanAmount) || 0,
            loanAmountDisplay: formatCurrencyVnd(item?.loanAmount),
            loanTermRaw: Number(item?.loanTerm) || 0,
            loanTermDisplay: `${Number(item?.loanTerm) || 0} tháng`,
            interestRateDisplay: formatInterestRate(item?.interestRate),
            statusRaw: status,
            statusLabel: statusMeta.label,
            statusTone: statusMeta.tone,
          };
        });

        setRows(normalizedRows);
      } catch (loadError) {
        if (mounted) {
          setRows([]);
          setError(loadError.message || 'Không thể tải danh sách lịch sử khoản vay');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLoanHistory();

    return () => {
      mounted = false;
    };
  }, [user?.businessCode, fetchContractsByBusinessCode]);

  const filteredRows = useMemo(() => {
    const createdFilter = filters.createdAt.trim().toLowerCase();
    const unitFilter = filters.unit.trim().toLowerCase();
    const amountFilter = filters.loanAmount.replace(/[^\d]/g, '');

    return rows.filter((row) => {
      const createdMatches = !createdFilter || row.createdAtDisplay.toLowerCase().includes(createdFilter);
      const unitText = `${row.unitBranch} ${row.unitAccountNumber}`.toLowerCase();
      const unitMatches = !unitFilter || unitText.includes(unitFilter);
      const amountMatches = !amountFilter || String(row.loanAmountRaw).includes(amountFilter);
      const termMatches = !filters.loanTerm || String(row.loanTermRaw) === filters.loanTerm;
      const statusMatches = !filters.status || String(row.statusRaw) === filters.status;

      return createdMatches && unitMatches && amountMatches && termMatches && statusMatches;
    });
  }, [rows, filters]);

  const termOptions = useMemo(() => {
    const uniqueTerms = Array.from(new Set(rows.map((row) => row.loanTermRaw).filter(Boolean)));
    return uniqueTerms.sort((a, b) => a - b);
  }, [rows]);

  const statusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(rows.map((row) => row.statusRaw).filter(Boolean)));
    return uniqueStatuses.sort((a, b) => a - b);
  }, [rows]);

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleOpenDetail = (row) => {
    if (!onNavigate) {
      return;
    }

    const resolvedContractCode = row?.contractCode || row?.rawContract?.contractCode || '';
    if (!resolvedContractCode) {
      return;
    }

    onNavigate('loan-history-detail', {
      contractCode: resolvedContractCode,
      contractData: row.rawContract,
    });
  };

  return (
    <main className="loan-history-page">
      <section className="loan-history-page__panel">
        <div className="loan-history-page__titlebar">
          <h1>Lịch sử khoản vay có thế chấp</h1>
        </div>

        <div className="loan-history-page__workspace">
          <section className="loan-history-page__card">
            <header className="loan-history-page__card-header">
              <h2>Danh sách hợp đồng KHDN vay có thế chấp</h2>
            </header>

            {error ? <p className="loan-history-page__error">{error}</p> : null}

            <div className="loan-history-page__table-wrap">
              <table className="loan-history-page__table" aria-label="Bảng lịch sử khoản vay">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Thời gian tạo</th>
                    <th>Đơn vị</th>
                    <th>Khoản vay (VND)</th>
                    <th>Thời hạn vay</th>
                    <th>Lãi suất</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                  <tr className="loan-history-page__filters-row">
                    <th />
                    <th>
                      <input
                        type="text"
                        value={filters.createdAt}
                        onChange={(event) => handleFilterChange('createdAt', event.target.value)}
                        placeholder="Chọn thời gian"
                        className="loan-history-page__filter-input"
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        value={filters.unit}
                        onChange={(event) => handleFilterChange('unit', event.target.value)}
                        placeholder="Tìm đơn vị / số TK"
                        className="loan-history-page__filter-input"
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        value={filters.loanAmount}
                        onChange={(event) => handleFilterChange('loanAmount', event.target.value)}
                        placeholder="Tìm khoản vay"
                        className="loan-history-page__filter-input"
                      />
                    </th>
                    <th>
                      <select
                        value={filters.loanTerm}
                        onChange={(event) => handleFilterChange('loanTerm', event.target.value)}
                        className="loan-history-page__filter-select"
                      >
                        <option value="">Tất cả</option>
                        {termOptions.map((term) => (
                          <option key={term} value={String(term)}>{`${term} tháng`}</option>
                        ))}
                      </select>
                    </th>
                    <th />
                    <th>
                      <select
                        value={filters.status}
                        onChange={(event) => handleFilterChange('status', event.target.value)}
                        className="loan-history-page__filter-select"
                      >
                        <option value="">Tất cả</option>
                        {statusOptions.map((statusCode) => (
                          <option key={statusCode} value={String(statusCode)}>
                            {STATUS_META[statusCode]?.label || `Trạng thái ${statusCode}`}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="loan-history-page__empty">Đang tải dữ liệu...</td>
                    </tr>
                  ) : null}

                  {!loading && filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="loan-history-page__empty">Không có dữ liệu phù hợp</td>
                    </tr>
                  ) : null}

                  {!loading
                    ? filteredRows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.stt}</td>
                          <td>{row.createdAtDisplay}</td>
                          <td>
                            <div className="loan-history-page__unit-branch">{row.unitBranch}</div>
                            <div className="loan-history-page__unit-account">{row.unitAccountNumber}</div>
                          </td>
                          <td>{row.loanAmountDisplay}</td>
                          <td>{row.loanTermDisplay}</td>
                          <td>{row.interestRateDisplay}</td>
                          <td>
                            <span className={`loan-history-page__status loan-history-page__status--${row.statusTone}`}>
                              {row.statusLabel}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="loan-history-page__view-btn"
                              title={`Mã hợp đồng ${row.contractCode}`}
                              aria-label={`Xem chi tiết hợp đồng ${row.contractCode}`}
                              onClick={() => handleOpenDetail(row)}
                            >
                               <EyeIcon />
                             </button>
                           </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default LoanHistoryPage;

