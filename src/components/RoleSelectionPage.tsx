import { motion } from 'framer-motion';
import { ShoppingCart, Tractor, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface RoleSelectionPageProps {
    onNavigate: (page: string) => void;
}

export default function RoleSelectionPage({ onNavigate }: RoleSelectionPageProps) {
    const { currentUser, setCurrentLocation } = useApp();
    const [location, setLocation] = useState(currentUser?.location || '');

    return (
        <div className="min-h-screen vasundhara-hero-bg flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <div className="vasundhara-card p-8 bg-card text-center">
                    <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                        Welcome, {currentUser?.name}! 🌾
                    </h1>
                    <p className="text-muted-foreground mb-8">How would you like to use Vasundhara?</p>

                    {/* Location Input */}
                    <div className="relative mb-8 max-w-sm mx-auto">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="Enter your location to search..."
                            className="pl-10"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Farmer */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                if (location.trim()) setCurrentLocation(location.trim());
                                onNavigate('dashboard');
                            }}
                            className="vasundhara-card p-6 bg-primary/5 hover:bg-primary/10 transition-colors text-left group cursor-pointer border-2 border-transparent hover:border-primary"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                                <Tractor className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-foreground mb-2">I'm a Farmer</h2>
                            <p className="text-sm text-muted-foreground">
                                Access dashboard, crop advisor, weather, storage, subsidies, and sell your produce.
                            </p>
                        </motion.button>

                        {/* Buyer */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                if (location.trim()) setCurrentLocation(location.trim());
                                onNavigate('marketplace');
                            }}
                            className="vasundhara-card p-6 bg-secondary/5 hover:bg-secondary/10 transition-colors text-left group cursor-pointer border-2 border-transparent hover:border-secondary"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mb-4 group-hover:bg-secondary/25 transition-colors">
                                <ShoppingCart className="w-8 h-8 text-secondary" />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-foreground mb-2">I'm a Buyer</h2>
                            <p className="text-sm text-muted-foreground">
                                Browse the marketplace to buy fresh produce directly from farmers.
                            </p>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
