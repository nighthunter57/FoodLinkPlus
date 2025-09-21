import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { DynamicPriceDisplay } from './DynamicPriceDisplay';

interface PriceChangeDemoProps {
  className?: string;
}

export const PriceChangeDemo: React.FC<PriceChangeDemoProps> = ({ className }) => {
  const { menuItems, transactionHistory } = useApp();
  const [showDemo, setShowDemo] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Get items that have been purchased recently
  const recentlyPurchasedItems = menuItems.filter(item => {
    const recentPurchases = transactionHistory.filter(tx => 
      tx.items.some(cartItem => cartItem.menuItem.id === item.id) &&
      tx.timestamp > new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
    );
    return recentPurchases.length > 0;
  });

  // Get items that haven't been purchased recently
  const unpurchasedItems = menuItems.filter(item => 
    !recentlyPurchasedItems.some(purchased => purchased.id === item.id)
  );

  const handleDemoCheckout = () => {
    setShowDemo(true);
    setSelectedItems(recentlyPurchasedItems.slice(0, 2).map(item => item.id));
    
    // Reset demo after 5 seconds
    setTimeout(() => {
      setShowDemo(false);
      setSelectedItems([]);
    }, 5000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingCart size={18} />
            Dynamic Pricing Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              See how prices change based on demand! Items that are purchased become more expensive,
              while unpurchased items become cheaper.
            </p>
            
            <Button onClick={handleDemoCheckout} className="w-full">
              Simulate Checkout Impact
            </Button>

            {showDemo && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="text-success" size={16} />
                  <span>After Checkout - Prices Updated!</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Recently Purchased Items (Higher Prices) */}
                  <div>
                    <p className="text-xs font-medium text-success mb-2">Purchased Items (Higher Demand)</p>
                    <div className="space-y-2">
                      {recentlyPurchasedItems.slice(0, 2).map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-success/10 rounded border border-success/20">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="text-success" size={14} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <DynamicPriceDisplay item={item} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unpurchased Items (Lower Prices) */}
                  <div>
                    <p className="text-xs font-medium text-destructive mb-2">Unpurchased Items (Lower Demand)</p>
                    <div className="space-y-2">
                      {unpurchasedItems.slice(0, 2).map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded border border-destructive/20">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="text-destructive" size={14} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <DynamicPriceDisplay item={item} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  💡 This demonstrates how the dynamic pricing system responds to real purchase behavior!
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Live Price Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">{recentlyPurchasedItems.length}</p>
                <p className="text-xs text-muted-foreground">Items with High Demand</p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg">
                <p className="text-2xl font-bold text-destructive">{unpurchasedItems.length}</p>
                <p className="text-xs text-muted-foreground">Items with Low Demand</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Prices update every 10 seconds based on purchase patterns
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
