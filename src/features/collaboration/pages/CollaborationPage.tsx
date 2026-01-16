import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MessageSquare, Activity, Zap, Clock } from "lucide-react";
import { LiveNotes } from "@/features/collaboration/components/LiveNotes";
import { PresenceIndicator } from "@/features/collaboration/components/PresenceIndicator";
import { ActivityFeed } from "@/features/collaboration/components/ActivityFeed";
import { useCollaborationStore } from "@/features/collaboration";
import { Link } from "react-router-dom";

export function CollaborationPage() {
  const { presence, isConnected } = useCollaborationStore();

  const onlineCount = presence.filter(p => p.online).length;

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
              <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              Collaboration Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time collaboration, notes, and team activity tracking
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <span className={`h-2 w-2 rounded-full shrink-0 ${isConnected ? 'bg-green-500' : 'bg-muted-foreground'}`} />
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
            <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
              <Users className="h-3 w-3 shrink-0" />
              {onlineCount} Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Live Notes - Primary Focus */}
        <Card className="lg:col-span-7 flex flex-col">
          <CardHeader className="pb-3 border-b shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg">Live Notes</CardTitle>
                  <CardDescription className="truncate">Shared workspace for real-time collaboration</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                <Zap className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <div className="h-[450px]">
              <LiveNotes />
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Team & Activity */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Team Presence */}
          <Card className="flex flex-col flex-1">
            <CardHeader className="pb-3 border-b shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">Team Presence</CardTitle>
                    <CardDescription className="truncate">See who's online and available</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {onlineCount} / {presence.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[200px] p-4">
                <PresenceIndicator />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="flex flex-col flex-1">
            <CardHeader className="pb-3 border-b shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
                    <Activity className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">Activity Feed</CardTitle>
                    <CardDescription className="truncate">Recent actions and updates</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  <Clock className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[200px] p-4">
                <ActivityFeed />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
