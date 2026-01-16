import { create } from 'zustand';

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'system';
  message: string;
  timestamp: number;
  source?: string;
  details?: Record<string, unknown>;
}

interface AlertsState {
  alerts: Alert[];
  socketStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  counters: Record<string, number>;
  unreadCount: number; // New: count of unread alerts
}

interface AlertsActions {
  addAlert: (alert: Alert) => void;
  clearAlerts: () => void;
  removeAlert: (id: string) => void;
  setSocketStatus: (status: AlertsState['socketStatus']) => void;
  updateCounter: (key: string, value: number) => void;
  markAllRead: () => void; // New: mark all alerts as read
  incrementUnread: () => void; // New: increment unread count
  reset: () => void;
}

const INITIAL_STATE: AlertsState = {
  alerts: [],
  socketStatus: 'disconnected',
  counters: {
    activeEvents: 0,
    systemLoad: 0,
  },
  unreadCount: 0,
};

export const useAlertsStore = create<AlertsState & AlertsActions>()((set) => ({
  ...INITIAL_STATE,

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 100), // Keep last 100 alerts
    })),

  clearAlerts: () => set({ alerts: [], unreadCount: 0 }),

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  setSocketStatus: (socketStatus) => set({ socketStatus }),

  updateCounter: (key, value) =>
    set((state) => ({
      counters: { ...state.counters, [key]: value },
    })),

  markAllRead: () => set({ unreadCount: 0 }),

  incrementUnread: () =>
    set((state) => ({
      unreadCount: state.unreadCount + 1,
    })),

  reset: () => set(INITIAL_STATE),
}));
