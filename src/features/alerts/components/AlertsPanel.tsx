import { Wifi, WifiOff, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VirtualizedList } from '@/shared/components/VirtualizedList';
import { useAlertsStore } from '../alertsSlice';
import { useWebSocket } from '../hooks/useWebSocket';
import { AlertItem } from './AlertItem';
import { LiveCounter } from './LiveCounter';

export const AlertsPanel = () => {
  const { alerts, socketStatus, clearAlerts } = useAlertsStore();
  const { sendTestAlert } = useWebSocket();

  const getStatusColor = () => {
    switch (socketStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'reconnecting': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (socketStatus) {
      case 'connected': return 'Live';
      case 'connecting': return 'Connecting...';
      case 'reconnecting': return 'Reconnecting...';
      default: return 'Offline';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">System Alerts</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {getStatusText()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            title="Send Test Alert"
            onClick={sendTestAlert}
            disabled={socketStatus !== 'connected'}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearAlerts}
            title="Clear Alerts"
            disabled={alerts.length === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0">
        <LiveCounter />

        <div className="flex-1 border rounded-md relative min-h-0 bg-secondary/5 flex flex-col">
          {alerts.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
              {socketStatus === 'connected' ? (
                <>
                  <Wifi className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Waiting for real-time events...</p>
                  <Button variant="link" size="sm" onClick={sendTestAlert}>Trigger test event</Button>
                </>
              ) : (
                <>
                  <WifiOff className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Disconnected from event stream</p>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1">
              <VirtualizedList
                items={alerts}
                itemHeight={90}
                height={undefined} // Let flex grow handle height, parent has min-h-0
                className="h-full"
                renderItem={(alert, index) => (
                  <AlertItem key={alert.id || index} alert={alert} />
                )}
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-2 border-t bg-muted/20 text-[10px] text-center text-muted-foreground">
        <span className="font-mono">{alerts.length}</span> total events processed
      </div>
    </div>
  );
};
