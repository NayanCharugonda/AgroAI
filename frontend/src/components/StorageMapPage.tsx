import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { StorageLocation } from '@/types';
import { useApp } from '@/context/AppContext';
import Map from '@/components/Map';
import { api } from '@/lib/api';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export default function StorageMapPage() {
  const { currentLocation, setCurrentLocation } = useApp();
  const [searchQuery, setSearchQuery] = useState(currentLocation);
  const [facilities, setFacilities] = useState<StorageLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);

  const fetchNearbyStorages = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the standardized api utility which respects VITE_API_URL
      const data = await api.post("/api/v1/nearby-storages", { lat, lng });

      // Map backend response to frontend type
      const mappedData: StorageLocation[] = data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        lat: item.latitude,
        lng: item.longitude,
        capacity: item.capacity,
        available: item.available,
        distance: item.distance,
        type: item.type
      }));

      setFacilities(mappedData);
    } catch (error: any) {
      console.error("Failed to fetch storages:", error);
      setError(error.message || "Failed to connect to storage service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationDetected = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
    fetchNearbyStorages(lat, lng);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setCurrentLocation(searchQuery.trim());

    // In a real app, we would geocode the search query here.
    // For now, we'll keep the current center but simulate a refresh.
    if (mapCenter) {
      fetchNearbyStorages(mapCenter.lat, mapCenter.lng);
    }
  };

  const openNavigation = (loc: StorageLocation) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, '_blank');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Storage Finder</h1>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-md">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="pl-10"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="w-4 h-4 mr-2" /> {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <p className="text-muted-foreground mb-6 flex items-center gap-1">
        <MapPin className="w-4 h-4" /> Nearby storage facilities for {currentLocation}
      </p>

      {/* Map */}
      <div className="agroai-card overflow-hidden mb-8 bg-card border border-border">
        <div className="w-full h-[400px]">
          <Map
            center={mapCenter}
            onLocationDetected={handleLocationDetected}
            markers={facilities.map(f => ({
              position: { lat: f.lat, lng: f.lng },
              title: f.name,
              available: f.available,
              type: f.type,
              capacity: f.capacity
            }))}
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Searching for nearby storage...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-1">Connection Error</h3>
            <p className="text-sm text-destructive font-medium">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Please ensure your backend server is running on port 8000 and CORS is enabled.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => mapCenter && fetchNearbyStorages(mapCenter.lat, mapCenter.lng)} className="mt-2">
            Retry Connection
          </Button>
        </div>
      ) : facilities.length === 0 ? (
        <div className="bg-muted/30 border border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center gap-3">
          <Inbox className="w-10 h-10 text-muted-foreground/50" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No Storage Found</h3>
            <p className="text-sm text-muted-foreground">
              We couldn't find any storage facilities near "{currentLocation}".
            </p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((loc, i) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="agroai-card p-5 bg-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{loc.name}</h3>
                  <p className="text-sm text-muted-foreground">{loc.type}</p>
                </div>
                <span className={`text-xs font-semibold rounded-full px-2 py-1 ${loc.available ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                  }`}>
                  {loc.available ? 'Available' : 'Full'}
                </span>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {loc.distance}</p>
                <p>📦 Capacity: {loc.capacity}</p>
              </div>
              <Button
                size="sm"
                onClick={() => openNavigation(loc)}
                className="w-full gap-2"
                disabled={!loc.available}
              >
                <Navigation className="w-3 h-3" /> Get Directions
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
