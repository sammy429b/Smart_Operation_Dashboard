/**
 * Smart Operations Dashboard - Theme Constants
 * 
 * Consistent color tokens for use across the application.
 * These complement the CSS variables defined in index.css
 */

// Widget category colors - use these for consistent widget styling
export const WIDGET_COLORS = {
  // Weather Widget - Electric Azure
  weather: {
    icon: 'text-sky-500 dark:text-sky-400',
    gradient: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-900/40 dark:via-blue-900/30 dark:to-indigo-900/40 border border-sky-200/50 dark:border-sky-700/50 shadow-lg backdrop-blur-xl',
    accent: 'bg-gradient-to-r from-sky-400/20 to-blue-500/20 text-sky-700 dark:text-sky-300',
    badge: 'bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/60 dark:to-blue-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700/50',
  },
  // Countries Widget - Neon Emerald
  countries: {
    icon: 'text-emerald-500 dark:text-emerald-400',
    gradient: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/40 dark:via-teal-900/30 dark:to-cyan-900/40 border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg backdrop-blur-xl',
    accent: 'bg-gradient-to-r from-emerald-400/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300',
    badge: 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/60 dark:to-teal-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50',
  },
  // News Widget - Radiant Amber
  news: {
    icon: 'text-amber-500 dark:text-amber-400',
    gradient: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/40 dark:via-orange-900/30 dark:to-red-900/40 border border-amber-200/50 dark:border-amber-700/50 shadow-lg backdrop-blur-xl',
    accent: 'bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-700 dark:text-amber-300',
    badge: 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/60 dark:to-orange-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50',
  },
  // Analytics - Cosmic Violet
  analytics: {
    icon: 'text-violet-500 dark:text-violet-400',
    gradient: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/40 dark:via-purple-900/30 dark:to-fuchsia-900/40 border border-violet-200/50 dark:border-violet-700/50 shadow-lg backdrop-blur-xl',
    accent: 'bg-gradient-to-r from-violet-400/20 to-fuchsia-500/20 text-violet-700 dark:text-violet-300',
    badge: 'bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/60 dark:to-fuchsia-900/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/50',
  },
  // System/CPU - Cyber Rose
  system: {
    icon: 'text-rose-500 dark:text-rose-400',
    gradient: 'bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-900/40 dark:via-pink-900/30 dark:to-red-900/40 border border-rose-200/50 dark:border-rose-700/50 shadow-lg backdrop-blur-xl',
    accent: 'bg-gradient-to-r from-rose-400/20 to-pink-500/20 text-rose-700 dark:text-rose-300',
    badge: 'bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/60 dark:to-pink-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700/50',
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
