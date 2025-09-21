import { CartItem, MenuItem, Restaurant } from '@/types';

export interface Transaction {
  id: string;
  timestamp: Date;
  items: CartItem[];
  totalAmount: number;
  userId?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface PurchaseRecord {
  menuItemId: string;
  quantity: number;
  timestamp: Date;
  price: number;
  restaurantId: string;
}

export class TransactionService {
  private static instance: TransactionService;
  private transactions: Transaction[] = [];
  private purchaseRecords: PurchaseRecord[] = [];
  private subscribers: ((transactions: Transaction[]) => void)[] = [];

  private constructor() {}

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  public subscribe(callback: (transactions: Transaction[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  public processCheckout(cartItems: CartItem[], userId?: string): Transaction {
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      timestamp: new Date(),
      items: [...cartItems],
      totalAmount: this.calculateTotal(cartItems),
      userId,
      status: 'completed'
    };

    // Record the transaction
    this.transactions.push(transaction);

    // Record individual purchases for demand tracking
    cartItems.forEach(cartItem => {
      const purchaseRecord: PurchaseRecord = {
        menuItemId: cartItem.menuItem.id,
        quantity: cartItem.quantity,
        timestamp: new Date(),
        price: cartItem.menuItem.dynamicPricing?.currentPrice || cartItem.menuItem.discountedPrice,
        restaurantId: cartItem.restaurant.id
      };
      this.purchaseRecords.push(purchaseRecord);
    });

    // Notify subscribers
    this.notifySubscribers();

    // Log the transaction for debugging
    console.log('Transaction completed:', {
      id: transaction.id,
      items: transaction.items.length,
      total: transaction.totalAmount,
      timestamp: transaction.timestamp
    });

    return transaction;
  }

  public getPurchaseHistory(menuItemId?: string, timeRange?: { start: Date; end: Date }): PurchaseRecord[] {
    let records = this.purchaseRecords;

    if (menuItemId) {
      records = records.filter(record => record.menuItemId === menuItemId);
    }

    if (timeRange) {
      records = records.filter(record => 
        record.timestamp >= timeRange.start && record.timestamp <= timeRange.end
      );
    }

    return records.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getDemandScore(menuItemId: string, timeWindow: number = 60 * 60 * 1000): number {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeWindow);
    
    const recentPurchases = this.purchaseRecords.filter(record => 
      record.menuItemId === menuItemId && record.timestamp >= cutoffTime
    );

    // Calculate demand score based on recent purchases
    const totalQuantity = recentPurchases.reduce((sum, record) => sum + record.quantity, 0);
    const purchaseFrequency = recentPurchases.length;
    
    // Normalize demand score (0-1 scale)
    // Higher quantity and frequency = higher demand
    const quantityScore = Math.min(totalQuantity / 10, 1); // Max 10 items = score of 1
    const frequencyScore = Math.min(purchaseFrequency / 5, 1); // Max 5 purchases = score of 1
    
    return (quantityScore + frequencyScore) / 2;
  }

  public getRelativeDemandScore(menuItemId: string, allMenuItems: MenuItem[]): number {
    const menuItemDemand = this.getDemandScore(menuItemId);
    
    // Get demand scores for all items
    const allDemandScores = allMenuItems.map(item => this.getDemandScore(item.id));
    const maxDemand = Math.max(...allDemandScores);
    const minDemand = Math.min(...allDemandScores);
    
    // Normalize relative to other items (0-1 scale)
    if (maxDemand === minDemand) return 0.5; // Neutral if all items have same demand
    
    return (menuItemDemand - minDemand) / (maxDemand - minDemand);
  }

  public getTransactionHistory(userId?: string): Transaction[] {
    let transactions = this.transactions;
    
    if (userId) {
      transactions = transactions.filter(transaction => transaction.userId === userId);
    }
    
    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getTotalRevenue(timeRange?: { start: Date; end: Date }): number {
    let transactions = this.transactions.filter(t => t.status === 'completed');
    
    if (timeRange) {
      transactions = transactions.filter(t => 
        t.timestamp >= timeRange.start && t.timestamp <= timeRange.end
      );
    }
    
    return transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
  }

  public getPopularItems(limit: number = 5): { menuItemId: string; purchaseCount: number; totalQuantity: number }[] {
    const itemStats = new Map<string, { purchaseCount: number; totalQuantity: number }>();
    
    this.purchaseRecords.forEach(record => {
      const existing = itemStats.get(record.menuItemId) || { purchaseCount: 0, totalQuantity: 0 };
      itemStats.set(record.menuItemId, {
        purchaseCount: existing.purchaseCount + 1,
        totalQuantity: existing.totalQuantity + record.quantity
      });
    });
    
    return Array.from(itemStats.entries())
      .map(([menuItemId, stats]) => ({ menuItemId, ...stats }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, item) => {
      const price = item.menuItem.dynamicPricing?.currentPrice || item.menuItem.discountedPrice;
      return sum + (price * item.quantity);
    }, 0);
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.transactions]));
  }

  // Demo data for testing
  public seedDemoData() {
    const demoTransactions: Transaction[] = [
      {
        id: 'demo_1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        items: [],
        totalAmount: 15.98,
        userId: 'demo_user',
        status: 'completed'
      },
      {
        id: 'demo_2',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        items: [],
        totalAmount: 23.97,
        userId: 'demo_user',
        status: 'completed'
      }
    ];

    const demoPurchases: PurchaseRecord[] = [
      {
        menuItemId: '1', // Mediterranean Bowl
        quantity: 2,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        price: 9.99,
        restaurantId: '1'
      },
      {
        menuItemId: '2', // Grilled Chicken Wrap
        quantity: 1,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        price: 7.99,
        restaurantId: '1'
      },
      {
        menuItemId: '5', // Green Smoothie Bowl
        quantity: 2,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        price: 7.99,
        restaurantId: '4'
      }
    ];

    this.transactions = demoTransactions;
    this.purchaseRecords = demoPurchases;
  }
}
