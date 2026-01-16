import { Outlet, useLocation } from 'react-router-dom';
import { useSessionValidator } from '@/features/auth';
import { SessionWarning } from '@/features/auth';
import { LiveNotes, PresenceIndicator, ActivityFeed, useCollaborationStore } from '@/features/collaboration';
import { AlertsPanel, useAlertsStore, useFirebaseAlerts, NotificationPopover } from '@/features/alerts';
import { Button } from '@/components/ui/button';
import { Activity, Loader2, Users, PanelRightClose, MessageSquare, Bell, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function AppLayout() {
  const location = useLocation();
  const [collaborationOpen, setCollaborationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('notes');
  const [isMobile, setIsMobile] = useState(false);
  const { isConnected, presence } = useCollaborationStore();

  const { markAllRead } = useAlertsStore();
  const { setTheme, theme } = useTheme();

  // Subscribe to Firebase alerts
  useFirebaseAlerts();

  // Track viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Validate session
  const { isValidating } = useSessionValidator();

  const onlineCount = presence.filter(p => p.online).length;

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Dashboard';
      case '/weather': return 'Weather';
      case '/countries': return 'Global Data';
      case '/news': return 'News Feed';
      default: return 'Overview';
    }
  };

  if (isValidating) {
    // Keep loading state clean
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Smart Ops</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle(location.pathname)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            {/* Theme Toggle - Simple Icon Cycle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Notifications */}
            <NotificationPopover
              onViewAll={() => {
                setActiveTab('alerts');
                setCollaborationOpen(true);
              }}
            />

            {/* Right Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                setCollaborationOpen(!collaborationOpen);
                if (!collaborationOpen) markAllRead();
              }}
            >
              <Users className="size-5" />
              {isConnected && onlineCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 overflow-hidden">
          <div className="flex-1 flex overflow-hidden relative">
            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <Outlet />
            </main>

            {/* Collaboration Sidebar (Custom implementation adjacent to Main) */}
            {collaborationOpen && (
              <aside className="w-80 border-l bg-background hidden md:flex flex-col z-40 h-full absolute right-0 top-0 bottom-0 shadow-xl">
                <div className="p-4 border-b flex items-center justify-between bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">Collaboration</span>
                  </div>
                  <Button variant="ghost" size="icon" className="size-6" onClick={() => setCollaborationOpen(false)}>
                    <PanelRightClose className="size-4" />
                  </Button>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div className="px-4 mt-2 mb-2 shrink-0">
                    <TabsList className="w-full grid grid-cols-4">
                      <TabsTrigger value="notes" title="Notes"><MessageSquare className="size-4" /></TabsTrigger>
                      <TabsTrigger value="presence" title="Presence"><Users className="size-4" /></TabsTrigger>
                      <TabsTrigger value="activity" title="Activity"><Activity className="size-4" /></TabsTrigger>
                      <TabsTrigger value="alerts" title="Alerts"><Bell className="size-4" /></TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                    <TabsContent value="notes" className="flex-1 p-4 m-0 data-[state=inactive]:hidden h-full"><LiveNotes /></TabsContent>
                    <TabsContent value="presence" className="flex-1 p-4 m-0 data-[state=inactive]:hidden h-full"><PresenceIndicator /></TabsContent>
                    <TabsContent value="activity" className="flex-1 p-4 m-0 data-[state=inactive]:hidden h-full"><ActivityFeed /></TabsContent>
                    <TabsContent value="alerts" className="flex-1 p-4 m-0 data-[state=inactive]:hidden h-full"><AlertsPanel /></TabsContent>
                  </div>
                </Tabs>
              </aside>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Mobile Collaboration Sheet */}
      {isMobile && (
        <Sheet open={collaborationOpen} onOpenChange={setCollaborationOpen}>
          <SheetContent side="right" className="w-full sm:w-96 p-0">
            {/* Same Tabs Content for Mobile */}
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="font-semibold">Collaboration</span>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="px-4 mt-4 mb-2 shrink-0">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="notes"><MessageSquare className="size-4" /></TabsTrigger>
                    <TabsTrigger value="presence"><Users className="size-4" /></TabsTrigger>
                    <TabsTrigger value="activity"><Activity className="size-4" /></TabsTrigger>
                    <TabsTrigger value="alerts"><Bell className="size-4" /></TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-4 pb-4">
                  <TabsContent value="notes" className="flex-1 m-0 data-[state=inactive]:hidden h-full"><LiveNotes /></TabsContent>
                  <TabsContent value="presence" className="flex-1 m-0 data-[state=inactive]:hidden h-full"><PresenceIndicator /></TabsContent>
                  <TabsContent value="activity" className="flex-1 m-0 data-[state=inactive]:hidden h-full"><ActivityFeed /></TabsContent>
                  <TabsContent value="alerts" className="flex-1 m-0 data-[state=inactive]:hidden h-full"><AlertsPanel /></TabsContent>
                </div>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <SessionWarning />
    </SidebarProvider>
  );
}
