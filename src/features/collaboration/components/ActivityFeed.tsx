import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, FileText, UserPlus, UserMinus, Edit, Trash } from 'lucide-react';
import { useCollaborationStore } from '../collaborationSlice';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityEvent } from '../collaborationSlice';

const getActivityIcon = (type: ActivityEvent['type']) => {
  switch (type) {
    case 'NOTE_CREATED':
      return <FileText className="h-4 w-4 text-green-500" />;
    case 'NOTE_UPDATED':
      return <Edit className="h-4 w-4 text-blue-500" />;
    case 'NOTE_DELETED':
      return <Trash className="h-4 w-4 text-red-500" />;
    case 'USER_JOINED':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'USER_LEFT':
      return <UserMinus className="h-4 w-4 text-orange-500" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActivityMessage = (event: ActivityEvent): string => {
  switch (event.type) {
    case 'NOTE_CREATED':
      return `${event.userName} created a note`;
    case 'NOTE_UPDATED':
      return `${event.userName} updated a note`;
    case 'NOTE_DELETED':
      return `${event.userName} deleted a note`;
    case 'USER_JOINED':
      return `${event.userName} joined`;
    case 'USER_LEFT':
      return `${event.userName} left`;
    default:
      return `${event.userName} performed an action`;
  }
};

const getActivityBadgeVariant = (type: ActivityEvent['type']): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (type) {
    case 'NOTE_CREATED':
    case 'USER_JOINED':
      return 'default';
    case 'NOTE_UPDATED':
      return 'secondary';
    case 'NOTE_DELETED':
    case 'USER_LEFT':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const ActivityFeed = () => {
  const { activityFeed, isLoading } = useCollaborationStore();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-purple-500" />
          Activity Feed
          <Badge variant="outline" className="ml-auto">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 pr-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">
                Loading activity...
              </div>
            ) : activityFeed.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              activityFeed.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-0.5">{getActivityIcon(event.type)}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm">{getActivityMessage(event)}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getActivityBadgeVariant(event.type)}
                        className="text-[10px]"
                      >
                        {event.type.replace('_', ' ').toLowerCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
