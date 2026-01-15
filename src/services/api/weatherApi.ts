import axios from 'axios';
import type { WeatherData } from '../../features/dashboard/dashboardStore';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Mock data for fallback when API is unavailable
const getMockWeather = (city: string): WeatherData => ({
  temp: Math.floor(Math.random() * 15) + 15, // 15-30°C
  condition: ['Clear', 'Clouds', 'Rain', 'Sunny'][Math.floor(Math.random() * 4)],
  location: city,
  humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
  windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
});

export const weatherApi = {
  getCurrentWeather: async (city: string = 'London'): Promise<WeatherData> => {
    // Check if API key is configured
    if (!API_KEY) {
      console.warn('⚠️ OpenWeatherMap API key not configured. Using mock data.');
      console.info('To use real data, add VITE_OPENWEATHER_API_KEY to your .env file');
      return getMockWeather(city);
    }

    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        },
      });

      const data = response.data;
      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        location: data.name,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      };
    } catch (error: any) {
      // Handle specific error codes
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          console.warn('⚠️ OpenWeatherMap API key is invalid or not yet activated.');
          console.info('New API keys can take up to 2 hours to activate.');
          console.info('Using mock data in the meantime...');
          return getMockWeather(city);
        }

        if (status === 404) {
          console.warn(`⚠️ City "${city}" not found. Using mock data.`);
          return getMockWeather(city);
        }

        if (status === 429) {
          console.warn('⚠️ API rate limit exceeded. Using mock data.');
          return getMockWeather(city);
        }
      }

      console.error('Failed to fetch weather:', error.message);
      return getMockWeather(city);
    }
  },

  // Check if API is working
  checkApiStatus: async (): Promise<{ working: boolean; message: string }> => {
    if (!API_KEY) {
      return { working: false, message: 'API key not configured' };
    }

    try {
      await axios.get(`${BASE_URL}/weather`, {
        params: { q: 'London', appid: API_KEY, units: 'metric' },
      });
      return { working: true, message: 'API is working' };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return { working: false, message: 'API key not activated yet (wait up to 2 hours)' };
      }
      return { working: false, message: error.message };
    }
  },
};
