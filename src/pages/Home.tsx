import React from 'react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import HomeConcierge from '@/components/Screens/HomeConcierge';

const Home: React.FC = () => {
  // Feature flag for concierge - set to false for placeholder
  const isConciergeEnabled = false;

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      <div className="flex-1 overflow-hidden">
        {isConciergeEnabled ? (
          <HomeConcierge />
        ) : (
          // Blank placeholder per specification
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="mb-8">
              {/* Mock wireframe of Home layout */}
              <div className="w-64 h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center mb-4">
                <div className="w-12 h-12 bg-muted rounded-full mb-2"></div>
                <div className="w-32 h-4 bg-muted rounded mb-2"></div>
                <div className="w-40 h-4 bg-muted rounded"></div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Home concierge coming soon
            </h2>
            <p className="text-muted-foreground">
              Your waiter will be ready here.
            </p>
          </div>
        )}
      </div>
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default Home;