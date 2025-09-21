import { GoogleGenerativeAI } from '@google/generative-ai';
import { FoodListing } from '@/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface FoodAnalysisResult {
  freshness: 'excellent' | 'good' | 'fair' | 'poor';
  summary: string;
  detectedItems: string[];
  qualityNotes: string[];
  recommendedPrice: number;
  estimatedExpiry: Date;
  freshnessScore: number;
}

export class GeminiService {
  private static instance: GeminiService;
  private model: any;

  private constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async analyzeFoodImages(images: File[]): Promise<FoodAnalysisResult> {
    if (!this.model) {
      throw new Error('Gemini API is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }

    if (images.length < 3) {
      throw new Error('At least 3 images are required for analysis');
    }

    try {
      // Convert images to base64
      const imageParts = await Promise.all(
        images.map(async (image) => {
          const arrayBuffer = await image.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          return {
            inlineData: {
              data: base64,
              mimeType: image.type,
            },
          };
        })
      );

      const prompt = `
        Analyze these food images and provide a comprehensive assessment. Please respond with a JSON object containing the following fields:

        {
          "freshness": "excellent|good|fair|poor",
          "summary": "A detailed description of the food items, their condition, and overall appeal",
          "detectedItems": ["list", "of", "detected", "food", "items"],
          "qualityNotes": ["list", "of", "quality", "observations", "and", "notes"],
          "recommendedPrice": 15.99,
          "estimatedExpiry": "2024-01-15T18:00:00Z",
          "freshnessScore": 8
        }

        Guidelines:
        - Assess freshness based on visual cues like color, texture, and overall appearance
        - Identify all food items visible in the images
        - Provide quality notes about the condition, presentation, and any concerns
        - Recommend a fair market price based on the food quality and condition
        - Estimate expiry time (typically 2-6 hours for prepared foods, 1-3 days for fresh ingredients)
        - Give a freshness score from 1-10 (10 being perfect, 1 being spoiled)
        - Be honest about any quality issues you observe
        - Consider the type of food and typical freshness indicators

        Respond ONLY with valid JSON, no additional text.
      `;

      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const analysis = JSON.parse(text);

      // Validate and transform the response
      return {
        freshness: analysis.freshness || 'fair',
        summary: analysis.summary || 'Food analysis completed',
        detectedItems: Array.isArray(analysis.detectedItems) ? analysis.detectedItems : [],
        qualityNotes: Array.isArray(analysis.qualityNotes) ? analysis.qualityNotes : [],
        recommendedPrice: parseFloat(analysis.recommendedPrice) || 10.00,
        estimatedExpiry: new Date(analysis.estimatedExpiry || new Date(Date.now() + 4 * 60 * 60 * 1000)),
        freshnessScore: Math.max(1, Math.min(10, parseInt(analysis.freshnessScore) || 5))
      };
    } catch (error) {
      console.error('Error analyzing food images:', error);
      
      // Return a fallback analysis if API fails
      return {
        freshness: 'fair',
        summary: 'Unable to analyze images due to technical issues. Please review manually.',
        detectedItems: ['Food items'],
        qualityNotes: ['Manual review recommended'],
        recommendedPrice: 10.00,
        estimatedExpiry: new Date(Date.now() + 4 * 60 * 60 * 1000),
        freshnessScore: 5
      };
    }
  }

  public async generateListingFromAnalysis(analysis: FoodAnalysisResult, additionalInfo?: {
    category?: string;
    dietary?: string[];
  }): Promise<Partial<FoodListing>> {
    const now = new Date();
    const timeLeft = this.calculateTimeLeft(analysis.estimatedExpiry, now);
    
    // Calculate discount based on freshness score
    const discountPercentage = this.calculateDiscountFromFreshness(analysis.freshnessScore);
    const discountedPrice = analysis.recommendedPrice * (1 - discountPercentage / 100);

    return {
      title: this.generateTitle(analysis.detectedItems),
      description: analysis.summary,
      originalPrice: analysis.recommendedPrice,
      discountedPrice: Math.round(discountedPrice * 100) / 100,
      discountPercentage: Math.round(discountPercentage),
      category: additionalInfo?.category || this.categorizeFood(analysis.detectedItems),
      dietary: additionalInfo?.dietary || this.detectDietaryInfo(analysis.detectedItems),
      available: true,
      timeLeft,
      freshnessScore: analysis.freshnessScore,
      aiAnalysis: analysis,
      createdAt: now,
      updatedAt: now
    };
  }

  private calculateTimeLeft(expiry: Date, now: Date): string {
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    } else {
      return 'Expired';
    }
  }

  private calculateDiscountFromFreshness(score: number): number {
    if (score >= 9) return 0;
    if (score >= 7) return 10;
    if (score >= 5) return 25;
    if (score >= 3) return 40;
    return 60;
  }

  private generateTitle(detectedItems: string[]): string {
    if (detectedItems.length === 0) return 'Fresh Food Items';
    if (detectedItems.length === 1) return detectedItems[0];
    if (detectedItems.length <= 3) return detectedItems.join(', ');
    return `${detectedItems.slice(0, 2).join(', ')} & More`;
  }

  private categorizeFood(detectedItems: string[]): string {
    const categories = {
      'Main Course': ['pizza', 'burger', 'pasta', 'rice', 'chicken', 'beef', 'fish', 'sandwich', 'wrap'],
      'Appetizer': ['salad', 'soup', 'dip', 'bruschetta', 'wings', 'fries'],
      'Dessert': ['cake', 'pie', 'cookie', 'ice cream', 'pudding', 'tart', 'muffin'],
      'Bakery': ['bread', 'croissant', 'bagel', 'donut', 'pastry', 'roll'],
      'Beverage': ['juice', 'smoothie', 'coffee', 'tea', 'soda', 'water'],
      'Snack': ['chips', 'nuts', 'crackers', 'popcorn', 'granola']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (detectedItems.some(item => 
        keywords.some(keyword => 
          item.toLowerCase().includes(keyword)
        )
      )) {
        return category;
      }
    }

    return 'Food';
  }

  private detectDietaryInfo(detectedItems: string[]): string[] {
    const dietary = [];
    const itemsText = detectedItems.join(' ').toLowerCase();

    if (itemsText.includes('vegetable') || itemsText.includes('salad') || itemsText.includes('veggie')) {
      dietary.push('vegetarian');
    }
    if (itemsText.includes('vegan') || (!itemsText.includes('dairy') && !itemsText.includes('meat') && !itemsText.includes('egg'))) {
      dietary.push('vegan');
    }
    if (itemsText.includes('gluten') || itemsText.includes('bread') || itemsText.includes('pasta')) {
      dietary.push('gluten-free');
    }

    return dietary;
  }
}

export const geminiService = GeminiService.getInstance();
