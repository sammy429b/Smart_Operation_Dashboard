import { LoginForm } from '@/features/auth';
import { Activity, Shield, Zap, Globe } from 'lucide-react';
import { ThemeToggle } from '@/shared/components';

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Theme Toggle - Fixed position */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Panel - Branding (hidden on mobile, visible on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-8 lg:p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
              <Activity className="size-6" />
            </div>
            <span className="text-2xl font-bold">Smart Operations</span>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Real-Time Monitoring Dashboard
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-md">
              Monitor live data streams, collaborate in real-time, and manage system operations from a single powerful dashboard.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="p-2 rounded-lg bg-primary-foreground/10">
                <Zap className="size-5" />
              </div>
              <span>Real-time data updates via WebSocket</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="p-2 rounded-lg bg-primary-foreground/10">
                <Globe className="size-5" />
              </div>
              <span>Multi-API integration (Weather, Countries, News)</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="p-2 rounded-lg bg-primary-foreground/10">
                <Shield className="size-5" />
              </div>
              <span>Secure JWT authentication with auto-refresh</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © 2026 Smart Operations Dashboard. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/20 p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Mobile Logo (visible on mobile, hidden on lg+) */}
          <div className="text-center space-y-3 lg:hidden">
            <div className="inline-flex items-center justify-center size-16 sm:size-20 rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Activity className="size-8 sm:size-10" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Smart Operations</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Real-time monitoring dashboard</p>
            </div>
          </div>

          <LoginForm />

          {/* Footer for mobile */}
          <p className="text-center text-xs text-muted-foreground lg:hidden">
            © 2026 Smart Operations Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
