import React, { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import PostDonationForm from '@/components/Restaurant/PostDonationForm';
import ReservationsList from '@/components/Restaurant/ReservationsList';

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'restaurant') {
    return (
      <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
        <div className="p-4 bg-card border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">This page is for restaurant accounts only.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Restaurant Dashboard</h1>
          <div></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="post">Post</TabsTrigger>
            <TabsTrigger value="reservations">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            <TabsContent value="overview" className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">23</div>
                    <div className="text-sm text-muted-foreground">Meals donated this week</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">11.5kg</div>
                    <div className="text-sm text-muted-foreground">CO₂ avoided</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chicken Rice Bowls</span>
                      <span className="text-sm text-success">5 reserved</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Veggie Salads</span>
                      <span className="text-sm text-muted-foreground">3 remaining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="post">
              <PostDonationForm />
            </TabsContent>
            
            <TabsContent value="reservations">
              <ReservationsList />
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star size={20} />
                    Ratings & Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-foreground">4.5</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={16} className="fill-warning text-warning" />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">Based on 127 reviews</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="border-b border-border pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={12} className="fill-warning text-warning" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">Sarah C.</span>
                      </div>
                      <p className="text-sm">Great food quality and portion size. Easy pickup process!</p>
                    </div>
                    
                    <div className="border-b border-border pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(star => (
                            <Star key={star} size={12} className="fill-warning text-warning" />
                          ))}
                          <Star size={12} className="text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">Mike T.</span>
                      </div>
                      <p className="text-sm">Good value for money. Would order again.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDashboard;