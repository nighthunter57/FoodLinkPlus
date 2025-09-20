import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FoodCard from '@/components/FoodCard/FoodCard';
import { mockRestaurants, mockUser, categories } from '@/data/mockData';

const BrowseScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allBags = mockRestaurants.flatMap(restaurant => 
    restaurant.surpriseBags.map(bag => ({ restaurant, bag }))
  );

  const filteredBags = selectedCategory === 'all' 
    ? allBags 
    : allBags.filter(({ bag }) => 
        bag.category.toLowerCase().replace(' & ', '-').replace(' ', '-') === selectedCategory
      );

  const recommendedBags = allBags.filter(({ restaurant }) => 
    mockUser.favorites.includes(restaurant.id)
  );

  const urgentBags = allBags.filter(({ bag }) => bag.stock <= 2);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Current location: Southampton, Houston</span>
        </div>
        
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {/* Recommended Section */}
        {recommendedBags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recommended for you
            </h2>
            <div className="space-y-4">
              {recommendedBags.slice(0, 2).map(({ restaurant, bag }) => (
                <FoodCard
                  key={bag.id}
                  restaurant={restaurant}
                  bag={bag}
                  isFavorite={mockUser.favorites.includes(restaurant.id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Urgent Section */}
        {urgentBags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Save before it's too late
            </h2>
            <div className="space-y-4">
              {urgentBags.map(({ restaurant, bag }) => (
                <FoodCard
                  key={bag.id}
                  restaurant={restaurant}
                  bag={bag}
                  isFavorite={mockUser.favorites.includes(restaurant.id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* All Items in Category */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {selectedCategory === 'all' 
              ? 'All available bags' 
              : `${categories.find(c => c.id === selectedCategory)?.name} bags`
            }
          </h2>
          <div className="space-y-4">
            {filteredBags.map(({ restaurant, bag }) => (
              <FoodCard
                key={bag.id}
                restaurant={restaurant}
                bag={bag}
                isFavorite={mockUser.favorites.includes(restaurant.id)}
              />
            ))}
            {filteredBags.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bags found in this category</p>
                <p className="text-sm text-muted-foreground mt-1">Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseScreen;