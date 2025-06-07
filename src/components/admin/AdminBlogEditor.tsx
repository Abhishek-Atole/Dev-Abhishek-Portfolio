
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
import { ArrowLeft, Save, Eye, Upload, Calendar, GitCompare, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from './RichTextEditor';
import TagSelector from './TagSelector';
import MediaUploader from './MediaUploader';
import ComparativeLearningSection from './ComparativeLearningSection';

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
  comparative_learning?: string; // JSON string
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
    published_date: new Date().toISOString().split('T')[0],
    read_time: 5,
    comparative_learning: ''
  });
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showComparativeSection, setShowComparativeSection] = useState(false);
  const [comparativeLearningData, setComparativeLearningData] = useState({
    topic: '',
    description: '',
    items: []
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Load comparative learning data from JSON
  useEffect(() => {
    if (formData.comparative_learning) {
      try {
        const parsed = JSON.parse(formData.comparative_learning);
        setComparativeLearningData(parsed);
        setShowComparativeSection(true);
      } catch (error) {
        console.error('Error parsing comparative learning data:', error);
      }
    }
  }, [formData.comparative_learning]);

  // Update comparative learning JSON when data changes
  useEffect(() => {
    if (showComparativeSection) {
      setFormData(prev => ({
        ...prev,
        comparative_learning: JSON.stringify(comparativeLearningData)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        comparative_learning: ''
      }));
    }
  }, [comparativeLearningData, showComparativeSection]);
  
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
        published_date: post.published_date || new Date().toISOString().split('T')[0],
        read_time: post.read_time || 5,
        comparative_learning: post.comparative_learning || ''
      });
      setSelectedTags(existingPost.tags || []);
    }
  }, [existingPost]);

  const saveMutation = useMutation({
    mutationFn: async (data: BlogPost & { tags: string[] }) => {
      const { tags, ...postData } = data;
      
      // Auto-generate read time based on content length
      const words = postData.content.split(' ').length;
      const estimatedReadTime = Math.max(1, Math.ceil(words / 200));
      postData.read_time = estimatedReadTime;
      
      if (postId) {
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
        const { data: newPost, error } = await supabase
          .from('admin_blog_posts')
          .insert([postData])
          .select()
          .single();
        
        if (error) throw error;
        
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
        description: `Blog post ${postId ? 'updated' : 'created'} successfully`,
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

  const handleSave = (publishNow = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Title and content are required',
        variant: 'destructive'
      });
      return;
    }

    const dataToSave = {
      ...formData,
      status: publishNow ? 'published' as const : formData.status,
      published_date: publishNow ? new Date().toISOString().split('T')[0] : formData.published_date,
      tags: selectedTags
    };

    saveMutation.mutate(dataToSave);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft size={16} />
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold font-mono">
                {postId ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>{new Date().toLocaleDateString()}</span>
                <Badge variant="outline" className="text-xs">
                  {formData.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleSave(false)}
              disabled={saveMutation.isPending}
            >
              <Save size={16} className="mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={saveMutation.isPending}
            >
              <Eye size={16} className="mr-2" />
              Publish Now
            </Button>
          </div>
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
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter an engaging post title..."
                  className="font-semibold"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-url-slug"
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description that appears in previews..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Comparative Learning Section */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GitCompare size={20} className="text-primary" />
                    Comparative Learning
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="comparative-toggle" className="text-sm font-medium">
                      Enable Comparison
                    </Label>
                    <Switch
                      id="comparative-toggle"
                      checked={showComparativeSection}
                      onCheckedChange={setShowComparativeSection}
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {showComparativeSection && (
              <ComparativeLearningSection
                data={comparativeLearningData}
                onChange={setComparativeLearningData}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={18} />
                Settings
              </CardTitle>
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
                    <SelectItem value="draft">📝 Draft</SelectItem>
                    <SelectItem value="published">✅ Published</SelectItem>
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
                <Label htmlFor="read_time">Estimated Read Time (auto-calculated)</Label>
                <Input
                  id="read_time"
                  type="number"
                  value={formData.read_time}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Based on ~200 words per minute
                </p>
              </div>
            </CardContent>
          </Card>

          <MediaUploader
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
          />

          {formData.cover_image && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cover Image Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={formData.cover_image}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded border"
                />
              </CardContent>
            </Card>
          )}

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
