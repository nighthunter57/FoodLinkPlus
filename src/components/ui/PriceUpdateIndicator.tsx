import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PriceUpdateIndicatorProps {
  lastUpdated: Date | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const PriceUpdateIndicator: React.FC<PriceUpdateIndicatorProps> = ({
  lastUpdated,
  onRefresh,
  isRefreshing = false
}) => {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never updated';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock size={12} />
        <span>Prices updated {formatLastUpdated(lastUpdated)}</span>
      </div>
      
      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw size={12} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      )}
      
      <Badge variant="outline" className="text-xs">
        Live Pricing
      </Badge>
    </div>
  );
};
