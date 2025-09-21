import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { validateAuth0Config } from '@/config/auth0';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// This component handles the conditional Auth0 usage
export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const hasValidConfig = validateAuth0Config();
  
  if (!hasValidConfig) {
    // Return children without Auth0 context
    return <>{children}</>;
  }
  
  // Use Auth0 hook only when config is valid
  const auth0Hook = useAuth0();
  
  // Pass Auth0 data through context or props as needed
  return <>{children}</>;
};
