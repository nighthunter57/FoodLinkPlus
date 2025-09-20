import React, { useState } from 'react';
import { MapPin, MessageCircle, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { mockMenuItems, mockRestaurants } from '@/data/mockData';

const HomeScreen = () => {
  const { user } = useApp();
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const hotDeals = mockMenuItems.filter(item => item.discountPercentage > 30).slice(0, 3);

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
        {/* AI Chatbot Section */}
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
              <Button variant="outline" size="sm">
                Browse Deals
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hot Deals Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center">
              <span className="text-xs">🔥</span>
            </div>
            <h2 className="font-semibold text-foreground">Hot Deals</h2>
          </div>
          
          <div className="space-y-3">
            {hotDeals.map((item) => {
              const restaurant = mockRestaurants.find(r => r.id === item.restaurantId);
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
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-primary">
                              ${item.discountedPrice}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                          </div>
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

        {/* Local Favorites */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-impact-green" />
            <h2 className="font-semibold text-foreground">Local Favorites</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {mockRestaurants.slice(0, 4).map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-foreground truncate">{restaurant.name}</h3>
                    <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs">⭐ {restaurant.rating}</span>
                      {restaurant.deals && (
                        <Badge variant="secondary" className="text-xs">Deals</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;