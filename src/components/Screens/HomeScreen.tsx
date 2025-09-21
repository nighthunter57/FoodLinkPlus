import React, { useState } from 'react';
import { MapPin, MessageCircle, Sparkles, Clock, Star, ShoppingBag, Plus, Minus, Trash2, CheckCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { DynamicPriceDisplay } from '@/components/ui/DynamicPriceDisplay';
import { useToast } from '@/hooks/use-toast';

const HomeScreen = ({ onNavigateToBrowse, onNavigateToCreateListing }: { onNavigateToBrowse?: (filters: any) => void; onNavigateToCreateListing?: () => void }) => {
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
        {/* How many people are you feeding today section - MOVED TO TOP */}
        <Card className="border-2 border-primary/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Sam, your food concierge</h3>
                <p className="text-sm text-muted-foreground">Here to help you find the perfect meal</p>
              </div>
            </div>

            {chatMessages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-foreground">{questions[currentQuestion].text}</p>
                <div className="flex flex-wrap gap-2">
                  {questions[currentQuestion].options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickResponse(option)}
                      className="text-xs"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {chatMessages.map((message, index) => (
                  <div key={index} className="text-sm bg-secondary p-2 rounded-lg">
                    {message}
                  </div>
                ))}
                {currentQuestion < questions.length - 1 && (
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">{questions[currentQuestion].text}</p>
                    <div className="flex flex-wrap gap-2">
                      {questions[currentQuestion].options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickResponse(option)}
                          className="text-xs"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button size="sm" className="bg-gradient-to-r from-accent to-accent/80">
                <Sparkles size={14} className="mr-1" />
                Surprise Me!
              </Button>
              <Button variant="outline" size="sm" onClick={handleBrowseDeals}>
                Browse Deals
              </Button>
              {user?.userType === 'seller' && onNavigateToCreateListing && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onNavigateToCreateListing}
                  className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                >
                  <Camera size={14} className="mr-1" />
                  Sell Food
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-sm text-foreground truncate">{item.name}</h3>
                          <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
                            {item.discountPercentage}% off
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{restaurant?.name}</p>
                        <div className="flex items-center justify-between">
                          <DynamicPriceDisplay item={item} size="sm" />
                          <div className="flex items-center text-xs text-warning">
                            <Clock size={12} className="mr-1" />
                            {item.timeLeft}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Order Widget - Only show if cart has items */}
        {cart.length > 0 && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag size={18} className="text-primary" />
                <h3 className="font-semibold text-foreground">Current Order</h3>
                <Badge variant="secondary" className="ml-auto">{cart.length} item{cart.length !== 1 ? 's' : ''}</Badge>
              </div>
              
              <div className="space-y-2 mb-3">
                {cart.slice(0, 2).map((item) => (
                  <div key={item.menuItem.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{item.quantity}x {item.menuItem.name}</span>
                    <span className="font-medium">${(item.menuItem.dynamicPricing.currentPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {cart.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{cart.length - 2} more item{cart.length - 2 !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm font-semibold mb-3">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <Button className="w-full" size="sm">
                View Cart
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Rating Past Orders - Only show if there's a recent transaction */}
        {isRecentTransaction && !ratingSubmitted && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-green-600" />
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

      </div>
    </div>
  );
};

export default HomeScreen;