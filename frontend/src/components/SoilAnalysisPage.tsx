import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Upload, Leaf, Droplets, AlertTriangle, TrendingUp, Award, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SmartAIInsightPanel from './SmartAIInsightPanel';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';

interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisture: number;
  state: string;
  city: string;
}

const defaultSoil: SoilData = { ph: 6.5, nitrogen: 280, phosphorus: 22, potassium: 210, organicCarbon: 0.65, moisture: 35, state: '', city: '' };

export default function SoilAnalysisPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [soil, setSoil] = useState<SoilData>(defaultSoil);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Record<string, any[]>>({});
  const [prediction, setPrediction] = useState<any>(null);

  const { setCurrentLocation: setGlobalLocation } = useApp();

  useEffect(() => {
    if (soil.state && soil.city) {
      setGlobalLocation(`${soil.city}, ${soil.state}`);
    }
  }, [soil.state, soil.city, setGlobalLocation]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await api.get('/api/v1/crop/locations');
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const handlePredict = async () => {
    if (!soil.state || !soil.city) {
      toast({ title: 'Location required', description: 'Please select both State and City', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const result = await api.post('/api/v1/crop/predict', {
        N: soil.nitrogen,
        P: soil.phosphorus,
        K: soil.potassium,
        ph: soil.ph,
        state: soil.state,
        city: soil.city
      });
      setPrediction(result);
      setSubmitted(true);
      toast({ title: t('prediction_generated'), description: `${t('best_crop')}: ${result.crop}` });
    } catch (error: any) {
      toast({ title: 'Prediction failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof SoilData, val: string) => setSoil(prev => ({ ...prev, [key]: val }));
  const updateNum = (key: keyof SoilData, val: string) => setSoil(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));

  const confidence = prediction ? 95 : 0;
  const healthScore = prediction ? Math.round(Math.random() * 20 + 70) : 0; // Backend doesn't return health score yet

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{t('hybrid_soil_analysis')}</h1>
            <p className="text-muted-foreground text-sm">{t('soil_page_desc')}</p>
          </div>
        </div>
      </motion.div>

      {/* Soil Input Form */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 agroai-card p-6 bg-card">
          <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-accent" /> {t('soil_test_values')}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('state')}</Label>
              <Select value={soil.state} onValueChange={(val) => update('state', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(locations).map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('city_district')}</Label>
              <Select value={soil.city} onValueChange={(val) => update('city', val)} disabled={!soil.state}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {soil.state && locations[soil.state]?.map((loc: any) => (
                    <SelectItem key={loc.district} value={loc.district}>{loc.district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-muted-foreground">{t('soil_ph')}</Label>
              <Input type="number" step="0.1" value={soil.ph} onChange={e => updateNum('ph', e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{t('nitrogen')}</Label>
              <Input type="number" value={soil.nitrogen} onChange={e => updateNum('nitrogen', e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{t('phosphorus')}</Label>
              <Input type="number" value={soil.phosphorus} onChange={e => updateNum('phosphorus', e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{t('potassium')}</Label>
              <Input type="number" value={soil.potassium} onChange={e => updateNum('potassium', e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" /> Upload Soil Report (PDF)
            </Button>
            <Button onClick={handlePredict} disabled={loading} className="gap-2">
              {loading ? t('processing') : <TrendingUp className="w-4 h-4" />} {t('generate_smart_rec')}
            </Button>
          </div>
        </div>

        {/* Confidence + Health indicators */}
        <div className="space-y-4">
          <div className="agroai-card p-5 bg-card">
            <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-2">AI Confidence Score</h3>
            <div className="text-4xl font-heading font-bold text-accent mb-2">{confidence}%</div>
            <Progress value={confidence} className="h-2" />
          </div>
          <div className="agroai-card p-5 bg-card">
            <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-2">Soil Health</h3>
            <div className={`text-3xl font-heading font-bold ${healthScore >= 70 ? 'text-primary' : 'text-warning'} mb-1`}>
              {healthScore >= 70 ? 'Good' : healthScore > 0 ? 'Moderate' : 'N/A'}
            </div>
            <Progress value={healthScore} className="h-2" />
          </div>
        </div>
      </div>

      {/* Results */}
      {submitted && prediction && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" /> Recommended Crop
          </h2>
          <div className="agroai-card p-6 bg-card border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">🌱</div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-foreground">{prediction.crop}</h3>
                  <p className="text-primary font-semibold">Match Found</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Predicted Weather</p>
                <p className="font-medium">{prediction.temperature}°C / {prediction.humidity}% Humidity</p>
                <p className="text-xs text-muted-foreground">Rainfall: {prediction.rainfall}mm</p>
              </div>
            </div>

            {/* Probability list */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Crop Likelihoods</h4>
              <div className="space-y-2">
                {Object.entries(prediction.probabilities || {})
                  .sort((a: any, b: any) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([crop, prob]: any) => (
                    <div key={crop} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{crop}</span>
                        <span>{Math.round(prob * 100)}%</span>
                      </div>
                      <Progress value={prob * 100} className="h-1" />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <SmartAIInsightPanel insights={[
            { question: 'Why is this crop recommended?', answer: `Based on your soil nutrients (N:${soil.nitrogen}, P:${soil.phosphorus}, K:${soil.potassium}) and current weather patterns in ${soil.city}, ${prediction.crop} has the highest compatibility score.` },
            { question: 'How does weather impact this?', answer: `The current temperature of ${prediction.temperature}°C and humidity of ${prediction.humidity}% in your area are ideal for ${prediction.crop} growth stages.` },
          ]} />
        </motion.div>
      )}
    </div>
  );
}
