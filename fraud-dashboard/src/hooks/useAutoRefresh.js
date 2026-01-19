import { useEffect, useRef, useState, useCallback } from 'react';

// Hook: useAutoRefresh(fetcher, options)
// - fetcher: async fn that returns data
// - options: { interval: ms, enabled: bool, immediate: bool }
// Returns: { data, isLoading, error, refresh, setEnabled, enabled, lastUpdated }
export default function useAutoRefresh(fetcher, options = {}) {
  const { interval = 10000, enabled: initialEnabled = true, immediate = true } = options;
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const runningRef = useRef(false);
  const timerRef = useRef(null);

  const refresh = useCallback(async () => {
    if (runningRef.current) return; // avoid concurrent fetches
    runningRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      runningRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (immediate) {
      refresh();
    }

    timerRef.current = setInterval(() => {
      refresh();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, interval, immediate, refresh]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      runningRef.current = false;
    };
  }, []);

  return { data, isLoading, error, refresh, setEnabled, enabled, lastUpdated };
}

