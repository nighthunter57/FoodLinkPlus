import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Restaurant, Donation, ReservationItem } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import { useToast } from '@/hooks/use-toast';

interface ReserveModalProps {
  donation: Donation;
  restaurant: Restaurant;
  onClose: () => void;
}

const ReserveModal: React.FC<ReserveModalProps> = ({ donation, restaurant, onClose }) => {
  const [selectedItems, setSelectedItems] = useState<ReservationItem[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const updateItemQuantity = (itemId: string, newQty: number) => {
    if (newQty === 0) {
      setSelectedItems(prev => prev.filter(item => item.itemId !== itemId));
    } else {
      setSelectedItems(prev => {
        const existing = prev.find(item => item.itemId === itemId);
        if (existing) {
          return prev.map(item => 
            item.itemId === itemId ? { ...item, qty: newQty } : item
          );
        } else {
          return [...prev, { itemId, qty: newQty }];
        }
      });
    }
  };

  const getItemQuantity = (itemId: string) => {
    return selectedItems.find(item => item.itemId === itemId)?.qty || 0;
  };

  const getTotalQuantity = () => {
    return selectedItems.reduce((sum, item) => sum + item.qty, 0);
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((sum, reservedItem) => {
      const donationItem = donation.items.find(item => item.id === reservedItem.itemId);
      const price = donationItem?.discountedPrice || 0;
      return sum + (price * reservedItem.qty);
    }, 0);
  };

  const handleReserve = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Create reservation
    const reservationId = `res-${Date.now()}`;
    
    // Mock reservation creation
    toast({
      title: "Reservation confirmed",
      description: `Reservation ${reservationId}. See Cart for details.`,
    });
    
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <Card className="w-full max-w-md rounded-t-lg border-t border-l border-r border-border max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>{restaurant.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{donation.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4 pb-6">
            {/* Pickup info */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Pickup:</strong> Today {donation.pickupWindowStart} - {donation.pickupWindowEnd}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {donation.location.address}
              </p>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-medium mb-3">Select items</h3>
              <div className="space-y-3">
                {donation.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.qtyAvailable} available
                        {item.discountedPrice && (
                          <span className="text-success ml-2">
                            ${item.discountedPrice.toFixed(2)} each
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemQuantity(item.id, Math.max(0, getItemQuantity(item.id) - 1))}
                        disabled={getItemQuantity(item.id) === 0}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="w-8 text-center">{getItemQuantity(item.id)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemQuantity(item.id, getItemQuantity(item.id) + 1)}
                        disabled={getItemQuantity(item.id) >= item.qtyAvailable}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {getTotalQuantity() > 0 && (
              <div className="p-3 bg-accent/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Total: {getTotalQuantity()} items
                  </span>
                  <span className="font-bold text-primary">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Action button */}
            <Button 
              onClick={handleReserve}
              className="w-full"
              disabled={getTotalQuantity() === 0}
            >
              {getTotalQuantity() === 0 ? 'Select items to reserve' : 'Reserve'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default ReserveModal;