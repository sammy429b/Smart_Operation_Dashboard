import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth, useSessionValidator } from '@/features/auth';
import { SessionWarning } from '@/features/auth';
import { LiveNotes, PresenceIndicator, ActivityFeed, useCollaborationStore } from '@/features/collaboration';
import { AlertsPanel, useAlertsStore, useFirebaseAlerts, NotificationPopover } from '@/features/alerts';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Activity, LogOut, User, Settings, Loader2, Menu, Users, PanelRightClose, MessageSquare, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/shared/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collaborationOpen, setCollaborationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('notes');
  const [isMobile, setIsMobile] = useState(false);
  const { isConnected, presence } = useCollaborationStore();
  const { unreadCount, markAllRead } = useAlertsStore();

  // Subscribe to Firebase alerts at app level (even when panel is closed)
  useFirebaseAlerts();

  // Track viewport size for conditional rendering
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Validate session on page load/refresh
  const { isValidating } = useSessionValidator();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const onlineCount = presence.filter(p => p.online).length;

  // Show loading while validating session
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Activity className="size-8 text-primary" />
            </div>
            <Loader2 className="absolute -bottom-1 -right-1 size-6 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <p className="font-medium">Smart Operations</p>
            <p className="text-sm text-muted-foreground">Validating session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 font-semibold group">
            <div className="flex items-center justify-center size-8 sm:size-10 rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Activity className="size-4 sm:size-5" />
            </div>
            <span className="hidden sm:inline-block text-sm sm:text-base font-bold tracking-tight">
              Smart Operations
            </span>
          </Link>

          {/* Right side - Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Collaboration Toggle */}
            <Button
              variant={collaborationOpen ? "secondary" : "ghost"}
              size="icon"
              className="relative size-9 sm:size-10"
              onClick={() => {
                setCollaborationOpen(!collaborationOpen);
                if (!collaborationOpen) markAllRead(); // Mark as read when opening
              }}
            >
              <Users className="size-4 sm:size-5" />
              {isConnected && onlineCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white ring-2 ring-background">
                  {onlineCount}
                </span>
              )}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Alert Notifications Popover */}
            <NotificationPopover
              onViewAll={() => {
                setActiveTab('alerts');
                setCollaborationOpen(true);
              }}
            />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 sm:h-10 gap-2 px-2 sm:px-3 rounded-full hover:bg-muted ml-2">
                  <Avatar className="size-7 sm:size-8 ring-2 ring-background shadow-sm">
                    <AvatarImage src={user?.image} alt={user?.firstName} />
                    <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                      {user ? getInitials(user.firstName, user.lastName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium max-w-[100px] truncate">
                    {user?.firstName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Collaboration Toggle - Mobile */}
            <Button
              variant={collaborationOpen ? "secondary" : "ghost"}
              size="icon"
              className="relative size-9"
              onClick={() => setCollaborationOpen(!collaborationOpen)}
            >
              <Users className="size-4" />
              {isConnected && onlineCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-green-500 text-[8px] text-white ring-2 ring-background">
                  {onlineCount}
                </span>
              )}
            </Button>

            {/* Theme Toggle - Mobile */}
            <ThemeToggle />

            {/* Alert Notifications - Mobile */}
            <NotificationPopover
              onViewAll={() => {
                setActiveTab('alerts');
                setCollaborationOpen(true);
              }}
            />

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9 ml-1">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12 ring-2 ring-primary/20">
                        <AvatarImage src={user?.image} alt={user?.firstName} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user ? getInitials(user.firstName, user.lastName) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11">
                      <User className="size-5" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11">
                      <Settings className="size-5" />
                      Settings
                    </Button>
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="size-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content area with optional collaboration sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>

        {/* Collaboration Sidebar */}
        {collaborationOpen && (
          <aside className="w-80 lg:w-96 border-l bg-background hidden md:flex flex-col shadow-xl z-40">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-primary" />
                <span className="font-semibold">Collaboration</span>
                {isConnected && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full ring-1 ring-inset ring-green-600/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Live
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setCollaborationOpen(false)}
              >
                <PanelRightClose className="size-4" />
              </Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">

              <div className="px-4 mt-2">
                <TabsList className="w-full grid grid-cols-4 h-10 p-1 bg-muted/50">
                  <TabsTrigger value="notes" aria-label="Notes" className="text-xs px-0 gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <MessageSquare className="size-3.5" />
                    <span className="hidden xl:inline">Notes</span>
                  </TabsTrigger>
                  <TabsTrigger value="presence" aria-label="Team Presence" className="text-xs px-0 gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Users className="size-3.5" />
                    <span className="hidden xl:inline">Team</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity" aria-label="Activity Feed" className="text-xs px-0 gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Activity className="size-3.5" />
                    <span className="hidden xl:inline">Activity</span>
                  </TabsTrigger>
                  <TabsTrigger value="alerts" aria-label="System Alerts" className="text-xs px-0 gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm relative">
                    <Bell className="size-3.5" />
                    <span className="hidden xl:inline">Alerts</span>
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-destructive animate-pulse ring-1 ring-background" />
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="notes" className="flex-1 p-4 pt-2 m-0">
                <LiveNotes />
              </TabsContent>
              <TabsContent value="presence" className="flex-1 p-4 pt-2 m-0">
                <PresenceIndicator />
              </TabsContent>
              <TabsContent value="activity" className="flex-1 p-4 pt-2 m-0">
                <ActivityFeed />
              </TabsContent>
              <TabsContent value="alerts" className="flex-1 p-4 pt-2 m-0 overflow-hidden">
                <AlertsPanel />
              </TabsContent>
            </Tabs>
          </aside>
        )}
      </div>

      {/* Mobile Collaboration Sheet - Only render on mobile */}
      {isMobile && (
        <Sheet open={collaborationOpen} onOpenChange={setCollaborationOpen}>
          <SheetContent side="right" className="w-full sm:w-96 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  <span className="font-semibold">Collaboration</span>
                  {isConnected && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full ring-1 ring-inset ring-green-600/20">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                      Live
                    </div>
                  )}
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 mt-2">
                  <TabsList className="w-full grid grid-cols-4 h-10 p-1 bg-muted/50">
                    <TabsTrigger value="notes" aria-label="Notes" className="text-xs px-0 gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <MessageSquare className="size-3.5" />
                      <span className="hidden sm:inline">Notes</span>
                    </TabsTrigger>
                    <TabsTrigger value="presence" aria-label="Team Presence" className="text-xs px-0 gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Users className="size-3.5" />
                      <span className="hidden sm:inline">Team</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" aria-label="Activity Feed" className="text-xs px-0 gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Activity className="size-3.5" />
                      <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                    <TabsTrigger value="alerts" aria-label="System Alerts" className="text-xs px-0 gap-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm relative">
                      <Bell className="size-3.5" />
                      <span className="hidden sm:inline">Alerts</span>
                      {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-destructive animate-pulse ring-1 ring-background" />
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="notes" className="flex-1 p-4 pt-2 m-0 overflow-hidden">
                  <LiveNotes />
                </TabsContent>
                <TabsContent value="presence" className="flex-1 p-4 pt-2 m-0 overflow-hidden">
                  <PresenceIndicator />
                </TabsContent>
                <TabsContent value="activity" className="flex-1 p-4 pt-2 m-0 overflow-hidden">
                  <ActivityFeed />
                </TabsContent>
                <TabsContent value="alerts" className="flex-1 p-4 pt-2 m-0 overflow-hidden">
                  <AlertsPanel />
                </TabsContent>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Session warning modal */}
      <SessionWarning />
    </div>
  );
}
