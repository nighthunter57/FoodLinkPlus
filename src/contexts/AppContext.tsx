import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, User, MenuItem, Restaurant } from '@/types';
import { useDynamicPricing } from '@/hooks/useDynamicPricing';
import { mockMenuItems, mockRestaurants } from '@/data/mockDataWithDynamicPricing';
import { TransactionService, Transaction } from '@/services/transactionService';
import { useAuth0Auth } from '@/hooks/useAuth0Auth';

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  menuItems: MenuItem[];
  restaurants: Restaurant[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  
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

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        menuItems: dynamicMenuItems,
        restaurants: mockRestaurants,
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
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};