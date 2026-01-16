import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Globe2, Newspaper } from "lucide-react";
import { WIDGET_COLORS, CHART_COLORS, CARD_STYLES, MULTI_CHART_COLORS } from "@/shared/theme";
import { useDashboardStore } from "../dashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export function AnalyticsPanel() {
  const { countries, news, isLoading } = useDashboardStore();
  const analyticsTheme = WIDGET_COLORS.analytics;
  const countriesTheme = WIDGET_COLORS.countries;

  // Aggregate population data by region from API
  const regionData = useMemo(() => {
    if (!countries.length) return [];

    const regionMap = countries.reduce((acc, country) => {
      const region = country.region || 'Other';
      if (!acc[region]) {
        acc[region] = { name: region, population: 0, count: 0 };
      }
      acc[region].population += country.population;
      acc[region].count += 1;
      return acc;
    }, {} as Record<string, { name: string; population: number; count: number }>);

    return Object.values(regionMap)
      .map(r => ({
        ...r,
        population: Math.round(r.population / 1000000), // Convert to millions
      }))
      .sort((a, b) => b.population - a.population);
  }, [countries]);

  // Aggregate news by source from API
  const newsSourceData = useMemo(() => {
    if (!news.length) return [];

    const sourceMap = news.reduce((acc, article) => {
      const source = article.source || 'Unknown';
      if (!acc[source]) {
        acc[source] = { name: source, articles: 0 };
      }
      acc[source].articles += 1;
      return acc;
    }, {} as Record<string, { name: string; articles: number }>);

    return Object.values(sourceMap)
      .sort((a, b) => b.articles - a.articles)
      .slice(0, 6); // Top 6 sources
  }, [news]);

  // Chart colors for bars
  // Chart colors for bars
  const barColors = MULTI_CHART_COLORS;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="h-[220px]">
            <Skeleton className="h-full w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="h-[220px]">
            <Skeleton className="h-full w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full">
      {/* Population by Region - From REST Countries API */}
      <Card className={`bg-gradient-to-br ${countriesTheme.gradient} ${CARD_STYLES.default}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <div className={`p-1.5 rounded-lg ${countriesTheme.accent}`}>
              <Globe2 className={`h-4 w-4 ${countriesTheme.icon}`} />
            </div>
            <span>Population by Region</span>
            <div className="ml-auto flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
              <span className="font-medium">{countries.length}</span> countries
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] md:h-[220px] lg:h-[260px]">
          {regionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPopulation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  labelStyle={{ fontWeight: 600 }}
                  formatter={(value: number) => [`${value}M`, 'Population']}
                />
                <Bar dataKey="population" radius={[6, 6, 0, 0]}>
                  {regionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Sources - From Spaceflight News API */}
      <Card className={`bg-gradient-to-br ${analyticsTheme.gradient} ${CARD_STYLES.default}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <div className={`p-1.5 rounded-lg ${analyticsTheme.accent}`}>
              <Newspaper className={`h-4 w-4 ${analyticsTheme.icon}`} />
            </div>
            <span>Articles by Source</span>
            <div className="ml-auto flex items-center gap-1 text-xs md:text-sm text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {news.length} total
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] md:h-[220px] lg:h-[260px]">
          {newsSourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newsSourceData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`${value}`, 'Articles']}
                />
                <Bar dataKey="articles" radius={[0, 6, 6, 0]}>
                  {newsSourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
