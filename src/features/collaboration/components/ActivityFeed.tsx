import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity } from 'lucide-react';
import { useCollaborationStore } from '../collaborationSlice';
import { formatDistanceToNow } from 'date-fns';

export const ActivityFeed = () => {
  const { activityFeed, isLoading } = useCollaborationStore();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-1 mb-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Latest Activity
        </h4>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-4 pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p className="text-sm">Loading feed...</p>
            </div>
          ) : activityFeed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3 border-2 border-dashed border-muted rounded-xl bg-muted/10 mx-2">
              <div className="bg-background p-3 rounded-full shadow-sm">
                <Activity className="h-6 w-6 opacity-50" />
              </div>
              <p className="text-sm font-medium">No activity yet</p>
            </div>
          ) : (
            <div className="relative border-l border-muted/50 ml-3 space-y-6 py-2">
              {activityFeed.map((event) => (
                <div key={event.id} className="relative pl-6 group">
                  {/* Timeline Dot */}
                  <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background ring-1 ring-border bg-muted group-hover:bg-primary transition-colors duration-200" />

                  <div className="flex flex-col gap-1">
                    <p className="text-sm leading-none">
                      <span className="font-semibold text-foreground">{event.userName}</span>
                      <span className="text-muted-foreground mx-1">
                        {event.type.includes('NOTE') ? 'updated notes' :
                          event.type.includes('USER') ? (event.type === 'USER_JOINED' ? 'joined' : 'left') :
                            'performed action'}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wide">
                        {event.type.split('_')[1] || 'ACTION'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
