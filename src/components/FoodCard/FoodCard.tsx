import React from 'react';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Restaurant, SurpriseBag } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';

interface FoodCardProps {
  restaurant: Restaurant;
  bag: SurpriseBag;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ 
  restaurant, 
  bag, 
  isFavorite = false, 
  onToggleFavorite 
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(bag.id);
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isFavorite
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/80 text-foreground hover:bg-card'
          }`}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        {bag.stock <= 3 && (
          <Badge className="absolute top-3 left-3 bg-warning text-warning-foreground">
            {bag.stock} left
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>⭐</span>
            <span>{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin size={14} />
          <span>{restaurant.distance} mi</span>
        </div>
        
        <div className="mb-3">
          <Badge variant="secondary" className="mb-2">
            {bag.title}
          </Badge>
          <p className="text-sm text-muted-foreground">{bag.description}</p>
        </div>
        
        <div className="flex items-center gap-2 mb-3 text-sm">
          <Clock size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">
            Pick up today {bag.pickupStart} - {bag.pickupEnd}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ${bag.discountedPrice.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${bag.originalPrice.toFixed(2)}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart} 
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
            disabled={bag.stock === 0}
          >
            {bag.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCard;