import React from 'react';
import { Heart, Clock, Leaf, Award, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUser } from '@/data/mockData';

const ProfileScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {/* User Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{mockUser.name}</h2>
                <p className="text-muted-foreground">{mockUser.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Impact Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="text-success" size={20} />
              Your Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{mockUser.mealsSaved}</div>
                <div className="text-sm text-muted-foreground">Meals Saved</div>
              </div>
              <div className="text-center p-4 bg-impact-blue/10 rounded-lg">
                <div className="text-2xl font-bold text-impact-blue">{mockUser.co2Reduced}kg</div>
                <div className="text-sm text-muted-foreground">CO₂ Reduced</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-accent rounded-lg">
              <p className="text-sm text-accent-foreground">
                🌍 Amazing! You've made a real difference by reducing food waste. 
                Keep up the great work!
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Heart className="mr-3" size={20} />
            Favorite Stores
          </Button>
          
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Clock className="mr-3" size={20} />
            Order History
          </Button>
          
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Award className="mr-3" size={20} />
            Achievements
          </Button>
          
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Settings className="mr-3" size={20} />
            Settings
          </Button>
          
          <Button variant="outline" className="w-full justify-start" size="lg">
            <HelpCircle className="mr-3" size={20} />
            Help & Support
          </Button>
          
          <Button variant="outline" className="w-full justify-start" size="lg">
            <LogOut className="mr-3" size={20} />
            Sign Out
          </Button>
        </div>
        
        {/* App Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>FoodRescue v1.0.0</p>
          <p>Reducing food waste, one meal at a time</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;