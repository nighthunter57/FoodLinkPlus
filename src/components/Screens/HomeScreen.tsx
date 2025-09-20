import React, { useState } from 'react';
import { Search, Filter, MapPin, List, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FoodCard from '@/components/FoodCard/FoodCard';
import { mockRestaurants, mockUser } from '@/data/mockData';

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState('relevance');

  const allBags = mockRestaurants.flatMap(restaurant => 
    restaurant.surpriseBags.map(bag => ({ restaurant, bag }))
  );

  const filteredBags = allBags.filter(({ restaurant, bag }) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Current location: Southampton, Houston</span>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12"
          />
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Filter size={16} />
          </Button>
        </div>
        
        {/* View Toggle and Sort */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} className="mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map size={16} className="mr-1" />
              Map
            </Button>
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {viewMode === 'list' ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Available Surprise Bags
            </h2>
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
                <p className="text-muted-foreground">No surprise bags found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or location</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Map view coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;