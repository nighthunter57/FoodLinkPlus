import React from 'react';
import { User, Settings, CreditCard, Heart, Clock, Star, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { LoginForm } from '@/components/Auth/LoginForm';

const ProfileScreen = () => {
  const { user, isAuthenticated, isLoading } = useApp();

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
      </div>
    </div>
  );
};

export default ProfileScreen;