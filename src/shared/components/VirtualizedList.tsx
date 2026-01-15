import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemHeight?: number;
  height?: number;
  className?: string;
}

// Simple virtualized list using CSS for scrolling optimization
export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight = 60,
  height = 400,
  className,
}: VirtualizedListProps<T>) {
  return (
    <div
      className={cn('overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20', className)}
      style={{ height, maxHeight: height }}
    >
      {items.map((item, index) => (
        <div key={index} style={{ minHeight: itemHeight }}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export function ScrollableList({
  children,
  height = 400,
  className,
}: {
  children: ReactNode;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn('overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20', className)}
      style={{ height }}
    >
      {children}
    </div>
  );
}
