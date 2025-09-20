import React from 'react';

// Complete Home Concierge component (disabled by feature flag)
const HomeConcierge: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Good evening, Sarah</h1>
      </div>
      
      {/* Waiter Card */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm p-6 bg-card border border-border rounded-lg shadow-sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              🍽️
            </div>
            <h2 className="text-lg font-semibold mb-2">Hi — I'm your FoodLink server</h2>
            <p className="text-muted-foreground mb-4">How many people are you feeding?</p>
            
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">1</button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">2</button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">3</button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">4+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeConcierge;