import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  continueAsGuest: (phone: string) => Promise<boolean>;
  guestPhone: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [guestPhone, setGuestPhone] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('foodlink_user');
    const storedGuest = localStorage.getItem('foodlink_guest_phone');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (storedGuest) {
      setGuestPhone(storedGuest);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - find user by email
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setGuestPhone(null);
      localStorage.setItem('foodlink_user', JSON.stringify(foundUser));
      localStorage.removeItem('foodlink_guest_phone');
      return true;
    }
    return false;
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    // Demo signup - create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      userId: `user-${Date.now()}`,
      name,
      email,
      role: 'user',
      preferences: {
        dietary: [],
        budget: 'medium',
        portionSize: 'medium'
      },
      walletBalance: 0,
      privacyFlag: false,
      mealsSaved: 0,
      co2Reduced: 0,
      favorites: [],
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    setGuestPhone(null);
    localStorage.setItem('foodlink_user', JSON.stringify(newUser));
    localStorage.removeItem('foodlink_guest_phone');
    return true;
  };

  const signOut = () => {
    setUser(null);
    setGuestPhone(null);
    localStorage.removeItem('foodlink_user');
    localStorage.removeItem('foodlink_guest_phone');
  };

  const continueAsGuest = async (phone: string): Promise<boolean> => {
    // Demo guest flow - store phone for verification
    setGuestPhone(phone);
    setUser(null);
    localStorage.setItem('foodlink_guest_phone', phone);
    localStorage.removeItem('foodlink_user');
    return true;
  };

  const isAuthenticated = !!(user || guestPhone);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      signIn,
      signUp,
      signOut,
      continueAsGuest,
      guestPhone
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};