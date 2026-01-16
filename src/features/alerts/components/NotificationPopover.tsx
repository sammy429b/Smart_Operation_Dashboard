import { format } from 'date-fns';
import { Bell, AlertCircle, CheckCircle, Info, AlertTriangle, Monitor, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAlertsStore, type Alert } from '../alertsSlice';
import { cn } from '@/lib/utils';

interface NotificationPopoverProps {
  onViewAll: () => void;
}

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'system':
      return <Monitor className="h-4 w-4 text-purple-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getBorderColor = (type: Alert['type']) => {
  switch (type) {
    case 'error':
      return 'border-l-red-500';
    case 'warning':
      return 'border-l-amber-500';
    case 'success':
      return 'border-l-green-500';
    case 'system':
      return 'border-l-purple-500';
    default:
      return 'border-l-blue-500';
  }
};

export const NotificationPopover = ({ onViewAll }: NotificationPopoverProps) => {
  const { alerts, unreadCount, markAllRead } = useAlertsStore();

  // Get the most recent 5 alerts for the preview
  const recentAlerts = alerts.slice(0, 5);

  const handleViewAll = () => {
    markAllRead();
    onViewAll();
  };

  const handleAlertClick = () => {
    markAllRead();
    onViewAll();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 sm:size-10"
          title={unreadCount > 0 ? `${unreadCount} new alerts` : 'No new alerts'}
        >
          <Bell className="size-4 sm:size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-4 sm:size-5 rounded-full bg-destructive text-destructive-foreground text-[9px] sm:text-[10px] flex items-center justify-center font-medium shadow-sm animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h4 className="font-semibold text-sm">Notifications</h4>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} new` : 'No new notifications'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-80">
          {recentAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs">Alerts from your team will appear here</p>
            </div>
          ) : (
            <div className="divide-y">
              {recentAlerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={cn(
                    "w-full text-left p-3 hover:bg-muted/50 transition-colors border-l-4",
                    getBorderColor(alert.type)
                  )}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{format(alert.timestamp, 'HH:mm')}</span>
                        {alert.source && (
                          <>
                            <span>•</span>
                            <span className="font-medium truncate">{alert.source}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {alerts.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className="w-full justify-center text-sm"
              onClick={handleViewAll}
            >
              View all alerts
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
