import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth, useSessionValidator } from '@/features/auth';
import { SessionWarning } from '@/features/auth';
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
import { Activity, LogOut, User, Bell, Settings, Loader2, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/shared/components';

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Validate session on page load/refresh
  const { isValidating } = useSessionValidator();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 font-semibold group">
            <div className="flex items-center justify-center size-8 sm:size-10 rounded-xl bg-primary text-primary-foreground shadow-md group-hover:shadow-lg transition-shadow">
              <Activity className="size-4 sm:size-5" />
            </div>
            <span className="hidden sm:inline-block text-sm sm:text-base font-bold">
              Smart Operations
            </span>
          </Link>

          {/* Right side - Desktop */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative size-9 sm:size-10">
              <Bell className="size-4 sm:size-5" />
              <span className="absolute -top-0.5 -right-0.5 size-4 sm:size-5 rounded-full bg-destructive text-destructive-foreground text-[9px] sm:text-[10px] flex items-center justify-center font-medium shadow-sm">
                3
              </span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 sm:h-10 gap-2 px-2 sm:px-3 rounded-full hover:bg-muted">
                  <Avatar className="size-7 sm:size-8 ring-2 ring-background">
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
            {/* Theme Toggle - Mobile */}
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative size-9">
              <Bell className="size-4" />
              <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center">
                3
              </span>
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
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

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Session warning modal */}
      <SessionWarning />
    </div>
  );
}
