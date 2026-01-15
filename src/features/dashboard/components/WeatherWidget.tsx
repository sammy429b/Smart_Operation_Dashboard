import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Wind, Droplets, MapPin, ArrowRight } from "lucide-react";
import { useDashboardStore } from "../dashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { WIDGET_COLORS, CARD_STYLES } from "@/shared/theme";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function WeatherWidget() {
  const { weather, isLoading } = useDashboardStore();
  const theme = WIDGET_COLORS.weather;

  if (isLoading || !weather) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CloudSun className={`h-5 w-5 ${theme.icon}`} />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-full bg-gradient-to-br ${theme.gradient} ${CARD_STYLES.default} group`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base md:text-lg">
          <div className="flex items-center gap-2">
            <CloudSun className={`h-5 w-5 ${theme.icon}`} />
            <span>Current Weather</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to="/weather" className="gap-1">
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link to="/weather" className="block">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                    {weather.temp}
                  </span>
                  <span className="text-xl md:text-2xl text-muted-foreground">°C</span>
                </div>
                <span className="text-sm md:text-base text-muted-foreground capitalize mt-1">
                  {weather.condition}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground ${theme.badge} px-2 py-1 rounded-full`}>
                <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                <span className="truncate max-w-[80px] md:max-w-none">{weather.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="flex items-center gap-2 bg-white/60 dark:bg-black/20 p-2 md:p-3 rounded-xl backdrop-blur-sm">
                <div className={`p-1.5 md:p-2 rounded-lg ${theme.accent}`}>
                  <Droplets className={`h-4 w-4 md:h-5 md:w-5 ${theme.icon}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Humidity</span>
                  <span className="text-sm md:text-base font-semibold truncate">{weather.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/60 dark:bg-black/20 p-2 md:p-3 rounded-xl backdrop-blur-sm">
                <div className="p-1.5 md:p-2 rounded-lg bg-slate-100 dark:bg-slate-900/50">
                  <Wind className="h-4 w-4 md:h-5 md:w-5 text-slate-500" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Wind</span>
                  <span className="text-sm md:text-base font-semibold truncate">{weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
