import React, { useState } from 'react';
import { Brain, Sparkles, Clock, Star, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhotoUpload as PhotoUploadType } from '@/types';
import { geminiService, FoodAnalysisResult } from '@/services/geminiService';

interface AIAnalysisProps {
  photos: PhotoUploadType[];
  onAnalysisComplete: (analysis: FoodAnalysisResult) => void;
  onError: (error: string) => void;
  className?: string;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({
  photos,
  onAnalysisComplete,
  onError,
  className = ''
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (photos.length < 3) {
      onError('Please upload at least 3 photos for analysis');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysis(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      const files = photos.map(photo => photo.file);
      const result = await geminiService.analyzeFoodImages(files);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setAnalysis(result);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      onError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFreshnessIcon = (freshness: string) => {
    switch (freshness) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'fair': return <AlertTriangle className="h-4 w-4" />;
      case 'poor': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const canAnalyze = photos.length >= 3 && !isAnalyzing;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Analysis Trigger */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Food Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Upload at least 3 photos to get AI-powered freshness analysis and automatic listing generation
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>~30 seconds</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Powered by Gemini AI</span>
                </span>
              </div>
            </div>
            
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              <span>
                {isAnalyzing ? 'Analyzing...' : 'Analyze Photos'}
              </span>
            </Button>
          </div>

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing food freshness...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Freshness Score */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getFreshnessIcon(analysis.freshness)}
                <div>
                  <p className="font-medium">Freshness Assessment</p>
                  <p className="text-sm text-muted-foreground">
                    {analysis.freshness.charAt(0).toUpperCase() + analysis.freshness.slice(1)} quality
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold">{analysis.freshnessScore}/10</span>
                </div>
                <Badge className={`text-xs ${getFreshnessColor(analysis.freshness)}`}>
                  {analysis.freshness}
                </Badge>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="font-medium mb-2">AI Summary</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {analysis.summary}
              </p>
            </div>

            {/* Detected Items */}
            {analysis.detectedItems.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Detected Food Items</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.detectedItems.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Notes */}
            {analysis.qualityNotes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Quality Notes</h4>
                <ul className="space-y-1">
                  {analysis.qualityNotes.map((note, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price Recommendation */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Recommended Price</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on quality and market analysis
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${analysis.recommendedPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Estimated expiry: {analysis.estimatedExpiry.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {photos.length > 0 && photos.length < 3 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please upload at least 3 photos to enable AI analysis
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AIAnalysis;
