import { useEffect, useRef } from 'react';
import { useCollaborationStore } from '../collaborationSlice';
import { collaborationService } from '../services/collaborationService';
import { useAuthStore } from '@/features/auth';

/**
 * Hook for managing Firebase real-time database connection and subscriptions
 */
export const useFirebase = () => {
  const { user, isAuthenticated } = useAuthStore();
  const {
    setNotes,
    setPresence,
    setActivityFeed,
    setConnected,
    setLoading,
    setError,
  } = useCollaborationStore();

  const unsubscribeRefs = useRef<(() => void)[]>([]);
  const cleanupPresenceRef = useRef<(() => void) | null>(null);
  const isConnectingRef = useRef(false);
  const hasConnectedRef = useRef(false);

  // Get stable user ID
  const userId = user?.id;

  // Auto-connect when authenticated
  useEffect(() => {
    const connect = async () => {
      // Prevent duplicate connections
      if (!isAuthenticated || !user || isConnectingRef.current || hasConnectedRef.current) {
        console.log('[useFirebase] Skipping connection:', {
          isAuthenticated,
          hasUser: !!user,
          isConnecting: isConnectingRef.current,
          hasConnected: hasConnectedRef.current
        });
        return;
      }

      console.log('[useFirebase] Starting Firebase connection...');
      isConnectingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        // Initialize Firebase
        collaborationService.initialize();
        console.log('[useFirebase] Firebase initialized');

        // Subscribe to notes
        const unsubscribeNotes = collaborationService.subscribeToNotes((notes) => {
          console.log('[useFirebase] Notes received:', notes.length);
          setNotes(notes);
        });
        unsubscribeRefs.current.push(unsubscribeNotes);

        // Subscribe to presence
        const unsubscribePresence = collaborationService.subscribeToPresence((presence) => {
          console.log('[useFirebase] Presence received:', presence.length);
          setPresence(presence);
        });
        unsubscribeRefs.current.push(unsubscribePresence);

        // Subscribe to activity feed
        const unsubscribeActivity = collaborationService.subscribeToRecentActivity((events) => {
          console.log('[useFirebase] Activity received:', events.length);
          setActivityFeed(events);
        });
        unsubscribeRefs.current.push(unsubscribeActivity);

        // Set user presence
        const cleanupPresence = await collaborationService.setUserPresence(
          String(user.id),
          `${user.firstName} ${user.lastName}`
        );
        cleanupPresenceRef.current = cleanupPresence;

        console.log('[useFirebase] Connection successful!');
        hasConnectedRef.current = true;
        setConnected(true);
      } catch (err) {
        console.error('[useFirebase] Failed to connect to Firebase:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect');
      } finally {
        setLoading(false);
        isConnectingRef.current = false;
      }
    };

    if (isAuthenticated && user) {
      connect();
    }

    // Cleanup only on unmount or when user logs out (isAuthenticated becomes false)
    return () => {
      // Only cleanup if user is logging out
      if (!isAuthenticated) {
        console.log('[useFirebase] Cleaning up (user logged out)...');
        // Cleanup presence
        if (cleanupPresenceRef.current) {
          cleanupPresenceRef.current();
          cleanupPresenceRef.current = null;
        }

        // Cleanup all subscriptions
        unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
        unsubscribeRefs.current = [];

        hasConnectedRef.current = false;
        setConnected(false);
      }
    };
  }, [isAuthenticated, userId, user, setNotes, setPresence, setActivityFeed, setConnected, setLoading, setError]);

  return {};
};
