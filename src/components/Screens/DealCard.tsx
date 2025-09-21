import React from 'react';
import { Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Restaurant } from '@/types';

interface DealCardProps {
  item: MenuItem;
  restaurant?: Restaurant;
}

export const DealCard: React.FC<DealCardProps> = ({ item, restaurant }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-1/3">
            <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
          </div>
          <div className="w-2/3 p-3">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
              <Badge variant="destructive">-{item.dynamicPricing ? Math.round(((item.originalPrice - item.dynamicPricing.currentPrice) / item.originalPrice) * 100) : item.discountPercentage}%</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{restaurant?.name}</p>
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Clock size={12} className="mr-1" />
              <span>{restaurant?.estimatedTime}</span>
              <Star size={12} className="ml-2 mr-1" />
              <span>{restaurant?.rating}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary text-sm">
                  ${item.dynamicPricing ? item.dynamicPricing.currentPrice.toFixed(2) : item.discountedPrice.toFixed(2)}
                </span>
                {item.originalPrice > (item.dynamicPricing ? item.dynamicPricing.currentPrice : item.discountedPrice) && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {/* Add to cart button can be added here if needed */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
