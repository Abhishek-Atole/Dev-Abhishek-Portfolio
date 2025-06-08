import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BlogList from "@/components/BlogList";
import { Code, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

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
        tags: ["Programming"], // Default tags for now, will be improved later
        content: post.content || "" // Add content field to fix TypeScript error
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
      {/* Add proper top spacing */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Blog Posts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on web development, technology, and more.
            </p>
          </motion.div>
          
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
      
      {/* AI Chatbot for blog readers */}
      <Chatbot position="bottom-right" />
    </div>
  );
};

export default BlogPage;
