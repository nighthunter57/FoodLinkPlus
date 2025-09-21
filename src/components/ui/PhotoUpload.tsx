import React, { useCallback, useState } from 'react';
import { Upload, X, Camera, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhotoUpload as PhotoUploadType } from '@/types';

interface PhotoUploadProps {
  photos: PhotoUploadType[];
  onPhotosChange: (photos: PhotoUploadType[]) => void;
  maxPhotos?: number;
  minPhotos?: number;
  className?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 10,
  minPhotos = 3,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    setError(null);
    const newPhotos: PhotoUploadType[] = [];
    const validFiles: File[] = [];

    // Validate files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not a valid image file`);
        continue;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      validFiles.push(file);
    }

    // Check total photo count
    if (photos.length + validFiles.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    // Process valid files
    validFiles.forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      newPhotos.push({
        id,
        file,
        preview
      });
    });

    onPhotosChange([...photos, ...newPhotos]);
  }, [photos, maxPhotos, onPhotosChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removePhoto = useCallback((id: string) => {
    const photoToRemove = photos.find(p => p.id === id);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    onPhotosChange(photos.filter(p => p.id !== id));
  }, [photos, onPhotosChange]);

  const canAddMore = photos.length < maxPhotos;
  const hasMinimum = photos.length >= minPhotos;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}>
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center justify-center space-y-4"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Camera size={24} />
              <span className="text-lg font-medium">
                {dragActive ? 'Drop photos here' : 'Upload Food Photos'}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Drag and drop images here, or click to select files
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Minimum: {minPhotos} photos</span>
              <span>•</span>
              <span>Maximum: {maxPhotos} photos</span>
              <span>•</span>
              <span>Max 5MB per file</span>
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="photo-upload"
              disabled={!canAddMore}
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
              disabled={!canAddMore}
              className="flex items-center space-x-2"
            >
              <Upload size={16} />
              <span>{canAddMore ? 'Choose Photos' : 'Maximum reached'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Minimum Photos Warning */}
      {!hasMinimum && photos.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please upload at least {minPhotos} photos for better analysis
          </AlertDescription>
        </Alert>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Uploaded Photos ({photos.length}/{maxPhotos})</h3>
            {hasMinimum && (
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <ImageIcon size={12} />
                <span>Ready for analysis</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={photo.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(photo.id)}
                >
                  <X size={12} />
                </Button>
                
                {/* Photo Number */}
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
