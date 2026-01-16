import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import { usePresence } from '../hooks/usePresence';

export const PresenceIndicator = () => {
  const {
    onlineUsers,
    offlineUsers,
    onlineUsersCount,
    formatLastSeen,
  } = usePresence();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-6">
          {/* Online users */}
          {onlineUsers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Online Now
                </h4>
                <Badge variant="outline" className="text-[10px] h-5 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 bg-green-500/10">
                  {onlineUsersCount}
                </Badge>
              </div>
              <div className="space-y-1">
                {onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9 border-2 border-background ring-1 ring-border">
                        <AvatarFallback className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 font-medium">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border-2 border-background"></span>
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        Active now
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offline users */}
          {offlineUsers.length > 0 && (
            <div className="space-y-3">
              <div className="px-1">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Away
                </h4>
              </div>
              <div className="space-y-1">
                {offlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors opacity-75 hover:opacity-100"
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9 border-2 border-background">
                        <AvatarFallback className="text-xs text-muted-foreground">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatLastSeen(user.lastSeen)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {onlineUsers.length === 0 && offlineUsers.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <div className="bg-muted/30 p-3 rounded-full w-fit mx-auto mb-3">
                <Users className="h-6 w-6 opacity-50" />
              </div>
              <p className="text-sm font-medium">No team members</p>
              <p className="text-xs opacity-75 mt-1">Invite your team to collaborate</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
