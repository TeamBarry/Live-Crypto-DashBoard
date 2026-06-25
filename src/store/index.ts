// =============================================================================
// REDUX STORE SETUP
// =============================================================================
// Yeh file humara GLOBAL state management setup karti hai
// Poori app ka data yahan store hoga
// =============================================================================

import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './coinSlice';
import chartReducer from './chartSlice';
import modeReducer from './modeSlice';
// =============================================================================
// Store Create Karna
// =============================================================================
// configureStore = Redux Toolkit ka modern way
// Automatically Redux DevTools, Thunk middleware sab include hota hai
// =============================================================================

export const store = configureStore({
  reducer: {
    coins: coinsReducer,   // ← Phase 4 mein add kiya
    chart: chartReducer, // ← Phase 4 mein add kiya
    mode: modeReducer,   // ← Phase 4 mein add kiya

  },
  
  // =============================================================================
  // Middleware Setup
  // =============================================================================
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  
  // =============================================================================
  // DevTools - Sirf Development Mein ON
  // =============================================================================
  devTools: import.meta.env.DEV,
});

// =============================================================================
// Type Exports - Typed Hooks Banane Ke Liye
// =============================================================================
// RootState = poori app ke state ka type
// AppDispatch = store.dispatch ka type
// =============================================================================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;