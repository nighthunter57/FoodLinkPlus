import React, { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import HomeScreen from '@/components/Screens/HomeScreen';
import BrowseScreen from '@/components/Screens/BrowseScreen';
import CartScreen from '@/components/Screens/CartScreen';
import ProfileScreen from '@/components/Screens/ProfileScreen';
import AdminDashboard from '@/components/Screens/AdminDashboard';

const AppContent = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'cart' | 'profile' | 'admin'>('home');
  const [browseFilters, setBrowseFilters] = useState<any>(null);

  const handleNavigateToBrowse = (filters: any) => {
    setBrowseFilters(filters);
    setActiveTab('browse');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigateToBrowse={handleNavigateToBrowse} />;
      case 'browse':
        return <BrowseScreen initialFilters={browseFilters} />;
      case 'cart':
        return <CartScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin':
        // Only show Admin dashboard for sellers
        if (user?.userType === 'seller') {
          return <AdminDashboard />;
        }
        // Fallback to home if customer tries to access admin
        return <HomeScreen onNavigateToBrowse={handleNavigateToBrowse} />;
      default:
        return <HomeScreen onNavigateToBrowse={handleNavigateToBrowse} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto border-x border-border">
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
