
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Upload, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import MediaUploader from "./MediaUploader";
import TagsManager from "./TagsManager";

interface AdminBlogEditorProps {
  postId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: string;
  status: "draft" | "published" | "unpublished";
  read_time: number;
  published_date: string;
}

const AdminBlogEditor = ({ postId, onSave, onCancel }: AdminBlogEditorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPreview, setIsPreview] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category_id: "",
    status: "draft",
    read_time: 5,
    published_date: new Date().toISOString().split('T')[0]
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });

  // Fetch existing post if editing
  const { data: existingPost } = useQuery({
    queryKey: ["admin-blog-post", postId],
    queryFn: async () => {
      if (!postId) return null;
      const { data, error } = await supabase
        .from("admin_blog_posts")
        .select(`
          *,
          admin_blog_post_tags(tag_id)
        `)
        .eq("id", postId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!postId
  });

  useEffect(() => {
    if (existingPost) {
      setFormData({
        id: existingPost.id,
        title: existingPost.title || "",
        slug: existingPost.slug || "",
        excerpt: existingPost.excerpt || "",
        content: existingPost.content || "",
        cover_image: existingPost.cover_image || "",
        category_id: existingPost.category_id || "",
        status: existingPost.status || "draft",
        read_time: existingPost.read_time || 5,
        published_date: existingPost.published_date || new Date().toISOString().split('T')[0]
      });
      setSelectedTags(existingPost.admin_blog_post_tags?.map((t: any) => t.tag_id) || []);
    }
  }, [existingPost]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  // Save post mutation
  const savePostMutation = useMutation({
    mutationFn: async (data: BlogPost & { tags: string[] }) => {
      const { tags, ...postData } = data;
      
      if (postId) {
        // Update existing post
        const { error } = await supabase
          .from("admin_blog_posts")
          .update(postData)
          .eq("id", postId);
        if (error) throw error;

        // Update tags
        await supabase.from("admin_blog_post_tags").delete().eq("blog_post_id", postId);
        if (tags.length > 0) {
          const tagInserts = tags.map(tagId => ({ blog_post_id: postId, tag_id: tagId }));
          const { error: tagsError } = await supabase.from("admin_blog_post_tags").insert(tagInserts);
          if (tagsError) throw tagsError;
        }
      } else {
        // Create new post
        const { data: newPost, error } = await supabase
          .from("admin_blog_posts")
          .insert(postData)
          .select()
          .single();
        if (error) throw error;

        // Insert tags
        if (tags.length > 0) {
          const tagInserts = tags.map(tagId => ({ blog_post_id: newPost.id, tag_id: tagId }));
          const { error: tagsError } = await supabase.from("admin_blog_post_tags").insert(tagInserts);
          if (tagsError) throw tagsError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      onSave();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save post: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSave = (status: "draft" | "published" = "draft") => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    savePostMutation.mutate({
      ...formData,
      status,
      published_date: status === "published" ? formData.published_date : "",
      tags: selectedTags
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      read_time: estimateReadTime(prev.content)
    }));
  }, [formData.content]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">
            {postId ? "Edit Post" : "Create New Post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye size={16} className="mr-2" />
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
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

      {isPreview ? (
        // Preview Mode
        <Card>
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{formData.title}</h1>
              {formData.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">{formData.excerpt}</p>
              )}
              {formData.cover_image && (
                <img
                  src={formData.cover_image}
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="post-url-slug"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the post..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Content *</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  />
                </div>
              </CardContent>
            </Card>

            <MediaUploader
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="unpublished">Unpublished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="published_date">Publish Date</Label>
                  <Input
                    id="published_date"
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Read Time (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.read_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 5 }))}
                    min="1"
                  />
                </div>
              </CardContent>
            </Card>

            <TagsManager
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />

            {formData.cover_image && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <img
                      src={formData.cover_image}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, cover_image: "" }))}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogEditor;
