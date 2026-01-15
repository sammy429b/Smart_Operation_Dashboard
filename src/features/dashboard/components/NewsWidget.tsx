import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper, ExternalLink, Clock, ArrowRight } from "lucide-react";
import { useDashboardStore } from "../dashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WIDGET_COLORS, CARD_STYLES } from "@/shared/theme";
import { Link } from "react-router-dom";

export function NewsWidget() {
  const { news, isLoading } = useDashboardStore();
  const theme = WIDGET_COLORS.news;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Newspaper className={`h-5 w-5 ${theme.icon}`} />
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 p-3 rounded-lg border">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={`h-full bg-gradient-to-br ${theme.gradient} ${CARD_STYLES.default} flex flex-col group`}>
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-base md:text-lg">
          <div className="flex items-center gap-2">
            <Newspaper className={`h-5 w-5 ${theme.icon}`} />
            <span>Latest News</span>
            <Badge variant="secondary" className="text-[10px]">
              {news.length} articles
            </Badge>
          </div>
          <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to="/news" className="gap-1">
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full max-h-[540px] md:max-h-[570px] px-4 md:px-6 pb-4">
          <div className="space-y-3 py-1">
            {news.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group/item"
              >
                <div className="flex flex-col gap-2 p-3 md:p-4 rounded-xl border bg-white/60 dark:bg-black/20 hover:bg-white/90 dark:hover:bg-black/40 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
                  <h4 className="font-medium text-sm md:text-base leading-tight line-clamp-2 group-hover/item:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-dashed">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[9px] md:text-[10px] px-1.5 py-0 border-none ${theme.badge}`}>
                        {article.source}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
