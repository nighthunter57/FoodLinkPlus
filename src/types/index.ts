export interface Restaurant {
  listings: any;
  id: string;
  name: string;
  image: string;
  logo?: string;
  cuisine: string;
  rating: number;
  distance: number;
  deals: boolean;
  estimatedTime: string;
  description?: string;
  closingTime: string; // "22:00"
  timezone: string;
  inventoryLevel: 'low' | 'medium' | 'high';
  nearbyStores: string[]; // IDs of nearby restaurants
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  category: string;
  dietary: string[];
  available: boolean;
  timeLeft?: string;
  
  // New dynamic pricing fields
  dynamicPricing: {
    basePrice: number;
    currentPrice: number;
    priceHistory: PricePoint[];
    demandLevel: 'low' | 'medium' | 'high';
    surplusLevel: 'low' | 'medium' | 'high';
    urgencyMultiplier: number;
    expiryDate: Date;
    closingTime: Date;
    lastUpdated: Date;
  };
}

export interface PricePoint {
  timestamp: Date;
  price: number;
  factors: {
    demand: number;
    surplus: number;
    timeToClosing: number;
    timeToExpiry: number;
  };
}

export interface CartItem {
  menuItem: MenuItem;
  restaurant: Restaurant;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: 'customer' | 'seller';
  preferences: {
    dietary: string[];
    cuisines: string[];
    budget: number;
    portionSize: 'small' | 'regular' | 'large';
  };
  isSignedIn: boolean;
}