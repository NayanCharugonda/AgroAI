import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, Recycle, Sprout, Bug, Award, RefreshCw, ArrowRightLeft,
  ChevronDown, AlertTriangle, Shield, Download, Droplets, Thermometer,
  Layers, Flower2, Activity
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import SmartAIInsightPanel from './SmartAIInsightPanel';
import {
  cropOptions, soilOptions, rainfallOptions, stageOptions,
  cropPlans, soilAdjustments, rainfallStrategies, stageAdvice,
  calculateSustainabilityScore, nutrientDeficiencyGuide, certificationSteps,
  type CropType, type SoilType, type RainfallType, type StageType,
} from './organic/organicData';

// ── Reusable selector ──
function Selector<T extends string>({ label, icon, options, value, onChange }: {
  label: string; icon: React.ReactNode; options: readonly T[]; value: T | ''; onChange: (v: T) => void;
}) {
  return (
    <div className="vasundhara-card p-4 bg-card">
      <label className="flex items-center gap-2 text-sm font-heading font-semibold text-foreground mb-2">
        {icon} {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select {label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

// ── Pest risk meter ──
function PestRiskMeter({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const config = { Low: { pct: 25, color: 'text-primary' }, Medium: { pct: 55, color: 'text-secondary' }, High: { pct: 85, color: 'text-destructive' } }[level];
  return (
    <div className="vasundhara-card p-4 bg-card">
      <h4 className="text-sm font-heading font-semibold text-foreground flex items-center gap-2 mb-2">
        <Bug className="w-4 h-4 text-primary" /> Pest Risk Level
      </h4>
      <div className="flex items-center gap-3">
        <Progress value={config.pct} className="h-3 flex-1" />
        <span className={`text-sm font-bold ${config.color}`}>{level}</span>
      </div>
    </div>
  );
}

export default function OrganicFarmingPage() {
  const [crop, setCrop] = useState<CropType | ''>('');
  const [soil, setSoil] = useState<SoilType | ''>('');
  const [rainfall, setRainfall] = useState<RainfallType | ''>('');
  const [stage, setStage] = useState<StageType | ''>('');

  const plan = crop ? cropPlans[crop] : null;
  const soilAdj = soil ? soilAdjustments[soil] : null;
  const rainStrat = rainfall ? rainfallStrategies[rainfall] : null;
  const stageAdv = stage ? stageAdvice[stage] : null;

  const { score, tips } = useMemo(() => calculateSustainabilityScore(crop, soil, rainfall, stage), [crop, soil, rainfall, stage]);
  const scoreColor = score >= 70 ? 'text-primary' : score >= 50 ? 'text-secondary' : 'text-destructive';

  const compostQty = useMemo(() => {
    if (!plan) return null;
    const [lo, hi] = plan.compost.split('-').map(Number);
    const m = soilAdj?.compostMultiplier ?? 1;
    return `${(lo * m).toFixed(1)}-${(hi * m).toFixed(1)} tonnes/ha`;
  }, [plan, soilAdj]);

  const hasSelections = crop || soil || rainfall || stage;

  // Build dynamic AI insights based on selections
  const aiInsights = useMemo(() => {
    const insights = [
      { question: 'Why is organic recommended for my crop?', answer: crop ? `${crop} responds well to organic inputs. Bio-fertilizers like ${cropPlans[crop].bioFertilizer} enhance root health and soil biology, leading to 15-25% better long-term yields while reducing input costs.` : 'Select a crop above to get personalized organic recommendations.' },
      { question: 'How can I increase soil fertility naturally?', answer: soil ? `For ${soil} soil: ${soilAdjustments[soil].regeneration}. Focus on adding micronutrients: ${soilAdjustments[soil].micronutrients.join(', ')}.` : 'Select your soil type to get specific fertility improvement advice.' },
      { question: `What pests are common in my selected crop?`, answer: crop ? `Common pests in ${crop} can be controlled organically with ${cropPlans[crop].pestControl}. ${stage ? `At ${stage} stage, pest risk is ${stageAdvice[stage].pestRisk}. ${stageAdvice[stage].spraySchedule}` : 'Select a growth stage for timing-specific pest management.'}` : 'Select a crop for pest management guidance.' },
      { question: 'When is the best time to switch to organic farming?', answer: 'Start transitioning during the Rabi season when pest pressure is lower. Reduce chemical inputs by 50% in Year 1, switch to bio-fertilizers, and use green manure. Full transition takes 2-3 seasons.' },
    ];
    return insights;
  }, [crop, soil, stage]);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Smart Organic Advisory</h1>
            <p className="text-muted-foreground text-sm">AI-powered organic farming recommendations tailored to your farm</p>
          </div>
        </div>
      </motion.div>

      {/* ── 1-4: Selection Panel ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Selector<CropType> label="Crop" icon={<Sprout className="w-4 h-4 text-primary" />} options={cropOptions} value={crop} onChange={v => setCrop(v as CropType | '')} />
        <Selector<SoilType> label="Soil Type" icon={<Layers className="w-4 h-4 text-primary" />} options={soilOptions} value={soil} onChange={v => setSoil(v as SoilType | '')} />
        <Selector<RainfallType> label="Rainfall" icon={<Droplets className="w-4 h-4 text-primary" />} options={rainfallOptions} value={rainfall} onChange={v => setRainfall(v as RainfallType | '')} />
        <Selector<StageType> label="Growth Stage" icon={<Flower2 className="w-4 h-4 text-primary" />} options={stageOptions} value={stage} onChange={v => setStage(v as StageType | '')} />
      </div>

      {/* ── 6: Dynamic Sustainability Score ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vasundhara-card p-5 bg-card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <Recycle className="w-5 h-5 text-primary" /> Sustainability Score
          </h2>
          <span className={`text-3xl font-heading font-bold ${scoreColor}`}>{score}/100</span>
        </div>
        <Progress value={score} className="h-3 mb-3" />
        {tips.length > 0 && (
          <ul className="space-y-1">
            {tips.map((t, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-primary mt-0.5">💡</span> {t}
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* ── 5: AI Dynamic Recommendation Panel ── */}
      {plan && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Smart Recommendations for {crop}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🌱', title: 'Compost', value: compostQty!, sub: soilAdj ? `Adjusted for ${soil} soil (×${soilAdj.compostMultiplier})` : 'Select soil type for adjusted dosage' },
              { icon: '🧬', title: 'Bio-Fertilizer', value: plan.bioFertilizer, sub: 'Apply with seeds at sowing' },
              { icon: '🌿', title: 'Pest Control', value: plan.pestControl, sub: stageAdv ? stageAdv.spraySchedule : 'Select growth stage for schedule' },
              { icon: '🌾', title: 'Intercropping', value: plan.intercrop, sub: 'Companion planting for pest control & nutrition' },
              { icon: '🔄', title: 'Next Season Rotation', value: plan.nextRotation, sub: 'Rotate to maintain soil health' },
              { icon: '💧', title: 'Water Requirement', value: plan.waterNeed, sub: rainStrat ? rainStrat.irrigation : 'Select rainfall for irrigation plan' },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="vasundhara-card p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{card.icon}</span>
                  <h3 className="font-heading font-semibold text-foreground text-sm">{card.title}</h3>
                </div>
                <p className="text-sm text-foreground font-medium mb-1">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Stage-specific alerts ── */}
      {stageAdv && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-4 mb-8">
          <PestRiskMeter level={stageAdv.pestRisk} />
          <div className="vasundhara-card p-4 bg-card">
            <h4 className="text-sm font-heading font-semibold text-foreground flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-secondary" /> Deficiency Warning
            </h4>
            <p className="text-sm text-muted-foreground">{stageAdv.deficiencyWarning}</p>
          </div>
        </motion.div>
      )}

      {/* ── Rainfall strategy ── */}
      {rainStrat && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="vasundhara-card p-5 bg-card mb-8">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" /> Rainfall Strategy ({rainfall})
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Irrigation', value: rainStrat.irrigation, icon: '💧' },
              { label: 'Mulching', value: rainStrat.mulching, icon: '🌿' },
              { label: 'Conservation', value: rainStrat.conservation, icon: '🏞️' },
            ].map(r => (
              <div key={r.label} className="bg-muted/50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-foreground mb-1">{r.icon} {r.label}</h4>
                <p className="text-xs text-muted-foreground">{r.value}</p>
              </div>
            ))}
          </div>
          {rainStrat.warning && (
            <div className="mt-3 flex items-start gap-2 bg-destructive/10 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive font-medium">{rainStrat.warning}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Soil adjustments ── */}
      {soilAdj && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="vasundhara-card p-5 bg-card mb-8">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Soil Adjustments for {soil}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">🧪 Micronutrient Focus</h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {soilAdj.micronutrients.map(m => (
                  <span key={m} className="text-xs bg-primary/10 text-primary rounded-full px-2.5 py-0.5 font-medium">{m}</span>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">🌿 Soil Regeneration</h4>
              <p className="text-xs text-muted-foreground">{soilAdj.regeneration}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Nutrient Deficiency Guide ── */}
      <div className="vasundhara-card p-5 bg-card mb-8">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-primary" /> Nutrient Deficiency Detection Guide
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nutrientDeficiencyGuide.map((n, i) => (
            <motion.div key={n.nutrient} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-muted/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-foreground mb-1">{n.nutrient}</h4>
              <p className="text-xs text-destructive/80 mb-1">⚠️ {n.symptoms}</p>
              <p className="text-xs text-primary">✅ {n.remedy}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 7: Certification Guidance ── */}
      <div className="vasundhara-card p-5 bg-card mb-8">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Organic Certification Journey
        </h3>
        <div className="space-y-3">
          {certificationSteps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm font-bold text-primary">{i + 1}</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" /> PGS-India
          </span>
          <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" /> NPOP
          </span>
        </div>
      </div>

      {/* ── Weather Alert Placeholder ── */}
      <div className="vasundhara-card p-4 bg-card mb-8 border-dashed">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-sm">Weather-based alerts will appear here when integrated with live weather data.</p>
        </div>
      </div>

      {/* ── Download Action Plan ── */}
      {hasSelections && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vasundhara-card p-4 bg-card mb-8">
          <button
            onClick={() => {
              const text = [
                '=== ORGANIC FARMING ACTION PLAN ===',
                `Crop: ${crop || 'Not selected'}`,
                `Soil: ${soil || 'Not selected'}`,
                `Rainfall: ${rainfall || 'Not selected'}`,
                `Growth Stage: ${stage || 'Not selected'}`,
                `Sustainability Score: ${score}/100`,
                '',
                plan ? `Compost: ${compostQty}` : '',
                plan ? `Bio-Fertilizer: ${plan.bioFertilizer}` : '',
                plan ? `Pest Control: ${plan.pestControl}` : '',
                plan ? `Intercrop: ${plan.intercrop}` : '',
                plan ? `Rotation: ${plan.nextRotation}` : '',
                plan ? `Water: ${plan.waterNeed}` : '',
                soilAdj ? `\nSoil Regeneration: ${soilAdj.regeneration}` : '',
                rainStrat ? `\nIrrigation: ${rainStrat.irrigation}` : '',
                stageAdv ? `\nStage Advice: ${stageAdv.fertilizer}` : '',
                stageAdv ? `Pest Risk: ${stageAdv.pestRisk}` : '',
              ].filter(Boolean).join('\n');
              const blob = new Blob([text], { type: 'text/plain' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'organic-farming-plan.txt';
              a.click();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" /> Download Organic Action Plan
          </button>
        </motion.div>
      )}

      {/* ── 8: AI Insights ── */}
      <SmartAIInsightPanel insights={aiInsights} />
    </div>
  );
}
