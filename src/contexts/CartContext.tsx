import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Reservation, getDonationById } from '@/data/mockData';

interface CartContextType {
  items: Reservation[];
  addToCart: (donationId: string, itemsReserved: Array<{itemId: string, qty: number}>) => void;
  removeFromCart: (reservationId: string) => void;
  updateQuantity: (reservationId: string, itemId: string, quantity: number) => void;
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
  const [items, setItems] = useState<Reservation[]>([]);

  const addToCart = (donationId: string, itemsReserved: Array<{itemId: string, qty: number}>) => {
    const newReservation: Reservation = {
      reservationId: `res-${Date.now()}`,
      donationId,
      userId: 'demo-user',
      itemsReserved,
      qtyTotal: itemsReserved.reduce((sum, item) => sum + item.qty, 0),
      pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      status: 'reserved',
      createdAt: new Date().toISOString()
    };
    
    setItems(prev => [...prev, newReservation]);
  };

  const removeFromCart = (reservationId: string) => {
    setItems(prev => prev.filter(item => item.reservationId !== reservationId));
  };

  const updateQuantity = (reservationId: string, itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.map(reservation => ({
        ...reservation,
        itemsReserved: reservation.itemsReserved.filter(item => item.itemId !== itemId),
        qtyTotal: reservation.itemsReserved.filter(item => item.itemId !== itemId).reduce((sum, item) => sum + item.qty, 0)
      })).filter(reservation => reservation.itemsReserved.length > 0));
      return;
    }
    
    setItems(prev => prev.map(reservation =>
      reservation.reservationId === reservationId
        ? {
            ...reservation,
            itemsReserved: reservation.itemsReserved.map(item =>
              item.itemId === itemId ? { ...item, qty: quantity } : item
            ),
            qtyTotal: reservation.itemsReserved.map(item =>
              item.itemId === itemId ? { ...item, qty: quantity } : item
            ).reduce((sum, item) => sum + item.qty, 0)
          }
        : reservation
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, reservation) => {
      const donation = getDonationById(reservation.donationId);
      if (!donation) return total;
      
      return total + reservation.itemsReserved.reduce((subtotal, reserved) => {
        const item = donation.items.find(i => i.id === reserved.itemId);
        const price = item?.discountedPrice || 0;
        return subtotal + (price * reserved.qty);
      }, 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return items.reduce((total, reservation) => total + reservation.qtyTotal, 0);
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