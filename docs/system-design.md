# System Design

Technical design document covering system architecture, data flow, and engineering decisions.

---

## System Overview

The Smart Operations Dashboard is a real-time monitoring platform that integrates:

- **Multiple REST APIs** for data aggregation
- **Firebase RTDB** for collaboration
- **WebSockets** for live events
- **JWT authentication** with session management

---

## Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                              │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                          UI Layer (React)                             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌───────────┐            │ │
│  │  │  Auth    │ │Dashboard │ │Collaboration│ │  Alerts   │            │ │
│  │  └────┬─────┘ └────┬─────┘ └──────┬──────┘ └─────┬─────┘            │ │
│  └───────┼────────────┼──────────────┼──────────────┼───────────────────┘ │
│          │            │              │              │                     │
│  ┌───────┴────────────┴──────────────┴──────────────┴───────────────────┐ │
│  │                       State Layer (Zustand)                           │ │
│  └───────┬────────────┬──────────────┬──────────────┬───────────────────┘ │
│          │            │              │              │                     │
│  ┌───────┴────────────┴──────────────┴──────────────┴───────────────────┐ │
│  │                        Service Layer                                  │ │
│  │  ┌─────────────┐  ┌────────────────┐  ┌─────────────────────────────┐│ │
│  │  │ API Client  │  │ Firebase SDK   │  │    WebSocket Service        ││ │
│  │  │  (Axios)    │  │ (Real-time DB) │  │  (Native WebSocket)         ││ │
│  │  └──────┬──────┘  └───────┬────────┘  └──────────────┬──────────────┘│ │
│  └─────────┼─────────────────┼──────────────────────────┼───────────────┘ │
│            │                 │                          │                 │
└────────────┼─────────────────┼──────────────────────────┼─────────────────┘
             │                 │                          │
             ▼                 ▼                          ▼
     ┌───────────────┐  ┌─────────────┐          ┌───────────────┐
     │  REST APIs    │  │  Firebase   │          │   WebSocket   │
     │               │  │   Server    │          │    Server     │
     │ • DummyJSON   │  │             │          │               │
     │ • Weather API │  └─────────────┘          └───────────────┘
     │ • Countries   │
     │ • Spaceflight │
     └───────────────┘
```

---

## Component Design

### Authentication Flow

```
┌─────────────┐    POST /auth/login    ┌─────────────┐
│   Browser   │ ─────────────────────▶ │  DummyJSON  │
│             │                        │     API     │
│             │ ◀───────────────────── │             │
└─────────────┘   JWT + Refresh Token  └─────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│                  Token Storage                       │
│  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │  Access Token   │  │    Refresh Token        │   │
│  │  (memory/local) │  │    (localStorage)       │   │
│  └─────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│               Session Management                     │
│  • 15-minute idle timeout                           │
│  • Activity tracking (mouse, keyboard, scroll)      │
│  • Warning modal 2 min before logout                │
│  • Token refresh before expiry                      │
└─────────────────────────────────────────────────────┘
```

### API Aggregation Pattern

```typescript
// Parallel requests for dashboard data
const fetchDashboardData = async () => {
  const [weather, countries, news, users] = await Promise.all([
    weatherApi.getCurrentWeather(city),
    countriesApi.getAllCountries(),
    spaceflightApi.getArticles(),
    dummyJsonApi.getUsers(),
  ]);
  
  return { weather, countries, news, users };
};
```

---

## Real-Time Systems

### Firebase RTDB Structure

```json
{
  "operational_notes": {
    "<note_id>": {
      "content": "string",
      "userId": "string",
      "userName": "string",
      "timestamp": "number",
      "edited": "boolean"
    }
  },
  "presence": {
    "<user_id>": {
      "online": "boolean",
      "lastSeen": "number",
      "displayName": "string"
    }
  },
  "activity_feed": {
    "<event_id>": {
      "type": "string",
      "userId": "string",
      "data": "object",
      "timestamp": "number"
    }
  }
}
```

### WebSocket Event System

```
┌─────────────────────────────────────────────────────────┐
│                   SocketService                          │
├─────────────────────────────────────────────────────────┤
│  Properties:                                            │
│  • socket: WebSocket | null                             │
│  • eventBuffer: Event[]                                 │
│  • reconnectAttempts: number                            │
│  • listeners: Map<string, Function[]>                   │
├─────────────────────────────────────────────────────────┤
│  Methods:                                               │
│  • connect(url)                                         │
│  • disconnect()                                         │
│  • send(event)                                          │
│  • on(eventType, handler)                               │
│  • off(eventType, handler)                              │
├─────────────────────────────────────────────────────────┤
│  Reconnection Strategy:                                 │
│  • Max attempts: 5                                      │
│  • Backoff: 1s → 2s → 4s → 8s → 16s                    │
│  • Buffer events while offline                          │
│  • Flush buffer on reconnect                            │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Optimizations

### Implemented Strategies

| Strategy | Implementation | Impact |
|----------|----------------|--------|
| **Virtualized Lists** | `react-window` for long lists | Renders only visible items |
| **Memoization** | `React.memo`, `useMemo`, `useCallback` | Prevents unnecessary re-renders |
| **Code Splitting** | `React.lazy` + `Suspense` | Smaller initial bundle |
| **Debounced Search** | 300ms delay | Reduces API calls |
| **Client Caching** | In-memory cache with TTL | Avoids redundant requests |
| **Selective Re-renders** | Zustand selectors | Minimal component updates |

### Caching Strategy

```typescript
// shared/hooks/useCache.ts
const cache = new Map<string, { data: any; expiry: number }>();

export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 5 * 60 * 1000 // 5 minutes default
): T | undefined => {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  
  // Fetch and cache
  fetcher().then(data => {
    cache.set(key, { data, expiry: Date.now() + ttl });
  });
};
```

---

## Error Handling

### Error Boundary Hierarchy

```
<App>
  <ErrorBoundary fallback={<AppError />}>
    <Layout>
      <ErrorBoundary fallback={<WidgetError />}>
        <WeatherWidget />
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}>
        <CountriesWidget />
      </ErrorBoundary>
    </Layout>
  </ErrorBoundary>
</App>
```

### Retry Logic

```typescript
// shared/hooks/useRetry.ts
const executeWithRetry = async (
  fn: () => Promise<any>,
  maxRetries = 3,
  baseDelay = 1000
) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
};
```

---

## Security Considerations

### Token Management

| Aspect | Implementation |
|--------|----------------|
| **Storage** | Access token in memory, refresh in localStorage |
| **Transmission** | Bearer token via Authorization header |
| **Refresh** | Auto-refresh before expiry via interceptor |
| **Cleanup** | Clear tokens on logout/session timeout |

### Route Protection

```typescript
// features/auth/components/ProtectedRoute.tsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

---

## External API Integration

### API Summary

| API | Purpose | Rate Limits | Fallback |
|-----|---------|-------------|----------|
| **DummyJSON** | Auth, Users | Unlimited | Mock data |
| **OpenWeatherMap** | Weather | 60/min | Cached data |
| **REST Countries** | Geo data | Unlimited | Static data |
| **Spaceflight News** | Articles | Unlimited | Empty state |
| **WebSocket Echo** | Testing | N/A | Offline mode |

### API Error Handling

```typescript
const fetchWithFallback = async (
  primaryFetch: () => Promise<any>,
  fallbackData: any
) => {
  try {
    return await primaryFetch();
  } catch (error) {
    console.warn('Using fallback data:', error);
    return fallbackData;
  }
};
```

---

## Scalability Considerations

### Current Design Supports

- **100+ concurrent users** via Firebase RTDB
- **1000+ items** in virtualized lists
- **Multiple API sources** with parallel fetching
- **Offline operation** with sync on reconnect

### Future Improvements

| Area | Suggestion |
|------|------------|
| **State** | Consider React Query for server state |
| **Caching** | Implement service worker for offline |
| **Auth** | Add OAuth/SSO support |
| **Monitoring** | Add observability (Sentry, logs) |

---

## Related Documentation

- [Setup Guide](./setup.md) - Installation instructions
- [Architecture](./architecture.md) - Code structure and patterns
