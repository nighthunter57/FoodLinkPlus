import React, { useState } from 'react';
import { ArrowLeft, Upload, Brain, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/ui/PhotoUpload';
import AIAnalysis from '@/components/ui/AIAnalysis';
import FoodListingForm from '@/components/ui/FoodListingForm';
import { PhotoUpload as PhotoUploadType, FoodListing } from '@/types';
import { FoodAnalysisResult } from '@/services/geminiService';

interface CreateListingScreenProps {
  onBack: () => void;
  onListingCreated: (listing: FoodListing) => void;
}

type Step = 'upload' | 'analyze' | 'form' | 'complete';

export const CreateListingScreen: React.FC<CreateListingScreenProps> = ({
  onBack,
  onListingCreated
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [photos, setPhotos] = useState<PhotoUploadType[]>([]);
  const [analysis, setAnalysis] = useState<FoodAnalysisResult | null>(null);
  const [listing, setListing] = useState<FoodListing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const steps = [
    { id: 'upload', title: 'Upload Photos', icon: Upload, description: 'Upload at least 3 photos of your food' },
    { id: 'analyze', title: 'AI Analysis', icon: Brain, description: 'Get AI-powered freshness analysis' },
    { id: 'form', title: 'Create Listing', icon: FileText, description: 'Review and customize your listing' },
    { id: 'complete', title: 'Complete', icon: CheckCircle, description: 'Your listing is ready!' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handlePhotosChange = (newPhotos: PhotoUploadType[]) => {
    setPhotos(newPhotos);
    setError(null);
    
    // Auto-advance to analysis if we have enough photos
    if (newPhotos.length >= 3 && currentStep === 'upload') {
      setCurrentStep('analyze');
    }
  };

  const handleAnalysisComplete = (analysisResult: FoodAnalysisResult) => {
    setAnalysis(analysisResult);
    setError(null);
    setCurrentStep('form');
    
    toast({
      title: "Analysis Complete!",
      description: `Freshness: ${analysisResult.freshness} (${analysisResult.freshnessScore}/10)`,
    });
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: "Analysis Failed",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleFormSubmit = (listingData: Partial<FoodListing>) => {
    const newListing: FoodListing = {
      id: Math.random().toString(36).substr(2, 9),
      sellerId: 'current-user', // This would come from auth context
      ...listingData,
      images: photos.map(photo => photo.preview),
    } as FoodListing;

    setListing(newListing);
    setCurrentStep('complete');
    
    toast({
      title: "Listing Created!",
      description: "Your food listing has been successfully created.",
    });
  };

  const handlePublishListing = () => {
    if (listing) {
      onListingCreated(listing);
      toast({
        title: "Listing Published!",
        description: "Your food listing is now live and visible to buyers.",
      });
    }
  };

  const canProceedToAnalysis = photos.length >= 3;
  const canProceedToForm = analysis !== null;
  const canComplete = listing !== null;

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Create Food Listing</h1>
              <p className="text-sm text-muted-foreground">
                Use AI to analyze your food and create an attractive listing
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Progress Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const status = getStepStatus(step.id);
                  const isCompleted = status === 'completed';
                  const isCurrent = status === 'current';
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          isCompleted 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : isCurrent 
                            ? 'border-primary text-primary' 
                            : 'border-muted-foreground text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-medium ${
                            isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-4 ${
                          isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step Content */}
          {currentStep === 'upload' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload Food Photos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PhotoUpload
                    photos={photos}
                    onPhotosChange={handlePhotosChange}
                    minPhotos={3}
                    maxPhotos={10}
                  />
                </CardContent>
              </Card>

              {canProceedToAnalysis && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentStep('analyze')}
                    className="flex items-center space-x-2"
                  >
                    <Brain className="h-4 w-4" />
                    <span>Start AI Analysis</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'analyze' && (
            <div className="space-y-6">
              <AIAnalysis
                photos={photos}
                onAnalysisComplete={handleAnalysisComplete}
                onError={handleAnalysisError}
              />

              {canProceedToForm && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentStep('form')}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Create Listing</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'form' && (
            <div className="space-y-6">
              <FoodListingForm
                photos={photos}
                analysis={analysis}
                onSubmit={handleFormSubmit}
                onCancel={() => setCurrentStep('analyze')}
              />
            </div>
          )}

          {currentStep === 'complete' && listing && (
            <div className="space-y-6">
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span>Listing Created Successfully!</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">{listing.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="bg-accent text-accent-foreground">
                          {listing.discountPercentage}% off
                        </Badge>
                        <Badge variant="outline">
                          {listing.freshnessScore}/10 freshness
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Your listing is ready to be published and will be visible to buyers.
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('form')}
                      >
                        Edit Listing
                      </Button>
                      <Button
                        onClick={handlePublishListing}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Publish Listing</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateListingScreen;
