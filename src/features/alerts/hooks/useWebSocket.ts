import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { useAlertsStore } from '../alertsSlice';
import { socketService } from '@/services/websocket/socketService';
import type { Alert } from '../alertsSlice';

export const useWebSocket = () => {
  const { isAuthenticated } = useAuthStore();
  const { addAlert, setSocketStatus, updateCounter } = useAlertsStore();

  useEffect(() => {
    // Sync socket status with store
    socketService.setStatusCallback((status) => {
      setSocketStatus(status);
    });

    // Handle generic messages
    const handleMessage = (data: any) => {
      // If it's an alert
      if (data.type && ['info', 'warning', 'error', 'success', 'system'].includes(data.type)) {
        const alert: Alert = {
          id: data.id || `alert-${Date.now()}-${Math.random()}`,
          type: data.type,
          message: data.message || 'Unknown event',
          timestamp: data.timestamp || Date.now(),
          source: data.source,
          details: data.details,
        };
        addAlert(alert);
      }

      // If it's a counter update
      if (data.type === 'counter_update' && data.key && typeof data.value === 'number') {
        updateCounter(data.key, data.value);
      }

      // Handle echo response (for testing)
      if (data.type === 'echo_response') {
        const alert: Alert = {
          id: `echo-${Date.now()}`,
          type: 'success',
          message: `Echo: ${JSON.stringify(data.payload)}`,
          timestamp: Date.now(),
          source: 'Echo Server',
        };
        addAlert(alert);
      }
    };

    // Subscribe to all messages
    socketService.on('message', handleMessage);

    // Connect if authenticated
    if (isAuthenticated) {
      // Using echo.websocket.events for testing as per requirements
      const WS_URL = import.meta.env.VITE_WEBSOCKET_URL || 'wss://ws.postman-echo.com/raw';
      socketService.connect(WS_URL);
    }

    // Cleanup
    return () => {
      // listener cleanup handled by socketService internals or we could implement specific off here
      // But for global app socket, we might want to keep it open?
      // For now, let's disconnect on unmount if this hook is used in a top-level component that unmounts
      // Or if user logs out.
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, addAlert, setSocketStatus, updateCounter]);

  const sendTestAlert = () => {
    const testPayload = {
      type: 'echo_response', // Trigger our local handler on echo
      payload: {
        message: 'Test Alert from Client',
        timestamp: Date.now()
      }
    };
    socketService.send(testPayload);
  };

  return {
    sendTestAlert
  };
};
