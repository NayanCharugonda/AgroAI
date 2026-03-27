// ── Crop-specific organic recommendations ──

export const cropOptions = ['Rice', 'Wheat', 'Tomato', 'Cotton', 'Millets', 'Pulses', 'Vegetables'] as const;
export type CropType = typeof cropOptions[number];

export const soilOptions = ['Sandy', 'Clay', 'Loamy', 'Black Soil', 'Red Soil'] as const;
export type SoilType = typeof soilOptions[number];

export const rainfallOptions = ['Low (<600mm)', 'Medium (600-1200mm)', 'High (>1200mm)'] as const;
export type RainfallType = typeof rainfallOptions[number];

export const stageOptions = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'] as const;
export type StageType = typeof stageOptions[number];

export interface CropPlan {
  compost: string;
  bioFertilizer: string;
  pestControl: string;
  intercrop: string;
  nextRotation: string;
  waterNeed: string;
}

export const cropPlans: Record<CropType, CropPlan> = {
  Rice: { compost: '6-8', bioFertilizer: 'Azospirillum + PSB', pestControl: 'Neem oil + Trichoderma', intercrop: 'Azolla / Fish culture', nextRotation: 'Pulses (Moong/Urad)', waterNeed: 'High – Maintain 5cm standing water' },
  Wheat: { compost: '5-7', bioFertilizer: 'Azotobacter + PSB', pestControl: 'Neem seed kernel extract', intercrop: 'Mustard / Chickpea', nextRotation: 'Green manure (Dhaincha)', waterNeed: 'Medium – 4-5 irrigations' },
  Tomato: { compost: '8-10', bioFertilizer: 'Azotobacter + VAM', pestControl: 'Panchagavya + Neem oil', intercrop: 'Marigold (pest trap)', nextRotation: 'Leafy vegetables', waterNeed: 'Medium – Drip irrigation preferred' },
  Cotton: { compost: '5-6', bioFertilizer: 'Azotobacter + PSB', pestControl: 'Neem oil + Bt spray', intercrop: 'Cowpea / Black gram', nextRotation: 'Wheat or Chickpea', waterNeed: 'Medium – Critical at flowering' },
  Millets: { compost: '3-4', bioFertilizer: 'Azospirillum + PSB', pestControl: 'Neem cake application', intercrop: 'Pigeon pea', nextRotation: 'Groundnut / Pulses', waterNeed: 'Low – Drought tolerant' },
  Pulses: { compost: '3-5', bioFertilizer: 'Rhizobium + PSB', pestControl: 'Trichoderma + Neem oil', intercrop: 'Sorghum / Millets', nextRotation: 'Cereals (Rice/Wheat)', waterNeed: 'Low – 2-3 irrigations' },
  Vegetables: { compost: '10-12', bioFertilizer: 'Azotobacter + VAM + PSB', pestControl: 'Panchagavya + Beauveria', intercrop: 'Herbs (Basil, Coriander)', nextRotation: 'Legume cover crop', waterNeed: 'High – Mulch + Drip' },
};

export interface SoilAdjustment {
  compostMultiplier: number;
  micronutrients: string[];
  regeneration: string;
}

export const soilAdjustments: Record<SoilType, SoilAdjustment> = {
  Sandy: { compostMultiplier: 1.3, micronutrients: ['Zinc', 'Boron', 'Iron'], regeneration: 'Add clay amendments & heavy mulching to improve water retention' },
  Clay: { compostMultiplier: 0.9, micronutrients: ['Calcium', 'Sulfur'], regeneration: 'Add gypsum & green manure to break compaction and improve drainage' },
  Loamy: { compostMultiplier: 1.0, micronutrients: ['Balanced – monitor Zinc'], regeneration: 'Maintain organic matter with cover crops and regular composting' },
  'Black Soil': { compostMultiplier: 0.8, micronutrients: ['Zinc', 'Iron', 'Manganese'], regeneration: 'Avoid over-tillage; use raised beds for drainage in rainy season' },
  'Red Soil': { compostMultiplier: 1.2, micronutrients: ['Phosphorus', 'Calcium', 'Molybdenum'], regeneration: 'Lime application to correct acidity; add organic matter generously' },
};

export interface RainfallStrategy {
  irrigation: string;
  mulching: string;
  conservation: string;
  warning: string | null;
}

export const rainfallStrategies: Record<RainfallType, RainfallStrategy> = {
  'Low (<600mm)': { irrigation: 'Drip irrigation essential; schedule every 3-4 days', mulching: 'Heavy mulch (5-6 inches) with crop residue or straw', conservation: 'Rainwater harvesting ponds; contour bunding', warning: '⚠️ Avoid water-intensive crops like Rice & Sugarcane' },
  'Medium (600-1200mm)': { irrigation: 'Sprinkler or furrow irrigation; supplement during dry spells', mulching: 'Moderate mulch (3-4 inches); use living mulch in rows', conservation: 'Farm ponds; check dams; moisture sensors', warning: null },
  'High (>1200mm)': { irrigation: 'Minimal supplemental irrigation; focus on drainage', mulching: 'Light mulch to prevent waterlogging; use raised beds', conservation: 'Drainage channels; terracing on slopes', warning: '⚠️ Risk of fungal diseases – increase Trichoderma application' },
};

export interface StageAdvice {
  fertilizer: string;
  pestRisk: 'Low' | 'Medium' | 'High';
  spraySchedule: string;
  deficiencyWarning: string;
}

export const stageAdvice: Record<StageType, StageAdvice> = {
  Seedling: { fertilizer: 'Apply basal compost + PSB at transplanting', pestRisk: 'Medium', spraySchedule: 'Neem oil spray on Day 7 & 14 after transplant', deficiencyWarning: 'Watch for Nitrogen deficiency (yellowing leaves)' },
  Vegetative: { fertilizer: 'Top-dress with vermicompost; apply Azotobacter', pestRisk: 'Medium', spraySchedule: 'Panchagavya foliar spray every 15 days', deficiencyWarning: 'Monitor Phosphorus (purple stems) & Iron (interveinal chlorosis)' },
  Flowering: { fertilizer: 'Apply Potassium-rich organic inputs (wood ash / banana stem)', pestRisk: 'High', spraySchedule: 'Trichoderma + Neem oil weekly; avoid during peak bloom', deficiencyWarning: 'Boron deficiency causes flower drop – apply borax spray' },
  Fruiting: { fertilizer: 'Foliar spray of Panchagavya + seaweed extract', pestRisk: 'High', spraySchedule: 'Beauveria bassiana for fruit borers; Neem for sucking pests', deficiencyWarning: 'Calcium deficiency causes blossom end rot in tomatoes' },
  Harvest: { fertilizer: 'No fertilizer needed; prepare soil for next crop', pestRisk: 'Low', spraySchedule: 'Post-harvest Trichoderma soil drench', deficiencyWarning: 'Take soil sample now for next season planning' },
};

export function calculateSustainabilityScore(crop: CropType | '', soil: SoilType | '', rainfall: RainfallType | '', stage: StageType | ''): { score: number; tips: string[] } {
  let score = 40; // base
  const tips: string[] = [];

  // Crop diversity bonus
  if (crop === 'Pulses' || crop === 'Millets') { score += 15; }
  else if (crop) { score += 10; }
  else { tips.push('Select a crop to improve your sustainability planning'); }

  // Soil awareness
  if (soil) { score += 12; }
  else { tips.push('Knowing your soil type helps optimize organic inputs'); }

  // Rainfall adaptation
  if (rainfall === 'Low (<600mm)') { score += 8; tips.push('Consider drought-resistant varieties for higher scores'); }
  else if (rainfall) { score += 12; }
  else { tips.push('Add rainfall data for water conservation recommendations'); }

  // Growth stage tracking
  if (stage) { score += 10; }
  else { tips.push('Track growth stages for timely nutrient management'); }

  // Bonus for complete profile
  if (crop && soil && rainfall && stage) { score += 8; tips.push('Great! Complete profile gives best recommendations'); }

  if (score < 70) tips.push('Add intercropping & cover crops to boost sustainability');

  return { score: Math.min(score, 100), tips };
}

export const nutrientDeficiencyGuide = [
  { nutrient: 'Nitrogen (N)', symptoms: 'Yellowing of older leaves, stunted growth', remedy: 'Apply vermicompost, Azolla, or Sesbania green manure' },
  { nutrient: 'Phosphorus (P)', symptoms: 'Purple/reddish stems, delayed maturity', remedy: 'Apply bone meal, rock phosphate, or PSB inoculant' },
  { nutrient: 'Potassium (K)', symptoms: 'Brown leaf edges, weak stems', remedy: 'Wood ash, banana stem compost, or potash-rich organic inputs' },
  { nutrient: 'Zinc (Zn)', symptoms: 'White bands on leaves (Khaira disease in rice)', remedy: 'Zinc sulfate foliar spray (0.5%) or chelated zinc' },
  { nutrient: 'Iron (Fe)', symptoms: 'Interveinal chlorosis on young leaves', remedy: 'Ferrous sulfate spray or improve soil organic matter' },
  { nutrient: 'Boron (B)', symptoms: 'Hollow stems, flower/fruit drop', remedy: 'Borax solution (0.2%) foliar spray at flowering' },
];

export const certificationSteps = [
  { title: 'Year 1: Transition', desc: 'Stop all chemical inputs. Start organic practices. Maintain daily input/output records.', done: false },
  { title: 'Year 2: Build Soil', desc: 'Continue organic inputs. Get soil tested. Document all farming activities with photos.', done: false },
  { title: 'Year 3: Apply', desc: 'Complete 36-month chemical-free period. Apply for PGS-India or NPOP certification.', done: false },
  { title: 'Maintain Records', desc: 'Keep seed purchase receipts, input logs, yield records, and soil test reports.', done: false },
  { title: 'Annual Soil Test', desc: 'Get soil tested at a certified lab every year. Track organic carbon improvement.', done: false },
];
