import React from 'react';
import { User, Settings, CreditCard, Heart, Clock, Star, LogIn, UserPlus, Camera, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { LoginForm } from '@/components/Auth/LoginForm';
import { AuthDebug } from '@/components/Debug/AuthDebug';

const ProfileScreen = ({ onNavigateToCreateListing }: { onNavigateToCreateListing?: () => void }) => {
  const { user, isAuthenticated, isLoading, foodListings, signOut } = useApp();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 bg-card border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 bg-card border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
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
                <Badge variant={user.userType === 'seller' ? 'default' : 'secondary'} className="mt-1">
                  {user.userType === 'seller' ? 'Restaurant Account' : 'Customer Account'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Actions */}
        {user.userType === 'seller' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Dashboard</CardTitle>
              <CardDescription>
                Manage your food listings and business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Active Listings</h3>
                  <p className="text-sm text-muted-foreground">
                    {foodListings.filter(l => l.available).length} active listings
                  </p>
                </div>
                <Badge variant="secondary">
                  {foodListings.length} total
                </Badge>
              </div>
              
              {onNavigateToCreateListing && (
                <Button 
                  onClick={onNavigateToCreateListing}
                  className="w-full flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Create New Listing</span>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Listings for Sellers */}
        {user.userType === 'seller' && foodListings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {foodListings.slice(0, 3).map((listing) => (
                  <div key={listing.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{listing.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        ${listing.discountedPrice} • {listing.freshnessScore}/10 freshness
                      </p>
                    </div>
                    <Badge variant={listing.available ? 'default' : 'secondary'}>
                      {listing.available ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auth Debug Info */}
        <AuthDebug />

        {/* Auth0 Demo Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Auth0 Integration</CardTitle>
            <CardDescription>
              Authentication is now powered by Auth0
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This user profile is now managed through Auth0 authentication. 
              To enable full Auth0 functionality, configure your Auth0 credentials in .env.local
            </p>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={signOut}
              variant="outline"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;