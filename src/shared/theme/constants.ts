/**
 * Smart Operations Dashboard - Theme Constants
 * 
 * Consistent color tokens for use across the application.
 */

// Widget category colors - standardized to use semantic colors
export const WIDGET_COLORS = {
  // Weather Widget
  weather: {
    icon: 'text-primary',
    gradient: 'bg-card border-border',
    accent: 'bg-muted text-foreground',
    badge: 'bg-muted text-muted-foreground border-border',
  },
  // Countries Widget
  countries: {
    icon: 'text-primary',
    gradient: 'bg-card border-border',
    accent: 'bg-muted text-foreground',
    badge: 'bg-muted text-muted-foreground border-border',
  },
  // News Widget
  news: {
    icon: 'text-primary',
    gradient: 'bg-card border-border',
    accent: 'bg-muted text-foreground',
    badge: 'bg-muted text-muted-foreground border-border',
  },
  // Analytics
  analytics: {
    icon: 'text-primary',
    gradient: 'bg-card border-border',
    accent: 'bg-muted text-foreground',
    badge: 'bg-muted text-muted-foreground border-border',
  },
  // System/CPU
  system: {
    icon: 'text-primary',
    gradient: 'bg-card border-border',
    accent: 'bg-muted text-foreground',
    badge: 'bg-muted text-muted-foreground border-border',
  },
} as const;

// Region colors for countries widget - kept subtle
export const REGION_COLORS: Record<string, string> = {
  'Europe': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'Asia': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'Americas': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  'Africa': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  'Oceania': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  'Antarctic': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
};

// Chart colors
// Chart colors
export const CHART_COLORS = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  quaternary: 'var(--chart-4)',
  quinary: 'var(--chart-5)',
  info: 'var(--chart-2)',
} as const;

export const MULTI_CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

// Gradient presets for charts - simplified
export const CHART_GRADIENTS = {
  primary: { start: 'hsl(var(--primary))', end: 'hsl(var(--primary) / 0.5)' },
  success: { start: 'hsl(var(--chart-2))', end: 'hsl(var(--chart-2) / 0.5)' },
  warning: { start: 'hsl(var(--chart-4))', end: 'hsl(var(--chart-4) / 0.5)' },
  danger: { start: 'hsl(var(--destructive))', end: 'hsl(var(--destructive) / 0.5)' },
} as const;

// Status colors - semantic
export const STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-muted-foreground',
  warning: 'bg-yellow-500',
  error: 'bg-destructive',
  loading: 'bg-primary',
} as const;

// Card styling presets - clean
export const CARD_STYLES = {
  default: 'border bg-card text-card-foreground shadow-sm',
  flat: 'border bg-muted/50 text-muted-foreground',
  elevated: 'border bg-card shadow-md',
} as const;
