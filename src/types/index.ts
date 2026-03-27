export interface User {
  id: string;
  name: string;
  location: string;
  voicePrint?: string;
}

export interface CropRecommendation {
  name: string;
  confidence: number;
  season: string;
  expectedYield: string;
  waterNeeds: string;
  soilType: string;
}

export interface FertilizerRecommendation {
  name: string;
  type: 'fertilizer' | 'pesticide';
  usage: string;
  proportion: string;
  imageUrl: string;
  shopLinks: { store: string; url: string }[];
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  forecast: { day: string; temp: number; condition: string; icon: string }[];
}

export interface StorageLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: string;
  available: boolean;
  distance: string;
  type: string;
}

export interface CropPrice {
  name: string;
  price: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  market?: string;
  state?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'price' | 'disease' | 'general';
  time: string;
  read: boolean;
}
