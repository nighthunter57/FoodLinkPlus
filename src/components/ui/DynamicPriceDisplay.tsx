import React from 'react';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '@/types';

interface DynamicPriceDisplayProps {
  item: MenuItem;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DynamicPriceDisplay: React.FC<DynamicPriceDisplayProps> = ({ 
  item, 
  showDetails = false, 
  size = 'md' 
}) => {
  const { dynamicPricing } = item;
  const currentPrice = dynamicPricing.currentPrice;
  const originalPrice = item.originalPrice;
  const discountPercentage = ((originalPrice - currentPrice) / originalPrice) * 100;

  // Calculate price change from history
  const priceHistory = dynamicPricing.priceHistory;
  const hasPriceChange = priceHistory.length >= 2;
  const previousPrice = hasPriceChange ? priceHistory[priceHistory.length - 2].price : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = hasPriceChange ? (priceChange / previousPrice) * 100 : 0;

  // Determine urgency level
  const urgencyLevel = dynamicPricing.urgencyMultiplier;
  const isUrgent = urgencyLevel >= 0.7;
  const isModeratelyUrgent = urgencyLevel >= 0.4;

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <div className="space-y-2">
      {/* Main Price Display */}
      <div className="flex items-center gap-2">
        <span className={`font-bold text-primary ${sizeClasses[size]}`}>
          ${currentPrice.toFixed(2)}
        </span>
        
        {originalPrice > currentPrice && (
          <span className="text-sm text-muted-foreground line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}

        {/* Price Change Indicator */}
        {hasPriceChange && Math.abs(priceChange) > 0.01 && (
          <div className={`flex items-center gap-1 ${
            priceChange > 0 ? 'text-destructive' : 'text-success'
          }`}>
            {priceChange > 0 ? (
              <TrendingUp size={iconSizes[size]} />
            ) : (
              <TrendingDown size={iconSizes[size]} />
            )}
            <span className="text-xs font-medium">
              {Math.abs(priceChangePercent).toFixed(1)}%
            </span>
          </div>
        )}

        {/* Urgency Badge */}
        {isUrgent && (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle size={10} className="mr-1" />
            Urgent
          </Badge>
        )}
        {isModeratelyUrgent && !isUrgent && (
          <Badge variant="secondary" className="text-xs bg-warning text-warning-foreground">
            <Clock size={10} className="mr-1" />
            Soon
          </Badge>
        )}
      </div>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <Badge variant="secondary" className="bg-accent text-accent-foreground">
          {discountPercentage.toFixed(0)}% off
        </Badge>
      )}

      {/* Detailed Information */}
      {showDetails && (
        <Card className="mt-2">
          <CardContent className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <DollarSign size={12} />
                <span>Base: ${dynamicPricing.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} />
                <span>Demand: {dynamicPricing.demandLevel}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown size={12} />
                <span>Surplus: {dynamicPricing.surplusLevel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>Urgency: {(urgencyLevel * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            {/* Price History Chart (Simple) */}
            {priceHistory.length > 1 && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">Price Trend</div>
                <div className="flex items-end gap-1 h-8">
                  {priceHistory.slice(-5).map((point, index) => {
                    const maxPrice = Math.max(...priceHistory.slice(-5).map(p => p.price));
                    const minPrice = Math.min(...priceHistory.slice(-5).map(p => p.price));
                    const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 100;
                    
                    return (
                      <div
                        key={index}
                        className="bg-primary/30 rounded-sm flex-1"
                        style={{ height: `${Math.max(height, 10)}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Last updated: {dynamicPricing.lastUpdated.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
