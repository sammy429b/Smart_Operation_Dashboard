import axios from 'axios';
import type { NewsArticle } from '../../features/dashboard/dashboardStore';

const BASE_URL = 'https://api.spaceflightnewsapi.net/v4';

export interface NewsApiParams {
  limit?: number;
  offset?: number;
  search?: string;
  newsSite?: string;
}

export interface NewsApiResponse {
  data: NewsArticle[];
  count: number;
  next: string | null;
  previous: string | null;
}

const mapArticle = (article: any): NewsArticle => ({
  id: String(article.id),
  title: article.title,
  summary: article.summary,
  url: article.url,
  imageUrl: article.image_url,
  publishedAt: article.published_at,
  source: article.news_site,
});

export const spaceflightApi = {
  // Get news for overview widget
  getNews: async (): Promise<NewsArticle[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/articles`, {
        params: {
          limit: 20,
        },
      });

      return response.data.results.map(mapArticle);
    } catch (error) {
      console.error('Failed to fetch space news:', error);
      throw error;
    }
  },

  // Get news with pagination and filters (API-based)
  getNewsWithPagination: async (params: NewsApiParams = {}): Promise<NewsApiResponse> => {
    const { limit = 10, offset = 0, search, newsSite } = params;

    try {
      const queryParams: Record<string, any> = {
        limit,
        offset,
      };

      // API-based search
      if (search) {
        queryParams.search = search;
      }

      // API-based filter by news site
      if (newsSite) {
        queryParams.news_site = newsSite;
      }

      const response = await axios.get(`${BASE_URL}/articles`, {
        params: queryParams,
      });

      return {
        data: response.data.results.map(mapArticle),
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      };
    } catch (error) {
      console.error('Failed to fetch news with pagination:', error);
      throw error;
    }
  },

  // Get available news sites for filtering
  getNewsSites: async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/info`);
      return response.data.news_sites || [];
    } catch (error) {
      console.error('Failed to fetch news sites:', error);
      // Fallback to common sources
      return ['NASA', 'SpaceX', 'ESA', 'Blue Origin', 'Spaceflight Now'];
    }
  },

  // Search articles (API-based debounced search)
  searchArticles: async (query: string, limit = 20): Promise<NewsArticle[]> => {
    if (!query.trim()) {
      const response = await spaceflightApi.getNewsWithPagination({ limit });
      return response.data;
    }

    try {
      const response = await axios.get(`${BASE_URL}/articles`, {
        params: {
          search: query,
          limit,
        },
      });

      return response.data.results.map(mapArticle);
    } catch (error) {
      console.error('Failed to search articles:', error);
      throw error;
    }
  },
};
