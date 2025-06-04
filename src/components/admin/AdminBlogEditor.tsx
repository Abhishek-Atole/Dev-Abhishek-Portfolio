
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import TagSelector from './TagSelector';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category_id?: string;
  status: 'draft' | 'published';
  published_date?: string;
  read_time?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface AdminBlogEditorProps {
  postId?: string;
  onBack: () => void;
}

const AdminBlogEditor: React.FC<AdminBlogEditorProps> = ({ postId, onBack }) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category_id: '',
    status: 'draft',
    published_date: '',
    read_time: 5
  });
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    }
  });

  // Fetch existing post if editing
  const { data: existingPost, isLoading } = useQuery({
    queryKey: ['admin-blog-post', postId],
    queryFn: async () => {
      if (!postId) return null;
      
      const { data: post, error } = await supabase
        .from('admin_blog_posts')
        .select('*')
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      
      // Fetch associated tags
      const { data: tagData, error: tagError } = await supabase
        .from('admin_blog_post_tags')
        .select('tag_id')
        .eq('blog_post_id', postId);
      
      if (tagError) throw tagError;
      
      return {
        post,
        tags: tagData.map(t => t.tag_id)
      };
    },
    enabled: !!postId
  });

  // Load existing post data
  useEffect(() => {
    if (existingPost?.post) {
      const post = existingPost.post;
      // Ensure status is properly typed
      const status = (post.status === 'published' || post.status === 'draft') ? post.status : 'draft';
      
      setFormData({
        id: post.id,
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        cover_image: post.cover_image || '',
        category_id: post.category_id || '',
        status,
        published_date: post.published_date || '',
        read_time: post.read_time || 5
      });
      setSelectedTags(existingPost.tags || []);
    }
  }, [existingPost]);

  const saveMutation = useMutation({
    mutationFn: async (data: BlogPost & { tags: string[] }) => {
      const { tags, ...postData } = data;
      
      if (postId) {
        // Update existing post
        const { data: updatedPost, error } = await supabase
          .from('admin_blog_posts')
          .update(postData)
          .eq('id', postId)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update tags
        await supabase
          .from('admin_blog_post_tags')
          .delete()
          .eq('blog_post_id', postId);
        
        if (tags.length > 0) {
          const tagInserts = tags.map(tagId => ({
            blog_post_id: postId,
            tag_id: tagId
          }));
          
          await supabase
            .from('admin_blog_post_tags')
            .insert(tagInserts);
        }
        
        return updatedPost;
      } else {
        // Create new post
        const { data: newPost, error } = await supabase
          .from('admin_blog_posts')
          .insert([postData])
          .select()
          .single();
        
        if (error) throw error;
        
        // Insert tags
        if (tags.length > 0) {
          const tagInserts = tags.map(tagId => ({
            blog_post_id: newPost.id,
            tag_id: tagId
          }));
          
          await supabase
            .from('admin_blog_post_tags')
            .insert(tagInserts);
        }
        
        return newPost;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({
        title: 'Success',
        description: `Blog post ${postId ? 'updated' : 'created'} successfully`
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value)
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Title and content are required',
        variant: 'destructive'
      });
      return;
    }

    saveMutation.mutate({
      ...formData,
      tags: selectedTags
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-media')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_image: data.publicUrl }));
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-2xl font-bold">
            {postId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            <Save size={16} className="mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={() => {
              setFormData(prev => ({ ...prev, status: 'published' }));
              handleSave();
            }}
            disabled={saveMutation.isPending}
          >
            <Eye size={16} className="mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
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
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id || ''}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, category_id: value || undefined }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="published_date">Published Date</Label>
                <Input
                  id="published_date"
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="read_time">Read Time (minutes)</Label>
                <Input
                  id="read_time"
                  type="number"
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 5 }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cover_image">Image Upload</Label>
                <div className="flex gap-2">
                  <Input
                    id="cover_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                  >
                    <Upload size={16} />
                  </Button>
                </div>
              </div>

              {formData.cover_image && (
                <div className="mt-2">
                  <img
                    src={formData.cover_image}
                    alt="Cover preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="cover_image_url">Or enter URL</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
