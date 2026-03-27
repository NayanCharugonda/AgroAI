import { motion } from 'framer-motion';
import { Beaker, Droplets, TrendingUp, FlaskConical, Zap, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import SmartAIInsightPanel from './SmartAIInsightPanel';

const fertilizerPlan = [
  { name: 'Urea (46-0-0)', qty: '85 kg/ha', timing: 'Split: 50% at sowing, 50% at 30 days', icon: '🧪', color: 'bg-accent' },
  { name: 'DAP (18-46-0)', qty: '100 kg/ha', timing: 'Full dose at sowing, mix with soil', icon: '🔬', color: 'bg-secondary' },
  { name: 'MOP (0-0-60)', qty: '60 kg/ha', timing: 'Apply at sowing with DAP', icon: '⚗️', color: 'bg-primary' },
];

const micronutrients = [
  { name: 'Zinc Sulphate', qty: '25 kg/ha', issue: 'Zinc deficiency', symptom: 'Yellowing between leaf veins' },
  { name: 'Borax', qty: '10 kg/ha', issue: 'Boron deficiency', symptom: 'Hollow stem, poor grain filling' },
  { name: 'Ferrous Sulphate', qty: '50 kg/ha', issue: 'Iron deficiency', symptom: 'Chlorosis in young leaves' },
];

const irrigationTips = [
  { method: 'Drip Irrigation', savings: '40-60%', best: 'Vegetables, orchards', desc: 'Delivers water directly to roots. Reduces disease and weeds.' },
  { method: 'Sprinkler', savings: '25-35%', best: 'Wheat, pulses', desc: 'Even water distribution. Good for sandy soils.' },
  { method: 'Flood (Optimized)', savings: '10-15%', best: 'Rice paddies', desc: 'Alternate Wetting & Drying (AWD) technique saves water in rice.' },
];

const npkChart = [
  { crop: 'Rice', n: 120, p: 60, k: 40 },
  { crop: 'Wheat', n: 100, p: 50, k: 30 },
  { crop: 'Cotton', n: 80, p: 40, k: 40 },
  { crop: 'Sugarcane', n: 150, p: 60, k: 60 },
];

export default function InorganicFarmingPage() {
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
            <Beaker className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Modern Farming</h1>
            <p className="text-muted-foreground text-sm">Chemical fertilizer dosage, irrigation optimization & yield maximization</p>
          </div>
        </div>
      </motion.div>

      {/* NPK Split Chart */}
      <div className="vasundhara-card p-5 bg-card mb-6">
        <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-secondary" /> NPK Requirement Chart (kg/ha)
        </h2>
        <div className="space-y-3">
          {npkChart.map(c => (
            <div key={c.crop} className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground w-24">{c.crop}</span>
              <div className="flex-1 flex gap-1 items-center">
                <div className="flex-1 flex gap-0.5 h-6 rounded-md overflow-hidden">
                  <motion.div className="bg-accent" initial={{ width: 0 }} animate={{ width: `${(c.n / 150) * 100}%` }} transition={{ duration: 0.6 }} />
                  <motion.div className="bg-secondary" initial={{ width: 0 }} animate={{ width: `${(c.p / 150) * 100}%` }} transition={{ duration: 0.6, delay: 0.1 }} />
                  <motion.div className="bg-primary" initial={{ width: 0 }} animate={{ width: `${(c.k / 150) * 100}%` }} transition={{ duration: 0.6, delay: 0.2 }} />
                </div>
                <span className="text-xs text-muted-foreground w-24 text-right">{c.n}-{c.p}-{c.k}</span>
              </div>
            </div>
          ))}
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="w-3 h-3 rounded bg-accent inline-block" /> Nitrogen</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="w-3 h-3 rounded bg-secondary inline-block" /> Phosphorus</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="w-3 h-3 rounded bg-primary inline-block" /> Potassium</span>
          </div>
        </div>
      </div>

      {/* Fertilizer Plan */}
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-secondary" /> Chemical Fertilizer Dosage
      </h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {fertilizerPlan.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="vasundhara-card p-5 bg-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{f.icon}</span>
              <span className={`text-xs font-semibold rounded-full px-2 py-0.5 text-primary-foreground ${f.color}`}>{f.qty}</span>
            </div>
            <h3 className="text-base font-heading font-semibold text-foreground mb-1">{f.name}</h3>
            <p className="text-xs text-muted-foreground">{f.timing}</p>
          </motion.div>
        ))}
      </div>

      {/* Micronutrient correction */}
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-secondary" /> Micronutrient Correction
      </h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {micronutrients.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="vasundhara-card p-5 bg-card"
          >
            <h3 className="text-base font-heading font-semibold text-foreground mb-1">{m.name}</h3>
            <span className="text-xs bg-secondary/15 text-secondary rounded-full px-2 py-0.5 font-medium">{m.qty}</span>
            <p className="text-sm text-muted-foreground mt-2">⚠️ {m.issue}: {m.symptom}</p>
          </motion.div>
        ))}
      </div>

      {/* Irrigation Optimization */}
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <Droplets className="w-5 h-5 text-accent" /> Irrigation Optimization
      </h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {irrigationTips.map((t, i) => (
          <motion.div
            key={t.method}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="vasundhara-card p-5 bg-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-heading font-semibold text-foreground">{t.method}</h3>
              <span className="text-xs bg-accent/15 text-accent rounded-full px-2 py-0.5 font-medium">Saves {t.savings}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{t.desc}</p>
            <p className="text-xs text-muted-foreground">Best for: {t.best}</p>
          </motion.div>
        ))}
      </div>

      {/* Yield Maximization */}
      <div className="vasundhara-card p-5 bg-card mb-6">
        <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" /> Yield Maximization Plan
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { step: '1. Seed Treatment', desc: 'Treat seeds with fungicide before sowing for 15% better germination' },
            { step: '2. Timely Fertilizer', desc: 'Apply NPK in splits — never all at once. Timing matters more than quantity.' },
            { step: '3. Weed Management', desc: 'Apply pre-emergence herbicide within 3 days of sowing.' },
            { step: '4. Harvest Window', desc: 'Harvest at optimal moisture (14-18%) to prevent post-harvest losses.' },
          ].map((s, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">{s.step}</h4>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <SmartAIInsightPanel insights={[
        { question: 'Why this NPK ratio is recommended?', answer: 'The recommended NPK ratio is based on your soil\'s current nutrient levels and the crop\'s requirement. Excess nitrogen causes lodging in wheat, while phosphorus is critical in early root development. Balanced application ensures 20-30% higher yields.' },
        { question: 'How does irrigation method affect yield?', answer: 'Drip irrigation can improve yield by 15-25% compared to flood irrigation by providing consistent moisture. It also reduces fertilizer leaching, meaning more nutrients stay in the root zone where plants can access them.' },
        { question: 'When should I apply micronutrients?', answer: 'Apply zinc sulphate at sowing for cereals. Foliar spray of boron during flowering stage improves grain setting by 10-15%. Iron deficiency correction should be done before symptoms become severe for best results.' },
      ]} />
    </div>
  );
}
