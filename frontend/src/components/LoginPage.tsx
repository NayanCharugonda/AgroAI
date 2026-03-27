import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, User as UserIcon, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp, getRegisteredUsers } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, signup } = useApp();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognitionRef = useRef<any>(null);

  const users = getRegisteredUsers();

  const startVoiceLogin = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: 'Voice not supported', description: 'Your browser does not support speech recognition.', variant: 'destructive' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('Listening... Say your name');
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      setName(transcript);
      setVoiceStatus(`Heard: "${transcript}"`);

      if (event.results[0].isFinal) {
        try {
          await login({ identifier: transcript, password: 'password' });
          setVoiceStatus(`Welcome back!`);
          setTimeout(() => {
            toast({ title: `Welcome back!`, description: 'Logged in successfully via voice.' });
            onNavigate('role-selection');
          }, 1000);
        } catch (error) {
          setVoiceStatus(`User "${transcript}" not found or error occurred.`);
        }
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceStatus('Could not hear you. Please try again.');
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [login, onNavigate, toast]);

  const handleManualLogin = async () => {
    if (!name.trim()) {
      toast({ title: 'Name required', variant: 'destructive' });
      return;
    }

    try {
      await login({ identifier: name.trim(), password: 'password' }); // Demo password
      toast({ title: `Welcome back!` });
      onNavigate('role-selection');
    } catch (error: any) {
      // If login fails, try signup as a fallback for demo purposes
      try {
        await signup({ username: name.trim(), password: 'password', location: 'Delhi, India' });
        toast({ title: `Welcome, ${name.trim()}!`, description: 'New account created.' });
        onNavigate('role-selection');
      } catch (signupError: any) {
        toast({ title: 'Authentication failed', description: signupError.message, variant: 'destructive' });
      }
    }
  };

  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  return (
    <div className="min-h-screen agroai-hero-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="agroai-card p-8 bg-card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{t('welcome_back')}</h1>
            <p className="text-muted-foreground">{t('sign_in_to_agroai')}</p>
          </div>

          {/* Voice Login */}
          <div className="text-center mb-8">
            <motion.button
              onClick={startVoiceLogin}
              whileTap={{ scale: 0.95 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${isListening
                ? 'bg-destructive agroai-glow'
                : 'bg-primary hover:bg-primary/90'
                }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 text-primary-foreground" />
              ) : (
                <Mic className="w-10 h-10 text-primary-foreground" />
              )}
            </motion.button>
            {isListening && (
              <div className="flex justify-center mb-2">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    className="w-1 mx-0.5 bg-primary rounded-full"
                    animate={{ height: [8, 24, 8] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground font-medium">
              {voiceStatus || t('Tap microphone & say your name to login')}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or type</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Manual */}
          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('your_full_name')}
                className="pl-10"
                onKeyDown={e => e.key === 'Enter' && handleManualLogin()}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password_optional')}
                className="pl-10 pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button onClick={handleManualLogin} className="w-full font-heading font-semibold" size="lg">
              {t('sign_in')}
            </Button>
          </div>

          {/* Quick users */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-3 text-center">Quick login as:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {users.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  onClick={async () => {
                    try {
                      await login({ identifier: u.name, password: 'password' });
                      toast({ title: `Welcome back!` });
                      onNavigate('role-selection');
                    } catch (error) {
                      toast({ title: 'Login failed', variant: 'destructive' });
                    }
                  }}
                  className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full px-3 py-1.5 transition-colors"
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="block mx-auto mt-6 text-primary-foreground/70 hover:text-primary-foreground text-sm"
        >
          ← {t('back_to_home')}
        </button>
      </motion.div>
    </div>
  );
}
