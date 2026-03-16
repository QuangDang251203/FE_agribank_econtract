import { useEffect, useMemo, useRef, useState } from 'react';
import { useCreateContract } from '../../hooks/useCreateContract';
import {
  extractContractCodeFromText,
  getLatestContractCode,
  normalizeContractCode,
  saveContractCode,
} from '../../utils/contractCodeStorage';
import { addNotification } from '../../utils/notificationStore';
import '../../styles/loanSigningPage.css';
import '../../styles/otpModal.css';

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="loan-signing__btn-icon">
      <path d="M3.5 8.3 6.7 11.5 12.6 4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="loan-signing__btn-icon">
      <path d="M8 3.2v6.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m5.8 7.5 2.2 2.3 2.2-2.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.4 12.2h9.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SuccessAlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="loan-signing__status-alert-icon">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path d="M7.4 12.3 10.2 15l6.4-6.2" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoanSigningPage({ onNavigate, pageState }) {
  const { sendOtp, signContract } = useCreateContract();
  const canvasRef = useRef(null);
  const otpInputRefs = useRef([]);
  const queryData = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      docKey: params.get('docKey') || '',
      preview: params.get('preview') || '',
      fileName: params.get('fileName') || '',
      contractCode: params.get('contractCode') || '',
    };
  }, []);

  const contractCode = pageState?.contractCode || queryData.contractCode || '';
  const currentBusinessCode = localStorage.getItem('businessCode') || '';
  const [previewUrl, setPreviewUrl] = useState(pageState?.previewUrl || queryData.preview || '');
  const [fileName, setFileName] = useState(pageState?.fileName || queryData.fileName || `${contractCode || 'hop_dong'}.pdf`);
  const [resolvedContractCode, setResolvedContractCode] = useState(
    normalizeContractCode(contractCode || getLatestContractCode(currentBusinessCode) || localStorage.getItem('lastContractCode') || '')
  );
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureError, setSignatureError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpAttemptCount, setOtpAttemptCount] = useState(0);
  const [isSigningContract, setIsSigningContract] = useState(false);
  const [statusAlert, setStatusAlert] = useState({ isOpen: false, message: '', type: 'success' });
  const MAX_OTP_ATTEMPTS = 5;

  const showStatusAlert = (message, type = 'success') => {
    setStatusAlert({ isOpen: true, message, type });
  };

  const closeStatusAlert = () => {
    setStatusAlert({ isOpen: false, message: '', type: 'success' });
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('loan-create');
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.close();
  };

  useEffect(() => {
    if (!contractCode) {
      return;
    }

    const normalized = normalizeContractCode(contractCode);
    setResolvedContractCode(normalized);
    saveContractCode({
      businessCode: currentBusinessCode,
      contractCode: normalized,
      source: 'signing-query',
    });
    localStorage.setItem('lastContractCode', normalized);
  }, [contractCode, currentBusinessCode]);

  useEffect(() => {
    if (previewUrl || !queryData.docKey) {
      return undefined;
    }

    try {
      const rawData = sessionStorage.getItem(queryData.docKey);
      if (!rawData) {
        return undefined;
      }

      const parsed = JSON.parse(rawData);
      const dataUrl = parsed?.data;
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.includes(',')) {
        return undefined;
      }

      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }

      const blob = new Blob([bytes], { type: parsed?.contentType || 'application/pdf' });
      const localPreviewUrl = URL.createObjectURL(blob);
      setPreviewUrl(localPreviewUrl);
      const parsedFileName = parsed?.fileName || `${contractCode || 'hop_dong'}.pdf`;
      setFileName(parsedFileName);

      const extractedFromFile = extractContractCodeFromText(parsedFileName);
      if (extractedFromFile) {
        const normalized = normalizeContractCode(extractedFromFile);
        saveContractCode({
          businessCode: currentBusinessCode,
          contractCode: normalized,
          source: 'pdf-file-name',
        });
        setResolvedContractCode((currentValue) => currentValue || normalized);
        localStorage.setItem('lastContractCode', normalized);
      }
    } catch {
      // Keep fallback UI if parsing fails.
    }

    return undefined;
  }, [previewUrl, queryData.docKey, contractCode, currentBusinessCode]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const pushBellNotification = (type, message) => {
    addNotification({ type, message });
  };

  useEffect(() => {
    if (!isSignatureModalOpen) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.fillStyle = '#f4f5fc';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#3b3f56';
  }, [isSignatureModalOpen]);

  const documentItems = useMemo(
    () => [
      { key: 'main', label: contractCode || 'Hợp đồng tín dụng' },
      { key: 'annex-1', label: 'Phụ lục 1' },
      { key: 'annex-2', label: 'Phụ lục 2' },
      { key: 'policy', label: 'Chính sách bảo mật' },
    ],
    [contractCode]
  );

  const handleDownload = () => {
    if (!previewUrl) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = previewUrl;
    anchor.download = fileName || 'contract.pdf';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const openSignatureModal = () => {
    setIsSignatureModalOpen(true);
    setSignatureError('');
    setHasSignature(false);
    setIsDrawing(false);

    if (!resolvedContractCode) {
      const fallbackCode = normalizeContractCode(
        getLatestContractCode(currentBusinessCode) || localStorage.getItem('lastContractCode') || ''
      );
      if (fallbackCode) {
        setResolvedContractCode(fallbackCode);
      }
    }
  };

  const closeSignatureModal = () => {
    setIsSignatureModalOpen(false);
    setSignatureError('');
    setIsDrawing(false);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setOtpAttemptCount(0);
    setIsSigningContract(false);
  };

  const clearOtpInputs = () => {
    setOtpDigits(['', '', '', '', '', '']);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 0);
  };

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleSignatureMouseDown = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const point = getCanvasPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    setIsDrawing(true);
    setSignatureError('');
  };

  const handleSignatureMouseMove = (event) => {
    if (!isDrawing) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const point = getCanvasPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    setHasSignature(true);
  };

  const handleOtpDigitChange = (index, value) => {
    const nextValue = value.replace(/\D/g, '').slice(-1);
    setOtpDigits((current) => {
      const updated = [...current];
      updated[index] = nextValue;
      return updated;
    });

    if (nextValue && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }

    setOtpError('');
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleConfirmOtpCode = async () => {
    const otpValue = otpDigits.join('');
    if (otpValue.length !== 6) {
      setOtpError('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    if (!resolvedContractCode) {
      const contractCodeError = 'Không tìm thấy mã hợp đồng để xác nhận OTP';
      setOtpError(contractCodeError);
      showStatusAlert(contractCodeError, 'error');
      return;
    }

    if (otpAttemptCount >= MAX_OTP_ATTEMPTS) {
      const lockMessage = 'Bạn đã nhập OTP sai tối đa 5 lần. Vui lòng gửi lại OTP mới.';
      setOtpError(lockMessage);
      showStatusAlert(lockMessage, 'error');
      return;
    }

    try {
      setIsSigningContract(true);
      await signContract(resolvedContractCode, otpValue);
      const successMessage = 'Ký hợp đồng thành công';
      showStatusAlert(successMessage, 'success');
      pushBellNotification('success', successMessage);
      closeOtpModal();
    } catch (error) {
      const rawErrorMessage = String(error?.message || '');
      const normalizedErrorMessage = rawErrorMessage.toLowerCase();
      const isOtpIncorrectError =
        normalizedErrorMessage.includes('otp is incorrect') ||
        normalizedErrorMessage.includes('otp incorrect') ||
        normalizedErrorMessage.includes('mã otp không đúng') ||
        normalizedErrorMessage.includes('otp không đúng');

      if (isOtpIncorrectError) {
        const nextAttempts = otpAttemptCount + 1;
        setOtpAttemptCount(nextAttempts);
        clearOtpInputs();

        if (nextAttempts >= MAX_OTP_ATTEMPTS) {
          const lockMessage = 'Bạn đã nhập OTP sai tối đa 5 lần. Vui lòng gửi lại OTP mới.';
          setOtpError(lockMessage);
          showStatusAlert(lockMessage, 'error');
        } else {
          const wrongOtpMessage = 'Mã OTP không đúng';
          setOtpError(`${wrongOtpMessage}. Bạn còn ${MAX_OTP_ATTEMPTS - nextAttempts} lần thử.`);
          showStatusAlert(wrongOtpMessage, 'error');
        }

        return;
      }

      const fallbackMessage = rawErrorMessage || 'Xác nhận OTP thất bại';
      setOtpError(fallbackMessage);
      showStatusAlert(fallbackMessage, 'error');
    } finally {
      setIsSigningContract(false);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) {
      return;
    }

    setIsDrawing(false);
  };

  const resetSignatureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.fillStyle = '#f4f5fc';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSignatureError('');
  };

  const handleConfirmSignature = async () => {
    if (!hasSignature) {
      setSignatureError('Vui lòng ký vào khung trước khi xác nhận');
      return;
    }

    if (!resolvedContractCode) {
      setSignatureError('Không lấy được mã hợp đồng tự động. Vui lòng tạo lại hợp đồng để hệ thống ghi nhận mã.');
      return;
    }

    try {
      setIsSendingOtp(true);
      const otpMessage = await sendOtp(resolvedContractCode);
      saveContractCode({
        businessCode: currentBusinessCode,
        contractCode: resolvedContractCode,
        source: 'send-otp-confirm',
      });
      localStorage.setItem('lastContractCode', resolvedContractCode);

      pushBellNotification('success', otpMessage || `Đã gửi OTP cho hợp đồng ${resolvedContractCode}`);
      closeSignatureModal();
      setIsOtpModalOpen(true);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setOtpAttemptCount(0);
    } catch (error) {
      pushBellNotification('error', error.message || 'Gửi OTP thất bại');
      setSignatureError(error.message || 'Gửi OTP thất bại');
    } finally {
      setIsSendingOtp(false);
    }

  };



  return (
    <main className="loan-signing">
      {statusAlert.isOpen ? (
        <div className={`loan-signing__status-alert loan-signing__status-alert--${statusAlert.type}`} role="alert" aria-live="assertive">
          <SuccessAlertIcon />
          <p className="loan-signing__status-alert-message">{statusAlert.message}</p>
          <button type="button" className="loan-signing__status-alert-close" onClick={closeStatusAlert} aria-label="Đóng thông báo">
            x
          </button>
        </div>
      ) : null}

      <header className="loan-signing__toolbar">
        <button type="button" className="loan-signing__back" onClick={handleBack}>
          Quay lai
        </button>

        <div className="loan-signing__actions">
          <button type="button" className="loan-signing__btn loan-signing__btn--success" onClick={openSignatureModal}>
            <CheckIcon />
            <span>Ký</span>
          </button>
          <button type="button" className="loan-signing__btn loan-signing__btn--danger">
            <span>Từ chối</span>
          </button>
          <button type="button" className="loan-signing__btn loan-signing__btn--ghost" onClick={handleDownload}>
            <DownloadIcon />
            <span>Tải xuống</span>
          </button>
        </div>
      </header>

      <section className="loan-signing__body">
        <aside className="loan-signing__sidebar">
          <h2>Danh sách tài liệu</h2>
          <ul>
            {documentItems.map((item, index) => (
              <li key={item.key} className={index === 0 ? 'is-active' : ''}>
                {item.label}
              </li>
            ))}
          </ul>
        </aside>

        <section className="loan-signing__viewer">
          {previewUrl ? (
            <iframe title="Hop dong PDF" src={previewUrl} className="loan-signing__iframe" />
          ) : (
            <div className="loan-signing__empty">Khong co du lieu hop dong de xem truoc.</div>
          )}
        </section>
      </section>

      {isSignatureModalOpen ? (
        <div className="loan-signing__signature-overlay" role="presentation">
          <section className="loan-signing__signature-modal" role="dialog" aria-modal="true" aria-labelledby="signature-title">
            <header className="loan-signing__signature-header">
              <h3 id="signature-title">Xác nhận chữ ký người đại diện</h3>
              <button type="button" className="loan-signing__signature-close" onClick={closeSignatureModal} aria-label="Đóng popup chữ ký">
                x
              </button>
            </header>

            <div className="loan-signing__signature-body">
              <canvas
                ref={canvasRef}
                className="loan-signing__signature-canvas"
                width={640}
                height={220}
                onMouseDown={handleSignatureMouseDown}
                onMouseMove={handleSignatureMouseMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              {signatureError ? <p className="loan-signing__signature-error">{signatureError}</p> : null}
            </div>

            <footer className="loan-signing__signature-actions">
              <button
                type="button"
                className="loan-signing__btn loan-signing__btn--danger-soft"
                onClick={handleConfirmSignature}
                disabled={isSendingOtp}
              >
                {isSendingOtp ? 'Đang gửi OTP...' : 'Xác nhận'}
              </button>
              <button type="button" className="loan-signing__btn loan-signing__btn--ghost" onClick={resetSignatureCanvas}>
                Vẽ lại
              </button>
              <button type="button" className="loan-signing__btn loan-signing__btn--ghost" onClick={closeSignatureModal}>
                Hủy
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {isOtpModalOpen ? (
        <div className="loan-signing__signature-overlay" role="presentation">
          <section className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
            <header className="otp-modal__header">
              <h3 id="otp-title">Xác nhận mã OTP</h3>
              <button type="button" className="otp-modal__close" onClick={closeOtpModal} aria-label="Đóng popup OTP">
                x
              </button>
            </header>

            <div className="otp-modal__body">
              <p className="otp-modal__instruction">Vui lòng điền mã OTP được gửi về hệ thống E-Contract</p>
              <div className="otp-modal__inputs">
                {otpDigits.map((digit, index) => (
                  <input
                    key={`otp-${index + 1}`}
                    ref={(element) => { otpInputRefs.current[index] = element; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="otp-modal__box"
                    value={digit}
                    onChange={(event) => handleOtpDigitChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    maxLength={1}
                    disabled={isSigningContract || otpAttemptCount >= MAX_OTP_ATTEMPTS}
                  />
                ))}
              </div>
              {otpError ? <p className="otp-modal__error">{otpError}</p> : null}
            </div>

            <footer className="otp-modal__actions">
              <button
                type="button"
                className="otp-modal__confirm"
                onClick={handleConfirmOtpCode}
                disabled={isSigningContract || otpAttemptCount >= MAX_OTP_ATTEMPTS}
              >
                {isSigningContract ? 'Đang xác nhận...' : 'Xác nhận'}
              </button>
              <button type="button" className="otp-modal__cancel" onClick={closeOtpModal}>
                Hủy
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default LoanSigningPage;



