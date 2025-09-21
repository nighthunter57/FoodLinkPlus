import React from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { TransactionService } from '@/services/transactionService';

interface TransactionAnalyticsProps {
  className?: string;
}

export const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({ className }) => {
  const { transactionHistory, menuItems } = useApp();
  const transactionService = TransactionService.getInstance();

  // Calculate analytics
  const totalTransactions = transactionHistory.length;
  const totalRevenue = transactionService.getTotalRevenue();
  const popularItems = transactionService.getPopularItems(3);

  // Get demand scores for all items
  const itemDemandScores = menuItems.map(item => ({
    item,
    demandScore: transactionService.getDemandScore(item.id),
    relativeDemand: transactionService.getRelativeDemandScore(item.id, menuItems)
  })).sort((a, b) => b.demandScore - a.demandScore);

  const highDemandItems = itemDemandScores.filter(item => item.relativeDemand > 0.7);
  const lowDemandItems = itemDemandScores.filter(item => item.relativeDemand < 0.3);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="text-success" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="text-success" size={18} />
            Popular Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {popularItems.map((item, index) => {
              const menuItem = menuItems.find(m => m.id === item.menuItemId);
              if (!menuItem) return null;

              return (
                <div key={item.menuItemId} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{menuItem.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{item.totalQuantity} sold</p>
                    <p className="text-xs text-muted-foreground">{item.purchaseCount} orders</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Demand Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demand Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* High Demand Items */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-success" size={16} />
                <span className="text-sm font-medium">High Demand (Prices Rising)</span>
              </div>
              <div className="space-y-1">
                {highDemandItems.slice(0, 3).map(({ item, relativeDemand }) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{item.name}</span>
                    <Badge variant="destructive" className="text-xs">
                      +{Math.round(relativeDemand * 100)}% demand
                    </Badge>
                  </div>
                ))}
                {highDemandItems.length === 0 && (
                  <p className="text-xs text-muted-foreground">No high demand items</p>
                )}
              </div>
            </div>

            {/* Low Demand Items */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="text-destructive" size={16} />
                <span className="text-sm font-medium">Low Demand (Prices Falling)</span>
              </div>
              <div className="space-y-1">
                {lowDemandItems.slice(0, 3).map(({ item, relativeDemand }) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{item.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      -{Math.round((1 - relativeDemand) * 100)}% demand
                    </Badge>
                  </div>
                ))}
                {lowDemandItems.length === 0 && (
                  <p className="text-xs text-muted-foreground">No low demand items</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users size={18} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactionHistory.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Order #{transaction.id.slice(-6)}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${transaction.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{transaction.items.length} items</p>
                </div>
              </div>
            ))}
            {transactionHistory.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No transactions yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
