import { create } from 'zustand';

// Types for collaboration feature
export interface Note {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: number;
  edited: boolean;
}

export interface PresenceUser {
  id: string;
  online: boolean;
  lastSeen: number;
  displayName: string;
}

export interface ActivityEvent {
  id: string;
  type: 'NOTE_CREATED' | 'NOTE_UPDATED' | 'NOTE_DELETED' | 'USER_JOINED' | 'USER_LEFT' | 'ALERT_RAISED';
  userId: string;
  userName: string;
  data: Record<string, unknown>;
  timestamp: number;
}

interface CollaborationState {
  notes: Note[];
  presence: PresenceUser[];
  activityFeed: ActivityEvent[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

interface CollaborationActions {
  // Notes actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;

  // Presence actions
  setPresence: (presence: PresenceUser[]) => void;
  updateUserPresence: (user: PresenceUser) => void;
  removeUserPresence: (userId: string) => void;

  // Activity actions
  setActivityFeed: (events: ActivityEvent[]) => void;
  addActivity: (event: ActivityEvent) => void;

  // Connection state
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

const INITIAL_STATE: CollaborationState = {
  notes: [],
  presence: [],
  activityFeed: [],
  isConnected: false,
  isLoading: false,
  error: null,
};

export const useCollaborationStore = create<CollaborationState & CollaborationActions>()((set) => ({
  ...INITIAL_STATE,

  // Notes actions
  setNotes: (notes) => set({ notes }),

  addNote: (note) => set((state) => ({
    notes: [...state.notes, note],
  })),

  updateNote: (id, content) => set((state) => ({
    notes: state.notes.map((note) =>
      note.id === id ? { ...note, content, edited: true, timestamp: Date.now() } : note
    ),
  })),

  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter((note) => note.id !== id),
  })),

  // Presence actions
  setPresence: (presence) => set({ presence }),

  updateUserPresence: (user) => set((state) => ({
    presence: state.presence.some((p) => p.id === user.id)
      ? state.presence.map((p) => (p.id === user.id ? user : p))
      : [...state.presence, user],
  })),

  removeUserPresence: (userId) => set((state) => ({
    presence: state.presence.filter((p) => p.id !== userId),
  })),

  // Activity actions
  setActivityFeed: (activityFeed) => set({ activityFeed }),

  addActivity: (event) => set((state) => ({
    activityFeed: [event, ...state.activityFeed].slice(0, 50), // Keep last 50 events
  })),

  // Connection state
  setConnected: (isConnected) => set({ isConnected }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Reset
  reset: () => set(INITIAL_STATE),
}));
