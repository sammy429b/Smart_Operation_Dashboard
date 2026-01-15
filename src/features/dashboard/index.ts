// Dashboard feature exports
export { DashboardLayout } from './components/DashboardLayout';
export { WeatherWidget } from './components/WeatherWidget';
export { CountriesWidget } from './components/CountriesWidget';
export { NewsWidget } from './components/NewsWidget';
export { AnalyticsPanel } from './components/AnalyticsPanel';

// Dashboard pages
export { WeatherDashboard, CountriesDashboard, NewsDashboard } from './pages';

// Store and hooks
export { useDashboardStore } from './dashboardStore';
export { useDashboardData } from './hooks/useDashboardData';

// Services
export { countriesApi } from './services/countriesApi';
export type { ExtendedCountryData, CountriesApiResponse } from './services/countriesApi';
