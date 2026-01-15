import { WeatherWidget } from "./WeatherWidget";
import { CountriesWidget } from "./CountriesWidget";
import { NewsWidget } from "./NewsWidget";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { useDashboardData } from "../hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

export function DashboardLayout() {
  const { error, isLoading, refetch } = useDashboardData();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Smart Operations Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Real-time overview of system metrics and global data
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={isLoading}
          className="w-fit gap-2 shadow-sm hover:shadow-md transition-shadow"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading dashboard data</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        {/* Left Column - Main Stats */}
        <div className="xl:col-span-8 flex flex-col gap-4 md:gap-6">
          {/* Top Row - Weather & Countries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="min-h-[220px] md:min-h-[250px]">
              <WeatherWidget />
            </div>
            <div className="min-h-[220px] md:min-h-[250px]">
              <CountriesWidget />
            </div>
          </div>

          {/* Analytics Section */}
          <div className="min-h-[300px] md:min-h-[350px]">
            <AnalyticsPanel />
          </div>
        </div>

        {/* Right Column - News & Feeds */}
        <div className="xl:col-span-4">
          <div className="min-h-[500px] md:min-h-[624px] sticky top-4">
            <NewsWidget />
          </div>
        </div>
      </div>

      {/* Footer Stats Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-4 border-t text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          System Online
        </div>
        <div>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
        <div>
          APIs: OpenWeatherMap • REST Countries • Spaceflight News
        </div>
      </div>
    </div>
  );
}
