import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, User } from '@/types';

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  signIn: (userData: Partial<User>) => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const signIn = (userData: Partial<User>) => {
    setUser({
      id: userData.id || '1',
      name: userData.name || 'User',
      email: userData.email || 'user@example.com',
      phone: userData.phone,
      preferences: {
        dietary: [],
        cuisines: [],
        budget: 25,
        portionSize: 'regular'
      },
      isSignedIn: true,
      ...userData
    });
  };

  const signOut = () => {
    setUser(null);
    clearCart();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        signIn,
        signOut
      }}
    >
      {children}
    </AppContext.Provider>
  );
};