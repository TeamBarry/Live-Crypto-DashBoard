// =============================================================================
// TYPES FILE
// =============================================================================
// Yeh file humari poori app ke data shapes define karti hai
// TypeScript ko pata chal jata hai ke har object mein kya kya fields honge
// Isse VS Code mein auto-complete milta hai aur bugs code likhte waqt pakde jate hain
// =============================================================================

/**
 * CoinGecko API se aane wale data ka exact shape
 * Jab bhi API se data ayega, isi shape mein hoga
 */
export interface Coin {
  id: string;                    // unique identifier jaise "bitcoin", "ethereum"
  name: string;                  // full name jaise "Bitcoin"
  symbol: string;                // short symbol jaise "btc", "eth"
  current_price: number;         // abhi ka price in USD
  price_change_percentage_24h: number;  // 24 ghante mein kitna % change hua
  market_cap: number;            // total market value (dollars mein)
  total_volume: number;          // 24h trading volume
  image: string;                 // coin ka logo image URL
  sparkline_in_7d?: {           // 7 din ka mini chart data (optional ? lagaya hai)
    price: number[];             // array of prices
  };
  market_cap_rank: number;       // rank #1, #2, #3 etc
}

/**
 * Chart ke liye har ek point ka shape
 * Recharts library ko isi shape mein data chahiye hoga
 */
export interface ChartDataPoint {
  timestamp: string;   // kab ka data hai (jaise "14:30")
  price: number;       // us waqt kya price thi
}

/**
 * Dashboard ke 3 modes
 * realtime = har 10 second pe auto update (polling)
 * paused = sab freeze, kuch bhi update nahi hoga, data cached rahega
 * manual = sirf refresh button dabane se update hoga
 */
export type DashboardMode = 'realtime' | 'paused' | 'manual';

/**
 * Mode toggle wala state
 * Redux store mein isi shape ka data hoga
 */
export interface DashboardState {
  mode: DashboardMode;           // abhi kon sa mode active hai
  lastUpdated: string | null;   // last update kab hua (timestamp)
  isLoading: boolean;           // kya abhi data load ho raha hai (spinner dikhane ke liye)
  error: string | null;         // agar API fail ho jaye toh error message
}








