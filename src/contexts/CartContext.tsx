import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, SurpriseBag } from '@/data/mockData';

interface CartContextType {
  items: CartItem[];
  addToCart: (bagId: string) => void;
  removeFromCart: (bagId: string) => void;
  updateQuantity: (bagId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (bagId: string) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.bagId === bagId);
      if (existingItem) {
        return prev.map(item =>
          item.bagId === bagId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { bagId, quantity: 1 }];
    });
  };

  const removeFromCart = (bagId: string) => {
    setItems(prev => prev.filter(item => item.bagId !== bagId));
  };

  const updateQuantity = (bagId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bagId);
      return;
    }
    
    setItems(prev => prev.map(item =>
      item.bagId === bagId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    // This would need access to bag prices - simplified for now
    return items.reduce((total, item) => total + (item.quantity * 6), 0);
  };

  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};