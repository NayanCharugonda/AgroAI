import { Leaf, Home, LayoutDashboard, Sprout, Cloud, TrendingUp, ShieldAlert, Map, TreeDeciduous, FlaskConical, Recycle, Beaker, LogIn, LogOut, Menu, X, CalendarDays, Store, Banknote, Truck, Languages } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import NotificationsPanel from '@/components/NotificationsPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'home', icon: Home },
  { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
  { id: 'advisor', label: 'soil_recommendation', icon: Sprout },
  { id: 'weather', label: 'weather', icon: Cloud },
  { id: 'prices', label: 'market_prices', icon: TrendingUp },
  { id: 'disease', label: 'disease_detection', icon: ShieldAlert },
  { id: 'storage', label: 'Storage', icon: Map },
  { id: 'growth', label: '3D Growth', icon: TreeDeciduous },
  { id: 'soil', label: 'Soil', icon: FlaskConical },
  { id: 'organic', label: 'organic_farming', icon: Recycle },
  { id: 'inorganic', label: 'Modern', icon: Beaker },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'marketplace', label: 'Market', icon: Store },
  { id: 'subsidies', label: 'Subsidies', icon: Banknote },
  { id: 'transport', label: 'Transport', icon: Truck },
];

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const { isLoggedIn, currentUser, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLangOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'te', name: 'తెలుగు' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
          <Leaf className="w-7 h-7 text-primary" />
          <span className="text-xl font-heading font-bold vasundhara-gradient-text">Vasundhara</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-0.5 overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activePage === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {t(item.label)}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Languages className="w-5 h-5" />
              <span className="text-xs font-bold uppercase hidden md:inline">{i18n.language.slice(0, 2)}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${i18n.language === lang.code ? 'text-primary font-bold' : 'text-foreground'
                        }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ThemeToggle />
          <NotificationsPanel />
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">{currentUser?.name}</span>
              <button
                onClick={() => { logout(); onNavigate('home'); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <LogIn className="w-4 h-4" /> {t('sign_in')}
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden border-t border-border overflow-hidden bg-card"
          >
            <div className="p-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activePage === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {t(item.label)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
