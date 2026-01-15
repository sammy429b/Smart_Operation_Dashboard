import axios from 'axios';
import { setAccessToken, setRefreshToken, clearAllTokens, getAccessToken, getRefreshToken, isTokenExpired } from '@/shared/utils/tokenUtils';
import type { User } from '../authSlice';

const AUTH_BASE_URL = 'https://dummyjson.com/auth';

// Token expiration times
const ACCESS_TOKEN_EXPIRES_MINS = 2;      // 2 minutes (for testing)
const REFRESH_TOKEN_EXPIRES_MINS = 60;    // 60 minutes

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export type SessionValidationResult = 'valid' | 'refreshed' | 'expired';

export const authService = {
  // Login with username and password
  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    const response = await axios.post<LoginResponse>(`${AUTH_BASE_URL}/login`, {
      username,
      password,
      expiresInMins: ACCESS_TOKEN_EXPIRES_MINS,
    });


    const { accessToken, refreshToken, ...userData } = response.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    const user: User = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      image: userData.image,
    };

    return { user, token: accessToken };
  },

  // Refresh access token
  async refreshToken(): Promise<string | null> {
    const token = getRefreshToken();
    if (!token) return null;

    try {
      const response = await axios.post<RefreshResponse>(`${AUTH_BASE_URL}/refresh`, {
        refreshToken: token,
        expiresInMins: REFRESH_TOKEN_EXPIRES_MINS,
      });

      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      return accessToken;
    } catch {
      clearAllTokens();
      return null;
    }
  },

  // Validate session on page load/refresh
  async validateSession(): Promise<SessionValidationResult> {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    // No tokens at all - session expired
    if (!accessToken && !refreshToken) {
      return 'expired';
    }

    // Check if access token is valid (not expired)
    if (accessToken && !isTokenExpired(accessToken, 0)) {
      return 'valid';
    }

    // Access token expired, check refresh token
    if (refreshToken && !isTokenExpired(refreshToken, 0)) {
      // Refresh token is valid, try to get new access token
      const newAccessToken = await this.refreshToken();
      if (newAccessToken) {
        return 'refreshed';
      }
    }

    // Both tokens expired or refresh failed
    clearAllTokens();
    return 'expired';
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const token = getAccessToken();
    if (!token) return null;

    try {
      const response = await axios.get<User>(`${AUTH_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch {
      return null;
    }
  },

  // Logout
  logout(): void {
    clearAllTokens();
  },
};
