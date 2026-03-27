import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Droplets, Bug, Sprout, Leaf, Sun, Scissors, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const cropProfiles: Record<string, { name: string; totalDays: number; stages: { name: string; startDay: number; endDay: number; icon: any; color: string; tasks: { day: number; task: string; type: 'irrigation' | 'fertilizer' | 'pesticide' | 'general' }[] }[] }> = {
  rice: {
    name: 'Rice (Paddy)',
    totalDays: 150,
    stages: [
      { name: 'Nursery & Transplanting', startDay: 0, endDay: 25, icon: Sprout, color: 'bg-primary/20 text-primary', tasks: [
        { day: 0, task: 'Prepare nursery bed, soak seeds for 24h', type: 'general' },
        { day: 1, task: 'Sow seeds in nursery', type: 'general' },
        { day: 5, task: 'Light irrigation in nursery', type: 'irrigation' },
        { day: 10, task: 'Apply Azospirillum biofertilizer', type: 'fertilizer' },
        { day: 20, task: 'Transplant seedlings to main field', type: 'general' },
        { day: 22, task: 'Flood field 3-5cm standing water', type: 'irrigation' },
      ]},
      { name: 'Vegetative Growth', startDay: 26, endDay: 60, icon: Leaf, color: 'bg-leaf/20 text-leaf', tasks: [
        { day: 28, task: 'Apply Urea (1st dose) — 40kg/acre', type: 'fertilizer' },
        { day: 30, task: 'Maintain 5cm water level', type: 'irrigation' },
        { day: 35, task: 'Weed management — apply pre-emergence herbicide', type: 'pesticide' },
        { day: 40, task: 'Check for stem borer; apply Chlorantraniliprole if needed', type: 'pesticide' },
        { day: 50, task: 'Apply DAP (2nd dose fertilizer)', type: 'fertilizer' },
        { day: 55, task: 'Drain field for 3 days (wetting/drying cycle)', type: 'irrigation' },
      ]},
      { name: 'Flowering & Grain Fill', startDay: 61, endDay: 110, icon: Sun, color: 'bg-secondary/20 text-secondary', tasks: [
        { day: 65, task: 'Apply Potash (MOP) — 20kg/acre', type: 'fertilizer' },
        { day: 70, task: 'Maintain consistent water; critical stage', type: 'irrigation' },
        { day: 75, task: 'Monitor for Brown Plant Hopper (BPH)', type: 'pesticide' },
        { day: 80, task: 'Spray Propiconazole for Blast/Sheath Blight', type: 'pesticide' },
        { day: 90, task: 'Continue intermittent irrigation', type: 'irrigation' },
        { day: 100, task: 'Apply micronutrient foliar spray (Zinc)', type: 'fertilizer' },
      ]},
      { name: 'Maturation & Harvest', startDay: 111, endDay: 150, icon: Scissors, color: 'bg-harvest/20 text-harvest', tasks: [
        { day: 115, task: 'Stop irrigation — let field dry', type: 'irrigation' },
        { day: 120, task: 'Check grain moisture (20-22%)', type: 'general' },
        { day: 130, task: 'Begin harvesting when 80% grains are golden', type: 'general' },
        { day: 135, task: 'Thresh and dry grains to 14% moisture', type: 'general' },
        { day: 145, task: 'Store in clean, dry storage; use neem leaves for pest protection', type: 'general' },
      ]},
    ],
  },
  wheat: {
    name: 'Wheat',
    totalDays: 140,
    stages: [
      { name: 'Sowing & Germination', startDay: 0, endDay: 20, icon: Sprout, color: 'bg-primary/20 text-primary', tasks: [
        { day: 0, task: 'Prepare field, apply FYM 5 tonnes/acre', type: 'fertilizer' },
        { day: 1, task: 'Sow treated seeds at 4-5cm depth', type: 'general' },
        { day: 3, task: 'Light irrigation (sowing irrigation)', type: 'irrigation' },
        { day: 15, task: 'First irrigation if no rain', type: 'irrigation' },
      ]},
      { name: 'Tillering & Growth', startDay: 21, endDay: 60, icon: Leaf, color: 'bg-leaf/20 text-leaf', tasks: [
        { day: 21, task: 'Apply Urea — 1st top dressing (35kg/acre)', type: 'fertilizer' },
        { day: 25, task: '2nd irrigation at Crown Root Initiation (CRI)', type: 'irrigation' },
        { day: 35, task: 'Weed control — 2,4-D or manual weeding', type: 'pesticide' },
        { day: 45, task: '3rd irrigation at tillering', type: 'irrigation' },
        { day: 50, task: 'Apply Urea — 2nd top dressing', type: 'fertilizer' },
      ]},
      { name: 'Heading & Flowering', startDay: 61, endDay: 100, icon: Sun, color: 'bg-secondary/20 text-secondary', tasks: [
        { day: 65, task: '4th irrigation at boot/heading stage', type: 'irrigation' },
        { day: 70, task: 'Monitor for rust/powdery mildew', type: 'pesticide' },
        { day: 75, task: 'Spray Propiconazole if disease detected', type: 'pesticide' },
        { day: 85, task: '5th irrigation at flowering', type: 'irrigation' },
        { day: 90, task: 'Monitor for aphids; spray if threshold crossed', type: 'pesticide' },
      ]},
      { name: 'Grain Fill & Harvest', startDay: 101, endDay: 140, icon: Scissors, color: 'bg-harvest/20 text-harvest', tasks: [
        { day: 105, task: '6th irrigation at dough stage', type: 'irrigation' },
        { day: 115, task: 'Stop irrigation; allow field to dry', type: 'irrigation' },
        { day: 125, task: 'Harvest when grain moisture is 12-14%', type: 'general' },
        { day: 130, task: 'Thresh and winnow; dry in sun', type: 'general' },
        { day: 135, task: 'Store in moisture-proof bags/bins', type: 'general' },
      ]},
    ],
  },
  tomato: {
    name: 'Tomato',
    totalDays: 120,
    stages: [
      { name: 'Nursery & Transplant', startDay: 0, endDay: 30, icon: Sprout, color: 'bg-primary/20 text-primary', tasks: [
        { day: 0, task: 'Sow seeds in nursery trays', type: 'general' },
        { day: 5, task: 'Keep nursery moist; light watering daily', type: 'irrigation' },
        { day: 15, task: 'Harden seedlings; reduce watering', type: 'irrigation' },
        { day: 25, task: 'Transplant to main field, apply basal fertilizer', type: 'fertilizer' },
        { day: 27, task: 'Immediate irrigation after transplant', type: 'irrigation' },
      ]},
      { name: 'Vegetative Growth', startDay: 31, endDay: 55, icon: Leaf, color: 'bg-leaf/20 text-leaf', tasks: [
        { day: 32, task: 'Apply Nitrogen (Urea 25kg/acre)', type: 'fertilizer' },
        { day: 35, task: 'Irrigate every 3-4 days via drip', type: 'irrigation' },
        { day: 40, task: 'Stake plants; prune side shoots', type: 'general' },
        { day: 45, task: 'Spray Neem oil for whitefly prevention', type: 'pesticide' },
        { day: 50, task: 'Apply micronutrient spray (Boron + Calcium)', type: 'fertilizer' },
      ]},
      { name: 'Flowering & Fruiting', startDay: 56, endDay: 90, icon: Sun, color: 'bg-secondary/20 text-secondary', tasks: [
        { day: 58, task: 'Apply Potash for fruit setting', type: 'fertilizer' },
        { day: 60, task: 'Regular drip irrigation; avoid overhead watering', type: 'irrigation' },
        { day: 65, task: 'Monitor for early blight; spray Mancozeb', type: 'pesticide' },
        { day: 75, task: 'Apply Trichoderma for root rot prevention', type: 'pesticide' },
        { day: 80, task: 'Mulch around plants for moisture retention', type: 'irrigation' },
      ]},
      { name: 'Harvest', startDay: 91, endDay: 120, icon: Scissors, color: 'bg-harvest/20 text-harvest', tasks: [
        { day: 92, task: 'Begin picking mature green/red fruits', type: 'general' },
        { day: 100, task: 'Harvest every 3-5 days for best quality', type: 'general' },
        { day: 110, task: 'Sort, grade, and pack for market', type: 'general' },
        { day: 115, task: 'Reduce irrigation as harvest completes', type: 'irrigation' },
      ]},
    ],
  },
};

const taskTypeConfig = {
  irrigation: { icon: Droplets, color: 'text-accent', bg: 'bg-accent/10', label: '💧 Irrigation' },
  fertilizer: { icon: Leaf, color: 'text-primary', bg: 'bg-primary/10', label: '🌿 Fertilizer' },
  pesticide: { icon: Bug, color: 'text-destructive', bg: 'bg-destructive/10', label: '🐛 Pesticide' },
  general: { icon: Sun, color: 'text-secondary', bg: 'bg-secondary/10', label: '☀️ General' },
};

export default function FarmerCalendarPage() {
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [startDate, setStartDate] = useState('');

  const crop = cropProfiles[selectedCrop];

  const getDateForDay = (day: number) => {
    if (!startDate) return `Day ${day}`;
    const d = new Date(startDate);
    d.setDate(d.getDate() + day);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const todayDay = useMemo(() => {
    if (!startDate) return -1;
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate]);

  const currentStage = crop.stages.find(s => todayDay >= s.startDay && todayDay <= s.endDay);
  const nextTask = crop.stages.flatMap(s => s.tasks).find(t => t.day >= todayDay);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <CalendarDays className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Farmer's Calendar</h1>
        </div>
        <p className="text-muted-foreground mb-6">Plan your entire crop cycle — irrigation, fertilizer, pesticide schedules</p>
      </motion.div>

      {/* Hero GIF banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden mb-8 h-56 md:h-72"
      >
        <img
          src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
          alt="Farming animation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent flex items-center">
          <div className="p-8 md:p-12">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl md:text-9xl mb-3 drop-shadow-lg"
            >
              🌾
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-primary-foreground drop-shadow-md">
              Plan. Grow. Prosper.
            </h2>
            <p className="text-primary-foreground/90 text-base md:text-lg mt-2 font-medium">Your complete crop timeline at a glance</p>
          </div>
        </div>
      </motion.div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="pt-6">
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-primary" /> Select Crop
            </label>
            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-border bg-card text-foreground font-semibold text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {Object.entries(cropProfiles).map(([key, c]) => (
                <option key={key} value={key}>{c.name}</option>
              ))}
            </select>
          </CardContent>
        </Card>
        <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
          <CardContent className="pt-6">
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-secondary" /> 🗓️ Crop Rotation Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-border bg-card text-foreground font-semibold text-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </CardContent>
        </Card>
      </div>

      {/* Current status */}
      {startDate && todayDay >= 0 && todayDay <= crop.totalDays && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Today is Day {todayDay} of {crop.totalDays}</p>
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    {currentStage ? `📍 Current Stage: ${currentStage.name}` : '⏳ Between stages'}
                  </h3>
                </div>
                {nextTask && (
                  <div className="bg-card rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground">Next Task (Day {nextTask.day}):</p>
                    <p className="text-sm font-medium text-foreground">{nextTask.task}</p>
                    <p className="text-xs text-primary mt-1">{getDateForDay(nextTask.day)}</p>
                  </div>
                )}
              </div>
              {/* Progress */}
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (todayDay / crop.totalDays) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{Math.round((todayDay / crop.totalDays) * 100)}% complete</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Timeline */}
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4">📅 Complete Crop Timeline — {crop.name}</h2>
      <div className="space-y-6">
        {crop.stages.map((stage, si) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: si * 0.1 }}
          >
            <Card className={todayDay >= stage.startDay && todayDay <= stage.endDay ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stage.color} flex items-center justify-center`}>
                    <stage.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-heading">{stage.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Day {stage.startDay} — Day {stage.endDay} {startDate && `(${getDateForDay(stage.startDay)} → ${getDateForDay(stage.endDay)})`}
                    </p>
                  </div>
                  {todayDay >= stage.startDay && todayDay <= stage.endDay && (
                    <Badge className="ml-auto bg-primary text-primary-foreground">Current</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stage.tasks.map((task, ti) => {
                    const cfg = taskTypeConfig[task.type];
                    const isPast = todayDay > task.day;
                    const isToday = todayDay === task.day;
                    return (
                      <motion.div
                        key={ti}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: si * 0.1 + ti * 0.03 }}
                        className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                          isToday ? 'bg-primary/10 ring-2 ring-primary shadow-md' : isPast ? 'bg-muted/30 opacity-60' : 'bg-muted/50 hover:bg-muted/70'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-xl ${cfg.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                          <span className="text-2xl font-heading font-black leading-none">{task.day}</span>
                          <span className="text-[9px] font-medium text-muted-foreground uppercase">day</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {startDate && <span className="text-xs font-medium text-muted-foreground">{getDateForDay(task.day)}</span>}
                            {isToday && <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-primary text-primary font-bold animate-pulse">🔴 TODAY</Badge>}
                          </div>
                          <p className="text-sm font-medium text-foreground">{task.task}</p>
                          <span className="text-[10px] font-medium text-muted-foreground">{cfg.label}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
