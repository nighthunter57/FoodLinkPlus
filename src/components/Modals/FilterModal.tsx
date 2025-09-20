import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dietaryFilters } from '@/data/mockData';

interface FilterModalProps {
  filters: {
    distance: string;
    dietary: string[];
    expiry: string;
    price: string;
  };
  onFilterChange: (filters: {
    distance: string;
    dietary: string[];
    expiry: string;
    price: string;
  }) => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ filters, onFilterChange, onClose }) => {
  const handleDietaryChange = (dietary: string, checked: boolean) => {
    const newDietary = checked 
      ? [...filters.dietary, dietary]
      : filters.dietary.filter(d => d !== dietary);
    
    onFilterChange({
      ...filters,
      dietary: newDietary
    });
  };

  const handleReset = () => {
    onFilterChange({
      distance: 'all',
      dietary: [],
      expiry: 'any',
      price: 'all'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <Card className="w-full max-w-md rounded-t-lg border-t border-l border-r border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-6">
          {/* Distance */}
          <div>
            <h3 className="font-medium mb-3">Distance</h3>
            <Select value={filters.distance} onValueChange={(value) => onFilterChange({ ...filters, distance: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any distance</SelectItem>
                <SelectItem value="0.5">Within 0.5 mi</SelectItem>
                <SelectItem value="1">Within 1 mi</SelectItem>
                <SelectItem value="2">Within 2 mi</SelectItem>
                <SelectItem value="5">Within 5 mi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dietary */}
          <div>
            <h3 className="font-medium mb-3">Dietary</h3>
            <div className="grid grid-cols-2 gap-3">
              {dietaryFilters.map(dietary => (
                <label key={dietary} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.dietary.includes(dietary)}
                    onCheckedChange={(checked) => handleDietaryChange(dietary, checked as boolean)}
                  />
                  <span className="text-sm capitalize">{dietary.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Expiry */}
          <div>
            <h3 className="font-medium mb-3">Expiry</h3>
            <Select value={filters.expiry} onValueChange={(value) => onFilterChange({ ...filters, expiry: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="<2h">&lt;2h</SelectItem>
                <SelectItem value="<6h">&lt;6h</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-medium mb-3">Price</h3>
            <Select value={filters.price} onValueChange={(value) => onFilterChange({ ...filters, price: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="discounted">Discounted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
            <Button onClick={onClose} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterModal;