// =============================================================================
// EVENT LOG COMPONENT
// =============================================================================
// Simulated real-time events
// Coins data se random events generate karte hain
// =============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../hooks/redusHooks';
import { selectAllCoins } from '../../store/coinSlice';

// =============================================================================
// Event Types
// =============================================================================
type EventType = 'price_alert' | 'volume_spike' | 'rank_change' | 'milestone';

interface LogEvent {
  id: string;
  type: EventType;
  message: string;
  coinId: string;
  timestamp: Date;
}

// =============================================================================
// Event Generator Function
// =============================================================================
// Random event generate karta hai coins data se
// =============================================================================
function generateEvent(coins: any[]): LogEvent {
  const types: EventType[] = ['price_alert', 'volume_spike', 'rank_change', 'milestone'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const coin = coins[Math.floor(Math.random() * Math.min(coins.length, 10))];
  if (!coin) return generateEvent(coins);
  
  let message = '';
  
  switch (type) {
    case 'price_alert':
      const direction = coin.price_change_percentage_24h >= 0 ? 'surged' : 'dropped';
      message = `${coin.name} ${direction} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%`;
      break;
    case 'volume_spike':
      message = `${coin.name} volume up 45% in 1h`;
      break;
    case 'rank_change':
      message = `${coin.name} rank changed to #${coin.market_cap_rank}`;
      break;
    case 'milestone':
      const milestone = Math.floor(coin.current_price / 1000) * 1000;
      message = `${coin.name} near $${milestone.toLocaleString()}`;
      break;
  }
  
  return {
    id: `${Date.now()}-${Math.random()}`,
    type,
    message,
    coinId: coin.id,
    timestamp: new Date(),
  };
}

export function EventLog() {
  const coins = useAppSelector(selectAllCoins);
  const [events, setEvents] = useState<LogEvent[]>([]);
  const eventsRef = useRef<HTMLDivElement>(null);

  // =============================================================================
  // Auto-generate events every 5 seconds
  // =============================================================================
  useEffect(() => {
    if (coins.length === 0) return;
    
    const interval = setInterval(() => {
      const newEvent = generateEvent(coins);
      
      setEvents(prev => {
        const updated = [newEvent, ...prev].slice(0, 50);
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [coins]);

  // =============================================================================
  // Auto-scroll to top on new event
  // =============================================================================
  useEffect(() => {
    if (eventsRef.current) {
      eventsRef.current.scrollTop = 0;
    }
  }, [events[0]?.id]);

  // =============================================================================
  // Event Color Helper
  // =============================================================================
  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'price_alert': return 'text-green-400';
      case 'volume_spike': return 'text-blue-400';
      case 'rank_change': return 'text-yellow-400';
      case 'milestone': return 'text-purple-400';
    }
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'price_alert': return '💰';
      case 'volume_spike': return '📊';
      case 'rank_change': return '📈';
      case 'milestone': return '🎯';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Live Events</h2>
        <span className="text-xs text-gray-500">{events.length} events</span>
      </div>
      
      {/* Events List */}
      <div 
        ref={eventsRef}
        className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar"
      >
        {events.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">
            Waiting for events...
          </div>
        ) : (
          events.map((event) => (
            <div 
              key={event.id}
              className="p-3 bg-gray-700/50 rounded-lg text-sm flex items-start gap-3 hover:bg-gray-700 transition-colors animate-fadeIn"
            >
              <span className="text-lg flex-shrink-0">{getEventIcon(event.type)}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${getEventColor(event.type)} truncate`}>
                  {event.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}