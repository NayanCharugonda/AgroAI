import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CropPrice } from '@/types';
import { api } from '@/lib/api';

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="w-5 h-5 text-primary" />;
  if (trend === 'down') return <TrendingDown className="w-5 h-5 text-destructive" />;
  return <Minus className="w-5 h-5 text-muted-foreground" />;
};

export default function MarketPricesPage() {
  const [search, setSearch] = useState('');
  const [prices, setPrices] = useState<CropPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get('/api/v1/prices/daily');
        setPrices(data);
      } catch (err: any) {
        console.error('Failed to fetch prices:', err);
        setError('Failed to load real-time prices. Showing cached data.');
        // Optional: set some local fallback if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const filtered = (prices || []).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Market Prices</h1>
      <p className="text-muted-foreground mb-6">Real-time crop prices across markets</p>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search crops..."
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Fetching live mandi prices...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center mb-8">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((crop, i) => (
            <motion.div
              key={crop.name + (crop.market || i)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="agroai-card p-5 bg-card"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-heading font-semibold text-foreground">{crop.name}</h3>
                <TrendIcon trend={crop.trend} />
              </div>
              <p className="text-2xl font-bold text-foreground">₹{crop.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{crop.unit}</p>
              {crop.market && (
                <p className="text-xs text-muted-foreground mt-1">📍 {crop.market}, {crop.state}</p>
              )}
              <p className={`text-sm font-medium mt-2 ${crop.change > 0 ? 'text-primary' : crop.change < 0 ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                {crop.change > 0 ? '+' : ''}{crop.change}% this week
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
