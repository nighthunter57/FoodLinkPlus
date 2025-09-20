import React from 'react';
import { Minus, Plus, Trash2, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { getDonationById, getRestaurantById } from '@/data/mockData';

const CartScreen: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const cartWithDetails = items.map(reservation => {
    const donation = getDonationById(reservation.donationId);
    const restaurant = donation ? getRestaurantById(donation.restaurantId) : null;
    return { ...reservation, donation, restaurant };
  }).filter(item => item.donation && item.restaurant);

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 bg-card border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">Shopping Cart</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground">Your cart is empty — reserve a meal from Browse.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Shopping Cart</h1>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Clear All
          </Button>
        </div>
      </div>
      
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="space-y-4">
          {cartWithDetails.map(item => (
            <Card key={item.reservationId}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img
                    src={item.donation!.photoUrl}
                    alt={item.restaurant!.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.restaurant!.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.donation!.title}</p>
                    
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Clock size={12} />
                      <span>Pickup {item.donation!.pickupWindowStart} - {item.donation!.pickupWindowEnd}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-success font-medium">
                        Reserved • {item.qtyTotal} items
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.reservationId)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Checkout Footer */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">${getCartTotal().toFixed(2)}</span>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>Pickup locations in Southampton, Houston</span>
            </div>
          </div>
          
          <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;