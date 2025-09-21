import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { validateAuth0Config } from '@/config/auth0';

export const Auth0Debug: React.FC = () => {
  const isConfigured = validateAuth0Config();
  
  return (
    <Card className="mb-4 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">Auth0 Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="space-y-1">
          <p><strong>Configured:</strong> {isConfigured ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Domain:</strong> {import.meta.env.VITE_AUTH0_DOMAIN || 'Not set'}</p>
          <p><strong>Client ID:</strong> {import.meta.env.VITE_AUTH0_CLIENT_ID || 'Not set'}</p>
          <p><strong>Audience:</strong> {import.meta.env.VITE_AUTH0_AUDIENCE || 'Not set'}</p>
          <p><strong>Redirect URI:</strong> {import.meta.env.VITE_AUTH0_REDIRECT_URI || 'Not set'}</p>
        </div>
      </CardContent>
    </Card>
  );
};
