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
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'system':
        return <Monitor className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  const getBorderColor = () => {
    switch (alert.type) {
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-amber-500';
      case 'success':
        return 'border-l-green-500';
      case 'system':
        return 'border-l-blue-500';
      default:
        return 'border-l-slate-400';
    }
  }

  return (
    <div style={style} className="px-4 py-2">
      <div className={cn(
        "flex items-start gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-right-5 hover:bg-accent/50 transition-colors border-l-4",
        getBorderColor()
      )}>
        <div className="mt-0.5 shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-none mb-1">
            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
          </p>
          <p className="text-sm text-muted-foreground break-words">
            {alert.message}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{format(alert.timestamp, 'HH:mm:ss')}</span>
            {alert.source && (
              <>
                <span>•</span>
                <span className="font-medium">{alert.source}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
