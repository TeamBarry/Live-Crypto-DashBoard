import { useRef, useEffect, useCallback } from 'react';

export function useAbortController() {
  const controllerRef = useRef<AbortController | null>(null);

  const getSignal = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    controllerRef.current = new AbortController();
    
    return controllerRef.current.signal;
  }, []);

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  const abortAndReset = useCallback(() => {
    abort();
    return getSignal();
  }, [abort, getSignal]);

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    getSignal,      // API call se pehle yeh lo
    abort,          // Emergency cancel
    abortAndReset,  // Mode change pe use karo
  };
}