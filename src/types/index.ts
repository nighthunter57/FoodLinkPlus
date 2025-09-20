export interface Restaurant {
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
  preferences: {
    dietary: string[];
    cuisines: string[];
    budget: number;
    portionSize: 'small' | 'regular' | 'large';
  };
  isSignedIn: boolean;
}