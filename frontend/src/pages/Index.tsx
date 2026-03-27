import { useState, useCallback } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import LoginPage from '@/components/LoginPage';
import RoleSelectionPage from '@/components/RoleSelectionPage';
import DashboardPage from '@/components/DashboardPage';
import CropAdvisorPage from '@/components/CropAdvisorPage';
import WeatherPage from '@/components/WeatherPage';
import MarketPricesPage from '@/components/MarketPricesPage';
import DiseaseDetectionPage from '@/components/DiseaseDetectionPage';
import StorageMapPage from '@/components/StorageMapPage';
import CropGrowthPage from '@/components/CropGrowthPage';
import SoilAnalysisPage from '@/components/SoilAnalysisPage';
import OrganicFarmingPage from '@/components/OrganicFarmingPage';
import InorganicFarmingPage from '@/components/InorganicFarmingPage';
import FarmerCalendarPage from '@/components/FarmerCalendarPage';
import MarketplacePage from '@/components/MarketplacePage';
import SubsidiesPage from '@/components/SubsidiesPage';
import TransportBookingPage from '@/components/TransportBookingPage';
import VoiceAssistantWidget from '@/components/VoiceAssistantWidget';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const { setActivePage: setContextPage } = useApp();

  const navigate = useCallback((page: string) => {
    setActivePage(page);
    setContextPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setContextPage]);

  const showNavbar = activePage !== 'login' && activePage !== 'role-selection';

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar activePage={activePage} onNavigate={navigate} />}

      {activePage === 'home' && <HomePage onNavigate={navigate} />}
      {activePage === 'login' && <LoginPage onNavigate={navigate} />}
      {activePage === 'role-selection' && <RoleSelectionPage onNavigate={navigate} />}
      {activePage === 'dashboard' && <DashboardPage onNavigate={navigate} />}
      {activePage === 'advisor' && <CropAdvisorPage />}
      {activePage === 'weather' && <WeatherPage />}
      {activePage === 'prices' && <MarketPricesPage />}
      {activePage === 'disease' && <DiseaseDetectionPage />}
      {activePage === 'storage' && <StorageMapPage />}
      {activePage === 'growth' && <CropGrowthPage />}
      {activePage === 'soil' && <SoilAnalysisPage />}
      {activePage === 'organic' && <OrganicFarmingPage />}
      {activePage === 'inorganic' && <InorganicFarmingPage />}
      {activePage === 'calendar' && <FarmerCalendarPage />}
      {activePage === 'marketplace' && <MarketplacePage />}
      {activePage === 'subsidies' && <SubsidiesPage />}
      {activePage === 'transport' && <TransportBookingPage />}

      <VoiceAssistantWidget onNavigate={navigate} />
    </div>
  );
}

const Index = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default Index;
