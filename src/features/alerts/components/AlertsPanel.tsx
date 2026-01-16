import { useState } from 'react';
import { Wifi, WifiOff, Trash2, Bell, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VirtualizedList } from '@/shared/components/VirtualizedList';
import { useAlertsStore } from '../alertsSlice';
import { useFirebaseAlerts } from '../hooks/useFirebaseAlerts';
import { AlertItem } from './AlertItem';
import { LiveCounter } from './LiveCounter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ALERT_TYPES = [
  { value: 'info', label: 'Info', icon: Info, color: 'text-muted-foreground' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-amber-500' },
  { value: 'error', label: 'Error', icon: AlertCircle, color: 'text-destructive' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-500' },
  { value: 'system', label: 'System', icon: Bell, color: 'text-primary' },
] as const;

export const AlertsPanel = () => {
  const { alerts, socketStatus, clearAlerts } = useAlertsStore();
  const { raiseAlert, isConnected } = useFirebaseAlerts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success' | 'system'>('info');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusColor = () => {
    if (isConnected) return 'bg-green-500';
    switch (socketStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'reconnecting': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    if (isConnected) return 'Live (Firebase)';
    switch (socketStatus) {
      case 'connected': return 'Live';
      case 'connecting': return 'Connecting...';
      case 'reconnecting': return 'Reconnecting...';
      default: return 'Offline';
    }
  };

  const handleRaiseAlert = async () => {
    if (!alertMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await raiseAlert(alertType, alertMessage.trim());
      setAlertMessage('');
      setAlertType('info');
      setDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-1 py-1 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {getStatusText()}
          </span>
        </div>
        <div className="flex gap-1">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs gap-1.5"
                title="Raise Alert"
                aria-label="Raise new alert"
                disabled={!isConnected}
              >
                <Bell className="h-3 w-3" />
                Raise
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Raise Alert</DialogTitle>
                <DialogDescription>
                  This alert will be visible to all connected users in real-time.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="alert-type">Alert Type</Label>
                  <Select value={alertType} onValueChange={(v) => setAlertType(v as typeof alertType)}>
                    <SelectTrigger id="alert-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALERT_TYPES.map(({ value, label, icon: Icon, color }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${color}`} />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="alert-message">Message</Label>
                  <Textarea
                    id="alert-message"
                    placeholder="Enter alert message..."
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleRaiseAlert}
                  disabled={!alertMessage.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Raise Alert'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {alerts.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={clearAlerts}
              title="Clear Alerts"
              aria-label="Clear all alerts"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 -mx-2 px-2">
        <LiveCounter />

        <div className="flex-1 relative min-h-0 flex flex-col mt-2">
          {alerts.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center border-2 border-dashed border-muted rounded-xl bg-muted/10">
              {isConnected ? (
                <>
                  <Wifi className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Waiting for alerts...</p>
                  <p className="text-xs mt-1">System events will appear here</p>
                </>
              ) : (
                <>
                  <WifiOff className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Connecting...</p>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 -mr-2 pr-2">
              <VirtualizedList
                items={alerts}
                itemHeight={90}
                height={undefined}
                className="h-full"
                renderItem={(alert, index) => (
                  <div key={alert.id || index} className="mb-2">
                    <AlertItem alert={alert} />
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 text-[10px] text-center text-muted-foreground border-t mt-2">
        <span className="font-mono">{alerts.length}</span> total events
      </div>
    </div>
  );
};
