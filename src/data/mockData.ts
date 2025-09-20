import { Restaurant, MenuItem } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Garden Bistro',
    image: '/public/images/bistro-food.jpg',
    cuisine: 'Mediterranean',
    rating: 4.8,
    distance: 0.3,
    deals: true,
    estimatedTime: '15-20 min',
    description: 'Fresh Mediterranean cuisine with a focus on local ingredients'
  },
  {
    id: '2',
    name: 'Urban Kitchen',
    image: '/public/images/kitchen-food.jpg',
    cuisine: 'American',
    rating: 4.5,
    distance: 0.7,
    deals: true,
    estimatedTime: '20-25 min',
    description: 'Modern American comfort food with a twist'
  },
  {
    id: '3',
    name: 'Artisan Bakery',
    image: '/public/images/bakery-food.jpg',
    cuisine: 'Bakery',
    rating: 4.9,
    distance: 0.2,
    deals: false,
    estimatedTime: '10-15 min',
    description: 'Fresh baked goods and artisanal breads daily'
  },
  {
    id: '4',
    name: 'Fresh Market Cafe',
    image: '/public/images/market-food.jpg',
    cuisine: 'Organic',
    rating: 4.6,
    distance: 1.2,
    deals: true,
    estimatedTime: '25-30 min',
    description: 'Farm-to-table organic meals and fresh juices'
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Mediterranean Bowl',
    description: 'Quinoa, grilled vegetables, hummus, and feta cheese',
    image: '/public/images/bistro-food.jpg',
    originalPrice: 14.99,
    discountedPrice: 9.99,
    discountPercentage: 33,
    category: 'Main Course',
    dietary: ['vegetarian', 'gluten-free'],
    available: true,
    timeLeft: '2 hours'
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Grilled Chicken Wrap',
    description: 'Herb-marinated chicken with fresh vegetables',
    image: '/public/images/bistro-food.jpg',
    originalPrice: 12.99,
    discountedPrice: 7.99,
    discountPercentage: 38,
    category: 'Main Course',
    dietary: [],
    available: true,
    timeLeft: '1.5 hours'
  },
  {
    id: '3',
    restaurantId: '2',
    name: 'Classic Burger',
    description: 'Grass-fed beef with house-made pickles and fries',
    image: '/public/images/kitchen-food.jpg',
    originalPrice: 16.99,
    discountedPrice: 11.99,
    discountPercentage: 29,
    category: 'Main Course',
    dietary: [],
    available: true,
    timeLeft: '3 hours'
  },
  {
    id: '4',
    restaurantId: '3',
    name: 'Sourdough Bread',
    description: 'Fresh baked sourdough loaf',
    image: '/public/images/bakery-food.jpg',
    originalPrice: 8.99,
    discountedPrice: 5.99,
    discountPercentage: 33,
    category: 'Bakery',
    dietary: ['vegan'],
    available: true,
    timeLeft: '4 hours'
  },
  {
    id: '5',
    restaurantId: '4',
    name: 'Green Smoothie Bowl',
    description: 'Acai, spinach, banana, and granola',
    image: '/public/images/market-food.jpg',
    originalPrice: 11.99,
    discountedPrice: 7.99,
    discountPercentage: 33,
    category: 'Breakfast',
    dietary: ['vegan', 'gluten-free'],
    available: true,
    timeLeft: '45 minutes'
  }
];