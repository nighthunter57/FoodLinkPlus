import { Restaurant, MenuItem } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Garden Bistro',
    image: '/images/bistro-food.jpg',
    cuisine: 'Mediterranean',
    rating: 4.8,
    distance: 0.3,
    deals: true,
    estimatedTime: '15-20 min',
    description: 'Fresh Mediterranean cuisine with a focus on local ingredients',
    closingTime: '22:00',
    timezone: 'America/New_York',
    inventoryLevel: 'medium',
    nearbyStores: ['2', '3']
  },
  {
    id: '2',
    name: 'Urban Kitchen',
    image: '/images/kitchen-food.jpg',
    cuisine: 'American',
    rating: 4.5,
    distance: 0.7,
    deals: true,
    estimatedTime: '20-25 min',
    description: 'Modern American comfort food with a twist',
    closingTime: '23:00',
    timezone: 'America/New_York',
    inventoryLevel: 'high',
    nearbyStores: ['1', '4']
  },
  {
    id: '3',
    name: 'Artisan Bakery',
    image: '/images/bakery-food.jpg',
    cuisine: 'Bakery',
    rating: 4.9,
    distance: 0.2,
    deals: false,
    estimatedTime: '10-15 min',
    description: 'Fresh baked goods and artisanal breads daily',
    closingTime: '18:00',
    timezone: 'America/New_York',
    inventoryLevel: 'low',
    nearbyStores: ['1', '4']
  },
  {
    id: '4',
    name: 'Fresh Market Cafe',
    image: '/images/market-food.jpg',
    cuisine: 'Organic',
    rating: 4.6,
    distance: 1.2,
    deals: true,
    estimatedTime: '25-30 min',
    description: 'Farm-to-table organic meals and fresh juices',
    closingTime: '21:00',
    timezone: 'America/New_York',
    inventoryLevel: 'medium',
    nearbyStores: ['2', '3']
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Mediterranean Bowl',
    description: 'Quinoa, grilled vegetables, hummus, and feta cheese',
    image: '/images/bistro-food.jpg',
    originalPrice: 14.99,
    discountedPrice: 9.99,
    discountPercentage: 33,
    category: 'Main Course',
    dietary: ['vegetarian', 'gluten-free'],
    available: true,
    timeLeft: '2 hours',
    dynamicPricing: {
      basePrice: 9.99,
      currentPrice: 9.99,
      priceHistory: [],
      demandLevel: 'medium',
      surplusLevel: 'medium',
      urgencyMultiplier: 0.3,
      expiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      closingTime: new Date(),
      lastUpdated: new Date()
    }
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Grilled Chicken Wrap',
    description: 'Herb-marinated chicken with fresh vegetables',
    image: '/images/bistro-food.jpg',
    originalPrice: 12.99,
    discountedPrice: 7.99,
    discountPercentage: 38,
    category: 'Main Course',
    dietary: [],
    available: true,
    timeLeft: '1.5 hours',
    dynamicPricing: {
      basePrice: 7.99,
      currentPrice: 7.99,
      priceHistory: [],
      demandLevel: 'high',
      surplusLevel: 'low',
      urgencyMultiplier: 0.5,
      expiryDate: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours from now
      closingTime: new Date(),
      lastUpdated: new Date()
    }
  },
  {
    id: '3',
    restaurantId: '2',
    name: 'Classic Burger',
    description: 'Grass-fed beef with house-made pickles and fries',
    image: '/images/kitchen-food.jpg',
    originalPrice: 16.99,
    discountedPrice: 11.99,
    discountPercentage: 29,
    category: 'Main Course',
    dietary: [],
    available: true,
    timeLeft: '3 hours',
    dynamicPricing: {
      basePrice: 11.99,
      currentPrice: 11.99,
      priceHistory: [],
      demandLevel: 'medium',
      surplusLevel: 'high',
      urgencyMultiplier: 0.2,
      expiryDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      closingTime: new Date(),
      lastUpdated: new Date()
    }
  },
  {
    id: '4',
    restaurantId: '3',
    name: 'Sourdough Bread',
    description: 'Fresh baked sourdough loaf',
    image: '/images/bakery-food.jpg',
    originalPrice: 8.99,
    discountedPrice: 5.99,
    discountPercentage: 33,
    category: 'Bakery',
    dietary: ['vegan'],
    available: true,
    timeLeft: '4 hours',
    dynamicPricing: {
      basePrice: 5.99,
      currentPrice: 5.99,
      priceHistory: [],
      demandLevel: 'low',
      surplusLevel: 'high',
      urgencyMultiplier: 0.1,
      expiryDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      closingTime: new Date(),
      lastUpdated: new Date()
    }
  },
  {
    id: '5',
    restaurantId: '4',
    name: 'Green Smoothie Bowl',
    description: 'Acai, spinach, banana, and granola',
    image: '/images/market-food.jpg',
    originalPrice: 11.99,
    discountedPrice: 7.99,
    discountPercentage: 33,
    category: 'Breakfast',
    dietary: ['vegan', 'gluten-free'],
    available: true,
    timeLeft: '45 minutes',
    dynamicPricing: {
      basePrice: 7.99,
      currentPrice: 7.99,
      priceHistory: [],
      demandLevel: 'high',
      surplusLevel: 'low',
      urgencyMultiplier: 0.8,
      expiryDate: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      closingTime: new Date(),
      lastUpdated: new Date()
    }
  }
];
