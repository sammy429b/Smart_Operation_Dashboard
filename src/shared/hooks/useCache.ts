import { useCallback, useRef } from 'react';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// Global singleton cache
const globalCache = new Map<string, CacheEntry<unknown>>();

// In-memory cache hook with TTL (default 5 minutes)
export function useCache(defaultTtl: number = 5 * 60 * 1000) {
  const defaultTtlRef = useRef(defaultTtl);
  defaultTtlRef.current = defaultTtl;

  const get = useCallback(<T>(key: string): T | undefined => {
    const entry = globalCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      globalCache.delete(key);
      return undefined;
    }
    return entry.value;
  }, []);

  const set = useCallback(<T>(key: string, value: T, ttl?: number): void => {
    const expiresAt = Date.now() + (ttl ?? defaultTtlRef.current);
    globalCache.set(key, { value, expiresAt });
  }, []);

  const remove = useCallback((key: string): boolean => globalCache.delete(key), []);

  const clear = useCallback((): void => globalCache.clear(), []);

  const has = useCallback((key: string): boolean => {
    const entry = globalCache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      globalCache.delete(key);
      return false;
    }
    return true;
  }, []);

  const keys = useCallback((): string[] => {
    const now = Date.now();
    const validKeys: string[] = [];
    globalCache.forEach((entry, key) => {
      if (now <= entry.expiresAt) validKeys.push(key);
      else globalCache.delete(key);
    });
    return validKeys;
  }, []);

  return { get, set, remove, clear, has, keys };
}

// Direct cache access for non-React contexts
export const cacheStore = {
  get: <T>(key: string): T | undefined => {
    const entry = globalCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      globalCache.delete(key);
      return undefined;
    }
    return entry.value;
  },
  set: <T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void => {
    globalCache.set(key, { value, expiresAt: Date.now() + ttl });
  },
  remove: (key: string): boolean => globalCache.delete(key),
  clear: (): void => globalCache.clear(),
};
