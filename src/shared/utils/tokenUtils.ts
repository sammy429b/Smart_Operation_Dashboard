const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Decode JWT payload without verification
export function decodeToken<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

// Check if token is expired (with optional buffer in seconds)
export function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
  const payload = decodeToken<{ exp?: number }>(token);
  if (!payload || !payload.exp) return true;

  const expiryTime = payload.exp * 1000;
  const bufferMs = bufferSeconds * 1000;
  return Date.now() >= expiryTime - bufferMs;
}

// Access token operations
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Refresh token operations
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Clear all tokens
export function clearAllTokens(): void {
  removeAccessToken();
  removeRefreshToken();
}

// Get token expiry timestamp in ms
export function getTokenExpiryTime(token: string): number | null {
  const payload = decodeToken<{ exp?: number }>(token);
  if (!payload || !payload.exp) return null;
  return payload.exp * 1000;
}

// Get seconds until token expires
export function getTimeUntilExpiry(token: string): number {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) return 0;
  return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
}
