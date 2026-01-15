import { useCallback } from 'react';
import { useCollaborationStore } from '../collaborationSlice';
import { useAuthStore } from '@/features/auth';

/**
 * Hook for tracking user presence in the collaboration system
 */
export const usePresence = () => {
  const { user } = useAuthStore();
  const { presence } = useCollaborationStore();

  // Get online users count
  const onlineUsersCount = presence.filter((p) => p.online).length;

  // Get list of online users
  const onlineUsers = presence.filter((p) => p.online);

  // Get list of offline users (recently seen)
  const offlineUsers = presence.filter((p) => !p.online);

  // Check if a specific user is online
  const isUserOnline = useCallback(
    (userId: string): boolean => {
      const userPresence = presence.find((p) => p.id === userId);
      return userPresence?.online ?? false;
    },
    [presence]
  );

  // Get user's display name by ID
  const getUserDisplayName = useCallback(
    (userId: string): string | undefined => {
      const userPresence = presence.find((p) => p.id === userId);
      return userPresence?.displayName;
    },
    [presence]
  );

  // Get last seen time for a user
  const getLastSeen = useCallback(
    (userId: string): number | undefined => {
      const userPresence = presence.find((p) => p.id === userId);
      return userPresence?.lastSeen;
    },
    [presence]
  );

  // Format last seen as relative time
  const formatLastSeen = useCallback((timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }, []);

  // Check if current user is connected
  const isCurrentUserOnline = user ? isUserOnline(String(user.id)) : false;

  return {
    presence,
    onlineUsersCount,
    onlineUsers,
    offlineUsers,
    isUserOnline,
    getUserDisplayName,
    getLastSeen,
    formatLastSeen,
    isCurrentUserOnline,
  };
};
