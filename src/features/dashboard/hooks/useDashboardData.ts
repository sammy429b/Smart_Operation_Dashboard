import { useEffect, useCallback } from 'react';
import { useDashboardStore } from '../dashboardStore';
import { weatherApi } from '../../../services/api/weatherApi';
import { countriesApi } from '../services/countriesApi';
import { spaceflightApi } from '../../../services/api/spaceflightApi';

export const useDashboardData = () => {
  const {
    weather,
    countries,
    news,
    isLoading,
    error,
    setWeather,
    setCountries,
    setNews,
    setLoading,
    setError,
  } = useDashboardStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all data in parallel
      const [weatherData, countriesData, newsData] = await Promise.all([
        weatherApi.getCurrentWeather('New Delhi'), // Could be dynamic
        countriesApi.getCountries(),
        spaceflightApi.getNews(),
      ]);

      setWeather(weatherData);
      setCountries(countriesData);
      setNews(newsData);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [setWeather, setCountries, setNews, setLoading, setError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    weather,
    countries,
    news,
    isLoading,
    error,
    refetch: fetchData,
  };
};
