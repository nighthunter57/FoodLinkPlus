import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auth Debug - Not Authenticated</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User is not logged in</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth Debug - User Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">User Details:</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User Type:</strong> 
            <Badge variant={user.userType === 'seller' ? 'default' : 'secondary'} className="ml-2">
              {user.userType}
            </Badge>
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold">Debug Info:</h3>
          <p className="text-sm text-muted-foreground">
            Check the browser console for detailed Auth0 user object and role detection logs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
