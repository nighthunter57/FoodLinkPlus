import { useState, useEffect, useCallback } from 'react';

import { MenuItem } from '@/types';
import { DynamicPricingService } from '@/services/dynamicPricingService';
import { mockMenuItems, mockRestaurants } from '@/data/mockDataWithDynamicPricing';

export const useDynamicPricing = () => {
  const [dynamicMenuItems, setDynamicMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const pricingService = DynamicPricingService.getInstance();

  useEffect(() => {
    // Initialize pricing service with mock data
    pricingService.initialize(mockMenuItems, mockRestaurants);

    // Subscribe to updates
    const unsubscribe = pricingService.subscribe((updatedItems) => {
      setDynamicMenuItems(updatedItems);
      setLastUpdated(new Date());
      setIsLoading(false);
    });

    // Set initial synchronous data if available
    try {
      const items = pricingService.getMenuItems();
      if (items && items.length > 0) {
        setDynamicMenuItems(items);
        setIsLoading(false);
      }
    } catch (e) {
      // ignore - getMenuItems may not be ready immediately
    }

    return () => {
      unsubscribe();
      pricingService.stopPriceUpdates();
    };
  }, [pricingService]);

  const getPriceChangeIndicator = useCallback((item: MenuItem) => {
    const history = item.dynamicPricing.priceHistory;
    if (!history || history.length < 2) return null;

    const currentPrice = item.dynamicPricing.currentPrice;
    const previousPrice = history[history.length - 2].price;
    const change = currentPrice - previousPrice;
    const changePercent = previousPrice ? (change / previousPrice) * 100 : 0;

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
    if (!history || history.length < 3) return 'stable';

    const recent = history.slice(-3);
    const isIncreasing = recent.every((point, index) => index === 0 || point.price >= recent[index - 1].price);
    const isDecreasing = recent.every((point, index) => index === 0 || point.price <= recent[index - 1].price);

    if (isIncreasing) return 'increasing';
    if (isDecreasing) return 'decreasing';
    return 'volatile';
  }, []);

  const refreshPrices = useCallback(() => {
    setIsLoading(true);
    // Trigger a price update; subscription will update state
    try {
      pricingService.updateAllPrices();
    } catch (e) {
      // fallback: reinitialize
      pricingService.initialize(mockMenuItems, mockRestaurants);
    }
  }, [pricingService]);

  return {
    dynamicMenuItems,
    isLoading,
    lastUpdated,
    getPriceChangeIndicator,
    getUrgencyLevel,
    getPriceTrend,
    refreshPrices
  };
};
