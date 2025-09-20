import React from 'react';
import { Minus, Plus, Trash2, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { mockRestaurants } from '@/data/mockData';

const CartScreen: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const cartWithDetails = items.map(item => {
    const restaurant = mockRestaurants.find(r => 
      r.surpriseBags.some(bag => bag.id === item.bagId)
    );
    const bag = restaurant?.surpriseBags.find(bag => bag.id === item.bagId);
    return { ...item, restaurant, bag };
  }).filter(item => item.restaurant && item.bag);

  const total = cartWithDetails.reduce((sum, item) => 
    sum + (item.bag!.discountedPrice * item.quantity), 0
  );

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
            <p className="text-muted-foreground">Add some surprise bags to get started!</p>
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
            <Card key={item.bagId}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img
                    src={item.restaurant!.image}
                    alt={item.restaurant!.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.restaurant!.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.bag!.title}</p>
                    
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Clock size={12} />
                      <span>{item.bag!.pickupStart} - {item.bag!.pickupEnd}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">
                          ${item.bag!.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.bag!.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.bagId, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.bagId, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.bagId)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
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
            <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
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