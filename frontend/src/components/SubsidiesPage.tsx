import { motion } from 'framer-motion';
import { Banknote, ExternalLink, CheckCircle2, Clock, IndianRupee, FileText, Users, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const subsidies = [
  {
    name: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    amount: '₹6,000/year',
    desc: 'Direct income support of ₹6,000 per year in three equal installments to small and marginal farmer families.',
    eligibility: ['All land-holding farmer families', 'Valid Aadhaar card', 'Active bank account'],
    status: 'Active',
    category: 'Income Support',
    link: 'https://pmkisan.gov.in',
  },
  {
    name: 'PM Fasal Bima Yojana',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    amount: 'Up to ₹2,00,000',
    desc: 'Crop insurance scheme providing financial support in case of crop failure due to natural calamities, pests & diseases.',
    eligibility: ['All farmers (loanee & non-loanee)', 'Growing notified crops', 'Premium: 2% Kharif, 1.5% Rabi'],
    status: 'Active',
    category: 'Insurance',
    link: 'https://pmfby.gov.in',
  },
  {
    name: 'KCC - Kisan Credit Card',
    fullName: 'Kisan Credit Card Scheme',
    amount: 'Up to ₹3,00,000 @ 4% interest',
    desc: 'Short-term crop loans at subsidized interest rates for farmers to meet agricultural and allied needs.',
    eligibility: ['All farmers, sharecroppers, tenant farmers', 'Self Help Groups (SHGs)', 'Fishermen and animal husbandry farmers'],
    status: 'Active',
    category: 'Loan',
    link: '#',
  },
  {
    name: 'Soil Health Card',
    fullName: 'Soil Health Card Scheme',
    amount: 'Free',
    desc: 'Free soil testing and health card to help farmers use appropriate nutrients for improved crop productivity.',
    eligibility: ['All farmers', 'Must apply through local agriculture office', 'Testing every 2 years'],
    status: 'Active',
    category: 'Advisory',
    link: 'https://soilhealth.dac.gov.in',
  },
  {
    name: 'PMKSY',
    fullName: 'Pradhan Mantri Krishi Sinchayee Yojana',
    amount: 'Up to 55% subsidy on drip/sprinkler',
    desc: 'Subsidy on micro-irrigation systems like drip and sprinkler for efficient water use.',
    eligibility: ['All farmers', 'Priority to small & marginal farmers', 'Up to 55% for SC/ST/small farmers'],
    status: 'Active',
    category: 'Irrigation',
    link: '#',
  },
  {
    name: 'eNAM',
    fullName: 'National Agriculture Market',
    amount: 'Market access',
    desc: 'Online trading platform for agricultural commodities providing better price discovery for farmers.',
    eligibility: ['Registered farmer', 'Any tradeable commodity', 'Access via local APMC mandi'],
    status: 'Active',
    category: 'Market',
    link: 'https://enam.gov.in',
  },
];

const loans = [
  {
    name: 'Agriculture Term Loan',
    provider: 'SBI / Nationalized Banks',
    interest: '7-9% p.a.',
    amount: '₹10 Lakh - ₹50 Lakh',
    purpose: 'Farm mechanization, land development, plantation, horticulture',
    tenure: '5-15 years',
  },
  {
    name: 'Farm Equipment Loan',
    provider: 'NABARD / Commercial Banks',
    interest: '8-10% p.a.',
    amount: 'Up to ₹25 Lakh',
    purpose: 'Purchase of tractors, harvesters, tillers and other equipment',
    tenure: '5-9 years',
  },
  {
    name: 'Warehouse Receipt Loan',
    provider: 'Cooperative Banks',
    interest: '6-8% p.a.',
    amount: 'Up to 70% of produce value',
    purpose: 'Loan against stored produce to avoid distress selling',
    tenure: '6-12 months',
  },
  {
    name: 'Dairy & Livestock Loan',
    provider: 'NABARD / Regional Rural Banks',
    interest: '7-11% p.a.',
    amount: 'Up to ₹10 Lakh',
    purpose: 'Dairy farming, poultry, goat rearing, fishery',
    tenure: '3-7 years',
  },
];

export default function SubsidiesPage() {
  const [activeTab, setActiveTab] = useState<'subsidies' | 'loans'>('subsidies');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Banknote className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Subsidies & Loans</h1>
        </div>
        <p className="text-muted-foreground mb-6">Government schemes and financial support for farmers</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'subsidies' as const, label: 'Government Subsidies', icon: Landmark },
          { id: 'loans' as const, label: 'Farm Loans', icon: IndianRupee },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'subsidies' ? (
        <div className="grid md:grid-cols-2 gap-4">
          {subsidies.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2 text-primary border-primary/30">{s.category}</Badge>
                      <CardTitle className="text-lg font-heading">{s.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.fullName}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> {s.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-heading font-bold text-foreground">
                    <IndianRupee className="w-5 h-5 text-secondary" />
                    {s.amount}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1.5">Eligibility:</p>
                    <ul className="space-y-1">
                      {s.eligibility.map((e, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" /> {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2 gap-2" onClick={() => window.open(s.link, '_blank')}>
                    <ExternalLink className="w-3.5 h-3.5" /> Apply / Learn More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {loans.map((l, i) => (
            <motion.div key={l.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-heading">{l.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{l.provider}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-2.5">
                      <p className="text-xs text-muted-foreground">Interest Rate</p>
                      <p className="text-sm font-bold text-foreground">{l.interest}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2.5">
                      <p className="text-xs text-muted-foreground">Loan Amount</p>
                      <p className="text-sm font-bold text-foreground">{l.amount}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1"><FileText className="w-3 h-3 inline mr-1" />Purpose: {l.purpose}</p>
                    <p className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline mr-1" />Tenure: {l.tenure}</p>
                  </div>
                  <Button size="sm" className="w-full gap-2">
                    <Users className="w-3.5 h-3.5" /> Check Eligibility
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
