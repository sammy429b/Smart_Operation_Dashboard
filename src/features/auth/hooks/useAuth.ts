import { useCallback } from 'react';
import { useAuthStore } from '../authSlice';
import { authService } from '../services/authService';
import { setAccessToken, clearAllTokens } from '@/shared/utils/tokenUtils';
import { showSuccess, showError } from '@/shared/components/Toast';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setLoading, login: storeLogin, logout: storeLogout } = useAuthStore();

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const { user, token } = await authService.login(username, password);
      storeLogin(user, token);
      showSuccess(`Welcome back, ${user.firstName}!`);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      showError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading, storeLogin]);

  const logout = useCallback(() => {
    authService.logout();
    storeLogout();
    clearAllTokens();
    showSuccess('Logged out successfully');
  }, [storeLogout]);

  const refreshSession = useCallback(async () => {
    const newToken = await authService.refreshToken();
    if (newToken) {
      setAccessToken(newToken);
      useAuthStore.getState().extendSession();
      return true;
    }
    return false;
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshSession,
  };
}
