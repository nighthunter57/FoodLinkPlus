import { MenuItem, Restaurant, PricePoint } from '@/types';
import { TransactionService } from './transactionService';

export class DynamicPricingService {
  private static instance: DynamicPricingService;
  private priceUpdateInterval: NodeJS.Timeout | null = null;
  private subscribers: ((items: MenuItem[]) => void)[] = [];
  private menuItems: MenuItem[] = [];
  private restaurants: Restaurant[] = [];
  private transactionService: TransactionService;

  private constructor() {
    this.transactionService = TransactionService.getInstance();
  }

  public static getInstance(): DynamicPricingService {
    if (!DynamicPricingService.instance) {
      DynamicPricingService.instance = new DynamicPricingService();
    }
    return DynamicPricingService.instance;
  }

  public initialize(menuItems: MenuItem[], restaurants: Restaurant[]) {
    this.menuItems = menuItems;
    this.restaurants = restaurants;
    
    // Seed demo transaction data
    this.transactionService.seedDemoData();
    
    this.startPriceUpdates();
  }

  public subscribe(callback: (items: MenuItem[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private startPriceUpdates() {
    // Update prices every 10 seconds
    this.priceUpdateInterval = setInterval(() => {
      this.updateAllPrices();
    }, 10000);

    // Initial price update
    this.updateAllPrices();
  }

  public stopPriceUpdates() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
      this.priceUpdateInterval = null;
    }
  }

  private updateAllPrices() {
    const updatedItems = this.menuItems.map(item => this.calculateDynamicPrice(item));
    this.menuItems = updatedItems;
    this.notifySubscribers();
  }

  private calculateDynamicPrice(item: MenuItem): MenuItem {
    const restaurant = this.restaurants.find(r => r.id === item.restaurantId);
    if (!restaurant) return item;

    const now = new Date();
    const factors = this.calculatePricingFactors(item, restaurant, now);
    
    // Calculate dynamic price based on factors
    const basePrice = item.dynamicPricing.basePrice;
    const dynamicPrice = this.applyPricingAlgorithm(basePrice, factors);
    
    // Create new price point for history
    const pricePoint: PricePoint = {
      timestamp: now,
      price: dynamicPrice,
      factors: factors
    };

    // Update item with new pricing
    const updatedItem: MenuItem = {
      ...item,
      dynamicPricing: {
        ...item.dynamicPricing,
        currentPrice: dynamicPrice,
        priceHistory: [...item.dynamicPricing.priceHistory, pricePoint].slice(-50), // Keep last 50 price points
        lastUpdated: now,
        demandLevel: this.getDemandLevel(factors.demand),
        surplusLevel: this.getSurplusLevel(factors.surplus),
        urgencyMultiplier: this.calculateUrgencyMultiplier(factors)
      }
    };

    return updatedItem;
  }

  private calculatePricingFactors(item: MenuItem, restaurant: Restaurant, now: Date) {
    return {
      demand: this.calculateDemandFactor(item),
      surplus: this.calculateSurplusFactor(item, restaurant),
      timeToClosing: this.calculateTimeToClosingFactor(restaurant, now),
      timeToExpiry: this.calculateTimeToExpiryFactor(item, now)
    };
  }

  private calculateDemandFactor(item: MenuItem): number {
    // Get real demand data from transaction service
    const relativeDemand = this.transactionService.getRelativeDemandScore(item.id, this.menuItems);
    const absoluteDemand = this.transactionService.getDemandScore(item.id);
    
    // Combine relative and absolute demand
    // Relative demand shows how popular this item is vs others
    // Absolute demand shows overall purchase activity
    const combinedDemand = (relativeDemand * 0.7) + (absoluteDemand * 0.3);
    
    // Ensure demand is between 0 and 1
    return Math.min(1, Math.max(0, combinedDemand));
  }

  private calculateSurplusFactor(item: MenuItem, restaurant: Restaurant): number {
    // Check restaurant inventory level and nearby stores
    const restaurantSurplus = this.getInventorySurplusLevel(restaurant.inventoryLevel);
    const nearbySurplus = this.calculateNearbySurplus(restaurant.nearbyStores);
    
    // Higher surplus = lower price
    return Math.min(1, Math.max(0, (restaurantSurplus + nearbySurplus) / 2));
  }

  private calculateTimeToClosingFactor(restaurant: Restaurant, now: Date): number {
    const closingTime = restaurant.closingTime;
    const [hours, minutes] = closingTime.split(':').map(Number);
    const closingDateTime = new Date(now);
    closingDateTime.setHours(hours, minutes, 0, 0);
    
    // If closing time has passed today, set for tomorrow
    if (closingDateTime <= now) {
      closingDateTime.setDate(closingDateTime.getDate() + 1);
    }
    
    const timeUntilClosing = closingDateTime.getTime() - now.getTime();
    const hoursUntilClosing = timeUntilClosing / (1000 * 60 * 60);
    
    // More urgent as closing approaches (0 = just opened, 1 = closing soon)
    return Math.min(1, Math.max(0, 1 - (hoursUntilClosing / 12))); // Assuming 12-hour operating day
  }

  private calculateTimeToExpiryFactor(item: MenuItem, now: Date): number {
    const expiryDate = item.dynamicPricing.expiryDate;
    const timeUntilExpiry = expiryDate.getTime() - now.getTime();
    const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);
    
    // More urgent as expiry approaches (0 = fresh, 1 = expiring soon)
    return Math.min(1, Math.max(0, 1 - (hoursUntilExpiry / 24))); // Assuming 24-hour shelf life
  }

  private applyPricingAlgorithm(basePrice: number, factors: any): number {
    // Weighted pricing algorithm
    const demandWeight = 0.3;
    const surplusWeight = 0.3;
    const timeToClosingWeight = 0.2;
    const timeToExpiryWeight = 0.2;

    // Calculate price multiplier
    let priceMultiplier = 1;
    
    // Demand increases price
    priceMultiplier += (factors.demand - 0.5) * demandWeight;
    
    // Surplus decreases price
    priceMultiplier -= factors.surplus * surplusWeight;
    
    // Urgency increases price
    priceMultiplier += (factors.timeToClosing + factors.timeToExpiry) * 0.1;

    // Apply bounds (50% to 200% of base price)
    const finalPrice = basePrice * Math.max(0.5, Math.min(2.0, priceMultiplier));
    
    return Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
  }

  private calculatePriceVolatility(history: PricePoint[]): number {
    if (history.length < 2) return 0;
    
    const prices = history.map(h => h.price);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length;
    
    return Math.sqrt(variance) / avgPrice; // Coefficient of variation
  }

  private simulateRecentPurchases(item: MenuItem): number {
    // Simulate purchase behavior based on item characteristics
    const basePurchaseRate = 0.1;
    const categoryMultiplier = this.getCategoryMultiplier(item.category);
    const dietaryMultiplier = this.getDietaryMultiplier(item.dietary);
    
    return basePurchaseRate * categoryMultiplier * dietaryMultiplier;
  }

  private getCategoryMultiplier(category: string): number {
    const multipliers: { [key: string]: number } = {
      'Main Course': 1.2,
      'Breakfast': 0.8,
      'Bakery': 1.0,
      'Dessert': 0.9
    };
    return multipliers[category] || 1.0;
  }

  private getDietaryMultiplier(dietary: string[]): number {
    // Popular dietary options get higher demand
    const popularDiets = ['vegetarian', 'vegan', 'gluten-free'];
    const popularCount = dietary.filter(d => popularDiets.includes(d)).length;
    return 1 + (popularCount * 0.1);
  }

  private getInventorySurplusLevel(level: 'low' | 'medium' | 'high'): number {
    const levels = { low: 0.2, medium: 0.5, high: 0.8 };
    return levels[level];
  }

  private calculateNearbySurplus(nearbyStores: string[]): number {
    // Simulate nearby store surplus
    return Math.random() * 0.4; // Random between 0-0.4
  }

  private getDemandLevel(demand: number): 'low' | 'medium' | 'high' {
    if (demand < 0.3) return 'low';
    if (demand < 0.7) return 'medium';
    return 'high';
  }

  private getSurplusLevel(surplus: number): 'low' | 'medium' | 'high' {
    if (surplus < 0.3) return 'low';
    if (surplus < 0.7) return 'medium';
    return 'high';
  }

  private calculateUrgencyMultiplier(factors: any): number {
    return (factors.timeToClosing + factors.timeToExpiry) / 2;
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.menuItems]));
  }

  public getCurrentPrices(): MenuItem[] {
    return [...this.menuItems];
  }

  public getPriceHistory(itemId: string): PricePoint[] {
    const item = this.menuItems.find(i => i.id === itemId);
    return item ? item.dynamicPricing.priceHistory : [];
  }

  public processTransaction(cartItems: any[], userId?: string) {
    // Process the transaction through the transaction service
    const transaction = this.transactionService.processCheckout(cartItems, userId);
    
    // Immediately update prices to reflect new demand
    this.updateAllPrices();
    
    return transaction;
  }

  public getTransactionService(): TransactionService {
    return this.transactionService;
  }
}
