/**
 * useCreateContract Hook
 * Custom hook for handling contract creation
 */

import { useCallback } from 'react';
import { createContractApi } from '../services/api/contractApi';

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

      return {
        success: true,
        data: response,
        // Backend CommonResponse does not return contractCode in payload
        contractCode: contractData.contractCode,
      };
    } catch (error) {
      console.error('❌ Contract creation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create contract',
      };
    }
  }, []);

  return {
    createContract,
  };
}

