import React from 'react';
import { Star, MapPin, Clock, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewMenu?: (restaurant: Restaurant) => void;
  className?: string;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onViewMenu,
  className = ''
}) => {
  const getInventoryColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInventoryIcon = (level: string) => {
    switch (level) {
      case 'high': return '🟢';
      case 'medium': return '🟡';
      case 'low': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Deals Badge */}
        {restaurant.deals && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-accent text-accent-foreground text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Deals
            </Badge>
          </div>
        )}

        {/* Inventory Level */}
        <div className="absolute top-2 right-2">
          <Badge className={`text-xs ${getInventoryColor(restaurant.inventoryLevel)}`}>
            {getInventoryIcon(restaurant.inventoryLevel)} {restaurant.inventoryLevel}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Restaurant Info */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {restaurant.description}
          </p>
          
          {/* Cuisine and Rating */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {restaurant.cuisine}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>
          </div>
        </div>

        {/* Location and Time Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.distance} mi</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{restaurant.estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Closes {restaurant.closingTime}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full" 
          onClick={() => onViewMenu?.(restaurant)}
        >
          View Menu
        </Button>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
