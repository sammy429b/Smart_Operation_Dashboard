import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/features/auth';
import { useAlertsStore, type Alert } from '../alertsSlice';
import { collaborationService } from '@/features/collaboration/services/collaborationService';
import { useCollaborationStore } from '@/features/collaboration';
import { toast } from 'sonner';

// Track if subscription is already active globally
let isSubscribed = false;
let unsubscribeGlobal: (() => void) | null = null;

/**
 * Hook for Firebase-based shared alerts
 * Provides real-time alert sync across all users
 * Uses singleton pattern to prevent duplicate subscriptions
 */
export const useFirebaseAlerts = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { isConnected } = useCollaborationStore();
  const { addAlert, setSocketStatus, incrementUnread } = useAlertsStore();
  const initialLoadRef = useRef(true);
  const processedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || !isConnected) {
      return;
    }

    // Only subscribe if not already subscribed (singleton pattern)
    if (isSubscribed) {
      return;
    }

    isSubscribed = true;

    // Subscribe to alerts from Firebase
    unsubscribeGlobal = collaborationService.subscribeToAlerts((alerts) => {
      // On initial load, just populate without notifications
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        // Add existing alerts to processed set
        alerts.forEach(alert => processedIdsRef.current.add(alert.id));
        // Convert and add to store
        alerts.forEach(firebaseAlert => {
          const alert: Alert = {
            id: firebaseAlert.id,
            type: firebaseAlert.type,
            message: firebaseAlert.message,
            timestamp: firebaseAlert.timestamp,
            source: `${firebaseAlert.userName}`,
            details: firebaseAlert.details,
          };
          addAlert(alert);
        });
        return;
      }

      // Check for new alerts and show notifications
      alerts.forEach(firebaseAlert => {
        if (!processedIdsRef.current.has(firebaseAlert.id)) {
          processedIdsRef.current.add(firebaseAlert.id);

          // Add to store
          const alert: Alert = {
            id: firebaseAlert.id,
            type: firebaseAlert.type,
            message: firebaseAlert.message,
            timestamp: firebaseAlert.timestamp,
            source: `${firebaseAlert.userName}`,
            details: firebaseAlert.details,
          };
          addAlert(alert);

          // Show toast notification and increment unread if it's from another user
          if (firebaseAlert.userId !== String(user?.id)) {
            incrementUnread();
            toast(firebaseAlert.message, {
              description: `From ${firebaseAlert.userName}`,
              duration: 5000,
            });
          }
        }
      });
    });

    // Update socket status to reflect Firebase connection
    setSocketStatus('connected');

    return () => {
      if (unsubscribeGlobal) {
        unsubscribeGlobal();
        unsubscribeGlobal = null;
      }
      isSubscribed = false;
      initialLoadRef.current = true;
      processedIdsRef.current.clear();
    };
  }, [isAuthenticated, isConnected, user, addAlert, setSocketStatus, incrementUnread]);

  // Function to raise a shared alert
  const raiseAlert = useCallback(async (
    type: Alert['type'],
    message: string,
    details?: Record<string, unknown>
  ) => {
    if (!user || !isConnected) {
      toast.error('Not connected. Please wait for connection.');
      return null;
    }

    try {
      const alertId = await collaborationService.createAlert(
        type,
        message,
        String(user.id),
        `${user.firstName} ${user.lastName}`,
        details
      );
      toast.success('Alert raised successfully');
      return alertId;
    } catch (error) {
      console.error('Failed to raise alert:', error);
      toast.error('Failed to raise alert');
      return null;
    }
  }, [user, isConnected]);

  return {
    raiseAlert,
    isConnected,
  };
};
