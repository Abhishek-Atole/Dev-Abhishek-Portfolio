
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Link, Image, FileText, Video, Check, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MediaUploaderProps {
  onImageUploaded: (url: string) => void;
}

const MediaUploader = ({ onImageUploaded }: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WebP image.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // If bucket doesn't exist, create it
        if (error.message.includes('Bucket not found')) {
          await supabase.storage.createBucket('blog-media', {
            public: true,
            allowedMimeTypes: allowedTypes,
            fileSizeLimit: 5242880 // 5MB
          });
          
          // Retry upload
          const { data: retryData, error: retryError } = await supabase.storage
            .from('blog-media')
            .upload(fileName, file);
          
          if (retryError) throw retryError;
          data && Object.assign(data, retryData);
        } else {
          throw error;
        }
      }

      setUploadProgress(75);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-media')
        .getPublicUrl(fileName);

      setUploadProgress(90);

      // Save to media_uploads table for tracking
      await supabase.from('media_uploads').insert({
        filename: fileName,
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
        url: publicUrl
      });

      setUploadProgress(100);
      onImageUploaded(publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Image uploaded and ready to use.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Empty URL",
        description: "Please enter an image URL.",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      const url = new URL(imageUrl);
      
      // Check if it looks like an image URL
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasImageExtension = imageExtensions.some(ext => 
        url.pathname.toLowerCase().includes(ext)
      );
      
      if (!hasImageExtension && !url.hostname.includes('unsplash') && !url.hostname.includes('imgur')) {
        toast({
          title: "Invalid image URL",
          description: "URL doesn't appear to be an image. Please use a direct image link.",
          variant: "destructive"
        });
        return;
      }
      
      onImageUploaded(imageUrl);
      setImageUrl("");
      toast({
        title: "Image URL added",
        description: "External image URL has been set.",
      });
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Image size={20} className="text-primary" />
          Cover Image Upload
          <Badge variant="secondary" className="text-xs font-mono">
            Media Manager
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* File Upload */}
        <div className="space-y-3">
          <Label htmlFor="file-upload" className="text-sm font-medium">
            Upload from Device
          </Label>
          <div className="relative">
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading... {uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>
          {isUploading && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Check size={12} className="text-green-600" />
            Supported: JPEG, PNG, GIF, WebP • Max size: 5MB
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-3">
          <Label htmlFor="image-url" className="text-sm font-medium">
            Use External Image URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 font-mono text-sm"
            />
            <Button 
              onClick={handleUrlSubmit} 
              variant="outline" 
              className="shrink-0"
              disabled={!imageUrl.trim()}
            >
              <Link size={16} className="mr-2" />
              Add URL
            </Button>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertCircle size={12} className="text-amber-600" />
            Ensure the URL points directly to an image file
          </p>
        </div>

        {/* Media Guidelines */}
        <Card className="bg-muted/30 border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              Media Guidelines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <Image size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Images</p>
                  <p className="text-muted-foreground">JPEG, PNG, GIF, WebP up to 5MB</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Video size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Videos</p>
                  <p className="text-muted-foreground">Embed via URL or HTML in content</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Upload size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Best Quality</p>
                  <p className="text-muted-foreground">1200x630px for social sharing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default MediaUploader;
