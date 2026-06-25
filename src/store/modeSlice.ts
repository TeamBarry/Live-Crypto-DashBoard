import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DashboardState, DashboardMode } from '../types';

const initialState: DashboardState = {
  mode: 'realtime',
  lastUpdated: null,
  isLoading: false,
  error: null,
};

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<DashboardMode>) => {
      state.mode = action.payload;
      state.lastUpdated = new Date().toISOString();
      if (action.payload === 'manual') {
        state.isLoading = false;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateTimestamp: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { setMode, setLoading, setError, updateTimestamp } = modeSlice.actions;

export const selectMode = (state: { mode: DashboardState }) => state.mode.mode;
export const selectIsLoading = (state: { mode: DashboardState }) => state.mode.isLoading;
export const selectLastUpdated = (state: { mode: DashboardState }) => state.mode.lastUpdated;
export const selectError = (state: { mode: DashboardState }) => state.mode.error;

export default modeSlice.reducer;