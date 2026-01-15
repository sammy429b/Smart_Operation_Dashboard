import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../authSlice';
import { authService } from '../services/authService';
import { showWarning, showError } from '@/shared/components/Toast';

/**
 * Hook that validates the session on page load/refresh.
 * - If access token is valid: continues normally
 * - If access token is expired but refresh token is valid: refreshes access token
 * - If both tokens are expired: logs out and redirects to login
 */
export function useSessionValidator() {
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const validateSession = async () => {
      // Skip validation on login page
      if (location.pathname === '/login') {
        setIsValidating(false);
        return;
      }

      // Only validate if user was previously authenticated (stored in zustand)
      if (!isAuthenticated) {
        setIsValidating(false);
        return;
      }

      try {
        const result = await authService.validateSession();

        switch (result) {
          case 'valid':
            // Session is valid, continue normally
            break;

          case 'refreshed':
            // Access token was refreshed successfully
            showWarning('Session was refreshed');
            break;

          case 'expired':
            // Both tokens expired, logout and redirect
            logout();
            showError('Your session has expired. Please log in again.');
            navigate('/login', { replace: true });
            break;
        }
      } catch (error) {
        console.error('Session validation error:', error);
        logout();
        navigate('/login', { replace: true });
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [isAuthenticated, location.pathname, logout, navigate]);

  return { isValidating };
}
