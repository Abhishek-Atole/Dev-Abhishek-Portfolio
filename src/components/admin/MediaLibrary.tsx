import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "blog-media";

const convertToWebP = (file: File, quality: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context error");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject("WebP conversion failed");
        },
        "image/webp",
        quality
      );
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const MediaLibrary = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  // Fetch image history
  const fetchImages = async () => {
    const { data, error } = await supabase.storage.from(BUCKET).list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (!error && data) setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setMessage("Converting to WebP...");
    try {
      const webpBlob = await convertToWebP(selectedFile, quality);
      const fileName = `${Date.now()}.webp`;
      const { error } = await supabase.storage.from(BUCKET).upload(fileName, webpBlob, { contentType: "image/webp" });
      if (error) throw error;
      setMessage("Upload successful!");
      setSelectedFile(null);
      fetchImages();
    } catch (err: any) {
      setMessage("Upload failed: " + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  // Like functionality (local only, for demo)
  const handleLike = (name: string) => {
    setLikes((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  };

  // Rename functionality
  const handleRename = async (oldName: string) => {
    if (!newName.trim()) return;
    const ext = oldName.split(".").pop();
    const newFileName = newName.endsWith(`.${ext}`) ? newName : `${newName}.${ext}`;
    // Download the file
    const { data, error } = await supabase.storage.from(BUCKET).download(oldName);
    if (error || !data) {
      setMessage("Failed to download file for renaming.");
      return;
    }
    // Upload with new name
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(newFileName, data, { contentType: "image/webp" });
    if (uploadError) {
      setMessage("Failed to upload renamed file.");
      return;
    }
    // Delete old file
    await supabase.storage.from(BUCKET).remove([oldName]);
    setRenaming(null);
    setNewName("");
    setMessage("File renamed successfully!");
    fetchImages();
  };

  // Calculate total size of all images (in bytes)
  const totalSize = images.reduce((acc, img) => acc + (img.metadata?.size || 0), 0);

  // Format bytes to KB/MB
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Image (Convert to WebP)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div>
          <label>Quality/Size: </label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
          />
          <span className="ml-2">{Math.round(quality * 100)}%</span>
        </div>
        <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? "Uploading..." : "Convert & Upload"}
        </Button>

        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <div>
            <span className="font-semibold">Total Uploaded Images:</span> {images.length}
          </div>
          <div>
            <span className="font-semibold">Total Size:</span> {formatBytes(totalSize)}
          </div>
        </div>

        <hr className="my-6" />

        <h3 className="font-bold text-lg mb-2">Image History</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map(img => {
            const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(img.name).data.publicUrl;
            return (
              <div key={img.name} className="border rounded p-2 flex flex-col items-center">
                <img
                  src={publicUrl}
                  alt={img.name}
                  className="w-full h-32 object-cover mb-2 rounded"
                />
                <div className="flex flex-wrap gap-2 mb-2 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(publicUrl);
                      setMessage("Image link copied!");
                    }}
                  >
                    Copy Link
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLike(img.name)}
                  >
                    👍 {likes[img.name] || 0}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRenaming(img.name);
                      setNewName("");
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      const { error } = await supabase.storage.from(BUCKET).remove([img.name]);
                      if (!error) {
                        setMessage("Image deleted!");
                        fetchImages();
                      } else {
                        setMessage("Failed to delete image.");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
                {renaming === img.name && (
                  <div className="flex flex-col gap-1 w-full">
                    <input
                      className="border px-2 py-1 rounded text-xs"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="New file name"
                    />
                    <Button size="sm" onClick={() => handleRename(img.name)}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRenaming(null)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {message && <div className="text-green-600 text-sm mt-2">{message}</div>}
      </CardContent>
    </Card>
  );
};

export default MediaLibrary;