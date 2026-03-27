import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Plus, MapPin, Phone, Package, IndianRupee, Search, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';

interface Listing {
  id: string;
  crop: string;
  variety: string;
  quantity: string;
  price: string;
  location: string;
  seller: string;
  phone: string;
  quality: string;
  postedAgo: string;
  image: string;
}

const sampleListings: Listing[] = [
  { id: '1', crop: 'Rice', variety: 'Basmati 1121', quantity: '50 Quintals', price: '₹3,200/Quintal', location: 'Karnal, Haryana', seller: 'Ravi Kumar', phone: '+91 98xxx-xxxxx', quality: 'Grade A', postedAgo: '2h ago', image: '🌾' },
  { id: '2', crop: 'Wheat', variety: 'HD-2967', quantity: '100 Quintals', price: '₹2,400/Quintal', location: 'Ludhiana, Punjab', seller: 'Gurpreet Singh', phone: '+91 97xxx-xxxxx', quality: 'Grade A', postedAgo: '5h ago', image: '🌾' },
  { id: '3', crop: 'Tomato', variety: 'Hybrid', quantity: '20 Tonnes', price: '₹18/kg', location: 'Nashik, Maharashtra', seller: 'Priya Patil', phone: '+91 96xxx-xxxxx', quality: 'Fresh', postedAgo: '1d ago', image: '🍅' },
  { id: '4', crop: 'Cotton', variety: 'BT Cotton', quantity: '30 Quintals', price: '₹6,500/Quintal', location: 'Guntur, AP', seller: 'Ramesh Reddy', phone: '+91 99xxx-xxxxx', quality: 'Grade B+', postedAgo: '1d ago', image: '🏵️' },
  { id: '5', crop: 'Potato', variety: 'Kufri Jyoti', quantity: '40 Tonnes', price: '₹12/kg', location: 'Agra, UP', seller: 'Suresh Yadav', phone: '+91 88xxx-xxxxx', quality: 'Fresh', postedAgo: '3d ago', image: '🥔' },
  { id: '6', crop: 'Onion', variety: 'Nashik Red', quantity: '25 Tonnes', price: '₹22/kg', location: 'Pune, Maharashtra', seller: 'Anil Jadhav', phone: '+91 95xxx-xxxxx', quality: 'Grade A', postedAgo: '6h ago', image: '🧅' },
];

export default function MarketplacePage() {
  const { currentUser } = useApp();
  const [listings, setListings] = useState<Listing[]>(sampleListings);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ crop: '', variety: '', quantity: '', price: '', location: '', phone: '', quality: 'Grade A' });

  const filteredListings = listings.filter(l =>
    l.crop.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase()) ||
    l.variety.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.crop || !form.quantity || !form.price) return;
    const newListing: Listing = {
      id: Date.now().toString(),
      ...form,
      seller: currentUser?.name || 'Anonymous Farmer',
      postedAgo: 'Just now',
      image: '🌿',
    };
    setListings([newListing, ...listings]);
    setShowForm(false);
    setForm({ crop: '', variety: '', quantity: '', price: '', location: '', phone: '', quality: 'Grade A' });
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Crop Marketplace</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Sell Your Crop'}
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">Buy and sell farm produce directly — farmer to buyer</p>
      </motion.div>

      {/* Add listing form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="mb-6 border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg font-heading">📋 List Your Crop for Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'crop', label: 'Crop Name', placeholder: 'e.g. Rice, Wheat' },
                    { key: 'variety', label: 'Variety', placeholder: 'e.g. Basmati 1121' },
                    { key: 'quantity', label: 'Quantity', placeholder: 'e.g. 50 Quintals' },
                    { key: 'price', label: 'Price', placeholder: 'e.g. ₹3,200/Quintal' },
                    { key: 'location', label: 'Location', placeholder: 'e.g. Karnal, Haryana' },
                    { key: 'phone', label: 'Contact Phone', placeholder: '+91 98xxx-xxxxx' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                      <input
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-1">Quality Grade</label>
                  <select
                    value={form.quality}
                    onChange={e => setForm({ ...form, quality: e.target.value })}
                    className="p-2.5 rounded-lg border border-border bg-card text-foreground text-sm"
                  >
                    <option>Grade A</option>
                    <option>Grade B+</option>
                    <option>Grade B</option>
                    <option>Fresh</option>
                  </select>
                </div>
                <Button onClick={handleSubmit} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" /> List Crop for Sale
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by crop, location, or variety..."
          className="w-full pl-10 p-3 rounded-lg border border-border bg-card text-foreground"
        />
      </div>

      {/* Listings */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{l.image}</span>
                    <div>
                      <h3 className="font-heading font-bold text-foreground text-lg">{l.crop}</h3>
                      <p className="text-xs text-muted-foreground">{l.variety}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/30">{l.quality}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee className="w-4 h-4 text-secondary" />
                    <span className="font-bold text-foreground">{l.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" /> {l.quantity}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {l.location}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{l.seller}</p>
                    <p className="text-xs text-muted-foreground">{l.postedAgo}</p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground">No listings found. Try a different search or list your crop!</p>
        </div>
      )}
    </div>
  );
}
