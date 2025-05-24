
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { blogPosts } from "@/data/blogPosts";
import BlogList from "@/components/BlogList";
import { Code, BookOpen } from "lucide-react";

const BlogPage = () => {
  useEffect(() => {
    document.title = "Blog | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

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
              <div className="text-2xl font-bold text-primary font-mono">{blogPosts.length}</div>
              <div className="text-sm text-muted-foreground">Articles Published</div>
            </div>
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              <div className="text-2xl font-bold text-primary font-mono">
                {blogPosts.reduce((acc, post) => acc + post.readTime, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Minutes of Content</div>
            </div>
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              <div className="text-2xl font-bold text-primary font-mono">
                {[...new Set(blogPosts.flatMap(post => post.tags))].length}
              </div>
              <div className="text-sm text-muted-foreground">Topics Covered</div>
            </div>
          </div>
          
          {/* Blog Posts */}
          <BlogList posts={blogPosts} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
