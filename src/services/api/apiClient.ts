import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearAllTokens, isTokenExpired } from '@/shared/utils/tokenUtils';

const apiClient = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track if refreshing to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      const token = getAccessToken();

      // Only try refresh if we have a token and it's expired
      if (token && isTokenExpired(token)) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            // Get the refresh token (not access token!)
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Attempt token refresh
            const response = await axios.post('https://dummyjson.com/auth/refresh', {
              refreshToken: refreshToken,
              expiresInMins: 30,
            });

            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;
            setAccessToken(newAccessToken);
            if (newRefreshToken) {
              setRefreshToken(newRefreshToken);
            }
            isRefreshing = false;
            onTokenRefreshed(newAccessToken);

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          } catch {
            isRefreshing = false;
            clearAllTokens();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }

        // Queue requests while refreshing
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      // No token or can't refresh - redirect to login
      clearAllTokens();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
