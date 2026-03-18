import { useEffect, useMemo, useState } from 'react';
import { useCreateContract } from '../../hooks/useCreateContract';
import '../../styles/loanContractDetailPage.css';

const STATUS_META = {
  1: { label: 'Chờ ký', tone: 'pending' },
  2: { label: 'Hoàn thành', tone: 'success' },
  99: { label: 'Đã hủy', tone: 'danger' },
};

const PAYMENT_META = {
  'end-term': 'Gốc, lãi trả cuối kỳ',
  'monthly-interest': 'Trả lãi hàng tháng',
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
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return 'N/A';
  }

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

function toPaymentLabel(value) {
  if (!value) {
    return 'N/A';
  }

  return PAYMENT_META[value] || value;
}

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let index = 0; index < byteCharacters.length; index += 1) {
    byteNumbers[index] = byteCharacters.charCodeAt(index);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType || 'application/pdf' });
}

function resolveFileNameByPath(filePath, fallbackName) {
  const normalized = String(filePath || '').replace(/\\/g, '/');
  const parts = normalized.split('/').filter(Boolean);
  return parts[parts.length - 1] || fallbackName;
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
  const { fetchContractDetailByCode, fetchContractFileByCode } = useCreateContract();
  const [detailPayload, setDetailPayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openFileLoading, setOpenFileLoading] = useState(false);
  const [error, setError] = useState('');

  const contractCode =
    pageState?.contractCode ||
    pageState?.contractData?.contractCode ||
    pageState?.contractData?.contractInfo?.contractCode ||
    '';

  useEffect(() => {
    if (!contractCode) {
      setError('Khong tim thay ma hop dong');
      return;
    }

    let mounted = true;

    const loadContractDetail = async () => {
      try {
        setLoading(true);
        setError('');

        const payload = await fetchContractDetailByCode(contractCode);
        if (!mounted) {
          return;
        }

        setDetailPayload(payload);
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || 'Khong the tai chi tiet hop dong');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadContractDetail();

    return () => {
      mounted = false;
    };
  }, [contractCode, fetchContractDetailByCode]);

  const mergedContract = useMemo(() => {
    const contractInfo = detailPayload?.contractInfo || {};
    const fallbackContract = pageState?.contractData || {};
    const apiClientInfo = detailPayload?.clientInfo || {};
    const apiCccdInfo = detailPayload?.cccdInfo || {};

    return {
      ...fallbackContract,
      ...contractInfo,
      bankAccount: contractInfo.bankAccount || fallbackContract.bankAccount || {},
      client: contractInfo.client || apiClientInfo || fallbackContract.client || {},
      cccdInfo: contractInfo.cccdInfo || apiCccdInfo || fallbackContract.cccdInfo || {},
      savingBook: contractInfo.savingBook || fallbackContract.savingBook || {},
    };
  }, [detailPayload, pageState?.contractData]);

  const statusMeta = useMemo(() => {
    const statusCode = Number(mergedContract?.status);
    return STATUS_META[statusCode] || { label: `Trang thai ${statusCode || ''}`.trim(), tone: 'draft' };
  }, [mergedContract?.status]);

  const attachments = useMemo(() => {
    const list = [];
    const fallbackName = mergedContract?.contractCode ? `${mergedContract.contractCode}.pdf` : 'contract.pdf';

    if (detailPayload?.fileContentBase64) {
      list.push({
        id: 'main-file',
        fileName: detailPayload.fileName || fallbackName,
        mimeType: detailPayload.mimeType || 'application/pdf',
        fileContentBase64: detailPayload.fileContentBase64,
      });
    }

    if (detailPayload?.fileInfo?.filePath && list.length === 0) {
      list.push({
        id: 'path-file',
        fileName: resolveFileNameByPath(detailPayload.fileInfo.filePath, fallbackName),
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'fallback-file',
        fileName: `${mergedContract?.contractCode || 'hop_dong'}_signed.pdf`,
      });
    }

    return list;
  }, [detailPayload, mergedContract?.contractCode]);

  const handleOpenAttachment = async (attachment) => {
    try {
      setOpenFileLoading(true);

      let blob = null;
      let fileName = attachment.fileName || `${mergedContract?.contractCode || 'hop_dong'}.pdf`;
      let mimeType = attachment.mimeType || 'application/pdf';

      if (attachment.fileContentBase64) {
        blob = base64ToBlob(attachment.fileContentBase64, mimeType);
      } else {
        const fallbackFile = await fetchContractFileByCode(mergedContract?.contractCode || contractCode);
        blob = fallbackFile?.blob || null;
        fileName = fallbackFile?.fileName || fileName;
        mimeType = fallbackFile?.contentType || mimeType;
      }

      if (!blob) {
        throw new Error('Khong tim thay tep hop dong');
      }

      const objectUrl = URL.createObjectURL(new Blob([blob], { type: mimeType }));
      const openedWindow = window.open(objectUrl, '_blank', 'noopener,noreferrer');

      if (!openedWindow) {
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 45000);
    } catch (openError) {
      setError(openError.message || 'Khong the mo tep hop dong');
    } finally {
      setOpenFileLoading(false);
    }
  };

  return (
    <main className="loan-contract-detail">
      <section className="loan-contract-detail__panel">
        <div className="loan-contract-detail__titlebar">
          <button
            type="button"
            className="loan-contract-detail__back"
            onClick={() => onNavigate?.('loan-history')}
            aria-label="Quay lai"
          >
            &lsaquo;
          </button>
          <h1>Chi tiết hợp đồng</h1>
        </div>

        {loading ? <p className="loan-contract-detail__notice">Dang tai du lieu...</p> : null}
        {error ? <p className="loan-contract-detail__notice loan-contract-detail__notice--error">{error}</p> : null}

        {!loading && !error ? (
          <div className="loan-contract-detail__workspace">
            <section className="loan-contract-detail__card loan-contract-detail__card--contract">
              <header className="loan-contract-detail__card-header">
                <div className="loan-contract-detail__header-left">
                  <h2>Thông tin hợp đồng</h2>
                  <span className={`loan-contract-detail__status loan-contract-detail__status--${statusMeta.tone}`}>{statusMeta.label}</span>
                </div>
                <button type="button" className="loan-contract-detail__action-btn">Lịch sử</button>
              </header>

              <div className="loan-contract-detail__row-title">
                <h3 className="loan-contract-detail__section-title">Thông tin bên vay</h3>
                <span className="loan-contract-detail__created-at">Được khởi tạo {formatDate(mergedContract?.createdAt)}</span>
              </div>

              <div className="loan-contract-detail__grid loan-contract-detail__grid--two">
                <Field label="Bên vay" value={mergedContract?.client?.businessName || mergedContract?.businessName} />
                <Field label="Địa chỉ" value={mergedContract?.client?.address} />
                <Field label="Số điện thoại" value={mergedContract?.client?.phone} />
                <Field label="FAX" value={mergedContract?.client?.fax||"0988967854"} />
                <Field label="Số tài khoản" value={mergedContract?.bankAccount?.bankAccountNumber} />
                <Field label="Chi nhánh" value={mergedContract?.bankAccount?.branchName} />
              </div>

              <h3 className="loan-contract-detail__section-title">Thông tin người đại diện</h3>
              <div className="loan-contract-detail__grid loan-contract-detail__grid--two">
                <Field label="Người đại diện" value={mergedContract?.cccdInfo?.representative || mergedContract?.client?.representativeName || mergedContract?.client?.businessName} />
                <Field label="Chức vụ" value="Giám đốc" />
                <Field label="Số CCCD/Hộ chiếu" value={mergedContract?.cccdInfo?.cccdNumber || mergedContract?.client?.idNumber} />
                <Field label="Nơi cấp" value={mergedContract?.cccdInfo?.issuingLocation || mergedContract?.client?.issuePlace} />
              </div>

              <h3 className="loan-contract-detail__section-title">Hợp đồng đính kèm</h3>
              <div className="loan-contract-detail__attachments">
                {attachments.map((attachment) => (
                  <button
                    key={attachment.id}
                    type="button"
                    className="loan-contract-detail__file-card"
                    onClick={() => handleOpenAttachment(attachment)}
                    disabled={openFileLoading}
                    title={attachment.fileName}
                  >
                    <span className="loan-contract-detail__file-icon">PDF</span>
                    <span className="loan-contract-detail__file-name">{attachment.fileName}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="loan-contract-detail__card loan-contract-detail__card--loan">
              <header className="loan-contract-detail__card-header">
                <div className="loan-contract-detail__header-left">
                  <h2>Thông tin khoản vay</h2>
                </div>
                <button type="button" className="loan-contract-detail__action-btn" aria-label="Tuy chon">
                  <span>▦</span>
                </button>
              </header>

              <h3 className="loan-contract-detail__section-title">Thong tin khoan vay</h3>
              <div className="loan-contract-detail__grid loan-contract-detail__grid--two">
                <Field label="Khoản vay(VNĐ)" value={formatCurrency(mergedContract?.loanAmount)} />
                <Field label="Bằng chữ" value={mergedContract?.loanAmountByWords} />
                <Field label="Thời hạn vay" value={`${Number(mergedContract?.loanTerm) || 0} thang`} />
                <Field label="Lãi suất" value={formatRate(mergedContract?.interestRate)} />
                <Field label="Phương thức trả" value={toPaymentLabel(mergedContract?.paymentMethod)} />
                <Field label="Ngày hiệu lực" value={formatDate(mergedContract?.effectiveDate || mergedContract?.createdAt)} />
              </div>

              <h3 className="loan-contract-detail__section-title">Thông tin thế chấp</h3>
              <div className="loan-contract-detail__grid loan-contract-detail__grid--two">
                <Field label="Loại hình thế chấp" value={mergedContract?.savingBook?.type || 'Số tiết kiệm'} />
                <Field label="Thời hạn" value={`${Number(mergedContract?.savingBook?.duration || mergedContract?.loanTerm) || 0} tháng`} />
                <Field label="Giá trị(VNĐ)" value={formatCurrency(mergedContract?.savingBook?.balance)} />
                <Field label="Bằng chữ" value={mergedContract?.savingBook?.amountByWords} />
                <Field label="Ngày đến hạn" value={formatDate(mergedContract?.savingBook?.maturityDate || mergedContract?.savingBook?.createdAt)} />
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default LoanContractDetailPage;
