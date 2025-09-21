import { useState, useEffect, useCallback } from 'react';
import { MenuItem, Restaurant } from '@/types';
import { DynamicPricingService } from '@/services/dynamicPricingService';

export const useDynamicPricing = (menuItems: MenuItem[], restaurants: Restaurant[]) => {
  const [dynamicMenuItems, setDynamicMenuItems] = useState<MenuItem[]>(menuItems);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const pricingService = DynamicPricingService.getInstance();

  useEffect(() => {
    // Initialize the pricing service
    pricingService.initialize(menuItems, restaurants);
    
    // Subscribe to price updates
    const unsubscribe = pricingService.subscribe((updatedItems) => {
      setDynamicMenuItems(updatedItems);
      setLastUpdated(new Date());
    });

    return () => {
      unsubscribe();
    };
  }, [menuItems, restaurants, pricingService]);

  const getPriceChangeIndicator = useCallback((item: MenuItem) => {
    const history = item.dynamicPricing.priceHistory;
    if (history.length < 2) return null;

    const currentPrice = item.dynamicPricing.currentPrice;
    const previousPrice = history[history.length - 2].price;
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    return {
      change,
      changePercent,
      isIncreasing: change > 0,
      isDecreasing: change < 0
    };
  }, []);

  const getUrgencyLevel = useCallback((item: MenuItem) => {
    const urgency = item.dynamicPricing.urgencyMultiplier;
    if (urgency >= 0.7) return 'high';
    if (urgency >= 0.4) return 'medium';
    return 'low';
  }, []);

  const getPriceTrend = useCallback((item: MenuItem) => {
    const history = item.dynamicPricing.priceHistory;
    if (history.length < 3) return 'stable';

    const recent = history.slice(-3);
    const isIncreasing = recent.every((point, index) => 
      index === 0 || point.price >= recent[index - 1].price
    );
    const isDecreasing = recent.every((point, index) => 
      index === 0 || point.price <= recent[index - 1].price
    );

    if (isIncreasing) return 'increasing';
    if (isDecreasing) return 'decreasing';
    return 'volatile';
  }, []);

  return {
    dynamicMenuItems,
    isLoading,
    lastUpdated,
    getPriceChangeIndicator,
    getUrgencyLevel,
    getPriceTrend,
    refreshPrices: () => {
      setIsLoading(true);
      // Force refresh by re-initializing
      pricingService.initialize(menuItems, restaurants);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };
};
