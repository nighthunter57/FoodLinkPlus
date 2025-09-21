import React, { useState, useEffect } from 'react';
import { Save, Edit3, Check, X, DollarSign, Tag, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FoodListing, PhotoUpload as PhotoUploadType } from '@/types';
import { FoodAnalysisResult } from '@/services/geminiService';

interface FoodListingFormProps {
  photos: PhotoUploadType[];
  analysis: FoodAnalysisResult | null;
  onSubmit: (listing: Partial<FoodListing>) => void;
  onCancel: () => void;
  className?: string;
}

const DIETARY_OPTIONS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'keto',
  'paleo',
  'halal',
  'kosher'
];

const CATEGORY_OPTIONS = [
  'Main Course',
  'Appetizer',
  'Dessert',
  'Bakery',
  'Beverage',
  'Snack',
  'Salad',
  'Soup',
  'Other'
];

export const FoodListingForm: React.FC<FoodListingFormProps> = ({
  photos,
  analysis,
  onSubmit,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState<Partial<FoodListing>>({
    title: '',
    description: '',
    originalPrice: 0,
    discountedPrice: 0,
    discountPercentage: 0,
    category: '',
    dietary: [],
    available: true
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate form when analysis is available
  useEffect(() => {
    if (analysis) {
      const generatedListing = {
        title: analysis.detectedItems.length > 0 
          ? analysis.detectedItems.slice(0, 2).join(', ')
          : 'Fresh Food Items',
        description: analysis.summary,
        originalPrice: analysis.recommendedPrice,
        discountedPrice: Math.round(analysis.recommendedPrice * 0.8 * 100) / 100,
        discountPercentage: 20,
        category: 'Food',
        dietary: analysis.detectedItems.some(item => 
          item.toLowerCase().includes('vegetable') || 
          item.toLowerCase().includes('salad')
        ) ? ['vegetarian'] : [],
        available: true
      };

      setFormData(generatedListing);
    }
  }, [analysis]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts editing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate discount percentage
    if (field === 'originalPrice' || field === 'discountedPrice') {
      const original = field === 'originalPrice' ? value : formData.originalPrice || 0;
      const discounted = field === 'discountedPrice' ? value : formData.discountedPrice || 0;
      
      if (original > 0 && discounted > 0) {
        const percentage = Math.round(((original - discounted) / original) * 100);
        setFormData(prev => ({ ...prev, discountPercentage: Math.max(0, percentage) }));
      }
    }
  };

  const handleDietaryChange = (dietary: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietary: checked 
        ? [...(prev.dietary || []), dietary]
        : (prev.dietary || []).filter(d => d !== dietary)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.originalPrice || formData.originalPrice <= 0) {
      newErrors.originalPrice = 'Original price must be greater than 0';
    }

    if (!formData.discountedPrice || formData.discountedPrice <= 0) {
      newErrors.discountedPrice = 'Discounted price must be greater than 0';
    }

    if (formData.originalPrice && formData.discountedPrice && 
        formData.discountedPrice >= formData.originalPrice) {
      newErrors.discountedPrice = 'Discounted price must be less than original price';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (photos.length < 3) {
      newErrors.photos = 'At least 3 photos are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const listingData: Partial<FoodListing> = {
      ...formData,
      images: photos.map(photo => photo.preview),
      freshnessScore: analysis?.freshnessScore || 5,
      aiAnalysis: analysis ? {
        freshness: analysis.freshness,
        summary: analysis.summary,
        detectedItems: analysis.detectedItems,
        qualityNotes: analysis.qualityNotes,
        recommendedPrice: analysis.recommendedPrice,
        estimatedExpiry: analysis.estimatedExpiry
      } : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSubmit(listingData);
  };

  const startEditing = (field: string) => {
    setEditingField(field);
  };

  const stopEditing = () => {
    setEditingField(null);
  };

  const isFieldEditable = (field: string) => editingField === field;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Edit3 className="h-5 w-5" />
          <span>Create Food Listing</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter food item title"
                className={errors.title ? 'border-destructive' : ''}
              />
              {!isFieldEditable('title') && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing('title')}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the food items..."
              rows={3}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice || ''}
                  onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`pl-10 ${errors.originalPrice ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.originalPrice && (
                <p className="text-sm text-destructive">{errors.originalPrice}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountedPrice">Discounted Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="discountedPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountedPrice || ''}
                  onChange={(e) => handleInputChange('discountedPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`pl-10 ${errors.discountedPrice ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.discountedPrice && (
                <p className="text-sm text-destructive">{errors.discountedPrice}</p>
              )}
            </div>
          </div>

          {/* Discount Percentage Display */}
          {formData.originalPrice && formData.discountedPrice && (
            <div className="flex items-center space-x-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Discount:</span>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                {formData.discountPercentage}% off
              </Badge>
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category || ''}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Dietary Options */}
          <div className="space-y-2">
            <Label>Dietary Information</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DIETARY_OPTIONS.map((dietary) => (
                <div key={dietary} className="flex items-center space-x-2">
                  <Checkbox
                    id={dietary}
                    checked={formData.dietary?.includes(dietary) || false}
                    onCheckedChange={(checked) => handleDietaryChange(dietary, checked as boolean)}
                  />
                  <Label htmlFor={dietary} className="text-sm font-normal">
                    {dietary.charAt(0).toUpperCase() + dietary.slice(1).replace('-', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Summary */}
          {analysis && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">AI Analysis Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Freshness:</span>
                  <Badge className="ml-2 text-xs">{analysis.freshness}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Score:</span>
                  <span className="ml-2 font-medium">{analysis.freshnessScore}/10</span>
                </div>
              </div>
            </div>
          )}

          {/* Photo Count */}
          {errors.photos && (
            <Alert variant="destructive">
              <AlertDescription>{errors.photos}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Create Listing</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FoodListingForm;
