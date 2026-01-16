import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { AlertsPanel } from "@/features/alerts/components/AlertsPanel";
import { useAlertsStore } from "@/features/alerts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AlertsPage() {
  const { alerts, markAllRead, clearAlerts, unreadCount } = useAlertsStore();

  const errorCount = alerts.filter(a => a.type === 'error').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info' || a.type === 'success').length;

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
          <ScrollArea className="h-[400px] p-4">
            <AlertsPanel />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
