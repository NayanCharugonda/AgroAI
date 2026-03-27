import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ShieldAlert, Leaf, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const diseasesLookup = [
  {
    name: 'Leaf Blight',
    crop: 'Rice',
    severity: 'Medium',
    symptoms: 'Yellow-brown lesions on leaves, wilting tips',
    treatment: 'Apply Mancozeb 75% WP at 2g/L. Remove infected leaves. Ensure proper spacing.',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop',
  },
  {
    name: 'Powdery Mildew',
    crop: 'Wheat',
    severity: 'Low',
    symptoms: 'White powdery coating on leaves and stems',
    treatment: 'Spray Sulphur 80% WDG at 3g/L. Improve air circulation between rows.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
  },
  {
    name: 'Boll Rot',
    crop: 'Cotton',
    severity: 'High',
    symptoms: 'Rotting of bolls, discoloration, fungal growth',
    treatment: 'Apply Copper Oxychloride at 3g/L. Remove and destroy infected bolls immediately.',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=250&fit=crop',
  },
];

export default function DiseaseDetectionPage() {
  const { toast } = useToast();
  const [selectedDisease, setSelectedDisease] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setDiagnosis(null);
    setSelectedDisease(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await api.post('/api/v1/predict', formData);
      // Result from backend: { prediction: { disease_id, disease_name, confidence }, confidence, disease_data, ... }
      const detectionResult = {
        crop: result.disease_data?.plant_name || 'Plant',
        status: result.prediction.disease_name.toLowerCase().includes('healthy') ? 'healthy' : 'diseased',
        disease: result.prediction.disease_name.replace(/___/g, ' ').replace(/_/g, ' '),
        confidence: result.confidence
      };
      setDiagnosis(detectionResult);
      toast({ title: 'Diagnosis Complete', description: `Detected: ${detectionResult.disease}` });
    } catch (error: any) {
      console.error('Detection error:', error);
      toast({
        title: 'Detection failed',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getTreatment = (diseaseName: string) => {
    const found = diseasesLookup.find(d => diseaseName.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(diseaseName.toLowerCase()));
    return found?.treatment || 'No specific treatment records found. Please consult a local agricultural expert.';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Internal Disease Detection</h1>
      <p className="text-muted-foreground mb-6">AI-powered diagnosis from leaf images</p>

      {/* Upload section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="vasundhara-card p-8 mb-8 bg-card text-center border-dashed border-2 border-primary/20"
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          {loading ? <Loader2 className="w-10 h-10 text-primary animate-spin" /> : <Camera className="w-10 h-10 text-primary" />}
        </div>

        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          {loading ? 'Analyzing Image...' : 'Upload Crop Image'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {loading ? 'Comparing features with our database' : 'Take a photo or upload an image for instant diagnosis'}
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => fileInputRef.current?.click()} disabled={loading} className="gap-2">
            <Camera className="w-4 h-4" /> Start Capturing
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} disabled={loading} variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Browse Gallery
          </Button>
        </div>
      </motion.div>

      {/* Diagnosis Results */}
      <AnimatePresence>
        {diagnosis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`vasundhara-card p-6 mb-8 border-l-4 ${diagnosis.status === 'healthy' ? 'border-primary' : 'border-destructive'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${diagnosis.status === 'healthy' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                {diagnosis.status === 'healthy' ? <CheckCircle2 className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-heading font-bold text-foreground">{diagnosis.crop}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${diagnosis.status === 'healthy' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                    {diagnosis.status}
                  </span>
                </div>
                <p className="text-lg text-foreground font-semibold mb-4">Diagnosis: <span className={diagnosis.status === 'healthy' ? 'text-primary' : 'text-destructive'}>{diagnosis.disease}</span> (Confidence: {Math.round(diagnosis.confidence * 100)}%)</p>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 font-semibold">
                    <AlertCircle className="w-4 h-4 text-accent" /> Recommended Actions
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getTreatment(diagnosis.disease)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Common diseases */}
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-destructive" /> Reference Guide
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {diseasesLookup.map((d, i) => (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedDisease(selectedDisease === i ? null : i)}
            className="vasundhara-card overflow-hidden cursor-pointer bg-card"
          >
            <div className="h-40 bg-muted overflow-hidden">
              <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-semibold text-foreground">{d.name}</h3>
                <span className={`text-xs font-semibold rounded-full px-2 py-1 ${d.severity === 'High' ? 'bg-destructive/10 text-destructive' :
                  d.severity === 'Medium' ? 'bg-warning-orange/10 text-warning-orange' :
                    'bg-primary/10 text-primary'
                  }`}>{d.severity}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1"><Leaf className="w-3 h-3 inline" /> Crop: {d.crop}</p>
              <p className="text-sm text-muted-foreground mb-2">{d.symptoms}</p>
              {selectedDisease === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <p className="text-sm font-medium text-foreground">💊 Treatment:</p>
                  <p className="text-sm text-muted-foreground">{d.treatment}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
