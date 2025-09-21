import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, User, MenuItem, Restaurant, FoodListing } from '@/types';
import { useDynamicPricing } from '@/hooks/useDynamicPricing';
import { mockMenuItems, mockRestaurants } from '@/data/mockDataWithDynamicPricing';
import { TransactionService, Transaction } from '@/services/transactionService';
import { useAuth0Auth } from '@/hooks/useAuth0Auth';

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  menuItems: MenuItem[];
  restaurants: Restaurant[];
  foodListings: FoodListing[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  signIn: (userType?: 'customer' | 'seller') => Promise<void>;
  signOut: () => Promise<void>;
  refreshPrices: () => void;
  lastPriceUpdate: Date | null;
  processCheckout: () => Promise<Transaction>;
  transactionHistory: Transaction[];
  isAuthenticated: boolean;
  isLoading: boolean;
  addFoodListing: (listing: FoodListing) => void;
  updateFoodListing: (id: string, updates: Partial<FoodListing>) => void;
  deleteFoodListing: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Mock food listings data
const mockFoodListings: FoodListing[] = [
  {
    id: 'fl-1',
    sellerId: 'seller-1',
    title: 'Fresh Mediterranean Platter',
    description: 'Homemade hummus, grilled vegetables, fresh pita bread, and tzatziki sauce. Perfect for sharing or a light dinner.',
    images: ['/images/bistro-food.jpg', '/images/market-food.jpg', '/images/kitchen-food.jpg'],
    originalPrice: 18.99,
    discountedPrice: 12.99,
    discountPercentage: 32,
    category: 'Main Course',
    dietary: ['vegetarian', 'gluten-free'],
    available: true,
    timeLeft: '3h 45m',
    freshnessScore: 9,
    aiAnalysis: {
      freshness: 'excellent',
      summary: 'Fresh, vibrant Mediterranean platter with high-quality ingredients. The vegetables are crisp and colorful, hummus has perfect consistency, and the pita bread appears freshly baked.',
      detectedItems: ['hummus', 'grilled vegetables', 'pita bread', 'tzatziki', 'olives'],
      qualityNotes: ['Excellent color and texture', 'Fresh herbs visible', 'Professional presentation'],
      recommendedPrice: 15.99,
      estimatedExpiry: new Date(Date.now() + 4 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'fl-2',
    sellerId: 'seller-2',
    title: 'Artisan Sourdough Loaf',
    description: 'Freshly baked sourdough bread with a perfect crust and airy interior. Made with organic flour and natural starter.',
    images: ['/images/bakery-food.jpg', '/images/bistro-food.jpg'],
    originalPrice: 8.99,
    discountedPrice: 5.99,
    discountPercentage: 33,
    category: 'Bakery',
    dietary: ['vegan'],
    available: true,
    timeLeft: '6h 20m',
    freshnessScore: 8,
    aiAnalysis: {
      freshness: 'good',
      summary: 'Well-baked sourdough with good crust development and proper fermentation. The bread shows signs of being recently baked with good oven spring.',
      detectedItems: ['sourdough bread', 'organic flour'],
      qualityNotes: ['Good crust color', 'Proper fermentation', 'Freshly baked appearance'],
      recommendedPrice: 7.99,
      estimatedExpiry: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 'fl-3',
    sellerId: 'seller-3',
    title: 'Gourmet Burger & Fries',
    description: 'Juicy grass-fed beef burger with house-made pickles, fresh lettuce, tomato, and crispy golden fries.',
    images: ['/images/kitchen-food.jpg', '/images/bistro-food.jpg', '/images/market-food.jpg'],
    originalPrice: 16.99,
    discountedPrice: 11.99,
    discountPercentage: 29,
    category: 'Main Course',
    dietary: [],
    available: true,
    timeLeft: '2h 15m',
    freshnessScore: 7,
    aiAnalysis: {
      freshness: 'good',
      summary: 'Well-prepared burger with fresh ingredients. The patty appears properly cooked, vegetables are crisp, and fries look golden and crispy.',
      detectedItems: ['beef burger', 'fries', 'lettuce', 'tomato', 'pickles', 'bun'],
      qualityNotes: ['Good meat quality', 'Fresh vegetables', 'Crispy fries'],
      recommendedPrice: 14.99,
      estimatedExpiry: new Date(Date.now() + 3 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 'fl-4',
    sellerId: 'seller-4',
    title: 'Green Smoothie Bowl',
    description: 'Nutritious acai bowl with spinach, banana, granola, and fresh berries. Perfect for a healthy breakfast or snack.',
    images: ['/images/market-food.jpg', '/images/bistro-food.jpg'],
    originalPrice: 11.99,
    discountedPrice: 7.99,
    discountPercentage: 33,
    category: 'Breakfast',
    dietary: ['vegan', 'gluten-free'],
    available: true,
    timeLeft: '1h 30m',
    freshnessScore: 6,
    aiAnalysis: {
      freshness: 'fair',
      summary: 'Nutritious smoothie bowl with good ingredient variety. The acai base appears fresh, though some berries may be starting to soften.',
      detectedItems: ['acai', 'spinach', 'banana', 'granola', 'berries'],
      qualityNotes: ['Good color', 'Some berries softening', 'Fresh granola'],
      recommendedPrice: 9.99,
      estimatedExpiry: new Date(Date.now() + 2 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: 'fl-5',
    sellerId: 'seller-5',
    title: 'Chocolate Croissants (6-pack)',
    description: 'Buttery, flaky croissants filled with rich chocolate. Perfect for breakfast or afternoon treat.',
    images: ['/images/bakery-food.jpg', '/images/kitchen-food.jpg', '/images/market-food.jpg'],
    originalPrice: 12.99,
    discountedPrice: 8.99,
    discountPercentage: 31,
    category: 'Bakery',
    dietary: ['vegetarian'],
    available: true,
    timeLeft: '4h 10m',
    freshnessScore: 8,
    aiAnalysis: {
      freshness: 'good',
      summary: 'Well-made croissants with good lamination and chocolate filling. The pastry appears fresh with proper flaky layers.',
      detectedItems: ['croissants', 'chocolate', 'butter', 'flour'],
      qualityNotes: ['Good lamination', 'Fresh appearance', 'Proper chocolate distribution'],
      recommendedPrice: 10.99,
      estimatedExpiry: new Date(Date.now() + 5 * 60 * 60 * 1000)
    },
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [foodListings, setFoodListings] = useState<FoodListing[]>(mockFoodListings);
  
  // Initialize Auth0 authentication
  const {
    user,
    isAuthenticated,
    isLoading,
    signIn: auth0SignIn,
    signOut: auth0SignOut
  } = useAuth0Auth();
  
  // Initialize dynamic pricing
  const {
    dynamicMenuItems,
    isLoading: isPricingLoading,
    lastUpdated,
    refreshPrices
  } = useDynamicPricing();

  // Initialize transaction service
  const transactionService = TransactionService.getInstance();

  useEffect(() => {
    setLastPriceUpdate(lastUpdated);
  }, [lastUpdated]);

  useEffect(() => {
    // Subscribe to transaction updates
    const unsubscribe = transactionService.subscribe((transactions) => {
      setTransactionHistory(transactions);
    });
    
    // Load initial transaction history
    setTransactionHistory(transactionService.getTransactionHistory());
    
    return unsubscribe;
  }, [transactionService]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.menuItem.id === item.menuItem.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.menuItem.id === item.menuItem.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const signIn = async (userType?: 'customer' | 'seller') => {
    await auth0SignIn(userType);
  };

  const signOut = async () => {
    await auth0SignOut();
    clearCart();
  };

  const processCheckout = async (): Promise<Transaction> => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      // Process the transaction
      const transaction = transactionService.processCheckout(cart, user?.id);
      
      // Clear the cart after successful checkout
      clearCart();
      
      // Show success message
      console.log('Checkout successful:', transaction);
      
      return transaction;
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    }
  };

  const addFoodListing = (listing: FoodListing) => {
    setFoodListings(prev => [...prev, listing]);
  };

  const updateFoodListing = (id: string, updates: Partial<FoodListing>) => {
    setFoodListings(prev => 
      prev.map(listing => 
        listing.id === id 
          ? { ...listing, ...updates, updatedAt: new Date() }
          : listing
      )
    );
  };

  const deleteFoodListing = (id: string) => {
    setFoodListings(prev => prev.filter(listing => listing.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        menuItems: dynamicMenuItems,
        restaurants: mockRestaurants,
        foodListings,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        signIn,
        signOut,
        refreshPrices,
        lastPriceUpdate,
        processCheckout,
        transactionHistory,
        isAuthenticated,
        isLoading,
        addFoodListing,
        updateFoodListing,
        deleteFoodListing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};