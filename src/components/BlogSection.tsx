
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import BlogList from "./BlogList";

const BlogSection = () => {
  return (
    <section id="blog" className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-primary group-hover:animate-spin transition-transform duration-500" />
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground 
                bg-clip-text text-transparent group-hover:tracking-wide transition-all duration-300">
                From The Blog
              </h2>
            </div>
            <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              Technical articles on C++, Java, and systems programming
            </p>
          </div>
          <Button variant="ghost" asChild className="mt-3 sm:mt-0 hover:bg-primary/10 hover:text-primary 
            hover:scale-105 transition-all duration-300 group">
            <Link to="/blog" className="flex items-center gap-2">
              View All Posts
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
        
        <div className="relative">
          <BlogList posts={blogPosts} limit={3} />
          
          {/* Subtle bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
