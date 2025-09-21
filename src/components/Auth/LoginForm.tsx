import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { Loader2, User, Store, AlertCircle } from 'lucide-react';
import { validateAuth0Config } from '@/config/auth0';

export const LoginForm: React.FC = () => {
  const { signIn, isLoading } = useApp();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const hasValidConfig = validateAuth0Config();

  const handleSignIn = async (userType: 'customer' | 'seller') => {
    if (!hasValidConfig) {
      alert('Auth0 not configured. Please set up your Auth0 credentials to enable authentication.');
      return;
    }
    
    setIsSigningIn(true);
    try {
      await signIn(userType);
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading || isSigningIn) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Bag by Bag</CardTitle>
          <CardDescription>
            Choose how you'd like to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasValidConfig && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Demo Mode: Auth0 not configured. Set up credentials to enable authentication.
                </p>
              </div>
            </div>
          )}
          
          <Button
            onClick={() => handleSignIn('customer')}
            className="w-full h-12 text-lg"
            variant="default"
            disabled={isSigningIn}
          >
            <User className="mr-2 h-5 w-5" />
            Sign in as Customer
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          
          <Button
            onClick={() => handleSignIn('seller')}
            className="w-full h-12 text-lg"
            variant="outline"
            disabled={isSigningIn}
          >
            <Store className="mr-2 h-5 w-5" />
            Sign in as Restaurant
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
