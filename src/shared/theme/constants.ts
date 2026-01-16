/**
 * Smart Operations Dashboard - Theme Constants
 * 
 * Consistent color tokens for use across the application.
 * These complement the CSS variables defined in index.css
 */

// Widget category colors - use these for consistent widget styling
export const WIDGET_COLORS = {
  // Weather Widget - Sky blue theme
  weather: {
    icon: 'text-sky-500',
    gradient: 'from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-950/40 dark:via-blue-950/40 dark:to-indigo-950/40',
    accent: 'bg-sky-100 dark:bg-sky-900/50',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  },
  // Countries Widget - Emerald/Teal theme
  countries: {
    icon: 'text-emerald-500',
    gradient: 'from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30',
    accent: 'bg-emerald-100 dark:bg-emerald-900/50',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
  // News Widget - Orange/Amber theme
  news: {
    icon: 'text-orange-500',
    gradient: 'from-orange-50/50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/30',
    accent: 'bg-orange-100 dark:bg-orange-900/50',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  },
  // Analytics - Indigo/Purple theme
  analytics: {
    icon: 'text-indigo-500',
    gradient: 'from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30',
    accent: 'bg-indigo-100 dark:bg-indigo-900/50',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  },
  // System/CPU - Rose/Pink theme
  system: {
    icon: 'text-rose-500',
    gradient: 'from-rose-50/50 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/30',
    accent: 'bg-rose-100 dark:bg-rose-900/50',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  },
} as const;

// Region colors for countries widget
export const REGION_COLORS: Record<string, string> = {
  'Europe': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'Asia': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'Americas': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  'Africa': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  'Oceania': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  'Antarctic': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
};

// Chart colors - use these with Recharts
export const CHART_COLORS = {
  primary: '#6366f1',      // Indigo - primary data
  secondary: '#14b8a6',    // Teal - secondary data
  tertiary: '#f59e0b',     // Amber - tertiary data
  quaternary: '#a855f7',   // Purple - fourth series
  quinary: '#22c55e',      // Green - fifth series

  // Semantic colors
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',

  // System metrics
  cpu: '#8b5cf6',
  memory: '#06b6d4',
  disk: '#10b981',
  network: '#f59e0b',
} as const;

// Gradient presets for charts
export const CHART_GRADIENTS = {
  primary: { start: '#818cf8', end: '#6366f1' },
  success: { start: '#86efac', end: '#22c55e' },
  warning: { start: '#fcd34d', end: '#f59e0b' },
  danger: { start: '#fca5a5', end: '#ef4444' },
} as const;

// Status colors
export const STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  loading: 'bg-blue-500',
} as const;

// Card styling presets
export const CARD_STYLES = {
  default: 'border-none shadow-lg hover:shadow-xl transition-shadow duration-300',
  flat: 'border shadow-sm',
  elevated: 'border-none shadow-xl',
} as const;
