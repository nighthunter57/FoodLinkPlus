import React from 'react';
import { User, Settings, CreditCard, Heart, Clock, Star, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

const ProfileScreen = () => {
  const { user, signIn, signOut } = useApp();

  const handleSignIn = () => {
    signIn({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+1 (555) 123-4567'
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 bg-card border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <User size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Join FoodRescue</h2>
            <p className="text-muted-foreground mb-6">
              Create an account to save preferences, use wallet, and manage reservations.
            </p>
            
            <div className="space-y-3">
              <Button onClick={handleSignIn} className="w-full bg-accent hover:bg-accent/90">
                <LogIn size={16} className="mr-2" />
                Sign In
              </Button>
              <Button variant="outline" className="w-full">
                <UserPlus size={16} className="mr-2" />
                Create Account
              </Button>
            </div>
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
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.phone && (
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                )}
              </div>
              <Button variant="outline" size="sm">
                <Settings size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard size={18} className="text-success" />
              Digital Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Account Balance</span>
              <span className="text-lg font-bold text-success">$25.00</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">Top Up</Button>
              <Button variant="outline" size="sm" className="flex-1">Add Card</Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Food Preferences</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Dietary Restrictions</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Vegetarian</Badge>
                  <Badge variant="outline">Gluten-free</Badge>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">+ Add</Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Favorite Cuisines</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Mediterranean</Badge>
                  <Badge variant="secondary">Asian</Badge>
                  <Badge variant="secondary">American</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm font-medium">Budget Range</p>
                  <p className="text-sm text-muted-foreground">$15 - $30</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Portion Size</p>
                  <p className="text-sm text-muted-foreground">Regular</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock size={18} className="text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-secondary rounded-lg">
                <img
                  src="/public/images/bistro-food.jpg"
                  alt="Mediterranean Bowl"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Mediterranean Bowl</p>
                  <p className="text-xs text-muted-foreground">Green Garden Bistro • Yesterday</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="fill-current text-warning" />
                    <span className="text-xs">5.0</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Reorder
                </Button>
              </div>

              <div className="flex items-center gap-3 p-2 bg-secondary rounded-lg">
                <img
                  src="/public/images/kitchen-food.jpg"
                  alt="Classic Burger"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Classic Burger</p>
                  <p className="text-xs text-muted-foreground">Urban Kitchen • 3 days ago</p>
                  <Button variant="ghost" size="sm" className="h-5 p-0 text-xs text-primary">
                    Rate Order
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  Reorder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart size={18} className="text-accent" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <img
                  src="/public/images/bistro-food.jpg"
                  alt="Green Garden Bistro"
                  className="w-12 h-12 rounded-full mx-auto mb-2 object-cover"
                />
                <p className="text-sm font-medium">Green Garden</p>
                <p className="text-xs text-muted-foreground">Mediterranean</p>
              </div>
              
              <div className="text-center p-3 bg-secondary rounded-lg">
                <img
                  src="/public/images/bakery-food.jpg"
                  alt="Artisan Bakery"
                  className="w-12 h-12 rounded-full mx-auto mb-2 object-cover"
                />
                <p className="text-sm font-medium">Artisan Bakery</p>
                <p className="text-xs text-muted-foreground">Bakery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;