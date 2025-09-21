import React, { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { DynamicPriceDisplay } from '@/components/ui/DynamicPriceDisplay';
import { useToast } from '@/hooks/use-toast';

const CartScreen = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, user, processCheckout } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const { toast } = useToast();

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.dynamicPricing.currentPrice * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCheckoutSuccess(false);

    try {
      const transaction = await processCheckout();
      
      setCheckoutSuccess(true);
      toast({
        title: "Order Successful! 🎉",
        description: `Transaction ${transaction.id} completed. Prices have been updated based on demand!`,
      });

      // Reset success state after 3 seconds
      setTimeout(() => {
        setCheckoutSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 bg-card border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Cart</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Reserve a meal from Browse to get started</p>
            <Button>Browse Meals</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Cart</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          <Trash2 size={16} className="mr-1" />
          Clear
        </Button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {cart.map((item) => (
            <Card key={item.menuItem.id}>
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.menuItem.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.restaurant.name}</p>
                    
                    <div className="flex items-center gap-1 mt-1">
                      {item.menuItem.dietary.map((diet) => (
                        <Badge key={diet} variant="outline" className="text-xs">
                          {diet}
                        </Badge>
                      ))}
                      {item.menuItem.timeLeft && (
                        <Badge variant="secondary" className="text-xs bg-warning text-warning-foreground">
                          {item.menuItem.timeLeft} left
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <DynamicPriceDisplay item={item.menuItem} size="sm" />
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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

      {/* Checkout Summary */}
      <div className="border-t border-border bg-card p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          <p>📍 Pickup locations vary by restaurant</p>
        </div>

        <Button 
          className="w-full bg-accent hover:bg-accent/90" 
          size="lg"
          onClick={handleCheckout}
          disabled={isProcessing || checkoutSuccess}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : checkoutSuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Order Complete!
            </>
          ) : !user ? (
            'Sign In to Continue'
          ) : (
            'Proceed to Checkout'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartScreen;