import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-12',
} as const;

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const;

export function LoadingSpinner({
  size = 'md',
  message,
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Spinner className={cn(sizeClasses[size], 'text-primary')} />
      {message && (
        <p className={cn('text-muted-foreground', textSizeClasses[size])}>{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
}

export function InlineSpinner({ className }: { className?: string }) {
  return <Spinner className={cn('size-4', className)} />;
}
