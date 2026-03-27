import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Sprout, Calendar, ChevronLeft, ChevronRight, Play, Pause, CloudRain, Sun, Cloud, CloudLightning } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Ground, GrassPatches, SoilBed, CropPlant } from './crop-growth/SceneElements';
import WeatherEffects, { type WeatherType } from './crop-growth/WeatherEffects';
import SoilOverlays from './crop-growth/SoilOverlays';
import { Slider as UISlider } from '@/components/ui/slider';
import { Droplets } from 'lucide-react';

const crops = [
  { name: 'Rice', color: '#4ade80', days: 120, stages: ['Seed', 'Sprout', 'Tillering', 'Flowering', 'Grain Fill', 'Harvest'] },
  { name: 'Wheat', color: '#facc15', days: 150, stages: ['Seed', 'Germination', 'Tillering', 'Stem Extension', 'Heading', 'Ripening'] },
  { name: 'Cotton', color: '#f9fafb', days: 180, stages: ['Seed', 'Seedling', 'Square', 'Bloom', 'Boll Open', 'Harvest'] },
  { name: 'Tomato', color: '#ef4444', days: 90, stages: ['Seed', 'Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'] },
];

const weatherOptions: { type: WeatherType; label: string; icon: typeof Sun }[] = [
  { type: 'sunny', label: 'Sunny', icon: Sun },
  { type: 'cloudy', label: 'Cloudy', icon: Cloud },
  { type: 'rainy', label: 'Rainy', icon: CloudRain },
  { type: 'stormy', label: 'Storm', icon: CloudLightning },
];

const skyColors: Record<WeatherType, string> = {
  sunny: '#87ceeb',
  cloudy: '#8a9bae',
  rainy: '#4a5568',
  stormy: '#2d3748',
};

const fogColors: Record<WeatherType, string> = {
  sunny: '#c8e6f5',
  cloudy: '#8a9bae',
  rainy: '#4a5568',
  stormy: '#2d3748',
};

export default function CropGrowthPage() {
  const [selectedCrop, setSelectedCrop] = useState(0);
  const [day, setDay] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [showSoilOverlay, setShowSoilOverlay] = useState(false);
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [soilN, setSoilN] = useState(70);
  const [soilP, setSoilP] = useState(55);
  const [soilK, setSoilK] = useState(65);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const crop = crops[selectedCrop];
  const progress = day / crop.days;
  const stageIndex = Math.min(Math.floor(progress * crop.stages.length), crop.stages.length - 1);

  const togglePlay = () => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setDay(prev => {
          if (prev >= crop.days) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPlaying(false);
            return crop.days;
          }
          return prev + 1;
        });
      }, 80);
    }
  };

  const plantPositions: [number, number, number][] = [
    [-1.5, 0, -1.5], [-0.5, 0, -1.5], [0.5, 0, -1.5], [1.5, 0, -1.5],
    [-1.5, 0, -0.5], [-0.5, 0, -0.5], [0.5, 0, -0.5], [1.5, 0, -0.5],
    [-1.5, 0, 0.5], [-0.5, 0, 0.5], [0.5, 0, 0.5], [1.5, 0, 0.5],
    [-1.5, 0, 1.5], [-0.5, 0, 1.5], [0.5, 0, 1.5], [1.5, 0, 1.5],
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">3D Crop Growth</h1>
            <p className="text-muted-foreground text-sm">Visualize day-by-day crop progress with weather effects</p>
          </div>
        </div>
      </motion.div>

      {/* Crop + Weather selectors */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {crops.map((c, i) => (
            <button
              key={c.name}
              onClick={() => { setSelectedCrop(i); setDay(1); setPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                i === selectedCrop
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-border hidden sm:block" />
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowSoilOverlay(!showSoilOverlay)}
            className={`p-2 rounded-lg text-sm transition-colors ${showSoilOverlay ? 'bg-accent/15 text-accent ring-1 ring-accent/30' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            title="Soil Overlays"
          >
            <Droplets className="w-4 h-4" />
          </button>
          {weatherOptions.map(w => (
            <button
              key={w.type}
              onClick={() => setWeather(w.type)}
              title={w.label}
              className={`p-2 rounded-lg text-sm transition-colors ${
                weather === w.type
                  ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <w.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="overflow-hidden rounded-xl mb-4 border border-border" style={{ height: '450px' }}>
        <Canvas shadows camera={{ position: [6, 5, 6], fov: 45 }}>
          <color attach="background" args={[skyColors[weather]]} />
          <fog attach="fog" args={[fogColors[weather], 10, 25]} />
          <WeatherEffects weather={weather} />
          <directionalLight
            position={[5, 8, 3]}
            intensity={weather === 'sunny' ? 1.2 : weather === 'cloudy' ? 0.5 : 0.3}
            castShadow
          />
          <Ground />
          <GrassPatches />
          <SoilBed />
          {plantPositions.map((pos, i) => (
            <CropPlant
              key={i}
              position={pos}
              progress={Math.max(0, Math.min(1, progress - (i * 0.02)))}
              color={crop.color}
            />
          ))}
          {showSoilOverlay && <SoilOverlays moisture={soilMoisture} nitrogen={soilN} phosphorus={soilP} potassium={soilK} />}
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>

      {/* Soil overlay controls */}
      {showSoilOverlay && (
        <div className="rounded-xl border border-border p-4 bg-card mb-4">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-accent" /> Soil Indicators
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Moisture', val: soilMoisture, set: setSoilMoisture, color: 'text-accent' },
              { label: 'Nitrogen', val: soilN, set: setSoilN, color: 'text-accent' },
              { label: 'Phosphorus', val: soilP, set: setSoilP, color: 'text-secondary' },
              { label: 'Potassium', val: soilK, set: setSoilK, color: 'text-primary' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className={`text-xs font-semibold ${s.color}`}>{s.val}%</span>
                </div>
                <UISlider value={[s.val]} min={0} max={100} step={1} onValueChange={([v]) => s.set(v)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline controls */}
      <div className="rounded-xl border border-border p-5 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Stage: <span className="text-primary">{crop.stages[stageIndex]}</span>
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Day {day} of {crop.days} ({Math.round(progress * 100)}%)
          </span>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {crop.stages.map((stage, i) => (
            <div
              key={stage}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                i === stageIndex
                  ? 'bg-primary text-primary-foreground'
                  : i < stageIndex
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {stage}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDay(d => Math.max(1, d - 1))}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setDay(d => Math.min(crop.days, d + 1))}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <Slider
              value={[day]}
              min={1}
              max={crop.days}
              step={1}
              onValueChange={([v]) => { setDay(v); if (playing) { setPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
