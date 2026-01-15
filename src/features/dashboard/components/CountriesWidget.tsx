import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe2, Users, Building2, ArrowRight } from "lucide-react";
import { useDashboardStore } from "../dashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WIDGET_COLORS, REGION_COLORS, CARD_STYLES } from "@/shared/theme";
import { Link } from "react-router-dom";

export function CountriesWidget() {
  const { countries, isLoading } = useDashboardStore();
  const theme = WIDGET_COLORS.countries;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe2 className={`h-5 w-5 ${theme.icon}`} />
            Global Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 md:px-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-full bg-gradient-to-br ${theme.gradient} ${CARD_STYLES.default} group`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base md:text-lg">
          <div className="flex items-center gap-2">
            <Globe2 className={`h-5 w-5 ${theme.icon}`} />
            <span>Global Data</span>
            <Badge variant="secondary" className="text-[10px]">
              {countries.length} countries
            </Badge>
          </div>
          <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to="/countries" className="gap-1">
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[160px] md:h-[180px] px-4 md:px-6 pb-4">
          <div className="space-y-2 md:space-y-3">
            {countries.map((country, index) => (
              <Link
                key={index}
                to="/countries"
                className="flex items-center justify-between p-2.5 md:p-3 rounded-xl bg-white/60 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/30 transition-colors cursor-pointer group/item"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-semibold text-sm md:text-base truncate group-hover/item:text-primary transition-colors">
                    {country.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[9px] md:text-[10px] px-1.5 py-0 border-none ${REGION_COLORS[country.region] || 'bg-muted'}`}
                    >
                      {country.region}
                    </Badge>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-0.5 flex-shrink-0">
                  <div className="flex items-center justify-end gap-1 text-xs md:text-sm font-medium">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{(country.population / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] md:text-xs text-muted-foreground">
                    <Building2 className="h-2.5 w-2.5" />
                    <span className="truncate max-w-[60px] md:max-w-[80px]">{country.capital}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
