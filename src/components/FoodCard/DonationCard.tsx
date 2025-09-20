import React, { useState } from 'react';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Donation, getRestaurantById } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import ReserveModal from '@/components/Modals/ReserveModal';

interface DonationCardProps {
  donation: Donation;
  isUrgent?: boolean;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation, isUrgent = false }) => {
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  
  const restaurant = getRestaurantById(donation.restaurantId);
  if (!restaurant) return null;

  // Calculate time until expiry
  const now = new Date();
  const expiry = new Date(donation.expiry);
  const hoursUntilExpiry = Math.max(0, (expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
  const minutesUntilExpiry = Math.max(0, (expiry.getTime() - now.getTime()) / (1000 * 60));

  const formatTimeLeft = () => {
    if (hoursUntilExpiry < 1) {
      return `${Math.floor(minutesUntilExpiry)}m left`;
    }
    return `${Math.floor(hoursUntilExpiry)}h ${Math.floor(minutesUntilExpiry % 60)}m left`;
  };

  const getLowestPrice = () => {
    const prices = donation.items
      .map(item => item.discountedPrice)
      .filter(price => price !== undefined) as number[];
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const lowestPrice = getLowestPrice();

  return (
    <>
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={donation.photoUrl}
            alt={`${restaurant.name} - ${donation.title}`}
            className="w-full h-48 object-cover"
          />
          
          {/* Top left badge */}
          {restaurant.isVerified && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
              Verified
            </Badge>
          )}
          {restaurant.isPopular && !restaurant.isVerified && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs">
              Popular
            </Badge>
          )}
          
          {/* Heart icon */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/80 text-foreground hover:bg-card'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <CardContent className="p-4">
          {/* Restaurant info row */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground">{restaurant.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star size={14} fill="currentColor" className="text-warning" />
              <span>{restaurant.rating}</span>
              <span className="mx-1">•</span>
              <MapPin size={12} />
              <span>{restaurant.distance} mi</span>
            </div>
          </div>
          
          {/* Title line */}
          <div className="mb-2">
            <p className="font-medium text-foreground">{donation.title}</p>
            {donation.tags.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {donation.tags.join(', ')}
              </p>
            )}
          </div>
          
          {/* Meta info */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className={`flex items-center gap-1 ${
              hoursUntilExpiry <= 2 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <Clock size={14} />
              <span>{formatTimeLeft()}</span>
            </div>
            
            <span className="text-muted-foreground">
              {donation.remainingPortions} left
            </span>
            
            <span className="text-muted-foreground">
              Pickup {donation.pickupWindowStart}–{donation.pickupWindowEnd}
            </span>
          </div>

          {/* Price and action */}
          <div className="flex items-center justify-between">
            <div>
              {lowestPrice && (
                <span className="text-sm text-success font-medium">
                  From ${lowestPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {}}>
                Info
              </Button>
              <Button 
                onClick={() => setShowReserveModal(true)}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
                size="sm"
                disabled={donation.remainingPortions === 0}
              >
                {donation.remainingPortions === 0 ? 'Sold Out' : 'Reserve'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showReserveModal && (
        <ReserveModal
          donation={donation}
          restaurant={restaurant}
          onClose={() => setShowReserveModal(false)}
        />
      )}
    </>
  );
};

export default DonationCard;