
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import BlogList from "./BlogList";

const BlogSection = () => {
  return (
    <section id="blog" className="py-16">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">From The Blog</h2>
            <p className="text-muted-foreground">Technical articles on C++, Java, and systems programming</p>
          </div>
          <Button variant="ghost" asChild className="mt-3 sm:mt-0">
            <Link to="/blog" className="flex items-center gap-2">
              View All Posts
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        
        <BlogList posts={blogPosts} limit={3} />
      </div>
    </section>
  );
};

export default BlogSection;
