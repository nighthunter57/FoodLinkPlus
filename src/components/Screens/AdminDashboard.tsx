import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, BarChart3, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { MenuItem } from '@/types';
import { TransactionAnalytics } from '@/components/ui/TransactionAnalytics';

const AdminDashboard = () => {
  const { menuItems, restaurants, refreshPrices, lastPriceUpdate } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [isLoading, setIsLoading] = useState(false);

  // Helper function for volatility calculation
  const calculateVolatility = (prices: number[]) => {
    if (prices.length < 2) return 0;
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance) / mean;
  };

  // Calculate price analytics - moved before early return
  const priceAnalytics = useMemo(() => {
    if (!menuItems || menuItems.length === 0) {
      console.log('No menu items available');
      return [];
    }
    
    const now = new Date();
    const timeframes = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };
    
    const cutoffTime = new Date(now.getTime() - timeframes[selectedTimeframe]);
    
    const analytics = menuItems.map(item => {
      // Add safety checks for dynamicPricing
      if (!item.dynamicPricing) {
        return {
          item,
          currentPrice: item.discountedPrice || item.originalPrice,
          basePrice: item.originalPrice,
          priceChange: 0,
          priceChangePercent: 0,
          volatility: 0,
          urgencyLevel: 0,
          demandLevel: 'low' as const,
          surplusLevel: 'medium' as const,
          recentHistory: [],
          restaurant: restaurants.find(r => r.id === item.restaurantId)
        };
      }
      
      const recentHistory = item.dynamicPricing.priceHistory?.filter(
        point => point.timestamp >= cutoffTime
      ) || [];
      
      const currentPrice = item.dynamicPricing.currentPrice || item.discountedPrice || item.originalPrice;
      const basePrice = item.dynamicPricing.basePrice || item.originalPrice;
      const priceChange = currentPrice - basePrice;
      const priceChangePercent = basePrice > 0 ? (priceChange / basePrice) * 100 : 0;
      
      const volatility = recentHistory.length > 1 ? 
        calculateVolatility(recentHistory.map(p => p.price)) : 0;
      
      const urgencyLevel = item.dynamicPricing.urgencyMultiplier || 0;
      const demandLevel = item.dynamicPricing.demandLevel || 'low';
      const surplusLevel = item.dynamicPricing.surplusLevel || 'medium';
      
      return {
        item,
        currentPrice,
        basePrice,
        priceChange,
        priceChangePercent,
        volatility,
        urgencyLevel,
        demandLevel,
        surplusLevel,
        recentHistory,
        restaurant: restaurants.find(r => r.id === item.restaurantId)
      };
    });
    
    return analytics.sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent));
  }, [menuItems, restaurants, selectedTimeframe]);

  // Debug logging
  console.log('AdminDashboard render:', { 
    menuItemsLength: menuItems?.length, 
    restaurantsLength: restaurants?.length,
    lastPriceUpdate 
  });

  // Add error boundary after hooks
  if (!menuItems || !restaurants) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 bg-card border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-destructive';
    if (change < 0) return 'text-success';
    return 'text-muted-foreground';
  };

  const getUrgencyBadge = (urgency: number) => {
    if (urgency >= 0.7) return <Badge variant="destructive">High Urgency</Badge>;
    if (urgency >= 0.4) return <Badge variant="secondary" className="bg-warning text-warning-foreground">Medium Urgency</Badge>;
    return <Badge variant="outline">Low Urgency</Badge>;
  };

  const getDemandBadge = (demand: string) => {
    const colors = {
      high: 'bg-success text-success-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-muted text-muted-foreground'
    };
    return <Badge variant="secondary" className={colors[demand as keyof typeof colors]}>{demand}</Badge>;
  };

  const getSurplusBadge = (surplus: string) => {
    const colors = {
      high: 'bg-success text-success-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-destructive text-destructive-foreground'
    };
    return <Badge variant="secondary" className={colors[surplus as keyof typeof colors]}>{surplus}</Badge>;
  };

  try {
    return (
      <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-medium text-foreground">Admin</h1>
            <p className="text-xs text-muted-foreground">
              Live listings & analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsLoading(true);
                refreshPrices();
                setTimeout(() => setIsLoading(false), 1000);
              }}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Badge variant="outline">
              {lastPriceUpdate ? `Updated ${lastPriceUpdate.toLocaleTimeString()}` : 'Never updated'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="listings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="listings">Live Listings</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="text-primary" size={14} />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Items</p>
                      <p className="text-sm font-medium">{menuItems?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-success" size={14} />
                    <div>
                      <p className="text-xs text-muted-foreground">Dynamic Pricing</p>
                      <p className="text-sm font-medium text-success">
                        {menuItems?.filter(item => item.dynamicPricing).length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="text-blue-500" size={14} />
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p className="text-sm font-medium text-blue-500">
                        {menuItems?.filter(item => item.available).length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" size={14} />
                    <div>
                      <p className="text-xs text-muted-foreground">Restaurants</p>
                      <p className="text-sm font-medium text-orange-500">
                        {restaurants?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Food Listings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-3 w-3" />
                  Live Food Listings
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  All food items across restaurants
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuItems && menuItems.length > 0 ? (
                    <div className="grid gap-3">
                      {menuItems.map((item, index) => {
                        const restaurant = restaurants?.find(r => r.id === item.restaurantId);
                        const currentPrice = item.dynamicPricing?.currentPrice || item.discountedPrice || item.originalPrice;
                        const priceChange = item.dynamicPricing ? 
                          ((currentPrice - (item.dynamicPricing.basePrice || item.originalPrice)) / (item.dynamicPricing.basePrice || item.originalPrice)) * 100 : 0;
                        
                        return (
                          <div key={item.id || index} className="border rounded-lg p-2 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-xs">{item.name}</h3>
                                  <Badge variant={item.dynamicPricing ? "default" : "secondary"} className="text-xs px-1 py-0">
                                    {item.dynamicPricing ? "Dynamic" : "Fixed"}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                  <div>
                                    <p className="text-muted-foreground text-xs">Restaurant</p>
                                    <p className="font-medium text-xs">{restaurant?.name || "Unknown"}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="text-muted-foreground text-xs">Current Price</p>
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium text-xs">${currentPrice.toFixed(2)}</span>
                                      {priceChange !== 0 && (
                                        <Badge 
                                          variant={priceChange > 0 ? "destructive" : "default"}
                                          className="text-xs px-1 py-0"
                                        >
                                          {priceChange > 0 ? "+" : ""}{priceChange.toFixed(1)}%
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="text-muted-foreground text-xs">Original Price</p>
                                    <p className="font-medium text-xs">${item.originalPrice.toFixed(2)}</p>
                                  </div>
                                </div>
                                
                                {item.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                    {item.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <span className="text-xs">Cat: {item.category}</span>
                                  {item.dietary && item.dietary.length > 0 && (
                                    <span className="text-xs">Diet: {item.dietary.join(", ")}</span>
                                  )}
                                  {item.dynamicPricing?.demandLevel && (
                                    <Badge variant="outline" className="text-xs px-1 py-0">
                                      {item.dynamicPricing.demandLevel}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="ml-2 flex flex-col items-end gap-1">
                                {item.image && (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Status</p>
                                  <Badge 
                                    variant={item.available ? "default" : "secondary"}
                                    className="text-xs px-1 py-0"
                                  >
                                    {item.available ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No food listings available</p>
                      <p className="text-sm text-muted-foreground">Check back later for updates</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            {/* Timeframe Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Time Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {(['1h', '6h', '24h', '7d'] as const).map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe(timeframe)}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Changes Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-success" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Price Increases</p>
                      <p className="text-2xl font-bold text-success">
                        {priceAnalytics.filter(a => a.priceChange > 0).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="text-destructive" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Price Decreases</p>
                      <p className="text-2xl font-bold text-destructive">
                        {priceAnalytics.filter(a => a.priceChange < 0).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-warning" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">High Urgency</p>
                      <p className="text-2xl font-bold text-warning">
                        {priceAnalytics.filter(a => a.urgencyLevel >= 0.7).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Items List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {priceAnalytics.map((analytics) => (
                    <div key={analytics.item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={analytics.item.image}
                          alt={analytics.item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{analytics.item.name}</h3>
                          <p className="text-sm text-muted-foreground">{analytics.restaurant?.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`font-bold ${getPriceChangeColor(analytics.priceChange)}`}>
                            ${analytics.currentPrice.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {analytics.priceChange > 0 ? '+' : ''}{analytics.priceChangePercent.toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getUrgencyBadge(analytics.urgencyLevel)}
                          {getDemandBadge(analytics.demandLevel)}
                          {getSurplusBadge(analytics.surplusLevel)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price Volatility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {priceAnalytics
                    .sort((a, b) => b.volatility - a.volatility)
                    .slice(0, 5)
                    .map((analytics) => (
                      <div key={analytics.item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{analytics.item.name}</p>
                          <p className="text-sm text-muted-foreground">{analytics.restaurant?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{(analytics.volatility * 100).toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">volatility</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <TransactionAnalytics />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {priceAnalytics
                    .filter(a => a.urgencyLevel >= 0.7 || Math.abs(a.priceChangePercent) >= 20)
                    .map((analytics) => (
                      <div key={analytics.item.id} className="flex items-center gap-3 p-3 border border-warning rounded-lg">
                        <AlertTriangle className="text-warning" size={20} />
                        <div className="flex-1">
                          <p className="font-medium">{analytics.item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {analytics.urgencyLevel >= 0.7 ? 'High urgency' : 'Significant price change'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-warning">${analytics.currentPrice.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {analytics.priceChange > 0 ? '+' : ''}{analytics.priceChangePercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    );
  } catch (error) {
    console.error('AdminDashboard error:', error);
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 bg-card border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-destructive mb-2">Something went wrong</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminDashboard;
