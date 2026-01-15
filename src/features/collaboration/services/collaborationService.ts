import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  onChildAdded,
  onDisconnect,
  remove,
  update,
  off,
  Database,
  DataSnapshot
} from 'firebase/database';
import type { Note, PresenceUser, ActivityEvent } from '../collaborationSlice';

/**
 * Firebase Realtime Database Service for Collaboration
 * 
 * Features:
 * - Live operational notes (CRUD)
 * - User presence detection (online/offline status)
 * - Real-time activity feed
 * - Offline persistence (Firebase RTDB caches data locally by default)
 * - Automatic re-sync when connection is restored
 * 
 * Security Rules: See firebase.rules.json for permission-based writes
 */

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://demo-default-rtdb.firebaseio.com',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only once
let app: FirebaseApp;
let database: Database;

const initializeFirebase = () => {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  database = getDatabase(app);
  return { app, database };
};

// Database paths
const PATHS = {
  NOTES: 'operational_notes',
  PRESENCE: 'presence',
  ACTIVITY: 'activity_feed',
};

export const collaborationService = {
  // Initialize Firebase connection
  initialize(): Database {
    const { database } = initializeFirebase();
    return database;
  },

  // Get database reference
  getDatabase(): Database {
    if (!database) {
      return this.initialize();
    }
    return database;
  },

  // ==================== NOTES ====================

  // Subscribe to notes changes
  subscribeToNotes(callback: (notes: Note[]) => void): () => void {
    const db = this.getDatabase();
    const notesRef = ref(db, PATHS.NOTES);

    onValue(notesRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const notes: Note[] = Object.entries(data).map(([id, note]) => ({
          id,
          ...(note as Omit<Note, 'id'>),
        }));
        callback(notes.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        callback([]);
      }
    });

    return () => off(notesRef);
  },

  // Create a new note
  async createNote(content: string, userId: string, userName: string): Promise<string> {
    const db = this.getDatabase();
    const notesRef = ref(db, PATHS.NOTES);
    const newNoteRef = push(notesRef);

    const note = {
      content,
      userId,
      userName,
      timestamp: Date.now(),
      edited: false,
    };

    await set(newNoteRef, note);

    // Log activity
    await this.logActivity('NOTE_CREATED', userId, userName, { noteId: newNoteRef.key });

    return newNoteRef.key!;
  },

  // Update a note
  async updateNote(noteId: string, content: string, userId: string, userName: string): Promise<void> {
    const db = this.getDatabase();
    const noteRef = ref(db, `${PATHS.NOTES}/${noteId}`);

    await update(noteRef, {
      content,
      edited: true,
      timestamp: Date.now(),
    });

    await this.logActivity('NOTE_UPDATED', userId, userName, { noteId });
  },

  // Delete a note
  async deleteNote(noteId: string, userId: string, userName: string): Promise<void> {
    const db = this.getDatabase();
    const noteRef = ref(db, `${PATHS.NOTES}/${noteId}`);

    await remove(noteRef);
    await this.logActivity('NOTE_DELETED', userId, userName, { noteId });
  },

  // ==================== PRESENCE ====================

  // Set user presence
  async setUserPresence(userId: string, displayName: string): Promise<() => void> {
    const db = this.getDatabase();
    const userPresenceRef = ref(db, `${PATHS.PRESENCE}/${userId}`);

    // Set online status
    await set(userPresenceRef, {
      online: true,
      lastSeen: Date.now(),
      displayName,
    });

    // Set up disconnect handler
    onDisconnect(userPresenceRef).set({
      online: false,
      lastSeen: Date.now(),
      displayName,
    });

    // Log user joined
    await this.logActivity('USER_JOINED', userId, displayName, {});

    // Return cleanup function
    return async () => {
      await set(userPresenceRef, {
        online: false,
        lastSeen: Date.now(),
        displayName,
      });
      await this.logActivity('USER_LEFT', userId, displayName, {});
    };
  },

  // Subscribe to presence changes
  subscribeToPresence(callback: (presence: PresenceUser[]) => void): () => void {
    const db = this.getDatabase();
    const presenceRef = ref(db, PATHS.PRESENCE);

    onValue(presenceRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const presence: PresenceUser[] = Object.entries(data).map(([id, user]) => ({
          id,
          ...(user as Omit<PresenceUser, 'id'>),
        }));
        callback(presence);
      } else {
        callback([]);
      }
    });

    return () => off(presenceRef);
  },

  // ==================== ACTIVITY FEED ====================

  // Log an activity event
  async logActivity(
    type: ActivityEvent['type'],
    userId: string,
    userName: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const db = this.getDatabase();
    const activityRef = ref(db, PATHS.ACTIVITY);
    const newActivityRef = push(activityRef);

    await set(newActivityRef, {
      type,
      userId,
      userName,
      data,
      timestamp: Date.now(),
    });
  },

  // Subscribe to activity feed
  subscribeToActivity(callback: (event: ActivityEvent) => void): () => void {
    const db = this.getDatabase();
    const activityRef = ref(db, PATHS.ACTIVITY);

    onChildAdded(activityRef, (snapshot: DataSnapshot) => {
      const event: ActivityEvent = {
        id: snapshot.key!,
        ...(snapshot.val() as Omit<ActivityEvent, 'id'>),
      };
      callback(event);
    });

    return () => off(activityRef);
  },

  // Get recent activity
  subscribeToRecentActivity(callback: (events: ActivityEvent[]) => void, limit = 20): () => void {
    const db = this.getDatabase();
    const activityRef = ref(db, PATHS.ACTIVITY);

    onValue(activityRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const events: ActivityEvent[] = Object.entries(data)
          .map(([id, event]) => ({
            id,
            ...(event as Omit<ActivityEvent, 'id'>),
          }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
        callback(events);
      } else {
        callback([]);
      }
    });

    return () => off(activityRef);
  },
};
