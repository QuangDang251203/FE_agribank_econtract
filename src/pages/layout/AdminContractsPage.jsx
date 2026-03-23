import { useEffect, useMemo, useState } from 'react';
import { useCreateContract } from '../../hooks/useCreateContract';
import '../../styles/adminContractsPage.css';

const STATUS_META = {
  1: { label: 'Chờ ký', tone: 'pending' },
  2: { label: 'Chờ phê duyệt', tone: 'pending' },
  200: { label: 'Hoàn thành', tone: 'success' },
  400: { label: 'Từ chối', tone: 'danger' },
};

function formatDate(value) {
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

function formatCurrency(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString('vi-VN');
}

function formatRate(value) {
  const interestValue = Number(value);
  if (!Number.isFinite(interestValue)) {
    return 'N/A';
  }

  const percent = interestValue <= 1 ? interestValue * 100 : interestValue;
  return `${percent.toFixed(percent % 1 === 0 ? 0 : 1)}%`;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="admin-contracts-page__eye-icon">
      <path d="M1.8 8c1.7-2.7 3.8-4 6.2-4s4.5 1.3 6.2 4c-1.7 2.7-3.8 4-6.2 4S3.5 10.7 1.8 8Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ApproveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="admin-contracts-page__action-icon">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
    </svg>
  );
}

function RejectIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="admin-contracts-page__action-icon">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
    </svg>
  );
}

function AdminContractsPage({ onNavigate }) {
  const { fetchAllContracts } = useCreateContract();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    createdAt: '',
    borrower: '',
    unit: '',
    representative: '',
    loanAmount: '',
    loanTerm: '',
    status: '',
  });

  useEffect(() => {
    let mounted = true;

    const loadAllContracts = async () => {
      try {
        setLoading(true);
        setError('');

        const contracts = await fetchAllContracts();
        if (!mounted) {
          return;
        }

        const normalizedRows = contracts.map((item, index) => {
          const contract = item?.contractInfo || item || {};
          const cccdInfo = item?.cccdInfo || contract?.cccdInfo || {};
          const statusCode = Number(contract?.status);
          const statusMeta = STATUS_META[statusCode] || { label: `Trạng thái ${statusCode}`, tone: 'draft' };

          return {
            id: `${contract?.contractCode || 'contract'}-${index}`,
            stt: index + 1,
            contractCode: contract?.contractCode || '',
            rawContract: {
              ...contract,
              cccdInfo,
            },
            createdAtRaw: contract?.createdAt || '',
            createdAtDisplay: formatDate(contract?.createdAt),
            borrowerName: contract?.client?.businessName || 'N/A',
            unitBranch: contract?.bankAccount?.branchName || 'N/A',
            unitAccountNumber: contract?.bankAccount?.bankAccountNumber || 'N/A',
            representativeName:
              cccdInfo?.representative ||
              contract?.representative ||
              contract?.client?.representativeName ||
              'N/A',
            representativeIdentity:
              cccdInfo?.cccdNumber ||
              contract?.representativeIdentity ||
              contract?.client?.idNumber ||
              'N/A',
            loanAmountRaw: Number(contract?.loanAmount) || 0,
            loanAmountDisplay: formatCurrency(contract?.loanAmount),
            loanTermRaw: Number(contract?.loanTerm) || 0,
            loanTermDisplay: `${Number(contract?.loanTerm) || 0} tháng`,
            interestRateDisplay: formatRate(contract?.interestRate),
            statusRaw: statusCode,
            statusLabel: statusMeta.label,
            statusTone: statusMeta.tone,
          };
        });

        setRows(normalizedRows);
      } catch (loadError) {
        if (mounted) {
          setRows([]);
          setError(loadError.message || 'Không thể tải danh sách hợp đồng');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAllContracts();

    return () => {
      mounted = false;
    };
  }, [fetchAllContracts]);

  const filteredRows = useMemo(() => {
    const createdFilter = filters.createdAt.trim().toLowerCase();
    const borrowerFilter = filters.borrower.trim().toLowerCase();
    const representativeFilter = filters.representative.trim().toLowerCase();
    const unitFilter = filters.unit.trim().toLowerCase();
    const amountFilter = filters.loanAmount.replace(/[^\d]/g, '');

    return rows.filter((row) => {
      const createdMatches = !createdFilter || row.createdAtDisplay.toLowerCase().includes(createdFilter);
      const borrowerMatches = !borrowerFilter || row.borrowerName.toLowerCase().includes(borrowerFilter);
      const representativeText = `${row.representativeName} ${row.representativeIdentity}`.toLowerCase();
      const representativeMatches = !representativeFilter || representativeText.includes(representativeFilter);
      const unitText = `${row.unitBranch} ${row.unitAccountNumber}`.toLowerCase();
      const unitMatches = !unitFilter || unitText.includes(unitFilter);
      const amountMatches = !amountFilter || String(row.loanAmountRaw).includes(amountFilter);
      const termMatches = !filters.loanTerm || String(row.loanTermRaw) === filters.loanTerm;
      const statusMatches = !filters.status || String(row.statusRaw) === filters.status;

      return createdMatches && borrowerMatches && representativeMatches && unitMatches && amountMatches && termMatches && statusMatches;
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
      console.warn('onNavigate not available');
      return;
    }

    // Log để debug
    console.log('Opening detail for row:', row);

    // Thử lấy contractCode từ nhiều nơi
    const contractCode = row?.contractCode || 
                        row?.rawContract?.contractCode || 
                        row?.contract?.contractCode ||
                        '';

    if (!contractCode) {
      console.warn('No contract code found in row:', row);
      alert('Không tìm thấy mã hợp đồng. Vui lòng thử lại.');
      return;
    }

    console.log('Navigating to loan-history-detail with code:', contractCode);

    onNavigate('loan-history-detail', {
      contractCode: contractCode,
      contractData: row.rawContract || row.contract || row,
    });
  };

  const handleApproveContract = async (row) => {
    try {
      const contractCode = row?.contractCode || row?.rawContract?.contractCode || '';
      
      console.log('Row data:', row);
      console.log('Contract code:', contractCode);
      
      if (!contractCode) {
        alert('Không tìm thấy mã hợp đồng');
        return;
      }

      const confirmed = window.confirm(`Bạn có chắc chắn muốn phê duyệt hợp đồng ${contractCode}?`);
      if (!confirmed) {
        return;
      }

      setLoading(true);
      
      // Gọi API phê duyệt
      const apiUrl = `/api/contract/admin/approve/${contractCode}`;
      console.log('Calling API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.code === '00' || result.success) {
        alert('Phê duyệt hợp đồng thành công!');
        // Reload danh sách bằng cách set lại rows
        const updatedRows = rows.map(r => {
          if (r.id === row.id) {
            return {
              ...r,
              statusRaw: 200,
              statusLabel: 'Hoàn thành',
              statusTone: 'success',
            };
          }
          return r;
        });
        setRows(updatedRows);
      } else {
        throw new Error(result.message || 'Lỗi phê duyệt hợp đồng');
      }
    } catch (error) {
      console.error('Error approving contract:', error);
      alert(`Lỗi phê duyệt hợp đồng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectContract = async (row) => {
    try {
      const contractCode = row?.contractCode || row?.rawContract?.contractCode || '';
      
      console.log('Row data:', row);
      console.log('Contract code:', contractCode);
      
      if (!contractCode) {
        alert('Không tìm thấy mã hợp đồng');
        return;
      }

      const confirmed = window.confirm(`Bạn có chắc chắn muốn từ chối hợp đồng ${contractCode}?`);
      if (!confirmed) {
        return;
      }

      setLoading(true);
      
      // Gọi API từ chối
      const apiUrl = `/contracts/admin/reject/${contractCode}`;
      console.log('Calling API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.code === '00' || result.success) {
        alert('Từ chối hợp đồng thành công!');
        // Reload danh sách bằng cách set lại rows
        const updatedRows = rows.map(r => {
          if (r.id === row.id) {
            return {
              ...r,
              statusRaw: 400,
              statusLabel: 'Từ chối',
              statusTone: 'danger',
            };
          }
          return r;
        });
        setRows(updatedRows);
      } else {
        throw new Error(result.message || 'Lỗi từ chối hợp đồng');
      }
    } catch (error) {
      console.error('Error rejecting contract:', error);
      alert(`Lỗi từ chối hợp đồng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-contracts-page">
      <section className="admin-contracts-page__panel">
        <div className="admin-contracts-page__titlebar">
          <h1>Hợp đồng vay có thế chấp</h1>
        </div>

        <div className="admin-contracts-page__workspace">
          <section className="admin-contracts-page__card">
            <header className="admin-contracts-page__card-header">
              <h2>Danh sách hợp đồng KHDN vay có thế chấp</h2>
            </header>

            {error ? <p className="admin-contracts-page__error">{error}</p> : null}

            <div className="admin-contracts-page__table-wrap">
              <table className="admin-contracts-page__table" aria-label="Bảng danh sách hợp đồng admin">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Thời gian tạo</th>
                    <th>Bên vay</th>
                    <th>Đơn vị</th>
                    <th>Người đại diện</th>
                    <th>Khoản vay (VND)</th>
                    <th>Thời hạn vay</th>
                    <th>Lãi suất</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                  <tr className="admin-contracts-page__filters-row">
                    <th />
                    <th>
                      <input
                        type="text"
                        value={filters.createdAt}
                        onChange={(event) => handleFilterChange('createdAt', event.target.value)}
                        placeholder="Chọn thời gian"
                        className="admin-contracts-page__filter-input"
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        value={filters.borrower}
                        onChange={(event) => handleFilterChange('borrower', event.target.value)}
                        placeholder="Tìm bên vay"
                        className="admin-contracts-page__filter-input"
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        value={filters.unit}
                        onChange={(event) => handleFilterChange('unit', event.target.value)}
                        placeholder="Tìm đơn vị / số TK"
                        className="admin-contracts-page__filter-input"
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        value={filters.representative}
                        onChange={(event) => handleFilterChange('representative', event.target.value)}
                        placeholder="Tìm người đại diện"
                        className="admin-contracts-page__filter-input"
                      />
                    </th>
                    <th>
                      <input
                        type="text"
                        value={filters.loanAmount}
                        onChange={(event) => handleFilterChange('loanAmount', event.target.value)}
                        placeholder="Tìm khoản vay"
                        className="admin-contracts-page__filter-input"
                      />
                    </th>
                    <th>
                      <select
                        value={filters.loanTerm}
                        onChange={(event) => handleFilterChange('loanTerm', event.target.value)}
                        className="admin-contracts-page__filter-select"
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
                        className="admin-contracts-page__filter-select"
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
                      <td colSpan={10} className="admin-contracts-page__empty">Đang tải dữ liệu...</td>
                    </tr>
                  ) : null}

                  {!loading && filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="admin-contracts-page__empty">Không có dữ liệu phù hợp</td>
                    </tr>
                  ) : null}

                  {!loading
                    ? filteredRows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.stt}</td>
                          <td>{row.createdAtDisplay}</td>
                          <td>{row.borrowerName}</td>
                          <td>
                            <div className="admin-contracts-page__unit-branch">{row.unitBranch}</div>
                            <div className="admin-contracts-page__unit-account">{row.unitAccountNumber}</div>
                          </td>
                          <td>
                            <div className="admin-contracts-page__unit-branch">{row.representativeName}</div>
                            <div className="admin-contracts-page__unit-account">{row.representativeIdentity}</div>
                          </td>
                          <td>{row.loanAmountDisplay}</td>
                          <td>{row.loanTermDisplay}</td>
                          <td>{row.interestRateDisplay}</td>
                          <td>
                            <span className={`admin-contracts-page__status admin-contracts-page__status--${row.statusTone}`}>
                              {row.statusLabel}
                            </span>
                          </td>
                          <td>
                            <div className="admin-contracts-page__actions">
                              <button
                                type="button"
                                className="admin-contracts-page__action-btn admin-contracts-page__action-btn--view"
                                title={`Xem chi tiết hợp đồng ${row.contractCode}`}
                                aria-label={`Xem chi tiết hợp đồng ${row.contractCode}`}
                                onClick={() => {
                                  console.log('View button clicked for:', row);
                                  handleOpenDetail(row);
                                }}
                              >
                                <EyeIcon />
                              </button>
                              <button
                                type="button"
                                className="admin-contracts-page__action-btn admin-contracts-page__action-btn--approve"
                                title="Phê duyệt"
                                aria-label="Phê duyệt hợp đồng"
                                onClick={() => handleApproveContract(row)}
                              >
                                <ApproveIcon />
                              </button>
                              <button
                                type="button"
                                className="admin-contracts-page__action-btn admin-contracts-page__action-btn--reject"
                                title="Từ chối"
                                aria-label="Từ chối hợp đồng"
                                onClick={() => handleRejectContract(row)}
                              >
                                <RejectIcon />
                              </button>
                            </div>
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

export default AdminContractsPage;

