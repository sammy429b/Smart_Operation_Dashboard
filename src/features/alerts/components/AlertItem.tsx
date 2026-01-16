import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Info, AlertTriangle, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Alert } from '../alertsSlice';

interface AlertItemProps {
  alert: Alert;
  style?: React.CSSProperties;
}

export const AlertItem = ({ alert, style }: AlertItemProps) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'system':
        return <Monitor className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };



  return (
    <div style={style} className="px-1">
      <div className={cn(
        "group flex items-start gap-3 p-3 rounded-xl border bg-card/50 hover:bg-muted/50 hover:shadow-sm transition-all duration-200 relative overflow-hidden",
        alert.type === 'error' && "bg-destructive/10 border-destructive/20",
        alert.type === 'warning' && "bg-amber-500/10 border-amber-500/20",
        alert.type === 'success' && "bg-green-500/10 border-green-500/20",
        alert.type === 'system' && "bg-primary/10 border-primary/20"
      )}>
        <div className={cn(
          "mt-0.5 shrink-0 p-1.5 rounded-full bg-background ring-1 ring-inset shadow-sm",
          alert.type === 'error' && "text-destructive ring-destructive/20",
          alert.type === 'warning' && "text-amber-600 dark:text-amber-400 ring-amber-500/20",
          alert.type === 'success' && "text-green-600 dark:text-green-400 ring-green-500/20",
          alert.type === 'system' && "text-primary ring-primary/20",
          (alert.type === 'info' || !alert.type) && "text-muted-foreground ring-border"
        )}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold leading-none tracking-tight">
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </p>
            <span className="text-[10px] text-muted-foreground tabular-nums opacity-70 group-hover:opacity-100 transition-opacity">
              {format(alert.timestamp, 'HH:mm:ss')}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-snug break-words">
            {alert.message}
          </p>

          {alert.source && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium uppercase tracking-wide">
                {alert.source}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
