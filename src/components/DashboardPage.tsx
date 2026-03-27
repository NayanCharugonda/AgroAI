import { motion } from 'framer-motion';
import { Leaf, Cloud, TrendingUp, ShieldAlert, Map, BarChart3, Calendar, Store, Banknote, Truck, TreeDeciduous, FlaskConical, Recycle, Beaker, Mic } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const quickActions = [
  { icon: Leaf, title: 'Crop Advisor', desc: 'Get recommendations', page: 'advisor', color: 'bg-primary/10 text-primary' },
  { icon: Cloud, title: 'Weather', desc: 'Check forecast', page: 'weather', color: 'bg-accent/10 text-accent' },
  { icon: TrendingUp, title: 'Market Prices', desc: 'View latest rates', page: 'prices', color: 'bg-secondary/10 text-secondary' },
  { icon: ShieldAlert, title: 'Disease Detection', desc: 'Scan your crops', page: 'disease', color: 'bg-destructive/10 text-destructive' },
  { icon: Map, title: 'Storage Finder', desc: 'Find nearby storage', page: 'storage', color: 'bg-accent/10 text-accent' },
  { icon: TreeDeciduous, title: '3D Crop Growth', desc: 'Visualize growth', page: 'growth', color: 'bg-primary/10 text-primary' },
  { icon: FlaskConical, title: 'Soil Analysis', desc: 'Test your soil', page: 'soil', color: 'bg-secondary/10 text-secondary' },
  { icon: Recycle, title: 'Organic Farming', desc: 'Eco-friendly tips', page: 'organic', color: 'bg-primary/10 text-primary' },
  { icon: Beaker, title: 'Modern Farming', desc: 'Chemical dosage', page: 'inorganic', color: 'bg-secondary/10 text-secondary' },
  { icon: Calendar, title: 'Farm Calendar', desc: 'Plan your season', page: 'calendar', color: 'bg-accent/10 text-accent' },
  { icon: Store, title: 'Marketplace', desc: 'Sell your produce', page: 'marketplace', color: 'bg-primary/10 text-primary' },
  { icon: Banknote, title: 'Subsidies & Loans', desc: 'Govt. schemes', page: 'subsidies', color: 'bg-secondary/10 text-secondary' },
  { icon: Truck, title: 'Transport Booking', desc: 'Book vehicles', page: 'transport', color: 'bg-accent/10 text-accent' },
  { icon: Mic, title: 'Voice Assistant', desc: 'Hands-free control', page: 'assistant', color: 'bg-primary/10 text-primary' },
];

const marketPriceData = [
  { month: 'Jan', Wheat: 2200, Rice: 3100, Cotton: 6200 },
  { month: 'Feb', Wheat: 2350, Rice: 3050, Cotton: 6400 },
  { month: 'Mar', Wheat: 2400, Rice: 2950, Cotton: 6100 },
  { month: 'Apr', Wheat: 2300, Rice: 3200, Cotton: 6500 },
  { month: 'May', Wheat: 2500, Rice: 3400, Cotton: 6800 },
  { month: 'Jun', Wheat: 2450, Rice: 3300, Cotton: 6600 },
];

const weatherData = [
  { day: 'Mon', temp: 28, humidity: 65, rain: 0 },
  { day: 'Tue', temp: 30, humidity: 60, rain: 0 },
  { day: 'Wed', temp: 27, humidity: 75, rain: 12 },
  { day: 'Thu', temp: 25, humidity: 80, rain: 25 },
  { day: 'Fri', temp: 29, humidity: 55, rain: 0 },
  { day: 'Sat', temp: 31, humidity: 50, rain: 0 },
  { day: 'Sun', temp: 30, humidity: 58, rain: 5 },
];

const cropDistribution = [
  { name: 'Rice', value: 35 },
  { name: 'Wheat', value: 25 },
  { name: 'Cotton', value: 20 },
  { name: 'Vegetables', value: 12 },
  { name: 'Pulses', value: 8 },
];

const COLORS = ['hsl(142, 60%, 35%)', 'hsl(38, 75%, 55%)', 'hsl(200, 65%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(25, 50%, 30%)'];

const farmingNews = [
  { title: 'Record wheat production expected this Rabi season', category: 'Production', time: '2h ago' },
  { title: 'Government announces new MSP for Kharif crops 2026', category: 'Policy', time: '5h ago' },
  { title: 'Organic farming area increases by 18% nationwide', category: 'Trends', time: '1d ago' },
  { title: 'New pest-resistant cotton variety released by ICAR', category: 'Research', time: '1d ago' },
  { title: 'Drip irrigation subsidy extended to more districts', category: 'Subsidies', time: '2d ago' },
];

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { currentUser, currentLocation } = useApp();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-1">
          Welcome back, {currentUser?.name || 'Farmer'}! 👋
        </h1>
        <p className="text-muted-foreground mb-6">Here's your farm overview for {currentLocation}</p>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Crops', value: '4', sub: 'In season' },
          { label: 'Weather', value: '28°C', sub: 'Partly Cloudy' },
          { label: 'Alerts', value: '3', sub: 'Pending' },
          { label: 'Yield Score', value: '87%', sub: 'Good' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="vasundhara-card p-5 bg-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Market Prices (₹/Quintal)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={marketPriceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="Wheat" stroke="hsl(38, 75%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Rice" stroke="hsl(142, 60%, 35%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Cotton" stroke="hsl(200, 65%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Cloud className="w-5 h-5 text-accent" /> Weekly Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Area type="monotone" dataKey="temp" stroke="hsl(0, 72%, 51%)" fill="hsl(0, 72%, 51%, 0.1)" name="Temp (°C)" />
                <Area type="monotone" dataKey="humidity" stroke="hsl(200, 65%, 50%)" fill="hsl(200, 65%, 50%, 0.1)" name="Humidity (%)" />
                <Area type="monotone" dataKey="rain" stroke="hsl(210, 80%, 50%)" fill="hsl(210, 80%, 50%, 0.15)" name="Rain (mm)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Crop distribution + News */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Crop Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {cropDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading flex items-center gap-2">📰 Farming News & Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {farmingNews.map((news, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{news.title}</p>
                    <span className="text-xs text-primary font-medium">{news.category}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{news.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Features */}
      <h2 className="text-xl font-heading font-semibold text-foreground">All Features</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onNavigate(action.page)}
            className="vasundhara-card p-4 cursor-pointer bg-card flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shrink-0`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-foreground text-sm truncate">{action.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
