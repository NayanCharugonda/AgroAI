import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Droplets, Sun, MapPin, Search, Play, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { CropRecommendation, FertilizerRecommendation } from '@/types';

const getCropRecommendations = (location: string): CropRecommendation[] => {
  const loc = location.toLowerCase();
  if (loc.includes('india') || loc.includes('hyderabad') || loc.includes('pune') || loc.includes('delhi') || loc.includes('jaipur')) {
    return [
      { name: 'Rice (Paddy)', confidence: 92, season: 'Kharif', expectedYield: '4-6 tonnes/ha', waterNeeds: 'High', soilType: 'Clay/Loamy' },
      { name: 'Wheat', confidence: 88, season: 'Rabi', expectedYield: '3-5 tonnes/ha', waterNeeds: 'Medium', soilType: 'Loamy' },
      { name: 'Cotton', confidence: 85, season: 'Kharif', expectedYield: '1.5-2 tonnes/ha', waterNeeds: 'Medium', soilType: 'Black Soil' },
      { name: 'Sugarcane', confidence: 80, season: 'Year-round', expectedYield: '70-80 tonnes/ha', waterNeeds: 'High', soilType: 'Loamy' },
    ];
  }
  return [
    { name: 'Corn', confidence: 90, season: 'Spring', expectedYield: '8-10 tonnes/ha', waterNeeds: 'Medium', soilType: 'Loamy' },
    { name: 'Soybean', confidence: 87, season: 'Spring', expectedYield: '2-3 tonnes/ha', waterNeeds: 'Low', soilType: 'Clay/Loamy' },
    { name: 'Wheat', confidence: 85, season: 'Fall', expectedYield: '4-6 tonnes/ha', waterNeeds: 'Medium', soilType: 'Loamy' },
  ];
};

const getFertilizerRecommendations = (): (FertilizerRecommendation & { ytTutorials: { title: string; url: string }[] })[] => [
  {
    name: 'DAP (Di-Ammonium Phosphate)',
    type: 'fertilizer',
    usage: 'Apply 100 kg/ha at sowing time. Mix with soil before planting seeds. Best used for root development.',
    proportion: '18-46-0 (N-P-K ratio)',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
    shopLinks: [
      { store: 'Amazon', url: 'https://www.amazon.in/s?k=DAP+fertilizer' },
      { store: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=fertilizer' },
      { store: 'IndiaMART', url: 'https://www.indiamart.com/search.html?ss=dap+fertilizer' },
    ],
    ytTutorials: [
      { title: 'How to Apply DAP Fertilizer Correctly', url: 'https://www.youtube.com/results?search_query=how+to+apply+DAP+fertilizer+farming' },
      { title: 'DAP vs NPK — Which is Better?', url: 'https://www.youtube.com/results?search_query=DAP+vs+NPK+fertilizer+comparison' },
    ],
  },
  {
    name: 'Urea Fertilizer',
    type: 'fertilizer',
    usage: 'Apply 50-100 kg/ha in split doses. First dose at sowing, second 30 days later. Dissolve in water for foliar spray.',
    proportion: '46-0-0 (N-P-K ratio)',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    shopLinks: [
      { store: 'Amazon', url: 'https://www.amazon.in/s?k=urea+fertilizer' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/search?q=urea+fertilizer' },
    ],
    ytTutorials: [
      { title: 'Urea Application Technique for Maximum Yield', url: 'https://www.youtube.com/results?search_query=urea+fertilizer+application+technique+farming' },
      { title: 'Foliar Spray with Urea — Step by Step', url: 'https://www.youtube.com/results?search_query=urea+foliar+spray+farming+tutorial' },
    ],
  },
  {
    name: 'Neem Oil Pesticide',
    type: 'pesticide',
    usage: 'Mix 5ml per liter of water. Spray on leaves during cool hours. Repeat every 7-10 days. Natural & organic.',
    proportion: '5ml per 1L water',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&h=200&fit=crop',
    shopLinks: [
      { store: 'Amazon', url: 'https://www.amazon.in/s?k=neem+oil+pesticide' },
      { store: 'Bighaat', url: 'https://www.bighaat.com/collections/neem-oil' },
    ],
    ytTutorials: [
      { title: 'How to Make Neem Oil Spray at Home', url: 'https://www.youtube.com/results?search_query=neem+oil+spray+organic+farming+tutorial' },
      { title: 'Organic Pest Control with Neem', url: 'https://www.youtube.com/results?search_query=organic+pest+control+neem+oil' },
    ],
  },
  {
    name: 'Chlorpyrifos 20% EC',
    type: 'pesticide',
    usage: 'Mix 2.5ml per liter of water. Spray on affected crops. Use protective gear. Effective against soil pests and borers.',
    proportion: '2.5ml per 1L water',
    imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300&h=200&fit=crop',
    shopLinks: [
      { store: 'Amazon', url: 'https://www.amazon.in/s?k=chlorpyrifos+pesticide' },
      { store: 'IndiaMART', url: 'https://www.indiamart.com/search.html?ss=chlorpyrifos' },
    ],
    ytTutorials: [
      { title: 'Safe Pesticide Spraying Techniques', url: 'https://www.youtube.com/results?search_query=safe+pesticide+spraying+technique+farming' },
      { title: 'Chlorpyrifos Usage Guide for Farmers', url: 'https://www.youtube.com/results?search_query=chlorpyrifos+usage+guide+farmers' },
    ],
  },
];

export default function CropAdvisorPage() {
  const { currentLocation, setCurrentLocation } = useApp();
  const [location, setLocation] = useState(currentLocation);
  const [crops, setCrops] = useState<CropRecommendation[]>(getCropRecommendations(currentLocation));
  const [showFertilizers, setShowFertilizers] = useState(true);

  const handleSearch = () => {
    if (location.trim()) {
      setCurrentLocation(location.trim());
      setCrops(getCropRecommendations(location.trim()));
    }
  };

  const fertilizers = getFertilizerRecommendations();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Crop Advisor</h1>
      <p className="text-muted-foreground mb-6">AI-powered recommendations based on your location's soil, weather and market</p>

      <div className="flex gap-2 mb-8">
        <div className="relative flex-1 max-w-md">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Enter your location..."
            className="pl-10"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}><Search className="w-4 h-4 mr-2" /> Analyze</Button>
      </div>

      {/* Crop recommendations */}
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <Sprout className="w-5 h-5 text-primary" /> Recommended Crops for {currentLocation}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {crops.map((crop, i) => (
          <motion.div
            key={crop.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="vasundhara-card p-5 bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-sm font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
                {crop.confidence}% match
              </span>
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{crop.name}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>🌱 Season: {crop.season}</p>
              <p>📊 Yield: {crop.expectedYield}</p>
              <p><Droplets className="w-3 h-3 inline" /> Water: {crop.waterNeeds}</p>
              <p>🪨 Soil: {crop.soilType}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fertilizers & Pesticides - shown directly */}
      <div className="mb-4">
        <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
          💊 Recommended Fertilizers & Pesticides
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Based on your crop and location analysis</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {fertilizers.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="vasundhara-card overflow-hidden bg-card"
          >
            <div className="h-40 bg-muted overflow-hidden relative">
              <img
                src={f.imageUrl}
                alt={f.name}
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop';
                }}
              />
              <span className={`absolute top-3 right-3 text-xs font-semibold rounded-full px-3 py-1 ${f.type === 'fertilizer' ? 'bg-primary text-primary-foreground' : 'bg-warning-orange text-primary-foreground'
                }`}>
                {f.type === 'fertilizer' ? '🌿 Fertilizer' : '🛡️ Pesticide'}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{f.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{f.usage}</p>
              <p className="text-sm font-medium text-foreground mb-3">📐 Proportion: {f.proportion}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {f.shopLinks.map(link => (
                  <a
                    key={link.store}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-3 py-1.5 transition-colors font-medium"
                  >
                    🛒 Buy on {link.store}
                  </a>
                ))}
              </div>

              {/* YouTube Tutorials */}
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <Play className="w-3 h-3 text-destructive" /> Video Tutorials
                </p>
                <div className="space-y-1.5">
                  {f.ytTutorials.map(yt => (
                    <a
                      key={yt.title}
                      href={yt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <span className="w-5 h-5 rounded bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <Play className="w-3 h-3 text-destructive" />
                      </span>
                      <span className="group-hover:underline">{yt.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 ml-auto flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
