import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudSun, Wind, Droplets, MapPin, Search, RefreshCw, Thermometer, Eye, Gauge } from "lucide-react";
import { useState, useEffect } from "react";
import { weatherApi } from "@/services/api/weatherApi";
import { Skeleton } from "@/components/ui/skeleton";
import { WIDGET_COLORS, CARD_STYLES } from "@/shared/theme";
import { Link } from "react-router-dom";
import { useDebounce } from "@/shared/hooks";
import type { WeatherData } from "../dashboardStore";

export function WeatherDashboard() {
  const [city, setCity] = useState("London");
  const [searchInput, setSearchInput] = useState("London");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = WIDGET_COLORS.weather;

  // Debounce search for API call
  const debouncedCity = useDebounce(searchInput, 500);

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await weatherApi.getCurrentWeather(cityName);
      setWeather(data);
      setCity(cityName);
    } catch (err) {
      setError("Failed to fetch weather data. Please check the city name.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debouncedCity && debouncedCity !== city) {
      fetchWeather(debouncedCity);
    }
  }, [debouncedCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground text-sm w-fit">
          ← Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className={`p-2 rounded-xl ${theme.accent}`}>
                <CloudSun className={`h-6 w-6 ${theme.icon}`} />
              </div>
              Weather Dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Real-time weather data from OpenWeatherMap API
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search city (debounced)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 w-[200px] md:w-[280px]"
              />
              {isLoading && (
                <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {/* Main Weather Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-2 bg-gradient-to-br ${theme.gradient} ${CARD_STYLES.default}`}>
          <CardHeader>
            <CardTitle className="text-xl">Current Weather</CardTitle>
            <CardDescription>
              {weather ? `Weather conditions in ${weather.location}` : "Loading weather data..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Skeleton className="h-24 w-32" />
                  <Skeleton className="h-8 w-40" />
                </div>
              </div>
            ) : weather ? (
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl md:text-7xl lg:text-8xl font-bold">{weather.temp}</span>
                    <span className="text-2xl md:text-3xl text-muted-foreground">°C</span>
                  </div>
                  <span className="text-xl text-muted-foreground capitalize mt-2">{weather.condition}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-full">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-medium">{weather.location}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No weather data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="flex flex-col gap-4">
          <Card className={CARD_STYLES.default}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${theme.accent}`}>
                  <Droplets className={`h-6 w-6 ${theme.icon}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold">{weather?.humidity ?? "--"}%</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={CARD_STYLES.default}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Wind className="h-6 w-6 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold">{weather?.windSpeed ?? "--"} km/h</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <Thermometer className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Feels Like</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{weather?.temp ?? "--"}°C</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Eye className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="text-2xl font-bold">10 km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-900/30">
                <Gauge className="h-6 w-6 text-rose-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p className="text-2xl font-bold">1013 hPa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Info */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Data Source:</strong> OpenWeatherMap API •
            <strong className="ml-2">Search:</strong> API-based (debounced 500ms) •
            <strong className="ml-2">Last Updated:</strong> {new Date().toLocaleTimeString()} •
            <strong className="ml-2">City:</strong> {city}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
