import React from 'react';
import BottomNavigation from '@/components/Layout/BottomNavigation';
import CartScreen from '@/components/Screens/CartScreen';

const Cart: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      <div className="flex-1 overflow-hidden">
        <CartScreen />
      </div>
      <BottomNavigation activeTab="cart" />
    </div>
  );
};

export default Cart;