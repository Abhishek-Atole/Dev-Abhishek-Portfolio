
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BlogList from "./BlogList";

const BlogSection = () => {
  // Fetch published blog posts from database
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["published-blog-posts"],
    queryFn: async () => {
      console.log("Fetching published blog posts for website...");
      const { data, error } = await supabase
        .from("admin_blog_posts")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }
      
      console.log("Fetched published posts:", data);
      
      // Transform database posts to match BlogPost interface
      return data?.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || "",
        slug: post.slug,
        publishedDate: post.published_date || post.created_at.split('T')[0],
        readTime: post.read_time || 5,
        coverImage: post.cover_image || "/placeholder.svg",
        tags: ["Programming"], // Default tags for now, will be improved later
        content: post.content || "" // Add content field to fix TypeScript error
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <section id="blog" className="py-16">
        <div className="container mx-auto">
          <div className="text-center">Loading blog posts...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-16 relative overflow-hidden">
      {/* Enhanced Background gradient with animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div className="group animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-primary group-hover:animate-spin transition-transform duration-500 group-hover:scale-110" />
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground 
                bg-clip-text text-transparent group-hover:tracking-wide transition-all duration-300 group-hover:scale-105">
                From The Blog
              </h2>
            </div>
            <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 group-hover:translate-x-1">
              Technical articles on C++, Java, and systems programming
            </p>
          </div>
          
          {/* Redesigned "View All Posts" Card */}
          <div className="mt-6 sm:mt-0 relative group animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110" />
            <div className="relative bg-gradient-to-r from-card/80 to-muted/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-105 hover:border-primary/40">
              <div className="text-center space-y-3">
                <div className="text-2xl font-bold font-mono text-primary group-hover:animate-pulse">
                  {blogPosts?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Articles Published
                </div>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 
                    border border-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-300 
                    hover:shadow-lg hover:shadow-primary/20 font-mono group/btn"
                >
                  <Link to="/blog" className="flex items-center justify-center gap-2">
                    <span className="group-hover/btn:font-semibold transition-all duration-300">View All Posts</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300 group-hover/btn:animate-bounce" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          {blogPosts && blogPosts.length > 0 ? (
            <BlogList posts={blogPosts} limit={3} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No published blog posts yet.</p>
            </div>
          )}
          
          {/* Enhanced bottom fade with animation */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none opacity-0 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }} />
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
