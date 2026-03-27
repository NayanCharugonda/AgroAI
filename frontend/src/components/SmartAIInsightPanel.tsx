import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Insight {
  question: string;
  answer: string;
}

interface SmartAIInsightPanelProps {
  insights: Insight[];
  title?: string;
}

export default function SmartAIInsightPanel({ insights, title = 'AI Insights' }: SmartAIInsightPanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
          <Brain className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground">{title}</h3>
        <span className="text-xs bg-accent/10 text-accent rounded-full px-2 py-0.5 font-medium">AI-Powered</span>
      </div>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors text-left"
            >
              <span>💡 {insight.question}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">{insight.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
