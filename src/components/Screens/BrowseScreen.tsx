import React, { useState } from 'react';
import { Search, Filter, MapPin, Grid, Map, Star, Clock, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { DynamicPriceDisplay } from '@/components/ui/DynamicPriceDisplay';
import FoodListingCard from '@/components/ui/FoodListingCard';
import { MenuItem, Restaurant, FoodListing } from '@/types';

const BrowseScreen = ({ initialFilters }: { initialFilters?: any }) => {
  const { addToCart, menuItems, restaurants, foodListings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapView, setIsMapView] = useState(false);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'listings'>('restaurants');
  const [filters, setFilters] = useState({
    cuisine: '',
    dietary: initialFilters?.dietary || '',
    priceRange: initialFilters?.budget || '',
    distance: '',
    deals: initialFilters?.deals || false,
    mealType: initialFilters?.mealType || '',
    peopleCount: initialFilters?.peopleCount || ''
  });

  const filteredItems = menuItems.filter(item => {
    const restaurant = restaurants.find(r => r.id === item.restaurantId);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply dietary filters
    const matchesDietary = !filters.dietary || 
      item.dietary.some(diet => diet.toLowerCase().includes(filters.dietary.toLowerCase()));
    
    // Apply price range filters
    const matchesPrice = !filters.priceRange || (() => {
      const price = item.dynamicPricing?.currentPrice || item.discountedPrice;
      switch (filters.priceRange) {
        case 'Under $15': return price < 15;
        case '$15-25': return price >= 15 && price <= 25;
        case '$25-40': return price >= 25 && price <= 40;
        case '$40+': return price > 40;
        default: return true;
      }
    })();
    
    // Apply meal type filters
    const matchesMealType = !filters.mealType || 
      item.category.toLowerCase().includes(filters.mealType.toLowerCase());
    
    // Apply deals filter
    const matchesDeals = !filters.deals || item.discountPercentage > 20;
    
    return matchesSearch && item.available && matchesDietary && matchesPrice && matchesMealType && matchesDeals;
  });

  const filteredListings = foodListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply dietary filters
    const matchesDietary = !filters.dietary || 
      listing.dietary.some(diet => diet.toLowerCase().includes(filters.dietary.toLowerCase()));
    
    // Apply price range filters
    const matchesPrice = !filters.priceRange || (() => {
      const price = listing.discountedPrice;
      switch (filters.priceRange) {
        case 'Under $15': return price < 15;
        case '$15-25': return price >= 15 && price <= 25;
        case '$25-40': return price >= 25 && price <= 40;
        case '$40+': return price > 40;
        default: return true;
      }
    })();
    
    // Apply meal type filters
    const matchesMealType = !filters.mealType || 
      listing.category.toLowerCase().includes(filters.mealType.toLowerCase());
    
    // Apply deals filter
    const matchesDeals = !filters.deals || listing.discountPercentage > 20;
    
    return matchesSearch && listing.available && matchesDietary && matchesPrice && matchesMealType && matchesDeals;
  });

  const handleAddToCart = (item: MenuItem) => {
    const restaurant = restaurants.find(r => r.id === item.restaurantId);
    if (restaurant) {
      addToCart({
        menuItem: item,
        restaurant,
        quantity: 1
      });
    }
  };

  const handleAddListingToCart = (listing: FoodListing) => {
    // For now, we'll create a mock menu item from the listing
    // In a real app, you'd have a proper conversion or separate cart handling
    const mockMenuItem: MenuItem = {
      id: listing.id,
      restaurantId: listing.sellerId,
      name: listing.title,
      description: listing.description,
      image: listing.images[0],
      originalPrice: listing.originalPrice,
      discountedPrice: listing.discountedPrice,
      discountPercentage: listing.discountPercentage,
      category: listing.category,
      dietary: listing.dietary,
      available: listing.available,
      timeLeft: listing.timeLeft,
      dynamicPricing: {
        basePrice: listing.originalPrice,
        currentPrice: listing.discountedPrice,
        priceHistory: [],
        demandLevel: 'medium',
        surplusLevel: 'medium',
        urgencyMultiplier: 0.5,
        expiryDate: listing.aiAnalysis?.estimatedExpiry || new Date(),
        closingTime: new Date(),
        lastUpdated: new Date()
      }
    };

    const mockRestaurant: Restaurant = {
      id: listing.sellerId,
      name: 'Local Seller',
      image: listing.images[0],
      cuisine: 'Local',
      rating: 4.5,
      distance: 0.5,
      deals: true,
      estimatedTime: '15-20 min',
      description: 'Local food seller',
      closingTime: '22:00',
      timezone: 'America/New_York',
      inventoryLevel: 'medium',
      nearbyStores: []
    };

    addToCart({
      menuItem: mockMenuItem,
      restaurant: mockRestaurant,
      quantity: 1
    });
  };

  const urgentItems = filteredItems.filter(item => {
    const timeLeft = item.timeLeft;
    return timeLeft && (timeLeft.includes('hour') || timeLeft.includes('minutes'));
  });

  const dealItems = filteredItems.filter(item => item.discountPercentage > 25);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Browse</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={isMapView ? "outline" : "default"}
              size="sm"
              onClick={() => setIsMapView(false)}
            >
              <Grid size={16} className="mr-1" />
              List
            </Button>
            <Button
              variant={isMapView ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMapView(true)}
            >
              <Map size={16} className="mr-1" />
              Map
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search restaurants, cuisines, or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" />
            Filters
          </Button>
          {filters.dietary && (
            <Button variant="default" size="sm" className="bg-accent">
              {filters.dietary}
            </Button>
          )}
          {filters.priceRange && (
            <Button variant="default" size="sm" className="bg-accent">
              {filters.priceRange}
            </Button>
          )}
          {filters.mealType && (
            <Button variant="default" size="sm" className="bg-accent">
              {filters.mealType}
            </Button>
          )}
          {filters.deals && (
            <Button variant="default" size="sm" className="bg-accent">
              Deals
            </Button>
          )}
          <Button variant="outline" size="sm">Distance</Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isMapView ? (
          <div className="h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <Map size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Map view coming soon!</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'restaurants' | 'listings')} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="restaurants" className="flex items-center space-x-2">
                  <Grid className="h-4 w-4" />
                  <span>Restaurants</span>
                </TabsTrigger>
                <TabsTrigger value="listings" className="flex items-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Food Listings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="restaurants" className="space-y-6">
            {/* Quick Pickup Section */}
            {urgentItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">⚡</span>
                  <h2 className="font-semibold text-foreground">Quick Pickup</h2>
                  <Badge variant="secondary" className="bg-warning text-warning-foreground">
                    Ending Soon
                  </Badge>
                </div>
                <div className="space-y-3">
                  {urgentItems.slice(0, 3).map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCart}
                      urgent={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Hot Deals Section */}
            {dealItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🔥</span>
                  <h2 className="font-semibold text-foreground">Hot Deals</h2>
                </div>
                <div className="space-y-3">
                  {dealItems.slice(0, 4).map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Items */}
            <div>
              <h2 className="font-semibold text-foreground mb-3">All Available</h2>
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
              </TabsContent>

              <TabsContent value="listings" className="space-y-6">
                {/* Fresh Listings Section */}
                {filteredListings.filter(l => l.freshnessScore >= 8).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">✨</span>
                      <h2 className="font-semibold text-foreground">Fresh & High Quality</h2>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Excellent Quality
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredListings
                        .filter(l => l.freshnessScore >= 8)
                        .slice(0, 4)
                        .map((listing) => (
                          <FoodListingCard
                            key={listing.id}
                            listing={listing}
                            onAddToCart={handleAddListingToCart}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* All Food Listings */}
                <div>
                  <h2 className="font-semibold text-foreground mb-3">All Food Listings</h2>
                  {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredListings.map((listing) => (
                        <FoodListingCard
                          key={listing.id}
                          listing={listing}
                          onAddToCart={handleAddListingToCart}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No food listings found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or check back later for new listings.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  urgent?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, urgent = false }) => {
  const { restaurants } = useApp();
  const restaurant = restaurants.find(r => r.id === item.restaurantId);

  return (
    <Card className={`overflow-hidden ${urgent ? 'border-warning' : ''}`}>
      <CardContent className="p-0">
        <div className="flex">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 object-cover"
          />
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{restaurant?.name}</span>
                  <div className="flex items-center">
                    <Star size={12} className="fill-current" />
                    <span>{restaurant?.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={12} />
                    <span>{restaurant?.distance} mi</span>
                  </div>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={urgent ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'}
              >
                {item.discountPercentage}% off
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center gap-1 mb-2">
              {item.dietary.map((diet) => (
                <Badge key={diet} variant="outline" className="text-xs">
                  {diet === 'vegetarian' && '🌱'}
                  {diet === 'vegan' && '🌿'}
                  {diet === 'gluten-free' && '🌾'}
                  {diet}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <DynamicPriceDisplay item={item} size="sm" />
              
              <Button 
                size="sm" 
                onClick={() => onAddToCart(item)}
                className="bg-accent hover:bg-accent/90"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowseScreen;