import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseLazyApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  ref: (node: HTMLElement | null) => void;
  refetch: () => void;
}

const memoryCache = new Map<string, any>();
const inFlightRequests = new Map<string, Promise<any>>();

export function setLazyCache<T>(key: string, data: T): void {
  memoryCache.set(key, data);
}

/**
 * Lazily fetches data only when the target element is near the viewport.
 * Uses IntersectionObserver with a generous rootMargin so the fetch
 * starts before the section becomes visible — zero perceived delay.
 *
 * Also handles elements already in the viewport on mount (e.g. the About
 * section which sits right below the Hero).
 */
export function useLazyApi<T>(
  fetchFn: () => Promise<T>,
  customKey?: string,
  rootMargin: string = '400px',
): UseLazyApiResult<T> {
  const cacheKey = customKey || fetchFn.name || fetchFn.toString();
  const cachedInitial = memoryCache.has(cacheKey) ? (memoryCache.get(cacheKey) as T) : null;

  const [data, setData] = useState<T | null>(cachedInitial);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const triggered = useRef(cachedInitial !== null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<HTMLElement | null>(null);

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

  // IntersectionObserver callback ref
  const ref = useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      nodeRef.current = node;

      // If already fetched (cached), skip observing
      if (triggered.current || !node) return;

      // Check if the element is already in / near the viewport on mount.
      // getBoundingClientRect is synchronous and avoids the 1-frame delay
      // that IntersectionObserver has.
      const rect = node.getBoundingClientRect();
      const margin = parseInt(rootMargin, 10) || 400;
      if (rect.top < window.innerHeight + margin) {
        triggered.current = true;
        execute();
        return; // no need to observe
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !triggered.current) {
            triggered.current = true;
            execute();
            observerRef.current?.disconnect();
          }
        },
        { rootMargin },
      );
      observerRef.current.observe(node);
    },
    [execute, rootMargin],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // If data was already cached, serve it instantly
  useEffect(() => {
    if (memoryCache.has(cacheKey) && !data) {
      setData(memoryCache.get(cacheKey));
      triggered.current = true;
    }
  }, [cacheKey, data]);

  const refetch = useCallback(() => {
    memoryCache.delete(cacheKey);
    triggered.current = true;
    execute();
  }, [cacheKey, execute]);

  return { data, loading, error, ref, refetch };
}

