import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuthStore } from '../authSlice';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE = 2 * 60 * 1000; // 2 minutes before timeout

interface UseSessionOptions {
  onWarning?: () => void;
  onTimeout?: () => void;
}

export function useSession(options: UseSessionOptions = {}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const sessionExpiry = useAuthStore((state) => state.sessionExpiry);
  const extendSession = useAuthStore((state) => state.extendSession);
  const logout = useAuthStore((state) => state.logout);

  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  // Reset activity timer
  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;

    clearTimers();
    setShowWarning(false);
    setTimeRemaining(null);

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      optionsRef.current.onWarning?.();

      // Start countdown
      const expiryTime = Date.now() + WARNING_BEFORE;
      countdownRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
        }
      }, 1000);
    }, IDLE_TIMEOUT - WARNING_BEFORE);

    // Set logout timeout
    logoutTimeoutRef.current = setTimeout(() => {
      optionsRef.current.onTimeout?.();
      logout();
    }, IDLE_TIMEOUT);
  }, [isAuthenticated, clearTimers, logout]);

  // Stay logged in action
  const stayLoggedIn = useCallback(() => {
    setShowWarning(false);
    setTimeRemaining(null);
    extendSession();
    resetTimer();
  }, [extendSession, resetTimer]);

  // Setup activity listeners
  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      return;
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    let activityTimeout: ReturnType<typeof setTimeout>;
    const handleActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        resetTimer();
      }, 100);
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(activityTimeout);
      clearTimers();
    };
  }, [isAuthenticated]);

  return {
    showWarning,
    timeRemaining,
    sessionExpiry,
    stayLoggedIn,
    resetTimer,
  };
}
