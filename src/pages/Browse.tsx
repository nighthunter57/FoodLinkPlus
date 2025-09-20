import React, { useState } from 'react';
import { Search, Filter, MapPin, List, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import DonationCard from '@/components/FoodCard/DonationCard';
import FilterModal from '@/components/Modals/FilterModal';
import { getAllDonations, getRestaurantById, categories } from '@/data/mockData';

const Browse: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    distance: 'all',
    dietary: [] as string[],
    expiry: 'any',
    price: 'all'
  });

  const donations = getAllDonations();
  
  // Apply filters and search
  const filteredDonations = donations.filter(donation => {
    const restaurant = getRestaurantById(donation.restaurantId);
    if (!restaurant) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!restaurant.name.toLowerCase().includes(query) && 
          !donation.title.toLowerCase().includes(query) &&
          !donation.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Dietary filter
    if (filters.dietary.length > 0) {
      const hasMatchingDietary = filters.dietary.some(diet => 
        donation.tags.some(tag => tag.includes(diet))
      );
      if (!hasMatchingDietary) return false;
    }

    // Expiry filter
    if (filters.expiry !== 'any') {
      const now = new Date();
      const expiry = new Date(donation.expiry);
      const hoursUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (filters.expiry === '<2h' && hoursUntilExpiry >= 2) return false;
      if (filters.expiry === '<6h' && hoursUntilExpiry >= 6) return false;
    }

    // Price filter
    if (filters.price === 'free') {
      const hasFreeItems = donation.items.some(item => !item.discountedPrice || item.discountedPrice === 0);
      if (!hasFreeItems) return false;
    }

    return true;
  });

  // Get recommended donations (from user favorites - simplified for demo)
  const recommendedDonations = filteredDonations.slice(0, 2);

  // Get urgent donations (expiring soon)
  const urgentDonations = filteredDonations.filter(donation => {
    const now = new Date();
    const expiry = new Date(donation.expiry);
    const hoursUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilExpiry <= 2;
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
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
            placeholder="Search food or restaurants…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowFilters(true)}
          >
            <Filter size={16} />
          </Button>
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
            Distance
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
            Dietary
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
            Expiry
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
            Price
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
              List view
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map size={16} className="mr-1" />
              Map view
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
          <div className="space-y-6">
            {/* Recommended Section */}
            {recommendedDonations.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Recommended for you
                </h2>
                <div className="space-y-4">
                  {recommendedDonations.map(donation => (
                    <DonationCard key={donation.id} donation={donation} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Urgent Section */}
            {urgentDonations.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Save before it's too late
                </h2>
                <div className="space-y-4">
                  {urgentDonations.map(donation => (
                    <DonationCard key={donation.id} donation={donation} isUrgent />
                  ))}
                </div>
              </div>
            )}
            
            {/* All Items */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                All available donations
              </h2>
              <div className="space-y-4">
                {filteredDonations.map(donation => (
                  <DonationCard key={donation.id} donation={donation} />
                ))}
                {filteredDonations.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No donations found nearby. Check back later or adjust filters.</p>
                  </div>
                )}
              </div>
            </div>
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
      
      <BottomNavigation activeTab="browse" />
      
      {showFilters && (
        <FilterModal
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default Browse;