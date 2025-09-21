import React from 'react';
import { Home, Search, ShoppingCart, User, BarChart3 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface BottomNavigationProps {
  activeTab: 'home' | 'browse' | 'cart' | 'profile' | 'admin';
  onTabChange: (tab: 'home' | 'browse' | 'cart' | 'profile' | 'admin') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { cart, user } = useApp();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const baseTabs = [
    { id: 'home' as const, label: 'Home', icon: Home, badge: undefined },
    { id: 'browse' as const, label: 'Browse', icon: Search, badge: undefined },
    { id: 'cart' as const, label: 'Cart', icon: ShoppingCart, badge: cartItemCount > 0 ? cartItemCount : undefined },
    { id: 'profile' as const, label: 'Profile', icon: User, badge: undefined },
  ];

  // Add Admin tab only for sellers
  const tabs = user?.userType === 'seller' 
    ? [...baseTabs, { id: 'admin' as const, label: 'Admin', icon: BarChart3, badge: undefined }]
    : baseTabs;

  return (
    <nav className="bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative ${
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="relative">
              <Icon size={20} />
              {badge && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;