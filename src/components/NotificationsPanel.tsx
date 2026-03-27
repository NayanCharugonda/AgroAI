import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, X, Check, CloudRain, TrendingUp, Bug, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AnimatePresence } from 'framer-motion';

const typeIcons = {
  weather: CloudRain,
  price: TrendingUp,
  disease: Bug,
  general: Info,
};

const typeColors = {
  weather: 'text-rain bg-rain/10',
  price: 'text-primary bg-primary/10',
  disease: 'text-destructive bg-destructive/10',
  general: 'text-accent bg-accent/10',
};

export default function NotificationsPanel() {
  const { notifications, markNotificationRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-primary-foreground text-xs flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 vasundhara-card bg-card z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">Notifications</h3>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => {
                  const Icon = typeIcons[n.type];
                  const colors = typeColors[n.type];
                  return (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                        !n.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colors}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
