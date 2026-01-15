import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Circle } from 'lucide-react';
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-green-500" />
          Team Presence
          <Badge variant="default" className="ml-auto bg-green-500">
            {onlineUsersCount} online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 pr-4">
            {/* Online users */}
            {onlineUsers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Online Now
                </h4>
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-green-500 text-white">
                            {getInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">Active now</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offline users */}
            {offlineUsers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recently Active
                </h4>
                <div className="space-y-2">
                  {offlineUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-muted-foreground text-muted-foreground" />
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
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No team members yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
