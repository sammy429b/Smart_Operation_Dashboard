import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe2, Users, Building2, Search, RefreshCw, ChevronLeft, ChevronRight, Flag, DollarSign, Languages } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { countriesApi, type ExtendedCountryData, type CountriesApiResponse } from "../services/countriesApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WIDGET_COLORS, REGION_COLORS, CARD_STYLES } from "@/shared/theme";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useDebounce } from "@/shared/hooks";

const ITEMS_PER_PAGE = 12;

type FilterType = 'name' | 'region' | 'subregion' | 'capital' | 'language' | 'currency' | 'code';

const FILTER_OPTIONS = [
  { value: 'name', label: 'Country Name', icon: Globe2, placeholder: 'Search by name...' },
  { value: 'region', label: 'Region', icon: Globe2, placeholder: 'e.g., Europe, Asia' },
  { value: 'subregion', label: 'Subregion', icon: Globe2, placeholder: 'e.g., Western Europe' },
  { value: 'capital', label: 'Capital City', icon: Building2, placeholder: 'e.g., London, Paris' },
  { value: 'language', label: 'Language', icon: Languages, placeholder: 'e.g., English, Spanish' },
  { value: 'currency', label: 'Currency', icon: DollarSign, placeholder: 'e.g., EUR, USD' },
  { value: 'code', label: 'Country Code', icon: Flag, placeholder: 'e.g., US, GB, IN' },
];

export function CountriesDashboard() {
  const [allCountries, setAllCountries] = useState<ExtendedCountryData[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<ExtendedCountryData[]>([]);
  const [metadata, setMetadata] = useState<{ regions: string[]; subregions: string[]; languages: string[]; currencies: string[] }>({
    regions: [], subregions: [], languages: [], currencies: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [showIndependentOnly, setShowIndependentOnly] = useState(false);
  const theme = WIDGET_COLORS.countries;

  // Debounce search query for API call
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Initial fetch - get all countries
  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: CountriesApiResponse = await countriesApi.getAllCountries();
      setAllCountries(response.data);
      setFilteredCountries(response.data);
      setMetadata({
        regions: response.regions,
        subregions: response.subregions,
        languages: response.languages,
        currencies: response.currencies,
      });
    } catch (err) {
      setError("Failed to fetch countries data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // API-based search when debounced search changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch.trim()) {
        // Apply independent filter if active
        if (showIndependentOnly) {
          setFilteredCountries(allCountries.filter(c => c.independent));
        } else {
          setFilteredCountries(allCountries);
        }
        setCurrentPage(1);
        return;
      }

      setIsSearching(true);
      try {
        const results = await countriesApi.searchWithFilter(filterType, debouncedSearch);
        // Apply independent filter if active
        if (showIndependentOnly) {
          setFilteredCountries(results.filter(c => c.independent));
        } else {
          setFilteredCountries(results);
        }
        setCurrentPage(1);
      } catch (err) {
        console.error("Search failed:", err);
        setFilteredCountries([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearch, filterType, allCountries, showIndependentOnly]);

  // Handle independent filter toggle
  const handleIndependentToggle = async () => {
    const newValue = !showIndependentOnly;
    setShowIndependentOnly(newValue);

    if (newValue && !searchQuery) {
      // Fetch only independent countries via API
      setIsSearching(true);
      try {
        const results = await countriesApi.getIndependent(true);
        setFilteredCountries(results);
      } catch (err) {
        console.error("Failed to fetch independent countries:", err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const paginatedCountries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCountries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCountries, currentPage]);

  // Population by region for chart
  const regionStats = useMemo(() => {
    const stats = filteredCountries.reduce((acc, country) => {
      const region = country.region || "Other";
      if (!acc[region]) acc[region] = { name: region, population: 0, count: 0 };
      acc[region].population += country.population;
      acc[region].count += 1;
      return acc;
    }, {} as Record<string, { name: string; population: number; count: number }>);
    return Object.values(stats).sort((a, b) => b.population - a.population);
  }, [filteredCountries]);

  const chartColors = ["#14b8a6", "#06b6d4", "#0ea5e9", "#6366f1", "#8b5cf6", "#a855f7"];
  const currentFilterOption = FILTER_OPTIONS.find(f => f.value === filterType)!;

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
                <Globe2 className={`h-6 w-6 ${theme.icon}`} />
              </div>
              Countries Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Multi-endpoint search via REST Countries API
            </p>
          </div>

          <Button onClick={fetchInitialData} disabled={isLoading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search Controls */}
      <Card className={CARD_STYLES.default}>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filter Type Selector */}
            <Select value={filterType} onValueChange={(v) => { setFilterType(v as FilterType); setSearchQuery(''); }}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Search by..." />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={currentFilterOption.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Independent Toggle */}
            <Button
              variant={showIndependentOnly ? "default" : "outline"}
              onClick={handleIndependentToggle}
              className="gap-2"
            >
              <Flag className="h-4 w-4" />
              Independent Only
            </Button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center mr-2">Quick filters:</span>
            {metadata.regions.slice(0, 6).map((region) => (
              <Button
                key={region}
                variant="outline"
                size="sm"
                onClick={() => { setFilterType('region'); setSearchQuery(region); }}
              >
                {region}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{allCountries.length}</p>
              <p className="text-sm text-muted-foreground">Total Countries</p>
            </div>
          </CardContent>
        </Card>
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{metadata.regions.length}</p>
              <p className="text-sm text-muted-foreground">Regions</p>
            </div>
          </CardContent>
        </Card>
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{filteredCountries.length}</p>
              <p className="text-sm text-muted-foreground">Search Results</p>
            </div>
          </CardContent>
        </Card>
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{metadata.languages.length}</p>
              <p className="text-sm text-muted-foreground">Languages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Chart */}
        <Card className={`bg-gradient-to-br ${theme.gradient} ${CARD_STYLES.default}`}>
          <CardHeader>
            <CardTitle>Population by Region</CardTitle>
            <CardDescription>Based on current search results</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : regionStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1e9).toFixed(1)}B`} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [`${(value / 1e9).toFixed(2)}B`, "Population"]}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }}
                  />
                  <Bar dataKey="population" radius={[0, 4, 4, 0]}>
                    {regionStats.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Countries List with Extended Data */}
        <Card className={CARD_STYLES.default}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Countries List</CardTitle>
              <CardDescription>{filteredCountries.length} countries found</CardDescription>
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {currentPage} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-6 pb-4">
              {isLoading || isSearching ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : paginatedCountries.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground py-8">
                  No countries found
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedCountries.map((country, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {/* Flag */}
                      {country.flag && (
                        <img src={country.flag} alt={country.name} className="w-10 h-7 object-cover rounded shadow-sm" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{country.name}</span>
                          <Badge variant="outline" className="text-[10px]">{country.code}</Badge>
                          {country.independent && (
                            <Badge variant="secondary" className="text-[10px]">Independent</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {country.capital}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {(country.population / 1e6).toFixed(1)}M
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> {country.currency}
                          </span>
                          <span className="flex items-center gap-1">
                            <Languages className="h-3 w-3" /> {country.language}
                          </span>
                        </div>

                        <Badge
                          variant="outline"
                          className={`text-[10px] mt-2 ${REGION_COLORS[country.region] || "bg-muted"}`}
                        >
                          {country.region} • {country.subregion}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints Used */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>REST Countries API Endpoints:</strong> /all, /name, /alpha, /currency, /lang, /capital, /region, /subregion, /independent, /translation
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Current filter: <strong>{filterType.toUpperCase()}</strong> |
            Search: <strong>API-based (debounced 500ms)</strong> |
            Results: <strong>{filteredCountries.length}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
