import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow, Thermometer, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { WeatherData } from '@/types';

const wmoCodeToCondition: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mainly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'cloud' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'cloud' },
  48: { label: 'Depositing rime fog', icon: 'cloud' },
  51: { label: 'Light drizzle', icon: 'rain' },
  53: { label: 'Moderate drizzle', icon: 'rain' },
  55: { label: 'Dense drizzle', icon: 'rain' },
  61: { label: 'Slight rain', icon: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  71: { label: 'Slight snow fall', icon: 'cloud' },
  73: { label: 'Moderate snow fall', icon: 'cloud' },
  75: { label: 'Heavy snow fall', icon: 'cloud' },
  77: { label: 'Snow grains', icon: 'cloud' },
  80: { label: 'Slight rain showers', icon: 'rain' },
  81: { label: 'Moderate rain showers', icon: 'rain' },
  82: { label: 'Violent rain showers', icon: 'rain' },
  95: { label: 'Thunderstorm', icon: 'rain' },
};

function getCondition(code: number) {
  return wmoCodeToCondition[code] || { label: 'Cloudy', icon: 'cloud' };
}

const WeatherIcon = ({ type, size = 'w-8 h-8' }: { type: string; size?: string }) => {
  if (type === 'sun') return <Sun className={`${size} text-sun`} />;
  if (type === 'rain') return <CloudRain className={`${size} text-rain`} />;
  return <Cloud className={`${size} text-sky`} />;
};

export default function WeatherPage() {
  const { currentLocation, setCurrentLocation } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Geocoding with Fallback
        const fetchGeo = async (name: string) => {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`);
          const data = await res.json();
          return data.results && data.results.length > 0 ? data.results[0] : null;
        };

        let locationData = await fetchGeo(currentLocation);

        // Fallback: try removing commas (e.g., "Pune, Maharashtra" -> "Pune")
        if (!locationData && currentLocation.includes(',')) {
          const simplified = currentLocation.split(',')[0].trim();
          locationData = await fetchGeo(simplified);
        }

        if (!locationData) {
          throw new Error(`Location "${currentLocation}" not found. Try searching for a major city.`);
        }

        const { latitude, longitude, name, admin1, country } = locationData;
        const locationStr = `${name}${admin1 ? `, ${admin1}` : ''}, ${country}`;

        // 2. Forecast
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherRes.json();

        const current = weatherData.current;
        const daily = weatherData.daily;
        const currentCond = getCondition(current.weather_code);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const forecast = daily.time.map((time: string, i: number) => {
          const date = new Date(time);
          const cond = getCondition(daily.weather_code[i]);
          return {
            day: i === 0 ? 'Today' : days[date.getDay()],
            temp: Math.round(daily.temperature_2m_max[i]),
            condition: cond.label,
            icon: cond.icon,
          };
        });

        setWeather({
          location: locationStr,
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          condition: currentCond.label,
          icon: currentCond.icon,
          forecast: forecast,
        });
      } catch (err: any) {
        console.error('Weather fetch error:', err);
        setError(err.message || 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [currentLocation]);

  const handleSearch = () => {
    if (searchLocation.trim()) {
      setCurrentLocation(searchLocation.trim());
      setSearchLocation('');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
        <div className="flex-1">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Weather Monitor</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {weather?.location || 'Loading...'}
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={searchLocation}
            onChange={e => setSearchLocation(e.target.value)}
            placeholder="Enter location..."
            className="w-60"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* Current weather */}
      {loading ? (
        <div className="agroai-card p-12 mb-8 bg-card flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Cloud className="w-12 h-12 text-primary/50" />
          </motion.div>
        </div>
      ) : error ? (
        <div className="agroai-card p-12 mb-8 bg-card text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={() => setCurrentLocation('Delhi, India')}>Reset to Default</Button>
        </div>
      ) : weather && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="agroai-card p-8 mb-8 bg-card"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex items-center gap-6">
                <WeatherIcon type={weather.icon} size="w-20 h-20" />
                <div>
                  <p className="text-6xl font-heading font-bold text-foreground">{weather.temperature}°C</p>
                  <p className="text-xl text-muted-foreground">{weather.condition}</p>
                </div>
              </div>
              <div className="flex gap-8 ml-auto">
                <div className="text-center">
                  <Droplets className="w-6 h-6 text-rain mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="text-lg font-semibold text-foreground">{weather.humidity}%</p>
                </div>
                <div className="text-center">
                  <Wind className="w-6 h-6 text-sky mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Wind</p>
                  <p className="text-lg font-semibold text-foreground">{weather.windSpeed} km/h</p>
                </div>
                <div className="text-center">
                  <Thermometer className="w-6 h-6 text-destructive mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Feels like</p>
                  <p className="text-lg font-semibold text-foreground">{weather.temperature - 2}°C</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 7-day forecast */}
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">7-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {weather.forecast.map((day, i) => (
              <motion.div
                key={day.day + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="agroai-card p-4 text-center bg-card"
              >
                <p className="text-sm font-semibold text-foreground mb-2">{day.day}</p>
                <WeatherIcon type={day.icon} size="w-8 h-8 mx-auto" />
                <p className="text-lg font-bold text-foreground mt-2">{day.temp}°C</p>
                <p className="text-xs text-muted-foreground">{day.condition}</p>
              </motion.div>
            ))}
          </div>

          {/* Weather alerts */}
          {weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('thunder') ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-destructive/10 border border-destructive/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-heading font-semibold text-destructive mb-2">⚠️ Weather Alert</h3>
              <p className="text-destructive/80">
                {weather.condition} conditions detected. Consider protecting your crops and postponing field work.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-primary/10 border border-primary/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-heading font-semibold text-primary mb-2">✅ Favorable Conditions</h3>
              <p className="text-primary/80">
                Weather conditions are favorable for farming activities.
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
