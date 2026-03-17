/**
 * Contract API Service
 * Handles API calls related to contract creation
 */

import API_CONFIG from '../../config/api.config';

const parseJsonSafe = async (response) => {
    const rawText = await response.text();
    if (!rawText) {
        return {};
    }

    try {
        return JSON.parse(rawText);
    } catch {
        return {message: rawText};
    }
};

const resolveFileNameFromDisposition = (disposition, fallbackName) => {
    const fileNameMatch = String(disposition || '').match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
    return fileNameMatch ? decodeURIComponent(fileNameMatch[1].replace(/"/g, '')) : fallbackName;
};

/**
 * Create contract
 * @param {Object} contractData - Contract data
 * @returns {Promise} Response from backend
 */
export const createContractApi = async (contractData) => {
    try {
        console.log('📤 Creating contract with data:', contractData);
        const candidateUrls = [
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTRACT.CREATE}`,
        ];

        let lastError = null;

        for (const url of candidateUrls) {
            console.log('🌐 Calling create contract URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(contractData),
            });

            console.log('📊 Create Contract Response Status:', response.status, 'URL:', url);
            const data = await parseJsonSafe(response);

            console.log('📥 Create Contract Response Data:', data);

            if (response.ok) {
                return data;
            }

            const backendMessage = data?.message || data?.error;
            lastError = new Error(
                backendMessage || `Failed to create contract with status ${response.status}`
            );

            // If endpoint not found, try next candidate URL.
            if (response.status === 404) {
                continue;
            }

            // For non-404, stop immediately (actual backend error).
            throw lastError;
        }

        throw lastError || new Error('Create contract endpoint not found');
    } catch (error) {
        console.error('❌ Create contract API error:', error);
        throw error;
    }
};

/**
 * Get all bank accounts by business code.
 * Backend returns ResponseList<BankAccount>.
 */
export const getBankAccountsByBusinessCodeApi = async (businessCode) => {
    if (!businessCode) {
        throw new Error('Business code is required');
    }

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BANK_ACCOUNT.GET_BY_BUSINESS_CODE}/${encodeURIComponent(businessCode)}`;

    try {
        console.log('📤 Fetching bank accounts with businessCode:', businessCode);
        const response = await fetch(url, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
        });

        const data = await parseJsonSafe(response);
        console.log('📥 Get bank accounts response:', data);

        if (!response.ok) {
            throw new Error(data?.message || `Failed to fetch bank accounts with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('❌ Get bank accounts API error:', error);
        throw error;
    }
};

/**
 * Get contracts by business code.
 * Backend returns ResponseList<Contract>.
 */
export const getContractsByBusinessCodeApi = async (businessCode) => {
    if (!businessCode) {
        throw new Error('Business code is required');
    }

    const encodedCode = encodeURIComponent(businessCode);
    const primaryPath = API_CONFIG.ENDPOINTS.CONTRACT.GET_BY_BUSINESS_CODE;
    const secondaryPath = primaryPath.replace('/api/contract/', '/api/contracts/');
    const candidateUrls = [
        `${API_CONFIG.BASE_URL}${primaryPath}/${encodedCode}`,
        `${API_CONFIG.BASE_URL}${secondaryPath}/${encodedCode}`,
    ];

    try {
        let lastError = null;

        for (const url of candidateUrls) {
            const response = await fetch(url, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
            });

            const data = await parseJsonSafe(response);
            if (response.ok) {
                return data;
            }

            lastError = new Error(
                data?.message || data?.error || `Failed to fetch contracts with status ${response.status}`
            );

            if (response.status === 404) {
                continue;
            }

            throw lastError;
        }

        throw lastError || new Error('Get contracts by business code endpoint not found');
    } catch (error) {
        console.error('❌ Get contracts by business code API error:', error);
        throw error;
    }
};

/**
 * Convert loan amount to Vietnamese words.
 */
export const moneyToWordsApi = async (amount) => {
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTRACT.MONEY_TO_WORDS}?amount=${Math.floor(amount)}`;

    try {
        console.log('📤 Converting amount to words:', amount);
        const response = await fetch(url, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
        });

        const text = await response.text();
        console.log('📥 Money to words response:', text);

        if (!response.ok) {
            throw new Error(text || `Failed to convert amount with status ${response.status}`);
        }

        return text;
    } catch (error) {
        console.error('❌ Money to words API error:', error);
        throw error;
    }
};

/**
 * Generate contract document and return PDF bytes.
 */
export const generateAndDownloadContractApi = async (contractCode) => {
    if (!contractCode) {
        throw new Error('Contract code is required');
    }

    const encodedCode = encodeURIComponent(contractCode);
    const primaryPath = API_CONFIG.ENDPOINTS.CONTRACT.GENERATE_AND_DOWNLOAD;
    const secondaryPath = primaryPath.replace('/api/contract/', '/api/contracts/');
    const candidateUrls = [
        `${API_CONFIG.BASE_URL}${primaryPath}/${encodedCode}`,
        `${API_CONFIG.BASE_URL}${secondaryPath}/${encodedCode}`,
    ];

    try {
        console.log('📤 Generating contract PDF for code:', contractCode);
        let lastError = null;

        for (const url of candidateUrls) {
            const response = await fetch(url, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
            });

            if (!response.ok) {
                const errorData = await parseJsonSafe(response);
                lastError = new Error(errorData?.message || `Failed to generate contract with status ${response.status}`);
                if (response.status === 404) {
                    continue;
                }
                throw lastError;
            }

            const blob = await response.blob();
            const disposition = response.headers.get('content-disposition') || '';
            const fileNameMatch = disposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
            const fileName = fileNameMatch ? decodeURIComponent(fileNameMatch[1].replace(/"/g, '')) : `${contractCode}.pdf`;

            return {
                blob,
                fileName,
                contentType: response.headers.get('content-type') || 'application/pdf',
            };
        }

        throw lastError || new Error('Generate contract endpoint not found');
    } catch (error) {
        console.error('❌ Generate contract API error:', error);
        throw error;
    }
};

/**
 * Create contract and generate PDF in one backend call.
 */
export const createAndGenerateContractApi = async (contractData) => {
    const primaryPath = API_CONFIG.ENDPOINTS.CONTRACT.CREATE_AND_GENERATE;
    const secondaryPath = primaryPath.replace('/api/contract/', '/api/contracts/');
    const candidateUrls = [
        `${API_CONFIG.BASE_URL}${primaryPath}`,
        `${API_CONFIG.BASE_URL}${secondaryPath}`,
    ];

    try {
        console.log('📤 Creating and generating contract in one request:', contractData);
        let lastError = null;

        for (const url of candidateUrls) {
            const response = await fetch(url, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(contractData),
            });

            if (!response.ok) {
                const errorData = await parseJsonSafe(response);
                lastError = new Error(errorData?.message || `Failed to create and generate contract with status ${response.status}`);
                if (response.status === 404) {
                    continue;
                }
                throw lastError;
            }

            const blob = await response.blob();
            const disposition = response.headers.get('content-disposition') || '';
            const fileName = resolveFileNameFromDisposition(disposition, 'contract.pdf');
            const responseContractCode =
                response.headers.get('contractCode') ||
                response.headers.get('x-contract-code') ||
                response.headers.get('X-Contract-Code') ||
                response.headers.get('contract-code') ||
                response.headers.get('Contract-Code') ||
                response.headers.get('contractcode') ||
                '';

            return {
                blob,
                fileName,
                contentType: response.headers.get('content-type') || 'application/pdf',
                contractCode: responseContractCode,
            };
        }

        throw lastError || new Error('Create and generate contract endpoint not found');
    } catch (error) {
        console.error('❌ Create and generate contract API error:', error);
        throw error;
    }
};

/**
 * Send OTP for a contract code.
 */
export const sendOtpApi = async (contractCode) => {
    if (!contractCode) {
        throw new Error('Contract code is required');
    }

    const primaryPath = API_CONFIG.ENDPOINTS.CONTRACT.SEND_OTP;
    const secondaryPath = primaryPath.replace('/api/contract/', '/api/contracts/');
    const encodedCode = encodeURIComponent(contractCode);
    const candidateUrls = [
        `${API_CONFIG.BASE_URL}${primaryPath}?contractCode=${encodedCode}`,
        `${API_CONFIG.BASE_URL}${secondaryPath}?contractCode=${encodedCode}`,
    ];

    try {
        let lastError = null;

        for (const url of candidateUrls) {
            const response = await fetch(url, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
            });

            const rawText = await response.text();

            if (!response.ok) {
                let backendMessage = rawText;
                try {
                    const json = rawText ? JSON.parse(rawText) : {};
                    backendMessage = json?.message || json?.error || rawText;
                } catch {
                    // Keep plain text response if it is not JSON.
                }

                lastError = new Error(backendMessage || `Failed to send OTP with status ${response.status}`);
                if (response.status === 404) {
                    continue;
                }
                throw lastError;
            }

            return rawText || 'OTP sent successfully';
        }

        throw lastError || new Error('Send OTP endpoint not found');
    } catch (error) {
        console.error('❌ Send OTP API error:', error);
        throw error;
    }
};

/**
 * Sign contract with OTP.
 */
export const signContractApi = async (contractCode, otpCode) => {
    if (!contractCode) {
        throw new Error('Contract code is required');
    }

    if (!otpCode) {
        throw new Error('OTP code is required');
    }

    const primaryPath = API_CONFIG.ENDPOINTS.CONTRACT.SIGN_CONTRACT;
    const secondaryPath = primaryPath.replace('/api/contract/', '/api/contracts/');
    const encodedContract = encodeURIComponent(contractCode);
    const encodedOtp = encodeURIComponent(otpCode);
    const candidateUrls = [
        `${API_CONFIG.BASE_URL}${primaryPath}?OtpCode=${encodedOtp}&contract=${encodedContract}`,
        `${API_CONFIG.BASE_URL}${secondaryPath}?OtpCode=${encodedOtp}&contract=${encodedContract}`,
    ];

    try {
        let lastError = null;

        for (const url of candidateUrls) {
            const response = await fetch(url, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
            });

            const data = await parseJsonSafe(response);
            if (response.ok) {
                return data;
            }

            lastError = new Error(
                data?.message || data?.error || `Failed to sign contract with status ${response.status}`
            );

            if (response.status === 404) {
                continue;
            }

            throw lastError;
        }

        throw lastError || new Error('Sign contract endpoint not found');
    } catch (error) {
        console.error('❌ Sign contract API error:', error);
        throw error;
    }
};

/**
 * Sign contract with OTP + signature image file.
 */
export const signContractWithSignatureApi = async (contractCode, otpCode, signatureFile) => {
    if (!contractCode) {
        throw new Error('Contract code is required');
    }

    if (!otpCode) {
        throw new Error('OTP code is required');
    }

    if (!(signatureFile instanceof Blob)) {
        throw new Error('Signature file is required');
    }

    const primaryPath = API_CONFIG.ENDPOINTS.CONTRACT.SIGN_WITH_SIGNATURE;
    const secondaryPath = primaryPath.replace('/api/contract/', '/api/contracts/');
    const candidateUrls = [
        `${API_CONFIG.BASE_URL}${primaryPath}`,
        `${API_CONFIG.BASE_URL}${secondaryPath}`,
    ];

    try {
        let lastError = null;

        for (const url of candidateUrls) {
            const formData = new FormData();
            formData.append('contractCode', contractCode);
            formData.append('otpCode', otpCode);
            formData.append('signatureFile', signatureFile, signatureFile.name || 'signature.png');

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            const data = await parseJsonSafe(response);
            if (response.ok) {
                return data;
            }

            lastError = new Error(
                data?.message || data?.error || `Failed to sign contract with signature, status ${response.status}`
            );

            if (response.status === 404) {
                continue;
            }

            throw lastError;
        }

        throw lastError || new Error('Sign with signature endpoint not found');
    } catch (error) {
        console.error('❌ Sign with signature API error:', error);
        throw error;
    }
};

/**
 * Get signed contract PDF by contract code.
 */
export const getContractFileByContractCodeApi = async (contractCode) => {
    if (!contractCode) {
        throw new Error('Contract code is required');
    }

    const encodedCode = encodeURIComponent(contractCode);
    const primaryPath = API_CONFIG.ENDPOINTS.CONTRACT.GET_FILE_BY_CONTRACT_CODE;
    const secondaryPath = primaryPath.replace('/api/contract/', '/api/contracts/');
    const candidateUrls = [
        `${API_CONFIG.BASE_URL}${primaryPath}/${encodedCode}`,
        `${API_CONFIG.BASE_URL}${secondaryPath}/${encodedCode}`,
    ];

    try {
        let lastError = null;

        for (const url of candidateUrls) {
            const response = await fetch(url, {
                method: 'GET',
            });

            if (response.ok) {
                const blob = await response.blob();
                const disposition = response.headers.get('content-disposition') || '';
                const fileName = resolveFileNameFromDisposition(disposition, `${contractCode}_signed.pdf`);
                return {
                    blob,
                    fileName,
                    contentType: response.headers.get('content-type') || 'application/pdf',
                };
            }

            const data = await parseJsonSafe(response);
            lastError = new Error(
                data?.message || data?.error || `Failed to get contract file with status ${response.status}`
            );

            if (response.status === 404) {
                continue;
            }

            throw lastError;
        }

        throw lastError || new Error('Get contract file endpoint not found');
    } catch (error) {
        console.error('❌ Get contract file API error:', error);
        throw error;
    }
};

/**
 * Get contract detail by contract code.
 */
export const getContractByContractCodeApi = async (contractCode) => {
    if (!contractCode) {
        throw new Error('Contract code is required');
    }

    const encodedCode = encodeURIComponent(contractCode);
    const primaryPath = API_CONFIG.ENDPOINTS.CONTRACT.GET_BY_CONTRACT_CODE;
    const secondaryPath = primaryPath.replace('/api/contract/', '/api/contracts/');
    const candidateUrls = [
        `${API_CONFIG.BASE_URL}${primaryPath}/${encodedCode}`,
        `${API_CONFIG.BASE_URL}${secondaryPath}/${encodedCode}`,
    ];

    try {
        let lastError = null;

        for (const url of candidateUrls) {
            const response = await fetch(url, {
                method: 'GET',
                headers: API_CONFIG.HEADERS,
            });

            const data = await parseJsonSafe(response);
            if (response.ok) {
                return data;
            }

            lastError = new Error(
                data?.message || data?.error || `Failed to fetch contract detail with status ${response.status}`
            );

            if (response.status === 404) {
                continue;
            }

            throw lastError;
        }

        throw lastError || new Error('Get contract by contract code endpoint not found');
    } catch (error) {
        console.error('❌ Get contract by contract code API error:', error);
        throw error;
    }
};
