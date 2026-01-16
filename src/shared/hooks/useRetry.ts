import { useState, useCallback, useRef } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

interface UseRetryResult<T> {
  execute: (...args: Parameters<() => Promise<T>>) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
  attempt: number;
  reset: () => void;
}

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// Calculate backoff with jitter
const getBackoffDelay = (attempt: number, baseDelay: number, maxDelay: number): number => {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, maxDelay);
};

// Retry async operations with exponential backoff
export function useRetry<T>(
  asyncFn: (...args: unknown[]) => Promise<T>,
  options: UseRetryOptions = {}
): UseRetryResult<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    onRetry,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const asyncFnRef = useRef(asyncFn);
  asyncFnRef.current = asyncFn;

  const execute = useCallback(async (...args: unknown[]): Promise<T> => {
    setIsLoading(true);
    setError(null);
    setAttempt(0);

    let lastError: Error = new Error('Unknown error');

    for (let currentAttempt = 0; currentAttempt <= maxRetries; currentAttempt++) {
      try {
        setAttempt(currentAttempt);
        const result = await asyncFnRef.current(...args);
        setIsLoading(false);
        setAttempt(0);
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (currentAttempt < maxRetries) {
          onRetry?.(currentAttempt + 1, lastError);
          await delay(getBackoffDelay(currentAttempt, baseDelay, maxDelay));
        }
      }
    }

    setIsLoading(false);
    setError(lastError);
    throw lastError;
  }, [maxRetries, baseDelay, maxDelay, onRetry]);

  const reset = useCallback(() => {
    setError(null);
    setAttempt(0);
    setIsLoading(false);
  }, []);

  return { execute, isLoading, error, attempt, reset };
}
