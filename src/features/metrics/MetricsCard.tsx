import React, { memo } from 'react';
import type { Coin } from '../../types';


interface MetricsCardProps {
  coin: Coin;           
  rank: number;         
}


export const MetricsCard = memo(function MetricsCard({ coin, rank }: MetricsCardProps) {
  
   const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(coin.current_price);

  
  const change = coin.price_change_percentage_24h || 0;
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeSign = isPositive ? '+' : '';
  const formattedChange = `${changeSign}${change.toFixed(2)}%`;

  
  const sparklineData = coin.sparkline_in_7d?.price || [];
  const minPrice = Math.min(...sparklineData);
  const maxPrice = Math.max(...sparklineData);
  const range = maxPrice - minPrice || 1;

  // SVG path generate karo
  const sparklinePath = sparklineData
    .map((price, i) => {
      const x = (i / (sparklineData.length - 1)) * 100;
      const y = 100 - ((price - minPrice) / range) * 100;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const sparklineColor = isPositive ? '#4ade80' : '#f87171';

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50">
      
      {/* Header: Rank + Name + Symbol */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
            {rank}
          </span>
          
          {/* Coin Image */}
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-8 h-8 rounded-full"
            loading="lazy"  // Lazy load for performance
          />
          
          {/* Name + Symbol */}
          <div className="flex flex-col">
            <span className="font-semibold text-white">{coin.name}</span>
            <span className="text-xs text-gray-500 uppercase">{coin.symbol}</span>
          </div>
        </div>
        
        {/* Change Badge */}
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'} ${changeColor}`}>
          {formattedChange}
        </span>
      </div>

      {/* Big Price */}
      <div className="text-3xl font-bold tracking-tight text-white mb-4">
        {formattedPrice}
      </div>

      {/* Sparkline Mini Chart */}
      <div className="h-12 w-full">
        {sparklineData.length > 0 && (
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d={sparklinePath}
              fill="none"
              stroke={sparklineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Gradient fill */}
            <path
              d={`${sparklinePath} L 100 100 L 0 100 Z`}
              fill={sparklineColor}
              fillOpacity="0.1"
            />
          </svg>
        )}
      </div>

      {/* Market Cap */}
      <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between text-xs text-gray-500">
        <span>Market Cap</span>
        <span className="font-mono">
          {new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(coin.market_cap)}
        </span>
      </div>
    </div>
  );
});