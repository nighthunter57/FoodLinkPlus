import React, { useState } from 'react';
import { MapPin, ShoppingBag, Plus, Minus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { FoodConcierge } from './FoodConcierge';
import { DealCard } from './DealCard';

const HomeScreen = ({ onNavigateToBrowse }: { onNavigateToBrowse?: (filters: any) => void }) => {
  const { user, cart, menuItems, restaurants, addToCart, updateQuantity, removeFromCart, transactionHistory } = useApp();
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    peopleCount: '',
    dietary: '',
    budget: '',
    mealType: ''
  });
  const { toast } = useToast();

  const questions = [
    { text: "How many people are you feeding today?", options: ["1", "2", "3", "4+"] },
    { text: "Any dietary restrictions I should know about?", options: ["Vegetarian", "Vegan", "Gluten-free", "No restrictions"] },
    { text: "What's your budget looking like today?", options: ["Under $15", "$15-25", "$25-40", "$40+"] },
    { text: "What kind of meal are you in the mood for?", options: ["Breakfast", "Lunch", "Dinner", "Snacks"] }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleQuickResponse = (response: string) => {
    setChatMessages(prev => [...prev, response]);
    
    // Store user preference based on current question
    const questionKeys = ['peopleCount', 'dietary', 'budget', 'mealType'];
    if (currentQuestion < questionKeys.length) {
      setUserPreferences(prev => ({
        ...prev,
        [questionKeys[currentQuestion]]: response
      }));
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBrowseDeals = () => {
    if (onNavigateToBrowse) {
      // Convert user preferences to browse filters
      const filters = {
        dietary: userPreferences.dietary === 'No restrictions' ? '' : userPreferences.dietary.toLowerCase(),
        budget: userPreferences.budget,
        mealType: userPreferences.mealType.toLowerCase(),
        peopleCount: userPreferences.peopleCount,
        deals: true // Always show deals when coming from home
      };
      onNavigateToBrowse(filters);
    }
  };

  // Get best deals (highest discount percentage)
  const goodDeals = menuItems
    .filter(item => item.discountPercentage > 20)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 3);

  // Get recent completed transaction for rating
  const recentTransaction = transactionHistory
    .filter(t => t.status === 'completed')
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

  const isRecentTransaction = recentTransaction && 
    (Date.now() - recentTransaction.timestamp.getTime()) < 24 * 60 * 60 * 1000; // Within 24 hours

  const handleRating = (rating: number) => {
    setRatingSubmitted(true);
    toast({
      title: "Thank you for your feedback!",
      description: `You rated your order ${rating} stars.`,
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.dynamicPricing.currentPrice * item.quantity), 0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {getGreeting()}{user ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={14} className="mr-1" />
              <span>Downtown, 0.5 mi</span>
            </div>
          </div>
          {user && (
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <FoodConcierge
          questions={questions}
          currentQuestion={currentQuestion}
          chatMessages={chatMessages}
          handleQuickResponse={handleQuickResponse}
          handleBrowseDeals={handleBrowseDeals}
        />

        {/* Good Deals Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center">
              <span className="text-xs">🔥</span>
            </div>
            <h2 className="font-semibold text-foreground">Good Deals</h2>
          </div>
          
          <div className="space-y-3">
            {goodDeals.map((item) => {
              const restaurant = restaurants.find(r => r.id === item.restaurantId);
              return (
                <DealCard key={item.id} item={item} restaurant={restaurant} />
              );
            })}
          </div>
        </div>

        {/* Rate your last order */}
        {isRecentTransaction && !ratingSubmitted && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star size={18} className="text-green-600" />
                <h3 className="font-semibold text-foreground">Rate Your Recent Order</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                How was your order from {new Date(recentTransaction.timestamp).toLocaleDateString()}?
              </p>
              
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRating(rating)}
                    className="flex items-center gap-1"
                  >
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {rating}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cart Section */}
        {cart.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Your Cart</h3>
              <div className="space-y-4">
                {cart.map(cartItem => (
                  <div key={cartItem.menuItem.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cartItem.menuItem.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${cartItem.menuItem.dynamicPricing.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}>
                        <Minus size={14} />
                      </Button>
                      <span>{cartItem.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}>
                        <Plus size={14} />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeFromCart(cartItem.menuItem.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4">
                  <ShoppingBag size={16} className="mr-2" />
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;