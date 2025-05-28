
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Link, Image, FileText, Video } from "lucide-react";

interface MediaUploaderProps {
  onImageUploaded: (url: string) => void;
}

const MediaUploader = ({ onImageUploaded }: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
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

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('blog-media')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-media')
        .getPublicUrl(fileName);

      // Save to media_uploads table
      await supabase.from('media_uploads').insert({
        filename: fileName,
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
        url: publicUrl
      });

      onImageUploaded(publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Image uploaded and set as cover image.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) return;

    // Basic URL validation
    try {
      new URL(imageUrl);
      onImageUploaded(imageUrl);
      setImageUrl("");
      toast({
        title: "Image URL added",
        description: "Image URL set as cover image.",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image size={20} />
          Media Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Image</Label>
          <div className="flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="flex-1"
            />
            <Button disabled={isUploading} variant="outline" className="shrink-0">
              <Upload size={16} className="mr-2" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
          </p>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="image-url">Or use image URL</Label>
          <div className="flex items-center gap-2">
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} variant="outline" className="shrink-0">
              <Link size={16} className="mr-2" />
              Add URL
            </Button>
          </div>
        </div>

        {/* Media Guidelines */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm">Media Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Image size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Images</p>
                <p className="text-muted-foreground">JPEG, PNG, GIF, WebP up to 5MB</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Video size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Videos</p>
                <p className="text-muted-foreground">Embed via URL or HTML</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Documents</p>
                <p className="text-muted-foreground">Link to external PDFs</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaUploader;
