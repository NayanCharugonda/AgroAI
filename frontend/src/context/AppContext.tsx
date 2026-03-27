import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Notification } from '@/types';
import { api } from '@/lib/api';

interface AppState {
  currentUser: User | null;
  isLoggedIn: boolean;
  currentLocation: string;
  notifications: Notification[];
  activePage: string;
  login: (credentials: { identifier: string; password?: string }) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  setCurrentLocation: (loc: string) => void;
  setActivePage: (page: string) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
}

const AppContext = createContext<AppState | null>(null);

const defaultNotifications: Notification[] = [
  { id: '1', title: 'Heavy Rain Alert', message: 'Heavy rainfall expected in your region for the next 3 days. Protect your crops.', type: 'weather', time: '10 min ago', read: false },
  { id: '2', title: 'Wheat Price Surge', message: 'Wheat prices have increased by 12% in the last week.', type: 'price', time: '1 hour ago', read: false },
  { id: '3', title: 'Pest Warning', message: 'Aphid infestation reported in nearby farms. Check your crops.', type: 'disease', time: '3 hours ago', read: false },
  { id: '4', title: 'Fertilizer Subsidy', message: 'Government subsidy on DAP fertilizer available until March.', type: 'general', time: '1 day ago', read: false },
];

const registeredUsers: User[] = [
  { id: '1', name: 'Ravi Kumar', location: 'Hyderabad, India' },
  { id: '2', name: 'Priya Sharma', location: 'Pune, India' },
  { id: '3', name: 'John Smith', location: 'Iowa, USA' },
  { id: '4', name: 'Anita Devi', location: 'Jaipur, India' },
  { id: '5', name: 'Demo User', location: 'Delhi, India' },
];

export const getRegisteredUsers = () => registeredUsers;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [currentLocation, setCurrentLocation] = useState('Hyderabad, India');
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [activePage, setActivePage] = useState('home');

  const login = useCallback(async (credentials: { identifier: string; password?: string }) => {
    try {
      const user: User = {
        id: credentials.identifier,
        name: credentials.identifier,
        location: 'Delhi, India', // Default for now
      };
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('token', 'mock_token');
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (userData: any) => {
    try {
      const user: User = {
        id: userData.username,
        name: userData.username,
        location: userData.location || 'Delhi, India',
      };
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('token', 'mock_token');
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'read'>) => {
    setNotifications(prev => [{ ...n, id: Date.now().toString(), read: false }, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, isLoggedIn, currentLocation, notifications, activePage,
      login, signup, logout, setCurrentLocation, setActivePage, markNotificationRead, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
