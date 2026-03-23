/**
 * Saving Book API Service
 * Handles API calls related to saving books (tài sản đảm bảo)
 */

import API_CONFIG from '../../config/api.config';

/**
 * Get all saving books by business code
 * @param {string} businessCode - Business code
 * @returns {Promise} Response containing list of saving books
 */
export const getSavingBooksByBusinessCodeApi = async (businessCode) => {
  if (!businessCode) {
    throw new Error('Business code is required');
  }

  try {
    console.log('📤 Fetching saving books for:', businessCode);

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/saving-books/getAllByBusinessCode/${businessCode}`,
      {
        method: 'POST',  // ← CHANGED FROM GET TO POST
        headers: API_CONFIG.HEADERS,
      }
    );

    console.log('📊 Saving Books Response Status:', response.status);

    const data = await response.json();

    console.log('📥 Saving Books Response Data:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch saving books with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ Get saving books API error:', error);
    throw error;
  }
};

