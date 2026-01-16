import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, CheckCircle, Info, XCircle, Plus } from "lucide-react";
import { AlertItem } from "@/features/alerts/components/AlertItem";
import { useAlertsStore } from "@/features/alerts";
import { useFirebaseAlerts } from "@/features/alerts/hooks/useFirebaseAlerts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALERT_TYPES = [
  { value: 'info', label: 'Info', color: 'text-blue-500' },
  { value: 'warning', label: 'Warning', color: 'text-amber-500' },
  { value: 'error', label: 'Error', color: 'text-destructive' },
  { value: 'success', label: 'Success', color: 'text-green-500' },
  { value: 'system', label: 'System', color: 'text-primary' },
] as const;

export function AlertsPage() {
  const { alerts, markAllRead, clearAlerts, unreadCount } = useAlertsStore();
  const { raiseAlert, isConnected } = useFirebaseAlerts();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success' | 'system'>('info');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorCount = alerts.filter(a => a.type === 'error').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info' || a.type === 'success').length;

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
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground text-sm inline-flex items-center gap-1 transition-colors">
          ← Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 shrink-0">
                <Bell className="h-6 w-6 text-amber-500" />
              </div>
              System Alerts
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor system notifications, warnings, and critical alerts
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" disabled={!isConnected}>
                  <Plus className="h-4 w-4 mr-2" />
                  Raise Alert
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
                        {ALERT_TYPES.map(({ value, label, color }) => (
                          <SelectItem key={value} value={value}>
                            <span className={color}>{label}</span>
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
            <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAlerts} disabled={alerts.length === 0}>
              <XCircle className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-xs text-muted-foreground truncate">Total Alerts</p>
              </div>
              <div className="p-2 rounded-lg bg-muted shrink-0">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                <p className="text-xs text-muted-foreground truncate">Errors</p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10 shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-2xl font-bold text-amber-500">{warningCount}</p>
                <p className="text-xs text-muted-foreground truncate">Warnings</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-2xl font-bold text-blue-500">{infoCount}</p>
                <p className="text-xs text-muted-foreground truncate">Info</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                <Bell className="h-5 w-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg">All Alerts</CardTitle>
                <CardDescription className="truncate">View and manage system notifications</CardDescription>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="shrink-0">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-2">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
                  <Bell className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No alerts</p>
                  <p className="text-xs mt-1">System events will appear here</p>
                </div>
              ) : (
                [...alerts]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
