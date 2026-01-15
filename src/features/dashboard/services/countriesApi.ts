import axios from 'axios';
import type { CountryData } from '../dashboardStore';

const BASE_URL = 'https://restcountries.com/v3.1';

// Fields to request from the API (max 10 allowed by API)
const FIELDS = [
  'name',
  'population',
  'region',
  'capital',
  'cca2',
  'currencies',
  'languages',
  'subregion',
  'flags',
  'independent'
].join(',');

// Helper to build URL with fields
const buildUrl = (endpoint: string) => `${BASE_URL}${endpoint}?fields=${FIELDS}`;

// Extended country data with more fields
export interface ExtendedCountryData extends CountryData {
  code: string;
  currency: string;
  language: string;
  subregion: string;
  flag: string;
  independent: boolean;
}

export interface CountriesApiResponse {
  data: ExtendedCountryData[];
  total: number;
  regions: string[];
  subregions: string[];
  languages: string[];
  currencies: string[];
}

const mapCountryData = (country: any): ExtendedCountryData => ({
  name: country.name?.common || 'Unknown',
  population: country.population || 0,
  region: country.region || 'Unknown',
  capital: country.capital?.[0] || 'N/A',
  code: country.cca2 || '',
  currency: country.currencies ? Object.keys(country.currencies)[0] : 'N/A',
  language: country.languages ? Object.values(country.languages)[0] as string : 'N/A',
  subregion: country.subregion || 'N/A',
  flag: country.flags?.svg || country.flags?.png || '',
  independent: country.independent ?? true,
});

export const countriesApi = {
  // Get all countries (for overview widget - limited)
  getCountries: async (): Promise<CountryData[]> => {
    try {
      const response = await axios.get(buildUrl('/all'));
      return response.data.slice(0, 10).map((c: any) => ({
        name: c.name?.common,
        population: c.population,
        region: c.region,
        capital: c.capital?.[0] || 'N/A',
      }));
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      throw error;
    }
  },

  // Get all countries with extended data (for dashboard)
  getAllCountries: async (): Promise<CountriesApiResponse> => {
    try {
      const response = await axios.get(buildUrl('/all'));

      const data: ExtendedCountryData[] = response.data.map(mapCountryData);
      const regions = Array.from(new Set(data.map((c) => c.region))).filter(Boolean).sort();
      const subregions = Array.from(new Set(data.map((c) => c.subregion))).filter((r) => r !== 'N/A').sort();
      const languages = Array.from(new Set(data.map((c) => c.language))).filter(Boolean).sort();
      const currencies = Array.from(new Set(data.map((c) => c.currency))).filter((c) => c !== 'N/A').sort();

      return { data, total: data.length, regions, subregions, languages, currencies };
    } catch (error) {
      console.error('Failed to fetch all countries:', error);
      throw error;
    }
  },

  // Search by name (API endpoint: /name/{name})
  searchByName: async (name: string): Promise<ExtendedCountryData[]> => {
    if (!name.trim()) {
      const response = await countriesApi.getAllCountries();
      return response.data;
    }
    try {
      const response = await axios.get(`${BASE_URL}/name/${encodeURIComponent(name)}?fields=${FIELDS}`);
      return response.data.map(mapCountryData);
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  // Search by country code (API endpoint: /alpha/{code})
  getByCode: async (code: string): Promise<ExtendedCountryData | null> => {
    try {
      const response = await axios.get(`${BASE_URL}/alpha/${encodeURIComponent(code)}?fields=${FIELDS}`);
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      return mapCountryData(data);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  // Filter by currency (API endpoint: /currency/{currency})
  getByCurrency: async (currency: string): Promise<ExtendedCountryData[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/currency/${encodeURIComponent(currency)}?fields=${FIELDS}`);
      return response.data.map(mapCountryData);
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  // Filter by language (API endpoint: /lang/{language})
  getByLanguage: async (language: string): Promise<ExtendedCountryData[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/lang/${encodeURIComponent(language)}?fields=${FIELDS}`);
      return response.data.map(mapCountryData);
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  // Filter by capital city (API endpoint: /capital/{capital})
  getByCapital: async (capital: string): Promise<ExtendedCountryData[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/capital/${encodeURIComponent(capital)}?fields=${FIELDS}`);
      return response.data.map(mapCountryData);
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  // Filter by region (API endpoint: /region/{region})
  getByRegion: async (region: string): Promise<ExtendedCountryData[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/region/${encodeURIComponent(region)}?fields=${FIELDS}`);
      return response.data.map(mapCountryData);
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  // Filter by subregion (API endpoint: /subregion/{subregion})
  getBySubregion: async (subregion: string): Promise<ExtendedCountryData[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/subregion/${encodeURIComponent(subregion)}?fields=${FIELDS}`);
      return response.data.map(mapCountryData);
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  // Get only independent countries (filter from /all)
  getIndependent: async (status: boolean = true): Promise<ExtendedCountryData[]> => {
    try {
      const response = await countriesApi.getAllCountries();
      return response.data.filter(c => c.independent === status);
    } catch (error: any) {
      console.error('Failed to fetch independent countries:', error);
      return [];
    }
  },

  // Combined search with filter type
  searchWithFilter: async (
    filterType: 'name' | 'region' | 'subregion' | 'capital' | 'language' | 'currency' | 'code' | 'independent',
    value: string
  ): Promise<ExtendedCountryData[]> => {
    try {
      switch (filterType) {
        case 'name':
          return await countriesApi.searchByName(value);
        case 'region':
          return await countriesApi.getByRegion(value);
        case 'subregion':
          return await countriesApi.getBySubregion(value);
        case 'capital':
          return await countriesApi.getByCapital(value);
        case 'language':
          return await countriesApi.getByLanguage(value);
        case 'currency':
          return await countriesApi.getByCurrency(value);
        case 'code':
          const result = await countriesApi.getByCode(value);
          return result ? [result] : [];
        case 'independent':
          return await countriesApi.getIndependent(value === 'true');
        default:
          return await countriesApi.searchByName(value);
      }
    } catch (error) {
      console.error(`Search with filter ${filterType} failed:`, error);
      return [];
    }
  },
};
