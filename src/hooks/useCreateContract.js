/**
 * useCreateContract Hook
 * Custom hook for handling contract creation
 */

import { useCallback } from 'react';
import {
  createAndGenerateContractApi,
  createContractApi,
  generateAndDownloadContractApi,
  getBankAccountsByBusinessCodeApi,
  moneyToWordsApi,
  signContractApi,
  sendOtpApi,
} from '../services/api/contractApi';

export function useCreateContract() {
  /**
   * Handle contract creation
   * @param {Object} contractData - Contract data to send to backend
   * @returns {Promise<Object>} Response from backend
   */
  const createContract = useCallback(async (contractData) => {
    try {
      console.log('🔄 Starting contract creation...');

      // Validate required fields
      if (!contractData.businessCode) {
        throw new Error('Business code is required');
      }
      if (!contractData.loanAmount) {
        throw new Error('Loan amount is required');
      }
      if (!contractData.loanTerm) {
        throw new Error('Loan term is required');
      }
      if (!contractData.savingBookId) {
        throw new Error('Saving book is required');
      }
      if (!contractData.bankAccountId) {
        throw new Error('Bank account is required');
      }
      if (!contractData.paymentMethod) {
        throw new Error('Payment method is required');
      }

      // Call API
      const response = await createContractApi(contractData);
      const isSuccess = response?.code === '00';

      if (!isSuccess) {
        throw new Error(response?.message || 'Create contract failed');
      }

      console.log('✅ Contract created successfully:', response);

      const resolvedContractCode =
        response?.contractCode ||
        response?.data?.contractCode ||
        response?.result?.contractCode ||
        contractData.contractCode ||
        '';

      return {
        success: true,
        data: response,
        contractCode: resolvedContractCode,
      };
    } catch (error) {
      console.error('❌ Contract creation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create contract',
      };
    }
  }, []);

  const fetchBankAccounts = useCallback(async (businessCode) => {
    const response = await getBankAccountsByBusinessCodeApi(businessCode);
    if (response?.code !== '00') {
      throw new Error(response?.message || 'Không lấy được danh sách tài khoản giải ngân');
    }

    return response?.data || [];
  }, []);

  const convertMoneyToWords = useCallback(async (amount) => {
    const response = await moneyToWordsApi(amount);
    return String(response || '').trim();
  }, []);

  const generateAndDownloadContract = useCallback(async (contractCode) => {
    return generateAndDownloadContractApi(contractCode);
  }, []);

  const createAndGenerateContract = useCallback(async (contractData) => {
    return createAndGenerateContractApi(contractData);
  }, []);

  const sendOtp = useCallback(async (contractCode) => {
    return sendOtpApi(contractCode);
  }, []);

  const signContract = useCallback(async (contractCode, otpCode) => {
    return signContractApi(contractCode, otpCode);
  }, []);

  return {
    createContract,
    fetchBankAccounts,
    convertMoneyToWords,
    generateAndDownloadContract,
    createAndGenerateContract,
    sendOtp,
    signContract,
  };
}

