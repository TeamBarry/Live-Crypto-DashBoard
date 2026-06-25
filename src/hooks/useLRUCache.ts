// =============================================================================
// USE LRU CACHE HOOK
// =============================================================================
// LRU = Least Recently Used
// Jab cache full ho jaye, sab se purana item hata do, naya add karo
// 
// KYA PROBLEM SOLVE KARTA HAI?
// --------------------------------
// Scenario: Chart mein 24-hour history hai
//           Har coin ka alag history array hai
//           100 coins × 1000 points = 100,000 objects in memory
//           Browser slow/crash ho jayega
// 
// LRU Cache = sirf last 50 points per coin rakho
//             Purane auto-delete ho jayenge
// =============================================================================

import { useRef, useCallback } from 'react';

// =============================================================================
// Cache Entry Interface
// =============================================================================
// Generic T = koi bhi type ho sakta hai (ChartDataPoint, Coin, etc)
// =============================================================================

interface CacheEntry<T> {
  value: T;           // actual data
  timestamp: number;  // kab use hua (LRU track karne ke liye)
}

interface LRUCache<T> {
  get: (key: string) => T | undefined;
  set: (key: string, value: T) => void;
  has: (key: string) => boolean;
  clear: () => void;
  size: () => number;
}

export function useLRUCache<T>(maxSize: number): LRUCache<T> {
  // =============================================================================
  // Cache Storage - useRef mein
  // =============================================================================
  // Kyun useRef? Kyunki cache ka UI se koi lena dena nahi
  // Cache update hone pe re-render nahi chahiye
  // =============================================================================
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());

  // =============================================================================
  // GET Function - O(1) Speed
  // =============================================================================
  // 1. Key se value nikalo
  // 2. Timestamp update karo (abhi use hua hai)
  // 3. Value return karo
  // =============================================================================
  const get = useCallback((key: string): T | undefined => {
    const entry = cacheRef.current.get(key);
    
    if (!entry) {
      return undefined;  // Key nahi milli
    }
    
    // =============================================================================
    // LRU Update: Is item ko "recently used" mark karo
    // =============================================================================
    // Delete + Set = Map mein last position pe aa jayega
    // Jab eviction hoga toh sab se purana (first) item hatega
    // =============================================================================
    cacheRef.current.delete(key);
    cacheRef.current.set(key, {
      value: entry.value,
      timestamp: Date.now(),
    });
    
    return entry.value;
  }, []);

  // =============================================================================
  // SET Function - O(1) Speed
  // =============================================================================
  // 1. Agar key already hai toh update karo
  // 2. Agar nayi key hai toh add karo
  // 3. Agar maxSize cross ho gaya toh sab se purana delete karo
  // =============================================================================
  const set = useCallback((key: string, value: T): void => {
    // Agar already exist karti hai toh pehle delete karo
    // (taake Map ke end mein aa jaye = recently used)
    if (cacheRef.current.has(key)) {
      cacheRef.current.delete(key);
    }
    
    // Naya entry add karo
    cacheRef.current.set(key, {
      value,
      timestamp: Date.now(),
    });
    
    // =============================================================================
    // EVICTION LOGIC - Cache full hone pe purana hatao
    // =============================================================================
    // Map.keys() = insertion order mein return karta hai
    // Sab se purana = first item
    // =============================================================================
  if (cacheRef.current.size > maxSize) {
  const oldestKey = cacheRef.current.keys().next().value;
  
  // TypeScript ko tasalli dene ke liye check lagaya
  if (oldestKey !== undefined) {
    cacheRef.current.delete(oldestKey);
  }
}
  }, [maxSize]);

  // =============================================================================
  // HAS Function - Check karo key exist karti hai
  // =============================================================================
  const has = useCallback((key: string): boolean => {
    return cacheRef.current.has(key);
  }, []);

  // =============================================================================
  // CLEAR Function - Sab kuch delete karo
  // =============================================================================
  const clear = useCallback((): void => {
    cacheRef.current.clear();
  }, []);

  // =============================================================================
  // SIZE Function - Kitne items hain
  // =============================================================================
  const size = useCallback((): number => {
    return cacheRef.current.size;
  }, []);

  return {
    get,
    set,
    has,
    clear,
    size,
  };
}