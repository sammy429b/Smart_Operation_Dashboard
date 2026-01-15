import { Activity, Server } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAlertsStore } from '../alertsSlice';

export const LiveCounter = () => {
  const { counters } = useAlertsStore();

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
            <Activity className="h-3 w-3" />
            Active events
          </div>
          <div className="text-2xl font-bold tracking-tight text-primary">
            {counters.activeEvents || 0}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
            <Server className="h-3 w-3" />
            System Load
          </div>
          <div className="text-2xl font-bold tracking-tight text-primary">
            {counters.systemLoad || 0}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
