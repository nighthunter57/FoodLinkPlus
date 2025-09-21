import React from 'react';
import { Auth0Provider as Auth0ProviderBase } from '@auth0/auth0-react';
import { auth0Config, validateAuth0Config } from '@/config/auth0';

interface Auth0ProviderProps {
  children: React.ReactNode;
}

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  // Check if we have valid Auth0 configuration
  const hasValidConfig = validateAuth0Config();
  
  console.log('Auth0Provider - hasValidConfig:', hasValidConfig);
  console.log('Auth0Provider - domain:', auth0Config.domain);
  console.log('Auth0Provider - clientId:', auth0Config.clientId);
  
  // If no valid config, render children without Auth0
  if (!hasValidConfig) {
    console.warn('Auth0 configuration missing. App will run in demo mode.');
    return (
      <div className="min-h-screen bg-background">
        {/* Warning banner */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">
                <strong>Demo Mode:</strong> Auth0 not configured. Please set up your Auth0 credentials in .env.local to enable authentication.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <Auth0ProviderBase
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0ProviderBase>
  );
};
