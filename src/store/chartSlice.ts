// =============================================================================
// CHART SLICE - Updated with selected coin
// =============================================================================

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChartDataPoint } from '../types';

interface ChartState {
  historyByCoin: Record<string, ChartDataPoint[]>;
  recentlyUsed: string[];
  maxPointsPerCoin: number;
  loading: boolean;
  error: string | null;
  selectedCoinId: string;
}

const initialState: ChartState = {
  historyByCoin: {},
  recentlyUsed: [],
  maxPointsPerCoin: 50,
  loading: false,
  error: null,
  selectedCoinId: 'bitcoin',
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  
  reducers: {
    setCoinHistory: (state, action: PayloadAction<{ coinId: string; data: ChartDataPoint[] }>) => {
      const { coinId, data } = action.payload;
      const trimmedData = data.slice(-state.maxPointsPerCoin);
      state.historyByCoin[coinId] = trimmedData;
      
      state.recentlyUsed = [
        coinId,
        ...state.recentlyUsed.filter(id => id !== coinId)
      ];
      
      state.loading = false;
    },
    
    addHistoryPoint: (state, action: PayloadAction<{ coinId: string; point: ChartDataPoint }>) => {
      const { coinId, point } = action.payload;
      
      if (!state.historyByCoin[coinId]) {
        state.historyByCoin[coinId] = [];
      }
      
      const history = state.historyByCoin[coinId];
      history.push(point);
      
      if (history.length > state.maxPointsPerCoin) {
        history.shift();
      }
    },
    
    // =============================================================================
    // Select Coin for Chart
    // =============================================================================
    setSelectedCoin: (state, action: PayloadAction<string>) => {
      state.selectedCoinId = action.payload;
    },
    
    setChartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setChartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setCoinHistory, 
  addHistoryPoint, 
  setSelectedCoin, 
  setChartLoading,
  setChartError 
} = chartSlice.actions;

// Selectors
export const selectSelectedCoinId = (state: { chart: ChartState }) => state.chart.selectedCoinId;
export const selectCoinHistory = (coinId: string) => 
  (state: { chart: ChartState }) => state.chart.historyByCoin[coinId] || [];
export const selectChartLoading = (state: { chart: ChartState }) => state.chart.loading;

export default chartSlice.reducer;