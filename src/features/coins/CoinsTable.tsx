// =============================================================================
// COINS TABLE - Virtualized List with react-virtuoso
// =============================================================================
// 100+ coins smooth scroll honge bina DOM overload ke
// =============================================================================

import React, { useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useAppSelector } from '../../hooks/redusHooks';
import { selectAllCoins } from '../../store/coinSlice';
import type { Coin } from '../../types';

// =============================================================================
// Single Row Component (Memoized)
// =============================================================================
interface CoinRowProps {
  coin: Coin;
  index: number;
}

const CoinRow = React.memo(function CoinRow({ coin, index }: CoinRowProps) {
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return {
      text: `${isPositive ? '+' : ''}${value.toFixed(2)}%`,
      color: isPositive ? 'text-green-400' : 'text-red-400',
      bg: isPositive ? 'bg-green-500/10' : 'bg-red-500/10',
    };
  };

  const formatLarge = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num);
  };

  const change = formatPercentage(coin.price_change_percentage_24h || 0);

  return (
    <div className="grid grid-cols-12 gap-4 px-6 items-center hover:bg-gray-700/30 transition-colors border-b border-gray-700/50 cursor-pointer h-16">
      
      {/* Rank */}
      <div className="col-span-1 text-gray-500 text-sm font-medium">
        {coin.market_cap_rank}
      </div>
      
      {/* Coin Info */}
      <div className="col-span-3 flex items-center gap-3 min-w-0">
        <img 
          src={coin.image} 
          alt={coin.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="font-medium text-white truncate">{coin.name}</p>
          <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
        </div>
      </div>
      
      {/* Price */}
      <div className="col-span-2 font-mono text-sm text-white">
        {formatPrice(coin.current_price)}
      </div>
      
      {/* 24h Change */}
      <div className="col-span-2">
        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${change.bg} ${change.color}`}>
          {change.text}
        </span>
      </div>
      
      {/* Market Cap */}
      <div className="col-span-2 text-sm text-gray-400 font-mono">
        {formatLarge(coin.market_cap)}
      </div>
      
      {/* Volume */}
      <div className="col-span-2 text-sm text-gray-400 font-mono">
        {formatLarge(coin.total_volume)}
      </div>
    </div>
  );
});

// =============================================================================
// MAIN TABLE COMPONENT
// =============================================================================

export function CoinsTable() {
  const coins = useAppSelector(selectAllCoins);
  const [searchQuery, setSearchQuery] = useState('');

  // =============================================================================
  // Search Filter (Memoized)
  // =============================================================================
  const filteredCoins = useMemo(() => {
    if (!searchQuery.trim()) return coins;
    
    const query = searchQuery.toLowerCase().trim();
    return coins.filter(coin => 
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
    );
  }, [coins, searchQuery]);

  // =============================================================================
  // Loading State
  // =============================================================================
  if (coins.length === 0) {
    return (
      <section className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Top 100 Coins</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          Loading coins...
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top 100 Coins</h2>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none w-64 text-white placeholder-gray-500 transition-colors"
          />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-700/50 text-xs text-gray-400 font-medium uppercase tracking-wider border-b border-gray-700">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Coin</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">24h %</div>
        <div className="col-span-2">Market Cap</div>
        <div className="col-span-2">Volume (24h)</div>
      </div>

      {/* Virtualized List */}
      {filteredCoins.length > 0 ? (
        <Virtuoso
          style={{ height: '500px' }}
          totalCount={filteredCoins.length}
          itemContent={(index: number) => {
            const coin = filteredCoins[index];
            return <CoinRow coin={coin} index={index} />;
          }}
          overscan={5}
        />
      ) : (
        <div className="p-8 text-center text-gray-500">
          {searchQuery ? `No coins found for "${searchQuery}"` : 'No coins available'}
        </div>
      )}
    </section>
  );
}