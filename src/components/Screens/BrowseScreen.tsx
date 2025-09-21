import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Grid, Map, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { DynamicPriceDisplay } from '@/components/ui/DynamicPriceDisplay';
import { MenuItem, Restaurant } from '@/types';

const BrowseScreen = ({ initialFilters }: { initialFilters?: any }) => {
  const { addToCart, setMenuItems , restaurants } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMapView, setIsMapView] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: '',
    dietary: initialFilters?.dietary || '',
    priceRange: initialFilters?.budget || '',
    distance: '',
    deals: initialFilters?.deals || false,
    mealType: initialFilters?.mealType || '',
    peopleCount: initialFilters?.peopleCount || ''
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('http://localhost:4000/restaurants');
        const restaurants = await res.json();

        // Flatten listings and add restaurant info
        const allItems: MenuItem[] = restaurants.flatMap((r: any) =>
          r.listings.map((listing: any) => ({
            ...listing,
            restaurantId: r.id,
            restaurantName: r.name,
          }))
        );

        // Take first 50 items
        const first50 = allItems.slice(0, 50);
        setListings(first50);
        setMenuItems(first50); // if your app context needs it
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div>Loading listings...</div>;

  const filteredItems = listings.filter(item => {
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
          <div className="p-4 space-y-6">
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