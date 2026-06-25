// =============================================================================
// PRICE CHART COMPONENT
// =============================================================================

import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useAppSelector, useAppDispatch } from '../../hooks/redusHooks';
import { selectSelectedCoinId, setSelectedCoin } from '../../store/chartSlice';
import { selectAllCoins } from '../../store/coinSlice';

export function PriceChart() {
  const dispatch = useAppDispatch();
  
  const selectedCoinId = useAppSelector(selectSelectedCoinId);
  const allCoins = useAppSelector(selectAllCoins);

  // 🛠️ FIX 1: Redux Error theek kiya (Direct state se data uthaya)
  const history = useAppSelector((state) => state.chart.historyByCoin[selectedCoinId]);
  
  const handleCoinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedCoin(e.target.value));
  };

  // Agar history hai toh wo lo, warna khali array
  const chartData = history && history.length > 0 ? history : [];

  const prices = chartData.map(d => d.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) * 0.99 : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.01 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{label}</p>
          <p className="text-white font-bold text-lg">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Price History (24h)</h2>
        
        <select
          value={selectedCoinId}
          onChange={handleCoinChange}
          className="bg-gray-700 rounded-lg px-3 py-1.5 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none cursor-pointer text-white"
        >
          {allCoins.slice(0, 20).map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Chart Container */}
      {/* 🛠️ FIX 2: minHeight laga diya taake Recharts shuru mein confuse na ho */}
      <div className="w-full" style={{ height: '250px', minHeight: '250px' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              
              <XAxis
                dataKey="timestamp"
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading chart data...
          </div>
        )}
      </div>
    </div>
  );
}