import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import HomeScreen from '@/components/Screens/HomeScreen';
import BrowseScreen from '@/components/Screens/BrowseScreen';
import CartScreen from '@/components/Screens/CartScreen';
import ProfileScreen from '@/components/Screens/ProfileScreen';
import AdminDashboard from '@/components/Screens/AdminDashboard';
import CreateListingScreen from '@/components/Screens/CreateListingScreen';
import { FoodListing } from '@/types';

const AppContent = () => {
  const { user, addFoodListing } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'cart' | 'profile' | 'admin'>('home');
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [browseFilters, setBrowseFilters] = useState<any>(null);

  const handleNavigateToBrowse = (filters: any) => {
    setBrowseFilters(filters);
    setActiveTab('browse');
  };

  const handleListingCreated = (listing: FoodListing) => {
    addFoodListing(listing);
    setShowCreateListing(false); // Close the create listing screen
    setActiveTab('home'); // Navigate back to home after creating listing
  };

  // Auto-redirect restaurant users to admin dashboard after sign-in
  useEffect(() => {
    if (user?.userType === 'seller' && activeTab !== 'admin') {
      setActiveTab('admin');
    }
  }, [user?.userType, activeTab]);

  const renderScreen = () => {
    // Show create listing screen if it's active
    if (showCreateListing) {
      return <CreateListingScreen onBack={() => setShowCreateListing(false)} onListingCreated={handleListingCreated} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigateToBrowse={handleNavigateToBrowse} onNavigateToCreateListing={() => setShowCreateListing(true)} />;
      case 'browse':
        return <BrowseScreen initialFilters={browseFilters} />;
      case 'cart':
        return <CartScreen />;
      case 'profile':
        return <ProfileScreen onNavigateToCreateListing={() => setShowCreateListing(true)} />;
      case 'admin':
        // Only show Admin dashboard for sellers
        if (user?.userType === 'seller') {
          return <AdminDashboard />;
        }
        // Fallback to home if customer tries to access admin
        return <HomeScreen onNavigateToBrowse={handleNavigateToBrowse} onNavigateToCreateListing={() => setShowCreateListing(true)} />;
      default:
        return <HomeScreen onNavigateToBrowse={handleNavigateToBrowse} onNavigateToCreateListing={() => setShowCreateListing(true)} />;
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
