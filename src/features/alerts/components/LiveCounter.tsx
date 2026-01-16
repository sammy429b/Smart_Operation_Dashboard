import { Activity, Server } from 'lucide-react';

import { useAlertsStore } from '../alertsSlice';

export const LiveCounter = () => {
  const { counters } = useAlertsStore();

  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="bg-muted/30 rounded-lg p-2.5 flex flex-col items-center justify-center border border-dashed border-muted-foreground/30">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
          <Activity className="h-3 w-3" />
          Active
        </div>
        <div className="text-xl font-bold tracking-tight text-foreground">
          {counters.activeEvents || 0}
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-2.5 flex flex-col items-center justify-center border border-dashed border-muted-foreground/30">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
          <Server className="h-3 w-3" />
          Load
        </div>
        <div className="text-xl font-bold tracking-tight text-foreground">
          {counters.systemLoad || 0}<span className="text-sm font-normal text-muted-foreground ml-0.5">%</span>
        </div>
      </div>
    </div>
  );
};
