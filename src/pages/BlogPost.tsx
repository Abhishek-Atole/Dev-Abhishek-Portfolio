import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButton from '@/components/ShareButton';
import SaveButton from '@/components/SaveButton';
import { Calendar, Clock, ArrowLeft, Code2, Bookmark, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-10 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="flex gap-4">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
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
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-20 pb-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground group">
              <Link to="/blog" className="flex items-center gap-2">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code2 size={16} />
              <span>Technical Article</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {post.published_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={16} className="text-primary" />
                  <span>{new Date(post.published_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              )}
              
              {post.read_time && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={16} className="text-primary" />
                  <span>{post.read_time} min read</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye size={16} className="text-primary" />
                <span>Developer Focused</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6">
              <ShareButton 
                url={window.location.href}
                title={post.title}
                text={post.excerpt || `Check out this blog post: ${post.title}`}
              />
              <SaveButton 
                postId={post.id}
                postTitle={post.title}
              />
              <Badge variant="secondary" className="text-xs px-3 py-1">
                <Bookmark size={12} className="mr-1" />
                Programming
              </Badge>
            </div>
          </header>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Cover Image */}
          {post.cover_image && (
            <Card className="mb-12 overflow-hidden border-0 shadow-lg">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                loading="lazy"
              />
            </Card>
          )}

          {/* Table of Contents Placeholder */}
          <Card className="mb-8 p-6 bg-muted/30 border-l-4 border-l-primary">
            <div className="flex items-center gap-2 mb-3">
              <Code2 size={16} className="text-primary" />
              <h3 className="font-semibold text-sm uppercase tracking-wide">Developer Note</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This article covers advanced programming concepts. Code examples are interactive and can be copied with a single click.
              Have questions? Ask the AI assistant below!
            </p>
          </Card>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-mono prose-headings:tracking-tight prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-primary prose-code:font-mono prose-code:text-sm prose-pre:bg-card prose-pre:border prose-pre:border-border">
            <MarkdownRenderer content={post.content} />
          </article>

          {/* Article Footer */}
          <footer className="mt-16">
            <Card className="p-8 bg-gradient-to-r from-muted/30 to-primary/5 border-border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Enjoyed this article?</h3>
                  <p className="text-muted-foreground text-sm">
                    Share it with fellow developers and explore more programming insights.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <ShareButton 
                    url={window.location.href}
                    title={post.title}
                    text={post.excerpt || `Check out this blog post: ${post.title}`}
                  />
                  
                  <Button variant="outline" asChild className="font-mono">
                    <Link to="/blog">
                      More Articles
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </footer>

          {/* Related Articles Placeholder */}
          <section className="mt-12">
            <h3 className="text-2xl font-bold mb-6 font-mono">Continue Reading</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-xs">Programming</Badge>
                  <h4 className="font-semibold line-clamp-2">Explore more programming articles</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    Discover more insights into modern software development, algorithms, and best practices.
                  </p>
                  <Button variant="ghost" asChild className="p-0 h-auto text-primary">
                    <Link to="/blog">View All Articles →</Link>
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-xs">Projects</Badge>
                  <h4 className="font-semibold line-clamp-2">Check out my projects</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    See real-world implementations of the concepts discussed in this article.
                  </p>
                  <Button variant="ghost" asChild className="p-0 h-auto text-primary">
                    <Link to="/projects">View Projects →</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
      
      {/* AI Chatbot for blog readers - positioned for easy access */}
      <Chatbot position="bottom-right" />
    </div>
  );
};

export default BlogPost;
