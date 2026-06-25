// =============================================================================
// COINS SLICE - Normalized State with createEntityAdapter
// =============================================================================
// Yeh file humari coins list ko Redux store mein manage karti hai
// 
// NORMALIZED STATE kya hota hai?
// --------------------------------
// Bura tareeqa (denormalized):
//   coins: [
//     { id: 'bitcoin', name: 'Bitcoin', price: 67420 },
//     { id: 'ethereum', name: 'Ethereum', price: 3890 },
//     // ... 100 items
//   ]
//   Problem: Ek coin update karna ho toh pura array scan karna parega O(n)
// 
// Acha tareeqa (normalized):
//   ids: ['bitcoin', 'ethereum', ...]
//   entities: {
//     'bitcoin': { id: 'bitcoin', name: 'Bitcoin', price: 67420 },
//     'ethereum': { id: 'ethereum', name: 'Ethereum', price: 3890 },
//   }
//   Faida: Ek coin update karna ho toh direct access O(1)
//         ids array se list render karna easy hai
// =============================================================================

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Coin } from '../types';

// =============================================================================
// STEP 1: Entity Adapter Create Karna
// =============================================================================
// createEntityAdapter = Redux Toolkit ka helper jo normalized state manage karta hai
// sortComparer = coins ko price ke hisaab se sort karna (optional)
// =============================================================================

const coinsAdapter = createEntityAdapter<Coin>({
  // Yeh function batata hai ke har coin ka unique ID kya hai
//   selectId: (coin) => coin.id,
  
  // Yeh function batata hai ke coins ko kis order mein rakhna hai
  // Abhi market_cap_rank ke hisaab se sort karenge
  sortComparer: (a, b) => a.market_cap_rank - b.market_cap_rank,
});

// =============================================================================
// STEP 2: Initial State
// =============================================================================
// getInitialState() = adapter ka default state deta hai
// { ids: [], entities: {} } + hum apni extra fields add kar sakte hain
// =============================================================================

const initialState = coinsAdapter.getInitialState({
  // Extra fields jo adapter mein nahi hain:
  loading: false,      // kya abhi API se data aa raha hai
  error: null as string | null,  // agar error aya toh yahan store hoga
  lastUpdated: null as string | null,  // last successful update kab hua
});

// =============================================================================
// STEP 3: Slice Create Karna
// =============================================================================
// Slice = reducer + actions + selectors ka bundle
// =============================================================================

const coinsSlice = createSlice({
  name: 'coins',  // Redux DevTools mein yeh naam dikhega
  
  initialState,
  
  // =============================================================================
  // Reducers = state change karne wale functions
  // =============================================================================
  reducers: {
    // -------------------------------------------------------------------------
    // Action 1: setAllCoins
    // -------------------------------------------------------------------------
    // Kya karta hai: API se aye poore array ko store mein daalta hai
    // Kab use hoga: Pehli baar data load hone pe ya refresh pe
    // -------------------------------------------------------------------------
    setAllCoins: (state, action: PayloadAction<Coin[]>) => {
      // adapter.setAll = purana data hata ke naya daalta hai
      // ids aur entities dono update karta hai
      coinsAdapter.setAll(state, action.payload);
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    
    // -------------------------------------------------------------------------
    // Action 2: updateCoin
    // -------------------------------------------------------------------------
    // Kya karta hai: Sirf ek coin update karta hai (real-time update ke liye)
    // Kab use hoga: Polling pe sirf changed coins update karne ke liye
    // -------------------------------------------------------------------------
    updateCoin: (state, action: PayloadAction<Coin>) => {
      // adapter.updateOne = sirf ek entity update karta hai O(1) speed mein
      coinsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
      state.lastUpdated = new Date().toISOString();
    },
    
    // -------------------------------------------------------------------------
    // Action 3: setLoading
    // -------------------------------------------------------------------------
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // -------------------------------------------------------------------------
    // Action 4: setError
    // -------------------------------------------------------------------------
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// =============================================================================
// STEP 4: Actions Export Karna
// =============================================================================
// Components mein dispatch ke liye use honge
// =============================================================================

export const { setAllCoins, updateCoin, setLoading, setError } = coinsSlice.actions;

// =============================================================================
// STEP 5: Selectors Export Karna
// =============================================================================
// createEntityAdapter ne already basic selectors banaye hue hain:
// - selectAll = sab coins array mein
// - selectById = ek specific coin
// - selectIds = sirf ids array
// - selectTotal = total count
// =============================================================================

export const {
  selectAll: selectAllCoins,        // Sab coins array mein
  selectById: selectCoinById,       // Ek coin by ID
  selectIds: selectCoinIds,         // Sirf IDs array
  selectTotal: selectTotalCoins,    // Total count
} = coinsAdapter.getSelectors((state: { coins: typeof initialState }) => state.coins);

// =============================================================================
// STEP 6: Extra Selectors (Custom)
// =============================================================================

// Loading state check karne ke liye
export const selectCoinsLoading = (state: { coins: typeof initialState }) => state.coins.loading;

// Error nikaalne ke liye
export const selectCoinsError = (state: { coins: typeof initialState }) => state.coins.error;

// Last update time
export const selectLastUpdated = (state: { coins: typeof initialState }) => state.coins.lastUpdated;

// =============================================================================
// STEP 7: Reducer Export
// =============================================================================
// Yeh store/index.ts mein connect hoga
// =============================================================================

export default coinsSlice.reducer;