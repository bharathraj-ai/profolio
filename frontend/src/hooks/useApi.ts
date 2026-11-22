import { useCallback, useEffect, useState } from 'react';

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const memoryCache = new Map<string, any>();
const inFlightRequests = new Map<string, Promise<any>>();

export function setApiCache<T>(key: string, data: T): void {
  memoryCache.set(key, data);
}

export function getApiCache<T>(key: string): T | undefined {
  return memoryCache.get(key);
}

export function clearApiCache(): void {
  memoryCache.clear();
  inFlightRequests.clear();
}

export function useApi<T>(fetchFn: () => Promise<T>, customKey?: string): UseApiResult<T> {
  const cacheKey = customKey || fetchFn.name || fetchFn.toString();
  const cachedInitial = memoryCache.has(cacheKey) ? (memoryCache.get(cacheKey) as T) : null;

  const [data, setData] = useState<T | null>(cachedInitial);
  const [loading, setLoading] = useState<boolean>(cachedInitial === null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(() => {
    if (memoryCache.has(cacheKey)) {
      setData(memoryCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let promise = inFlightRequests.get(cacheKey);
    if (!promise) {
      promise = fetchFn()
        .then((res) => {
          memoryCache.set(cacheKey, res);
          inFlightRequests.delete(cacheKey);
          return res;
        })
        .catch((err) => {
          inFlightRequests.delete(cacheKey);
          throw err;
        });
      inFlightRequests.set(cacheKey, promise);
    }

    promise
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || 'Failed to fetch data';
        setError(msg);
        setLoading(false);
      });
  }, [fetchFn, cacheKey]);

  useEffect(() => {
    if (memoryCache.has(cacheKey)) {
      setData(memoryCache.get(cacheKey));
      setLoading(false);
    } else {
      execute();
    }
  }, [execute, cacheKey]);

  const refetch = useCallback(() => {
    memoryCache.delete(cacheKey);
    execute();
  }, [cacheKey, execute]);

  return { data, loading, error, refetch };
}
