/**
 * useSavingBooks Hook
 * Custom hook for handling saving books (tài sản đảm bảo)
 */

import { useCallback, useState, useEffect } from 'react';
import { getSavingBooksByBusinessCodeApi } from '../services/api/savingBookApi';

export function useSavingBooks() {
  const [savingBooks, setSavingBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch saving books by business code
   * @param {string} businessCode - Business code
   */
  const fetchSavingBooks = useCallback(async (businessCode) => {
    if (!businessCode) {
      setError('Business code is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getSavingBooksByBusinessCodeApi(businessCode);

      // Check if response is successful
      const isSuccess = 
        response?.code === '00' || 
        response?.code === 0 ||
        response?.success === true;

      if (isSuccess) {
        const books = response?.data || [];
        setSavingBooks(books);
        console.log('✅ Saving Books Loaded:', books);
      } else {
        throw new Error(response?.message || 'Failed to fetch saving books');
      }

      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching saving books:', err);
      setError(err.message || 'Failed to load saving books');
      setSavingBooks([]);
      setLoading(false);
    }
  }, []);

  return {
    savingBooks,
    loading,
    error,
    fetchSavingBooks,
  };
}

