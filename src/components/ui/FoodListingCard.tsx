import React, { useState } from 'react';
import { Star, Clock, MapPin, Heart, Share2, Eye, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FoodListing } from '@/types';

interface FoodListingCardProps {
  listing: FoodListing;
  onAddToCart?: (listing: FoodListing) => void;
  onViewDetails?: (listing: FoodListing) => void;
  className?: string;
}

export const FoodListingCard: React.FC<FoodListingCardProps> = ({
  listing,
  onAddToCart,
  onViewDetails,
  className = ''
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleImageClick = () => {
    if (onViewDetails) {
      onViewDetails(listing);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(listing);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href
      });
    }
  };

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimeLeft = (timeLeft?: string) => {
    if (!timeLeft) return 'Available';
    if (timeLeft === 'Expired') return 'Expired';
    return `Expires in ${timeLeft}`;
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
      <div className="relative" onClick={handleImageClick}>
        {/* Image Carousel */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}

          {/* Discount Badge */}
          {listing.discountPercentage > 0 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-accent text-accent-foreground">
                {listing.discountPercentage}% off
              </Badge>
            </div>
          )}

          {/* Freshness Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={`text-xs ${getFreshnessColor(listing.aiAnalysis?.freshness || 'fair')}`}>
              {listing.freshnessScore}/10
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col space-y-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleLike}
            >
              <Heart 
                size={16} 
                className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
              />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 size={16} className="text-gray-600" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Category */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-foreground line-clamp-2">
              {listing.title}
            </h3>
            <Badge variant="outline" className="ml-2 text-xs">
              {listing.category}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {listing.description}
          </p>

          {/* Dietary Information */}
          {listing.dietary && listing.dietary.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {listing.dietary.slice(0, 3).map((diet) => (
                <Badge key={diet} variant="secondary" className="text-xs">
                  {diet}
                </Badge>
              ))}
              {listing.dietary.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{listing.dietary.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">
                ${listing.discountedPrice.toFixed(2)}
              </span>
              {listing.originalPrice > listing.discountedPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${listing.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{listing.freshnessScore}/10</span>
            </div>
          </div>

          {/* Time Left */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTimeLeft(listing.timeLeft)}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>0.5 mi</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) onViewDetails(listing);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!listing.available}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default FoodListingCard;
