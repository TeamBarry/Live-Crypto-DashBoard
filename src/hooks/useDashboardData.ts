// =============================================================================
// USE DASHBOARD DATA - Main Data Fetching Hook (WITH ABORT CONTROLLERS)
// =============================================================================

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redusHooks';
import { setAllCoins, setLoading, setError } from '../store/coinSlice';
import { setCoinHistory, setChartLoading, setChartError } from '../store/chartSlice';
import { fetchCoins, fetchCoinHistory } from '../utils/api';
import { usePolling } from './usePolling';
import { useAbortController } from './useAbortController';
import { selectMode } from '../store/modeSlice';
import { selectSelectedCoinId } from '../store/chartSlice';

export function useDashboardData() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode); 
  const selectedCoinId = useAppSelector(selectSelectedCoinId);

  // =============================================================================
  // 🚨 THE FIX: Do alag alag Abort Controllers banaye
  // Ek Coins ke liye, ek Chart ke liye. Ab yeh aapas mein nahi larenge!
  // =============================================================================
  const coinsController = useAbortController();
  const chartController = useAbortController();

  // 1. FETCH COINS
  const fetchCoinsData = useCallback(async () => {
    dispatch(setLoading(true));
    
    // Sirf pichli coins wali request cancel hogi
    const signal = coinsController.getSignal();
    
    try {
      const coins = await fetchCoins(signal); // Signal wapas laga diya
      dispatch(setAllCoins(coins));
    } catch (error: any) {
      if (error.name === 'AbortError' || error.name === 'CanceledError') return;
      dispatch(setError(error.message || 'Failed to fetch coins'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // 2. FETCH CHART HISTORY
  const fetchChartData = useCallback(async () => {
    if (!selectedCoinId) return;

    dispatch(setChartLoading(true));
    
    // Sirf pichli chart wali request cancel hogi
    const signal = chartController.getSignal();
    
    try {
      const history = await fetchCoinHistory(selectedCoinId, signal); // Signal wapas laga diya
      dispatch(setCoinHistory({ coinId: selectedCoinId, data: history }));
    } catch (error: any) {
      if (error.name === 'AbortError' || error.name === 'CanceledError') return;
      dispatch(setChartError(error.message || 'Failed to fetch chart'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedCoinId]);

  // 3. COMBINED FETCH
  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchCoinsData(),
      fetchChartData(),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4. POLLING SETUP
  const { refresh } = usePolling({
    callback: fetchAllData,
    interval: 60000, // 1 Minute
    enabled: mode === 'realtime',
  });

  // 5. INITIAL LOAD
  useEffect(() => {
    fetchCoinsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 6. CHART REFRESH ON COIN CHANGE
  useEffect(() => {
    if (selectedCoinId) fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoinId]);

  return { refresh, isRealtime: mode === 'realtime' };
}