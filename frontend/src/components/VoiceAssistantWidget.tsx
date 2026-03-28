import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Bot, Volume2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';

interface VoiceAssistantProps {
  onNavigate: (page: string) => void;
}

const pageKeywords: Record<string, string[]> = {
  home: ['home', 'main', 'start', 'landing', 'beginning'],
  login: ['login', 'sign in', 'log in', 'signin', 'account', 'register'],
  dashboard: ['dashboard', 'overview', 'summary', 'main page'],
  advisor: ['crop', 'advisor', 'recommend', 'suggestion', 'what to grow'],
  weather: ['weather', 'rain', 'temperature', 'forecast', 'climate', 'sunny', 'cloudy'],
  prices: ['price', 'market price', 'cost', 'rate', 'mandi'],
  disease: ['disease', 'pest', 'infection', 'blight', 'mildew', 'diagnosis', 'sick', 'detect'],
  storage: ['storage', 'warehouse', 'store', 'godown', 'silo', 'keep', 'facility'],
  transport: ['transport', 'booking', 'tractor', 'harvester', 'vehicle', 'truck', 'book', 'rent'],
  growth: ['3d', 'growth', 'simulation', 'visualize', 'three d'],
  soil: ['soil', 'soil analysis', 'soil test'],
  organic: ['organic', 'organic farming', 'compost', 'bio fertilizer'],
  inorganic: ['modern', 'inorganic', 'chemical', 'modern farming', 'urea', 'dap'],
  calendar: ['calendar', 'schedule', 'planner', 'when to farm', 'crop rotation'],
  marketplace: ['marketplace', 'sell crop', 'buy crop', 'sell', 'buy', 'market'],
  subsidies: ['subsidy', 'subsidies', 'loan', 'government scheme', 'pm kisan', 'pmfby'],
};

export default function VoiceAssistant({ onNavigate }: VoiceAssistantProps) {
  const { setCurrentLocation, isLoggedIn } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('Hi! I\'m your AgroAI assistant. Say "Go to weather" or "Show crop advisor" to navigate. Ask me anything about farming!');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const recognitionRef = useRef<any>(null);
  const { i18n } = useTranslation();
  const selectedLang = i18n.language || 'en';

  const speak = useCallback((text: string, langCode = 'en-US') => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    let locale = langCode;
    if (langCode === 'hi') locale = 'hi-IN';
    if (langCode === 'te') locale = 'te-IN';
    if (langCode === 'en') locale = 'en-US';

    utterance.lang = locale;

    utterance.rate = 0.9;   // slower, clearer
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === locale);

    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);

    setResponse(text);
  }, []);

  const processCommand = useCallback(async (text: string) => {
    const lower = text.toLowerCase();

    // 1. Navigation commands
    for (const [page, keywords] of Object.entries(pageKeywords)) {
      if (keywords.some(k => lower.includes(k))) {
        const pageNames: Record<string, string> = {
          home: 'Home Page', login: 'Login Page', dashboard: 'Dashboard',
          advisor: 'Crop Advisor', weather: 'Weather Monitor', prices: 'Market Prices',
          disease: 'Disease Detection', storage: 'Storage Finder', transport: 'Transport Booking',
          growth: '3D Crop Growth', soil: 'Soil Analysis', organic: 'Organic Farming',
          inorganic: 'Modern Farming', calendar: 'Farmer Calendar', marketplace: 'Marketplace',
          subsidies: 'Subsidies & Loans',
        };

        if (page === 'login') {
          const reply = 'Taking you to the login page. You can sign in with your voice!';
          speak(reply, selectedLang);
          onNavigate('login');
          return;
        }

        const reply = `Navigating to ${pageNames[page]}.`;
        speak(reply, selectedLang);
        onNavigate(page);
        return;
      }
    }

    // 2. Location commands
    const locationMatch = lower.match(/(?:location|weather in|weather for|go to|show me|set location to)\s+(.+)/i);
    if (locationMatch) {
      const loc = locationMatch[1].replace(/[?.!]/g, '').trim();
      const capitalizedLoc = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setCurrentLocation(capitalizedLoc);
      const reply = `Location set to ${capitalizedLoc}. Showing weather and crop data for this area.`;
      speak(reply, selectedLang);
      onNavigate('weather');
      return;
    }

    // 3. Scroll commands
    if (lower.includes('scroll down')) {
      window.scrollBy({ top: 400, behavior: 'smooth' });
      speak('Scrolling down.', selectedLang);
      return;
    }
    if (lower.includes('scroll up')) {
      window.scrollBy({ top: -400, behavior: 'smooth' });
      speak('Scrolling up.', selectedLang);
      return;
    }
    if (lower.includes('scroll to top') || lower.includes('go to top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      speak('Scrolling to top.', selectedLang);
      return;
    }
    if (lower.includes('scroll to bottom') || lower.includes('go to bottom')) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      speak('Scrolling to bottom.', selectedLang);
      return;
    }

    // 4. Fallback to Ollama AI for complex queries
    try {
      setResponse("Thinking...");

      const res = await fetch('http://localhost:5000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          lang: selectedLang
        })
      });

      const data = await res.json();
      const aiReply = data.reply;

      setTranscript(text);
      speak(aiReply, selectedLang);

    } catch (err) {
      console.error(err);
      speak("AI connection error", selectedLang);
    }
  }, [selectedLang, speak, onNavigate, setCurrentLocation]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResponse('Speech recognition not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);

      if (event.results[0].isFinal) {
        setMessages(prev => [...prev, { role: 'user', text: result }]);
        processCommand(result);
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setResponse('Could not hear you. Please try again.');
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [processCommand]);

  useEffect(() => {
    return () => { recognitionRef.current?.stop(); speechSynthesis.cancel(); };
  }, []);

  useEffect(() => {
    if (response) {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.text === response) return prev;
        return [...prev, { role: 'assistant', text: response }];
      });
    }
  }, [response]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform agroai-glow"
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-8 h-8 text-primary-foreground" /> : <Mic className="w-10 h-10 text-primary-foreground" />}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/50 pulse-ring" />
            <span className="absolute inset-0 rounded-full bg-primary/30 pulse-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-h-[500px] agroai-card bg-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-primary-foreground">AgroAI Assistant</h3>
                <p className="text-xs text-primary-foreground/70">Voice-powered farming helper</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm relative flex items-start gap-2 ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                    }`}>
                    {msg.role === 'assistant' && <Bot className="w-3 h-3 mt-1 flex-shrink-0 text-primary" />}
                    <span>{msg.text}</span>
                    {msg.role === 'assistant' && (
                      <button onClick={() => speak(msg.text)} className="mt-1 flex-shrink-0 hover:scale-110 transition-transform">
                        <Volume2 className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mic */}
            <div className="p-4 border-t border-border flex items-center justify-center gap-3">
              {isListening && (
                <div className="flex items-center gap-1 mr-2">
                  {[0, 1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{ height: [6, 18, 6] }}
                      transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              )}
              <motion.button
                onClick={startListening}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-destructive' : 'bg-primary hover:bg-primary/90'
                  }`}
              >
                {isListening ? <MicOff className="w-5 h-5 text-primary-foreground" /> : <Mic className="w-5 h-5 text-primary-foreground" />}
              </motion.button>
              {transcript && isListening && (
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{transcript}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}