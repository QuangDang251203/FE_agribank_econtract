/**
 * Contract API Service
 * Handles API calls related to contract creation
 */

import API_CONFIG from '../../config/api.config';

/**
 * Create contract
 * @param {Object} contractData - Contract data
 * @returns {Promise} Response from backend
 */
export const createContractApi = async (contractData) => {
  try {
    console.log('📤 Creating contract with data:', contractData);
    const candidateUrls = [
      `${API_CONFIG.BASE_URL}/api/contracts/createContract`,
      `${API_CONFIG.BASE_URL}/api/contract/createContract`,
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

      const rawText = await response.text();
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = { message: rawText };
      }

      console.log('📥 Create Contract Response Data:', data);

      if (response.ok) {
        return data;
      }

      const backendMessage = data?.message || data?.error || rawText;
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

