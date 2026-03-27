import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Calendar, Clock, Phone, Star, Search, Filter, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  emoji: string;
  pricePerHour: number;
  pricePerDay: number;
  rating: number;
  reviews: number;
  available: boolean;
  owner: string;
  phone: string;
  location: string;
  distance: string;
  features: string[];
  image: string;
}

const vehicleCategories = [
  { id: 'all', label: 'All', emoji: '🚜' },
  { id: 'tractor', label: 'Tractors', emoji: '🚜' },
  { id: 'harvester', label: 'Harvesters', emoji: '🌾' },
  { id: 'tiller', label: 'Tillers & Cultivators', emoji: '⚙️' },
  { id: 'sprayer', label: 'Sprayers', emoji: '💧' },
  { id: 'transport', label: 'Transport', emoji: '🚛' },
  { id: 'planter', label: 'Planters & Seeders', emoji: '🌱' },
  { id: 'other', label: 'Others', emoji: '🔧' },
];

const vehicles: Vehicle[] = [
  { id: '1', name: 'Mahindra 575 DI Tractor', category: 'tractor', emoji: '🚜', pricePerHour: 500, pricePerDay: 3500, rating: 4.8, reviews: 124, available: true, owner: 'Rajesh Kumar', phone: '+91 98765 43210', location: 'Nashik, MH', distance: '3.2 km', features: ['45 HP', 'Power Steering', 'Dual Clutch'], image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=250&fit=crop' },
  { id: '2', name: 'Swaraj 744 FE Tractor', category: 'tractor', emoji: '🚜', pricePerHour: 600, pricePerDay: 4000, rating: 4.6, reviews: 89, available: true, owner: 'Suresh Patil', phone: '+91 98765 43211', location: 'Pune, MH', distance: '5.1 km', features: ['48 HP', 'Oil Immersed Brakes', 'Heavy Duty'], image: 'https://images.unsplash.com/photo-1605002969196-722dcd7f45f3?w=400&h=250&fit=crop' },
  { id: '3', name: 'Power Tiller (Honda)', category: 'tiller', emoji: '⚙️', pricePerHour: 300, pricePerDay: 2000, rating: 4.5, reviews: 56, available: true, owner: 'Mohan Das', phone: '+91 98765 43212', location: 'Nagpur, MH', distance: '2.8 km', features: ['13 HP', 'Diesel Engine', 'Easy Maneuver'], image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop' },
  { id: '4', name: 'Combine Harvester (Kartar)', category: 'harvester', emoji: '🌾', pricePerHour: 2500, pricePerDay: 15000, rating: 4.9, reviews: 210, available: false, owner: 'Bhim Singh', phone: '+91 98765 43213', location: 'Amritsar, PB', distance: '8.5 km', features: ['Self-Propelled', '14ft Cutter Bar', 'AC Cabin'], image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop' },
  { id: '5', name: 'Forage Harvester', category: 'harvester', emoji: '🌾', pricePerHour: 1800, pricePerDay: 12000, rating: 4.4, reviews: 45, available: true, owner: 'Gurpreet Kaur', phone: '+91 98765 43214', location: 'Ludhiana, PB', distance: '12 km', features: ['Multi-crop', 'High Capacity', 'Low Maintenance'], image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=250&fit=crop' },
  { id: '6', name: 'Reaper Binder', category: 'harvester', emoji: '🌾', pricePerHour: 800, pricePerDay: 5000, rating: 4.3, reviews: 67, available: true, owner: 'Ravi Shankar', phone: '+91 98765 43215', location: 'Bhopal, MP', distance: '4.7 km', features: ['Walk Behind', 'Multi-crop', 'Fuel Efficient'], image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=250&fit=crop' },
  { id: '7', name: 'Seed Drill Machine', category: 'planter', emoji: '🌱', pricePerHour: 400, pricePerDay: 2500, rating: 4.7, reviews: 92, available: true, owner: 'Anand Yadav', phone: '+91 98765 43216', location: 'Indore, MP', distance: '6.3 km', features: ['9 Row', 'Adjustable Depth', 'Fertilizer Attachment'], image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=400&h=250&fit=crop' },
  { id: '8', name: 'Boom Sprayer (Tractor-mounted)', category: 'sprayer', emoji: '💧', pricePerHour: 350, pricePerDay: 2200, rating: 4.5, reviews: 78, available: true, owner: 'Deepak Verma', phone: '+91 98765 43217', location: 'Jaipur, RJ', distance: '3.9 km', features: ['500L Tank', '12m Boom', 'Pressure Adjustable'], image: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?w=400&h=250&fit=crop' },
  { id: '9', name: 'Tractor Trailer (10 Ton)', category: 'transport', emoji: '🚛', pricePerHour: 700, pricePerDay: 4500, rating: 4.6, reviews: 145, available: true, owner: 'Vikram Chauhan', phone: '+91 98765 43218', location: 'Ahmedabad, GJ', distance: '7.1 km', features: ['Hydraulic Tipping', '10 Ton Capacity', 'Heavy Duty'], image: 'https://images.unsplash.com/photo-1586191582056-3e3a00f4d09e?w=400&h=250&fit=crop' },
  { id: '10', name: 'Farm Pickup Truck', category: 'transport', emoji: '🚛', pricePerHour: 450, pricePerDay: 3000, rating: 4.4, reviews: 112, available: true, owner: 'Prakash Reddy', phone: '+91 98765 43219', location: 'Hyderabad, TS', distance: '2.5 km', features: ['1.5 Ton', 'AC Cabin', 'GPS Tracking'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop' },
  { id: '11', name: 'Rotavator (6ft)', category: 'tiller', emoji: '⚙️', pricePerHour: 450, pricePerDay: 2800, rating: 4.7, reviews: 99, available: true, owner: 'Kishore Nair', phone: '+91 98765 43220', location: 'Kochi, KL', distance: '5.6 km', features: ['42 Blades', 'Heavy Duty Gearbox', 'Multi-Speed'], image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop' },
  { id: '12', name: 'Rice Transplanter', category: 'planter', emoji: '🌱', pricePerHour: 1200, pricePerDay: 8000, rating: 4.8, reviews: 63, available: true, owner: 'Sanjay Mishra', phone: '+91 98765 43221', location: 'Cuttack, OD', distance: '9.2 km', features: ['8 Row', 'Walk-Behind', 'High Speed'], image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=250&fit=crop' },
  { id: '13', name: 'Hay Baler (Round)', category: 'other', emoji: '🔧', pricePerHour: 1500, pricePerDay: 10000, rating: 4.6, reviews: 34, available: false, owner: 'Harinder Singh', phone: '+91 98765 43222', location: 'Karnal, HR', distance: '15 km', features: ['Round Bale', 'Auto Tie', 'PTO Driven'], image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop' },
  { id: '14', name: 'ATV All-Terrain Vehicle', category: 'transport', emoji: '🚛', pricePerHour: 350, pricePerDay: 2500, rating: 4.3, reviews: 41, available: true, owner: 'Ajay Thakur', phone: '+91 98765 43223', location: 'Shimla, HP', distance: '4.1 km', features: ['4WD', 'Cargo Rack', 'Hill Ready'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop' },
  { id: '15', name: 'Drone Sprayer (10L)', category: 'sprayer', emoji: '💧', pricePerHour: 1000, pricePerDay: 7000, rating: 4.9, reviews: 187, available: true, owner: 'Tech Agri Solutions', phone: '+91 98765 43224', location: 'Bengaluru, KA', distance: '6.8 km', features: ['10L Tank', 'GPS Auto-pilot', '10 Acre/Hr'], image: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?w=400&h=250&fit=crop' },
];

export default function TransportBookingPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingHours, setBookingHours] = useState('8');
  const [booked, setBooked] = useState(false);

  const filtered = vehicles.filter(v => {
    const matchCat = category === 'all' || v.category === category;
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 4000);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-primary/90 via-accent/80 to-secondary/90 p-8 md:p-12">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <motion.span animate={{ x: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl">🚜</motion.span>
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-black text-primary-foreground">Farm Vehicle Booking</h1>
                <p className="text-primary-foreground/80">Book tractors, harvesters, sprayers & more — like Rapido for farmers!</p>
              </div>
            </div>
          </div>
          <div className="absolute right-8 bottom-4 text-8xl opacity-20">🚛</div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles or location..." className="pl-10" />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {vehicleCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              category === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Vehicles grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filtered.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${!v.available ? 'opacity-60' : ''} ${selectedVehicle?.id === v.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => v.available && setSelectedVehicle(v)}>
              <div className="h-40 bg-muted overflow-hidden relative">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=250&fit=crop'; }} />
                {!v.available && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">Booked</Badge>
                  </div>
                )}
                <Badge className="absolute top-3 left-3 bg-card/90 text-foreground">{v.emoji} {v.category}</Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-semibold text-foreground text-sm leading-tight">{v.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-secondary">
                    <Star className="w-3 h-3 fill-secondary" /> {v.rating}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" /> {v.location} • {v.distance}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {v.features.map(f => <Badge key={f} variant="outline" className="text-[10px] px-1.5 py-0">{f}</Badge>)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">₹{v.pricePerHour}</span>
                    <span className="text-xs text-muted-foreground">/hr</span>
                  </div>
                  <span className="text-xs text-muted-foreground">₹{v.pricePerDay}/day</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Booking panel */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-4 md:p-6 shadow-xl">
            <div className="max-w-4xl mx-auto">
              {booked ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-xl font-heading font-bold text-foreground">Booking Confirmed!</h3>
                  <p className="text-muted-foreground text-sm">Owner {selectedVehicle.owner} will contact you shortly.</p>
                </motion.div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-foreground mb-1">{selectedVehicle.emoji} {selectedVehicle.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {selectedVehicle.owner} • {selectedVehicle.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Date</label>
                      <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                        className="block w-full p-2 rounded-lg border border-border bg-card text-foreground text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Hours</label>
                      <select value={bookingHours} onChange={e => setBookingHours(e.target.value)}
                        className="block w-full p-2 rounded-lg border border-border bg-card text-foreground text-sm">
                        {[2, 4, 6, 8, 12, 24].map(h => <option key={h} value={h}>{h} hrs</option>)}
                      </select>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-lg font-bold text-primary">₹{selectedVehicle.pricePerHour * parseInt(bookingHours)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedVehicle(null)}>Cancel</Button>
                    <Button onClick={handleBook} className="gap-2"><Truck className="w-4 h-4" /> Book Now</Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
