import { motion } from 'framer-motion';
import { Leaf, Cloud, TrendingUp, ShieldCheck, Mic, Map, Sprout, FlaskConical, Recycle, Beaker, CalendarDays, Store, Banknote, Truck, TreeDeciduous, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const features = [
  { icon: Sprout, title: 'Smart Crop Advisor', desc: 'AI-powered crop recommendations based on your soil, weather, and market prices', page: 'advisor' },
  { icon: Cloud, title: 'Live Weather', desc: 'Real-time weather monitoring with alerts for your exact location', page: 'weather' },
  { icon: TrendingUp, title: 'Market Prices', desc: 'Track crop prices in real-time and get price alerts', page: 'prices' },
  { icon: ShieldCheck, title: 'Disease Detection', desc: 'Identify crop diseases and get treatment recommendations instantly', page: 'disease' },
  { icon: Map, title: 'Storage Finder', desc: 'Find nearby crop storage facilities with map navigation', page: 'storage' },
  { icon: TreeDeciduous, title: '3D Crop Growth', desc: 'Visualize crop growth in 3D with real-time simulation', page: 'growth' },
  { icon: FlaskConical, title: 'Soil Analysis', desc: 'Hybrid soil test + location analysis for precision recommendations', page: 'soil' },
  { icon: Recycle, title: 'Organic Farming', desc: 'Eco-friendly recommendations with composting & sustainability score', page: 'organic' },
  { icon: Beaker, title: 'Modern Farming', desc: 'Chemical fertilizer dosage, irrigation optimization & yield tips', page: 'inorganic' },
  { icon: CalendarDays, title: 'Farmer Calendar', desc: 'Plan your crop cycle with irrigation, fertilizer & pesticide schedules', page: 'calendar' },
  { icon: Store, title: 'Crop Marketplace', desc: 'Buy and sell crops directly from farmers', page: 'marketplace' },
  { icon: Banknote, title: 'Subsidies & Loans', desc: 'Government schemes and farm loan options for farmers', page: 'subsidies' },
  { icon: Truck, title: 'Transport Booking', desc: 'Book tractors, harvesters, and farm vehicles on demand', page: 'transport' },
  { icon: Mic, title: 'Voice Assistant', desc: 'Navigate the platform hands-free in any language', page: 'assistant' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { isLoggedIn } = useApp();
  const { toast } = useToast();

  const handleFeatureClick = (page: string) => {
    if (!isLoggedIn) {
      toast({ title: '🔒 Login Required', description: 'Please sign in to access this feature.', variant: 'destructive' });
      onNavigate('login');
      return;
    }
    onNavigate(page);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="vasundhara-hero-bg min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: Math.random() * 4 + 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Leaf className="w-4 h-4 text-primary-foreground" />
              <span className="text-primary-foreground text-sm font-medium">AI-Powered Farming Platform</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-heading font-black text-primary-foreground mb-6 leading-tight">Vasundhara</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-8 max-w-2xl font-body leading-relaxed">
              Your intelligent farming companion. Get crop recommendations, weather alerts, disease detection, and market insights — all powered by AI and voice control.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => onNavigate('login')} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold text-lg px-8 py-6 rounded-xl">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })} className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-heading font-semibold text-lg px-8 py-6 rounded-xl">
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features-section" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Everything Your Farm Needs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by artificial intelligence and real-time data to help you grow better, earn more, and farm smarter.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleFeatureClick(f.page)}
                className="vasundhara-card p-6 cursor-pointer group relative overflow-hidden"
              >
                {!isLoggedIn && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">Ready to Transform Your Farming?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">Join thousands of farmers using Vasundhara to increase their yield and profits.</p>
          <Button size="lg" onClick={() => onNavigate('login')} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold text-lg px-10 py-6 rounded-xl">
            Start Now — It's Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-6 text-center">
          <p className="text-background/60 font-body">© 2026 Vasundhara — AI-Powered Farming Platform. Empowering farmers worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
