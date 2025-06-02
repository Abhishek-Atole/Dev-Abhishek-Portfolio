
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BlogList from "@/components/BlogList";
import { Code, BookOpen } from "lucide-react";

const BlogPage = () => {
  useEffect(() => {
    document.title = "Blog | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

  // Fetch published blog posts from database
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["published-blog-posts"],
    queryFn: async () => {
      console.log("Fetching published blog posts for blog page...");
      const { data, error } = await supabase
        .from("admin_blog_posts")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }
      
      console.log("Fetched published posts for blog page:", data);
      
      // Transform database posts to match BlogPost interface
      return data?.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || "",
        slug: post.slug,
        publishedDate: post.published_date || post.created_at.split('T')[0],
        readTime: post.read_time || 5,
        coverImage: post.cover_image || "/placeholder.svg",
        tags: ["Programming"] // Default tags for now, will be improved later
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center">Loading blog posts...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Code size={32} className="text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono">Developer Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Deep dives into C++, Java, systems programming, and software engineering. 
              Sharing insights, tutorials, and lessons learned from real-world development.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              <div className="text-2xl font-bold text-primary font-mono">{blogPosts?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Articles Published</div>
            </div>
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              <div className="text-2xl font-bold text-primary font-mono">
                {blogPosts?.reduce((acc, post) => acc + post.readTime, 0) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Minutes of Content</div>
            </div>
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              <div className="text-2xl font-bold text-primary font-mono">
                {blogPosts ? [...new Set(blogPosts.flatMap(post => post.tags))].length : 0}
              </div>
              <div className="text-sm text-muted-foreground">Topics Covered</div>
            </div>
          </div>
          
          {/* Blog Posts */}
          {blogPosts && blogPosts.length > 0 ? (
            <BlogList posts={blogPosts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No published blog posts yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
