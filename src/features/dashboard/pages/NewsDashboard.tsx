import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Newspaper, ExternalLink, Clock, Search, RefreshCw, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { spaceflightApi, type NewsApiResponse } from "@/services/api/spaceflightApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WIDGET_COLORS, CARD_STYLES } from "@/shared/theme";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useDebounce } from "@/shared/hooks";
import type { NewsArticle } from "../dashboardStore";

const ITEMS_PER_PAGE = 10;

export function NewsDashboard() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [newsSites, setNewsSites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const theme = WIDGET_COLORS.news;

  // Debounce search query for API call
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch news sites for filter dropdown
  useEffect(() => {
    const fetchSites = async () => {
      const sites = await spaceflightApi.getNewsSites();
      setNewsSites(sites.slice(0, 6)); // Top 6 sources
    };
    fetchSites();
  }, []);

  // Fetch news with API-based pagination, search, and filter
  const fetchNews = async (page: number, search?: string, source?: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response: NewsApiResponse = await spaceflightApi.getNewsWithPagination({
        limit: ITEMS_PER_PAGE,
        offset,
        search: search || undefined,
        newsSite: source || undefined,
      });
      setNews(response.data);
      setTotalCount(response.count);
    } catch (err) {
      setError("Failed to fetch news data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNews(1);
  }, []);

  // API-based search when debounced search or source filter changes
  useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true);
      setCurrentPage(1);
      await fetchNews(1, debouncedSearch, selectedSource);
      setIsSearching(false);
    };
    performSearch();
  }, [debouncedSearch, selectedSource]);

  // Handle page change
  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    await fetchNews(newPage, debouncedSearch, selectedSource);
  };

  // Handle source filter change (API-based)
  const handleSourceChange = (source: string | null) => {
    setSelectedSource(source);
    setCurrentPage(1);
  };

  // Refresh data
  const handleRefresh = () => {
    setSearchQuery("");
    setSelectedSource(null);
    setCurrentPage(1);
    fetchNews(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Articles by source for chart (from current results)
  const sourceStats = useMemo(() => {
    const stats = news.reduce((acc, article) => {
      const source = article.source || "Unknown";
      if (!acc[source]) acc[source] = { name: source, count: 0 };
      acc[source].count += 1;
      return acc;
    }, {} as Record<string, { name: string; count: number }>);
    return Object.values(stats).sort((a, b) => b.count - a.count);
  }, [news]);

  const chartColors = ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#10b981", "#6366f1"];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm">
            ← Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className={`p-2 rounded-xl ${theme.accent}`}>
              <Newspaper className={`h-6 w-6 ${theme.icon}`} />
            </div>
            News Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Live articles from Spaceflight News API with server-side pagination
          </p>
        </div>

        <Button onClick={handleRefresh} disabled={isLoading} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search and Filter - API-based */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles (API-based, debounced)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {isSearching && (
            <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedSource === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleSourceChange(null)}
          >
            All Sources
          </Button>
          {newsSites.map((source) => (
            <Button
              key={source}
              variant={selectedSource === source ? "default" : "outline"}
              size="sm"
              onClick={() => handleSourceChange(source)}
            >
              {source}
            </Button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{totalCount}</p>
              <p className="text-sm text-muted-foreground">Total Articles</p>
            </div>
          </CardContent>
        </Card>
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{newsSites.length}</p>
              <p className="text-sm text-muted-foreground">News Sources</p>
            </div>
          </CardContent>
        </Card>
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{news.length}</p>
              <p className="text-sm text-muted-foreground">Current Page</p>
            </div>
          </CardContent>
        </Card>
        <Card className={CARD_STYLES.default}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{currentPage}/{totalPages || 1}</p>
              <p className="text-sm text-muted-foreground">Page</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Featured */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sources Chart */}
        <Card className={`bg-gradient-to-br ${theme.gradient} ${CARD_STYLES.default}`}>
          <CardHeader>
            <CardTitle>Articles by Source (Current Page)</CardTitle>
            <CardDescription>Distribution across news sources</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {sourceStats.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Featured Article */}
        <Card className={CARD_STYLES.default}>
          <CardHeader>
            <CardTitle>Featured Article</CardTitle>
            <CardDescription>Latest news highlight</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : news.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold leading-tight">{news[0].title}</h3>
                <p className="text-muted-foreground">{news[0].summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={theme.badge}>{news[0].source}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(news[0].publishedAt)}
                    </span>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <a href={news[0].url} target="_blank" rel="noopener noreferrer">
                      Read More <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">No articles found</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Articles with API Pagination */}
      <Card className={CARD_STYLES.default}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Articles</CardTitle>
            <CardDescription>{totalCount} total articles</CardDescription>
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1 || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] px-6 pb-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No articles found
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                      <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={theme.badge}>
                            {article.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* API Info */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Data Source:</strong> Spaceflight News API •
            <strong className="ml-2">Search:</strong> API-based (debounced 500ms) •
            <strong className="ml-2">Filter:</strong> API-based by news_site •
            <strong className="ml-2">Pagination:</strong> API-based (limit/offset)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
