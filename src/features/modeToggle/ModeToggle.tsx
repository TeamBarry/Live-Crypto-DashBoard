 import React from 'react'
import {  useAppDispatch , useAppSelector  } from '../../hooks/redusHooks'

import { setMode } from '../../store/modeSlice'
import { selectMode , selectLastUpdated , selectIsLoading } from '../../store/modeSlice'
import type { DashboardMode } from '../../types'


const modeConfig: Record<DashboardMode, {
  label: string;
  icon: string;
  color: string;
  activeColor: string;
  description: string;
}> = {
  realtime: {
    label: 'Live',
    icon: '●',
    color: 'text-gray-400',
    activeColor: 'bg-green-600 text-white',
    description: 'Auto-refresh every 10s',
  },
  paused: {
    label: 'Paused',
    icon: '⏸',
    color: 'text-gray-400',
    activeColor: 'bg-yellow-600 text-white',
    description: 'Data frozen, no updates',
  },
  manual: {
    label: 'Manual',
    icon: '🔄',
    color: 'text-gray-400',
    activeColor: 'bg-blue-600 text-white',
    description: 'Refresh button only',
  },
};


export function ModeToggle() {

   const dispatch = useAppDispatch();
  const currentMode = useAppSelector(selectMode);
  const lastUpdated = useAppSelector(selectLastUpdated);
  const isLoading = useAppSelector(selectIsLoading);



  const handleModeChange = (mode: DashboardMode) => {
    dispatch(setMode(mode));
  };

   const formatTime = (isoString: string | null) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (

<div className='flex flex-col gap-3' >
<div className="flex items-center gap-1 bg-gray-800 roundeed-xl p-1.5 border border-gray-700"  >
    {(Object.keys(modeConfig) as DashboardMode[] ).map((mode)=>{
        const config = modeConfig[mode];
        const isActive = currentMode === mode;
return(
         <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              disabled={isLoading && mode !== currentMode}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 ease-out
                ${isActive 
                  ? config.activeColor + ' shadow-lg scale-105' 
                  : config.color + ' hover:text-white hover:bg-gray-700'
                }
                ${isLoading && mode !== currentMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Icon */}
              <span className={`text-xs ${isActive ? 'animate-pulse' : ''}`}>
                {config.icon}
              </span>
              
              {/* Label */}
              <span>{config.label}</span>
              
              {/* Active indicator dot */}
              {isActive && mode === 'realtime' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        {/* Left: Current mode description */}
        <span>
          {modeConfig[currentMode].description}
        </span>
        
        {/* Right: Last updated time */}
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Updating...
            </span>
          )}
          <span>
            Last updated: {formatTime(lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  );
}