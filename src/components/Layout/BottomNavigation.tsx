import React from 'react';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface BottomNavigationProps {
  activeTab: 'home' | 'browse' | 'cart' | 'profile';
  onTabChange?: (tab: 'home' | 'browse' | 'cart' | 'profile') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const navigate = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab as any);
    } else {
      // Navigate using window.location for page routing
      const routes = { browse: '/', home: '/home', cart: '/cart', profile: '/profile' };
      window.location.href = routes[tab as keyof typeof routes];
    }
  };
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home, badge: undefined },
    { id: 'browse' as const, label: 'Browse', icon: Search, badge: undefined },
    { id: 'cart' as const, label: 'Cart', icon: ShoppingCart, badge: cartItemCount > 0 ? cartItemCount : undefined },
    { id: 'profile' as const, label: 'Profile', icon: User, badge: undefined },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
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
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
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