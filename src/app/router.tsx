import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WeatherDashboard, CountriesDashboard, NewsDashboard } from '@/features/dashboard';
import { CollaborationPage } from '@/features/collaboration/pages/CollaborationPage';
import { AlertsPage } from '@/features/alerts/pages/AlertsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'weather',
        element: <WeatherDashboard />,
      },
      {
        path: 'countries',
        element: <CountriesDashboard />,
      },
      {
        path: 'news',
        element: <NewsDashboard />,
      },
      {
        path: 'collaboration',
        element: <CollaborationPage />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
