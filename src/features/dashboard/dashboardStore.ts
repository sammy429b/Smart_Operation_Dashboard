import { create } from 'zustand';

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

export interface CountryData {
  name: string;
  population: number;
  region: string;
  capital: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
}

interface DashboardState {
  weather: WeatherData | null;
  countries: CountryData[];
  news: NewsArticle[];
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  setWeather: (weather: WeatherData) => void;
  setCountries: (countries: CountryData[]) => void;
  setNews: (news: NewsArticle[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE: DashboardState = {
  weather: null,
  countries: [],
  news: [],
  isLoading: false,
  error: null,
};

export const useDashboardStore = create<DashboardState & DashboardActions>((set) => ({
  ...INITIAL_STATE,

  setWeather: (weather) => set({ weather }),
  setCountries: (countries) => set({ countries }),
  setNews: (news) => set({ news }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(INITIAL_STATE),
}));
