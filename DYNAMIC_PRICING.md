# Dynamic Pricing Implementation

This document outlines the comprehensive dynamic pricing system implemented for the Bag by Bag food rescue app, designed specifically for low-income users.

## 🎯 Overview

The dynamic pricing system automatically adjusts food prices based on four key factors:
1. **Demand** - Based on purchase patterns and popularity
2. **Surplus** - Inventory levels in-store and nearby stores
3. **Time-to-closing** - Urgency as restaurant closing time approaches
4. **Expiry date** - Urgency as food approaches expiration

Prices update every **10 seconds** and are immediately reflected in the UI.

## 🏗️ Architecture

### Core Components

#### 1. DynamicPricingService (`src/services/dynamicPricingService.ts`)
- **Singleton service** managing all pricing logic
- **Real-time updates** every 10 seconds
- **Pricing algorithms** for all four factors
- **Price history tracking** for analytics
- **Subscriber pattern** for UI updates

#### 2. useDynamicPricing Hook (`src/hooks/useDynamicPricing.ts`)
- **React hook** for easy integration
- **Real-time price updates** via subscription
- **Utility functions** for price analysis
- **Loading states** and error handling

#### 3. DynamicPriceDisplay Component (`src/components/ui/DynamicPriceDisplay.tsx`)
- **Visual price indicators** with trend arrows
- **Urgency badges** for time-sensitive items
- **Price change percentages** with color coding
- **Detailed pricing breakdown** (optional)

#### 4. AdminDashboard (`src/components/Screens/AdminDashboard.tsx`)
- **Real-time monitoring** of all price changes
- **Analytics and trends** with multiple timeframes
- **Alert system** for significant changes
- **Volatility tracking** for risk management

## 📊 Pricing Algorithm

### Factor Weights
```typescript
const demandWeight = 0.3;      // 30% - Demand impact
const surplusWeight = 0.3;     // 30% - Surplus impact  
const timeToClosingWeight = 0.2; // 20% - Closing urgency
const timeToExpiryWeight = 0.2;  // 20% - Expiry urgency
```

### Price Calculation
```typescript
priceMultiplier = 1 + (demand - 0.5) * demandWeight
                - surplus * surplusWeight
                + (timeToClosing + timeToExpiry) * 0.1

finalPrice = basePrice * Math.max(0.5, Math.min(2.0, priceMultiplier))
```

### Price Bounds
- **Minimum**: 50% of base price
- **Maximum**: 200% of base price
- **Precision**: Rounded to 2 decimal places

## 🔄 Real-Time Updates

### Update Frequency
- **Interval**: 10 seconds
- **Method**: setInterval with cleanup
- **Scope**: All menu items simultaneously

### UI Synchronization
- **Subscriber pattern** for efficient updates
- **React state management** via Context API
- **Automatic re-rendering** of price displays
- **Loading indicators** during updates

## 📈 Analytics & Monitoring

### Price History
- **50 most recent** price points per item
- **Timestamp tracking** for each change
- **Factor breakdown** for each price point
- **Volatility calculations** for risk assessment

### Admin Dashboard Features
- **Overview tab**: Price changes summary
- **Analytics tab**: Volatility and trends
- **Alerts tab**: High-urgency items
- **Time range filtering**: 1h, 6h, 24h, 7d

### Key Metrics
- **Price increases/decreases** count
- **High urgency items** count
- **Volatility scores** per item
- **Demand/surplus levels** tracking

## 🎨 UI/UX Features

### Visual Indicators
- **Trend arrows** (↗️ ↘️) for price changes
- **Color coding**: Green (decrease), Red (increase)
- **Urgency badges**: High/Medium/Low urgency
- **Percentage changes** with precision

### Price Display Components
- **Compact view**: Price + trend + urgency
- **Detailed view**: Full breakdown with history
- **Size variants**: sm, md, lg for different contexts
- **Real-time updates** without page refresh

### User Experience
- **Immediate feedback** on price changes
- **Clear visual hierarchy** for important information
- **Accessibility** with proper contrast and ARIA labels
- **Mobile-optimized** touch-friendly interface

## 🔧 Configuration

### Environment Variables
```typescript
// Update intervals (milliseconds)
PRICE_UPDATE_INTERVAL = 10000  // 10 seconds

// Price bounds (multipliers)
MIN_PRICE_MULTIPLIER = 0.5     // 50% of base
MAX_PRICE_MULTIPLIER = 2.0     // 200% of base

// Factor weights (must sum to 1.0)
DEMAND_WEIGHT = 0.3
SURPLUS_WEIGHT = 0.3
TIME_TO_CLOSING_WEIGHT = 0.2
TIME_TO_EXPIRY_WEIGHT = 0.2
```

### Restaurant Configuration
```typescript
interface Restaurant {
  closingTime: string;        // "22:00"
  timezone: string;          // "America/New_York"
  inventoryLevel: 'low' | 'medium' | 'high';
  nearbyStores: string[];    // IDs of nearby restaurants
}
```

### Menu Item Configuration
```typescript
interface MenuItem {
  dynamicPricing: {
    basePrice: number;           // Starting price
    currentPrice: number;        // Current dynamic price
    priceHistory: PricePoint[];  // Historical data
    demandLevel: 'low' | 'medium' | 'high';
    surplusLevel: 'low' | 'medium' | 'high';
    urgencyMultiplier: number;   // 0-1 scale
    expiryDate: Date;           // When item expires
    closingTime: Date;          // Restaurant closing
    lastUpdated: Date;          // Last price update
  };
}
```

## 🚀 Usage Examples

### Basic Implementation
```typescript
import { useDynamicPricing } from '@/hooks/useDynamicPricing';

const MyComponent = () => {
  const { dynamicMenuItems, lastUpdated } = useDynamicPricing(menuItems, restaurants);
  
  return (
    <div>
      {dynamicMenuItems.map(item => (
        <DynamicPriceDisplay key={item.id} item={item} />
      ))}
    </div>
  );
};
```

### Admin Monitoring
```typescript
import { AdminDashboard } from '@/components/Screens/AdminDashboard';

const AdminPage = () => {
  return <AdminDashboard />;
};
```

### Manual Price Refresh
```typescript
const { refreshPrices } = useApp();

const handleRefresh = () => {
  refreshPrices(); // Force immediate price update
};
```

## 🔍 Monitoring & Alerts

### Automatic Alerts
- **High urgency items** (urgency > 0.7)
- **Significant price changes** (>20% change)
- **Low inventory** situations
- **Expiring soon** items

### Admin Notifications
- **Real-time dashboard** updates
- **Price volatility** warnings
- **Demand surge** alerts
- **Surplus overflow** notifications

## 🎯 Benefits for Low-Income Users

### Affordability Focus
- **Dynamic discounts** based on urgency
- **Surplus-driven** price reductions
- **Time-sensitive** deals for maximum savings
- **Transparent pricing** with clear indicators

### Fair Access
- **Demand balancing** prevents price gouging
- **Surplus distribution** reduces waste
- **Time-based** urgency creates fair opportunities
- **Real-time updates** ensure current pricing

### User Empowerment
- **Clear visual indicators** for informed decisions
- **Price history** for trend analysis
- **Urgency awareness** for time-sensitive deals
- **Transparent factors** driving price changes

## 🔮 Future Enhancements

### Planned Features
- **Machine learning** for better demand prediction
- **Weather integration** for demand forecasting
- **Social features** for community-driven pricing
- **Push notifications** for price alerts
- **Price prediction** for future planning

### Advanced Analytics
- **Predictive modeling** for price trends
- **Customer behavior** analysis
- **Seasonal patterns** recognition
- **A/B testing** for pricing strategies

## 📝 Technical Notes

### Performance Considerations
- **Efficient updates** with minimal re-renders
- **Memory management** for price history
- **Debounced calculations** for complex operations
- **Lazy loading** for admin dashboard

### Error Handling
- **Graceful degradation** if service fails
- **Fallback prices** for critical items
- **Retry mechanisms** for failed updates
- **User notifications** for system issues

### Testing Strategy
- **Unit tests** for pricing algorithms
- **Integration tests** for real-time updates
- **Performance tests** for large datasets
- **User acceptance tests** for UI components

This dynamic pricing system provides a sophisticated yet user-friendly solution for optimizing food rescue pricing while maintaining accessibility for low-income users.
