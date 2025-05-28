
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import RichTextEditor from "./RichTextEditor";
import TagsManager from "./TagsManager";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: "draft" | "published" | "unpublished";
  cover_image?: string;
  published_date?: string;
  read_time?: number;
  created_at: string;
  updated_at: string;
}

interface AdminBlogEditorProps {
  postId?: string;
  onBack: () => void;
}

const AdminBlogEditor = ({ postId, onBack }: AdminBlogEditorProps) => {
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    status: "draft",
    cover_image: "",
    published_date: "",
    read_time: 5
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing post if editing
  const { data: existingPost, isLoading } = useQuery({
    queryKey: ["blog-post", postId],
    queryFn: async () => {
      if (!postId) return null;
      const { data, error } = await supabase
        .from("admin_blog_posts")
        .select("*")
        .eq("id", postId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!postId
  });

  useEffect(() => {
    if (existingPost) {
      setPost(existingPost);
    }
  }, [existingPost]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Save/Update post mutation
  const savePostMutation = useMutation({
    mutationFn: async (postData: Partial<BlogPost>) => {
      const slug = postData.slug || generateSlug(postData.title || "");
      
      if (postId) {
        // Update existing post
        const { data, error } = await supabase
          .from("admin_blog_posts")
          .update({
            ...postData,
            slug,
            updated_at: new Date().toISOString()
          })
          .eq("id", postId)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from("admin_blog_posts")
          .insert({
            ...postData,
            slug
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({
        title: "Success",
        description: `Post ${postId ? "updated" : "created"} successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSave = (status: "draft" | "published" | "unpublished" = "draft") => {
    const postData = {
      ...post,
      status,
      published_date: status === "published" ? new Date().toISOString().split('T')[0] : post.published_date
    };
    savePostMutation.mutate(postData);
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Posts
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          
          <Button
            onClick={() => handleSave("draft")}
            variant="outline"
            disabled={savePostMutation.isPending}
          >
            <Save size={16} className="mr-2" />
            Save Draft
          </Button>
          
          <Button
            onClick={() => handleSave("published")}
            disabled={savePostMutation.isPending}
          >
            Publish
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{postId ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={post.title || ""}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <Input
              value={post.slug || ""}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              placeholder="post-slug (auto-generated from title)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea
              value={post.excerpt || ""}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              placeholder="Brief description of the post"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image URL</label>
            <Input
              value={post.cover_image || ""}
              onChange={(e) => setPost({ ...post, cover_image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Read Time (minutes)</label>
              <Input
                type="number"
                value={post.read_time || 5}
                onChange={(e) => setPost({ ...post, read_time: parseInt(e.target.value) || 5 })}
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={post.status || "draft"}
                onChange={(e) => setPost({ ...post, status: e.target.value as "draft" | "published" | "unpublished" })}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
          </div>

          <TagsManager
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <RichTextEditor
              value={post.content || ""}
              onChange={(content) => setPost({ ...post, content })}
              preview={showPreview}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogEditor;
