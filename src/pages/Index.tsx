import React, { useState } from 'react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import HomeScreen from '@/components/Screens/HomeScreen';
import BrowseScreen from '@/components/Screens/BrowseScreen';
import CartScreen from '@/components/Screens/CartScreen';
import ProfileScreen from '@/components/Screens/ProfileScreen';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'cart' | 'profile'>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'browse':
        return <BrowseScreen />;
      case 'cart':
        return <CartScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
