
import React from 'react';
import { useAppSelector } from '../../hooks/redusHooks';
import { selectAllCoins } from '../../store/coinSlice';
import { MetricsCard } from './MetricsCard';

export function TopMetrics() {
  // =============================================================================
  // Sab coins Redux store se lo
  // =============================================================================
  const coins = useAppSelector(selectAllCoins);

  // =============================================================================
  // Top 3 filter karo (market cap rank ke hisaab se)
  // =============================================================================
  // coinsAdapter ne already sort kiya hai, toh pehle 3 hi top hain
  // =============================================================================
  const topCoins = coins.slice(0, 3);

  // =============================================================================
  // Loading State (jab tak data nahi aya)
  // =============================================================================
  if (coins.length === 0) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-5 border border-gray-700 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4" />
            <div className="h-8 bg-gray-700 rounded w-2/3 mb-4" />
            <div className="h-12 bg-gray-700 rounded" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {topCoins.map((coin, index) => (
        <MetricsCard 
          key={coin.id} 
          coin={coin} 
          rank={index + 1} 
        />
      ))}
    </section>
  );
}