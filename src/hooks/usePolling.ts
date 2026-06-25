import { useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions {
  callback: () => void;
  interval?: number;
  enabled?: boolean;
}

export function usePolling({ 
  callback, 
  interval = 10000,  
  enabled = true     
}: UsePollingOptions) {
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    callbackRef.current();
    
    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, interval);

  }, [interval, stopPolling]);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    } 
    
    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  const refresh = useCallback(() => {
    callbackRef.current();
  }, []);

  return {
    startPolling,   
    stopPolling,    
    refresh,        
  };
}