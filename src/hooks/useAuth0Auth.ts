import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';
import { User } from '@/types';
import { validateAuth0Config } from '@/config/auth0';

export const useAuth0Auth = () => {
  const hasValidConfig = validateAuth0Config();
  
  // Always call useAuth0 hook - it will handle missing config gracefully
  const auth0Hook = useAuth0();
  
  // Use Auth0 data only if config is valid, otherwise use fallback values
  const auth0User = hasValidConfig ? auth0Hook.user : null;
  const isAuthenticated = hasValidConfig ? auth0Hook.isAuthenticated : false;
  const isLoading = hasValidConfig ? auth0Hook.isLoading : false;
  const loginWithRedirect = hasValidConfig ? auth0Hook.loginWithRedirect : async () => {
    console.warn('Auth0 not configured. Please set up your Auth0 credentials.');
  };
  const logout = hasValidConfig ? auth0Hook.logout : async () => {
    console.warn('Auth0 not configured. Please set up your Auth0 credentials.');
  };
  const getAccessTokenSilently = hasValidConfig ? auth0Hook.getAccessTokenSilently : async () => null;
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Extract user role from Auth0 user metadata
  const getUserRole = useCallback((auth0User: any): 'customer' | 'seller' => {
    // Check for role in user metadata or app_metadata
    const role = auth0User?.['https://bagbybag.com/roles'] || 
                 auth0User?.app_metadata?.roles?.[0] ||
                 auth0User?.user_metadata?.role;
    
    // Default to customer if no role is specified
    return role === 'restaurant' || role === 'seller' ? 'seller' : 'customer';
  }, []);

  // Convert Auth0 user to our User type
  const convertAuth0User = useCallback((auth0User: any): User => {
    const userType = getUserRole(auth0User);
    
    return {
      id: auth0User.sub,
      name: auth0User.name || auth0User.nickname || 'User',
      email: auth0User.email,
      phone: auth0User.phone_number,
      userType,
      preferences: {
        dietary: [],
        cuisines: [],
        budget: 25,
        portionSize: 'regular'
      },
      isSignedIn: true,
    };
  }, [getUserRole]);

  // Update user when Auth0 user changes
  useEffect(() => {
    if (isAuthenticated && auth0User) {
      setIsLoadingUser(true);
      try {
        const convertedUser = convertAuth0User(auth0User);
        setUser(convertedUser);
      } catch (error) {
        console.error('Error converting Auth0 user:', error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    } else {
      setUser(null);
    }
  }, [isAuthenticated, auth0User, convertAuth0User]);

  const signIn = useCallback(async (userType?: 'customer' | 'seller') => {
    try {
      // You can customize the login parameters based on user type
      const loginParams = {
        ...(userType && {
          screen_hint: userType === 'seller' ? 'signup' : 'login',
          // You can add custom parameters here for role-based login
        })
      };
      
      await loginWithRedirect(loginParams);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, [loginWithRedirect]);

  const signOut = useCallback(async () => {
    try {
      await logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  const getAccessToken = useCallback(async () => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }, [getAccessTokenSilently]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isLoadingUser,
    signIn,
    signOut,
    getAccessToken,
    auth0User,
  };
};
