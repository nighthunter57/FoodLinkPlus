# AI-Powered Food Listings Feature

This feature enables sellers to upload photos of their food items and automatically generate detailed listings using AI analysis powered by Google's Gemini API.

## 🚀 Features

### For Sellers
- **Multi-photo Upload**: Upload 3-10 high-quality photos of food items
- **AI Analysis**: Automatic freshness assessment and quality analysis
- **Auto-generated Listings**: AI creates complete listings with titles, descriptions, pricing, and categories
- **Smart Pricing**: AI recommends optimal pricing based on food quality and condition
- **Freshness Scoring**: 1-10 scale freshness assessment with visual indicators
- **Dietary Detection**: Automatic detection of dietary information (vegetarian, vegan, gluten-free, etc.)

### For Buyers
- **Visual Food Listings**: Browse food items with multiple high-quality photos
- **Freshness Indicators**: Clear freshness scores and quality badges
- **AI-Generated Descriptions**: Detailed, accurate descriptions of food items
- **Smart Filtering**: Filter by freshness, dietary requirements, price range
- **Quality Assurance**: AI-verified quality and condition information

## 🛠 Technical Implementation

### Core Components

1. **PhotoUpload Component** (`src/components/ui/PhotoUpload.tsx`)
   - Drag-and-drop photo upload interface
   - Image validation and preview
   - Support for 3-10 photos per listing
   - File size and type validation

2. **AIAnalysis Component** (`src/components/ui/AIAnalysis.tsx`)
   - Integration with Gemini API
   - Real-time analysis progress
   - Freshness scoring and quality assessment
   - Error handling and fallback analysis

3. **FoodListingForm Component** (`src/components/ui/FoodListingForm.tsx`)
   - Auto-populated form fields
   - Editable AI-generated content
   - Price calculation and discount logic
   - Category and dietary information management

4. **CreateListingScreen Component** (`src/components/Screens/CreateListingScreen.tsx`)
   - Step-by-step listing creation process
   - Progress tracking and navigation
   - Integration of all listing components

5. **FoodListingCard Component** (`src/components/ui/FoodListingCard.tsx`)
   - Display food listings with photos
   - Freshness indicators and quality badges
   - Interactive elements (like, share, add to cart)

### Services

1. **GeminiService** (`src/services/geminiService.ts`)
   - Google Gemini API integration
   - Image analysis and processing
   - Food freshness assessment
   - Automatic listing generation
   - Error handling and fallback mechanisms

### Data Models

1. **FoodListing Interface** (`src/types/index.ts`)
   ```typescript
   interface FoodListing {
     id: string;
     sellerId: string;
     title: string;
     description: string;
     images: string[];
     originalPrice: number;
     discountedPrice: number;
     discountPercentage: number;
     category: string;
     dietary: string[];
     available: boolean;
     timeLeft?: string;
     freshnessScore: number; // 1-10 scale
     aiAnalysis: {
       freshness: 'excellent' | 'good' | 'fair' | 'poor';
       summary: string;
       detectedItems: string[];
       qualityNotes: string[];
       recommendedPrice: number;
       estimatedExpiry: Date;
     };
     createdAt: Date;
     updatedAt: Date;
   }
   ```

2. **PhotoUpload Interface**
   ```typescript
   interface PhotoUpload {
     file: File;
     preview: string;
     id: string;
   }
   ```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install @google/generative-ai
```

### 2. Environment Configuration
Create a `.env.local` file with your Gemini API key:
```env
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your environment variables

## 📱 User Experience

### Seller Workflow
1. **Access**: Navigate to Profile screen or Home screen (for sellers)
2. **Upload**: Click "Create New Listing" or "Sell Food" button
3. **Photos**: Upload 3-10 photos of food items
4. **Analysis**: AI analyzes photos for freshness and quality
5. **Review**: Review and edit AI-generated listing details
6. **Publish**: Publish the listing to make it visible to buyers

### Buyer Workflow
1. **Browse**: Navigate to Browse screen
2. **Switch Tabs**: Switch between "Restaurants" and "Food Listings" tabs
3. **Filter**: Use filters to find specific food items
4. **View Details**: Click on listings to see full details and photos
5. **Purchase**: Add items to cart and checkout

## 🎨 UI/UX Features

### Visual Design
- **Modern Interface**: Clean, intuitive design with shadcn/ui components
- **Progress Indicators**: Step-by-step progress tracking
- **Quality Badges**: Color-coded freshness and quality indicators
- **Image Carousels**: Smooth photo browsing experience
- **Responsive Design**: Works on mobile and desktop

### User Feedback
- **Real-time Validation**: Immediate feedback on photo uploads
- **Progress Updates**: Live analysis progress with percentage
- **Error Handling**: Clear error messages and recovery options
- **Success Notifications**: Toast notifications for completed actions

## 🔍 AI Analysis Features

### Freshness Assessment
- **Visual Analysis**: Examines color, texture, and overall appearance
- **Quality Scoring**: 1-10 scale with detailed explanations
- **Freshness Levels**: Excellent, Good, Fair, Poor classifications
- **Expiry Estimation**: AI-predicted expiration times

### Content Generation
- **Smart Titles**: Auto-generated based on detected food items
- **Detailed Descriptions**: Comprehensive food descriptions
- **Category Detection**: Automatic categorization of food types
- **Dietary Information**: Detection of vegetarian, vegan, gluten-free options
- **Price Recommendations**: Market-based pricing suggestions

## 🚦 Error Handling

### API Failures
- **Graceful Degradation**: Fallback analysis when API is unavailable
- **Retry Mechanisms**: Automatic retry for transient failures
- **User Notifications**: Clear error messages and next steps

### Validation
- **Photo Requirements**: Minimum 3 photos, maximum 10
- **File Validation**: Size limits (5MB) and type checking
- **Form Validation**: Required fields and data integrity

## 🔮 Future Enhancements

### Planned Features
- **Batch Upload**: Upload multiple listings at once
- **Template System**: Save and reuse listing templates
- **Analytics Dashboard**: Seller performance metrics
- **Quality Trends**: Track freshness scores over time
- **Smart Notifications**: Alerts for expiring items

### Technical Improvements
- **Image Optimization**: Automatic compression and resizing
- **Caching**: Improved performance with image caching
- **Offline Support**: Work offline with sync when online
- **Advanced AI**: More sophisticated analysis algorithms

## 🧪 Testing

### Manual Testing
1. Upload various food photos
2. Test AI analysis with different food types
3. Verify form auto-population
4. Test error scenarios
5. Validate buyer experience

### Test Cases
- **Photo Upload**: Various file types, sizes, and quantities
- **AI Analysis**: Different food types and conditions
- **Form Validation**: Required fields and data integrity
- **Navigation**: Screen transitions and state management
- **Error Handling**: Network failures and invalid inputs

## 📊 Performance Considerations

### Optimization
- **Image Compression**: Automatic image optimization
- **Lazy Loading**: Load images as needed
- **Caching**: Cache analysis results
- **Debouncing**: Optimize search and filter inputs

### Monitoring
- **API Usage**: Track Gemini API calls and costs
- **Performance Metrics**: Load times and user interactions
- **Error Rates**: Monitor and alert on failures

## 🔒 Security & Privacy

### Data Protection
- **Image Storage**: Secure handling of uploaded photos
- **API Security**: Secure API key management
- **User Data**: Privacy-compliant data handling
- **Content Moderation**: AI-powered content filtering

### Compliance
- **GDPR**: European data protection compliance
- **CCPA**: California privacy law compliance
- **Food Safety**: Adherence to food safety guidelines

## 📈 Analytics & Metrics

### Key Metrics
- **Listing Creation Rate**: How many listings are created
- **AI Accuracy**: Freshness assessment accuracy
- **User Engagement**: Time spent on listing creation
- **Conversion Rate**: Listings that result in sales

### Monitoring
- **Real-time Dashboards**: Live metrics and alerts
- **Performance Tracking**: System performance monitoring
- **User Feedback**: Collection and analysis of user feedback

This AI-powered food listings feature transforms the way sellers create and manage their food listings, while providing buyers with detailed, accurate information about food quality and freshness. The integration of AI analysis ensures consistent, high-quality listings that build trust and improve the overall marketplace experience.
