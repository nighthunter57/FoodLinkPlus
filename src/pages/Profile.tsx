import React from 'react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import ProfileScreen from '@/components/Screens/ProfileScreen';

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      <div className="flex-1 overflow-hidden">
        <ProfileScreen />
      </div>
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default Profile;