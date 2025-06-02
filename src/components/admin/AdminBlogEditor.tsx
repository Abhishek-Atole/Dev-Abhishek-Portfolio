import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
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
      console.log("Fetching post for editing:", postId);
      const { data, error } = await supabase
        .from("admin_blog_posts")
        .select("*")
        .eq("id", postId)
        .single();
      if (error) {
        console.error("Error fetching post:", error);
        throw error;
      }
      console.log("Fetched post:", data);
      return data;
    },
    enabled: !!postId
  });

  useEffect(() => {
    if (existingPost) {
      const typedPost: Partial<BlogPost> = {
        ...existingPost,
        status: existingPost.status as "draft" | "published" | "unpublished"
      };
      setPost(typedPost);
    }
  }, [existingPost]);

  // Auto-generate slug from title
  useEffect(() => {
    if (post.title && !postId) {
      const generatedSlug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setPost(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [post.title, postId]);

  // Save/Update post mutation
  const savePostMutation = useMutation({
    mutationFn: async (postData: Partial<BlogPost>) => {
      console.log("Saving post data:", postData);
      
      // Validate required fields
      if (!postData.title || !postData.content || !postData.slug) {
        throw new Error("Title, content, and slug are required.");
      }

      // Check for slug uniqueness if creating new post or changing slug
      if (!postId || postData.slug !== existingPost?.slug) {
        const { data: existing } = await supabase
          .from("admin_blog_posts")
          .select("id")
          .eq("slug", postData.slug)
          .neq("id", postId || "")
          .maybeSingle();
        
        if (existing) {
          throw new Error("A post with this slug already exists. Please choose a different slug.");
        }
      }

      const dataToSave = {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt || null,
        slug: postData.slug,
        status: postData.status || "draft",
        cover_image: postData.cover_image || null,
        published_date: postData.published_date || null,
        read_time: postData.read_time || 5
      };

      if (postId) {
        // Update existing post
        console.log("Updating existing post:", postId);
        const { data, error } = await supabase
          .from("admin_blog_posts")
          .update({ ...dataToSave, updated_at: new Date().toISOString() })
          .eq("id", postId)
          .select()
          .single();
        
        if (error) {
          console.error("Error updating post:", error);
          throw error;
        }
        console.log("Post updated successfully:", data);
        return data;
      } else {
        // Create new post
        console.log("Creating new post");
        const { data, error } = await supabase
          .from("admin_blog_posts")
          .insert(dataToSave)
          .select()
          .single();
        
        if (error) {
          console.error("Error creating post:", error);
          throw error;
        }
        console.log("Post created successfully:", data);
        return data;
      }
    },
    onSuccess: (data) => {
      console.log("Post save successful, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", postId] });
      
      toast({
        title: "Success",
        description: `Post ${postId ? "updated" : "created"} successfully`,
      });
      
      // Update local state with returned data ensuring proper typing
      if (data) {
        const typedData: Partial<BlogPost> = {
          ...data,
          status: data.status as "draft" | "published" | "unpublished"
        };
        setPost(typedData);
      }
    },
    onError: (error: any) => {
      console.error("Post save error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSave = (status: "draft" | "published" | "unpublished" = "draft") => {
    console.log("Handling save with status:", status);
    
    if (!post.title?.trim()) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!post.content?.trim()) {
      toast({
        title: "Error",
        description: "Content is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!post.slug?.trim()) {
      toast({
        title: "Error",
        description: "Slug is required.",
        variant: "destructive"
      });
      return;
    }

    const postData = {
      ...post,
      status,
      published_date: status === "published" ? new Date().toISOString().split('T')[0] : post.published_date
    };
    
    console.log("Calling save mutation with data:", postData);
    savePostMutation.mutate(postData);
  };

  const handlePreview = () => {
    if (post.slug && post.status === "published") {
      // Open the live blog post in a new tab
      window.open(`/blog/${post.slug}`, "_blank");
    } else {
      // Show preview modal or toggle preview mode
      setShowPreview(!showPreview);
    }
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
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            {post.status === "published" ? <Eye size={16} /> : showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {post.status === "published" ? "View Live" : (showPreview ? "Hide Preview" : "Show Preview")}
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
            {savePostMutation.isPending ? "Saving..." : "Publish"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{postId ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={post.title || ""}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug *</label>
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
            <label className="block text-sm font-medium mb-2">Content *</label>
            <RichTextEditor
              content={post.content || ""}
              onChange={(content) => setPost({ ...post, content })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogEditor;
