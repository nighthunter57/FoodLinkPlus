import React from 'react';
import { Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicPriceDisplay } from '@/components/ui/DynamicPriceDisplay';
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
              <Badge variant="destructive">-{item.discountPercentage}%</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{restaurant?.name}</p>
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Clock size={12} className="mr-1" />
              <span>{restaurant?.estimatedTime}</span>
              <Star size={12} className="ml-2 mr-1" />
              <span>{restaurant?.rating}</span>
            </div>
            <div className="flex justify-between items-center">
              <DynamicPriceDisplay item={item} />
              {/* Add to cart button can be added here if needed */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
