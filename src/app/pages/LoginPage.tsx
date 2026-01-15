import { LoginForm } from '@/features/auth';
import { Activity } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <Activity className="size-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Operations</h1>
          <p className="text-muted-foreground">Real-time monitoring dashboard</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

