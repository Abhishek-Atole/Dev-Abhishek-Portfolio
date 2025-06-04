
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButton from '@/components/ShareButton';
import SaveButton from '@/components/SaveButton';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      console.log('Fetching blog post with slug:', slug);
      
      const { data, error } = await supabase
        .from('admin_blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching blog post:', error);
        throw error;
      }

      console.log('Fetched blog post:', data);
      return data;
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-20 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/blog" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {post.published_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(post.published_date).toLocaleDateString()}</span>
                </div>
              )}
              
              {post.read_time && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post.read_time} min read</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-6 border-b">
              <ShareButton 
                url={window.location.href}
                title={post.title}
                text={post.excerpt || `Check out this blog post: ${post.title}`}
              />
              <SaveButton 
                postId={post.id}
                title={post.title}
              />
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center">
              <ShareButton 
                url={window.location.href}
                title={post.title}
                text={post.excerpt || `Check out this blog post: ${post.title}`}
              />
              
              <Button variant="outline" asChild>
                <Link to="/blog">
                  More Articles
                </Link>
              </Button>
            </div>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
