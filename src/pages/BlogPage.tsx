
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { blogPosts } from "@/data/blogPosts";
import BlogList from "@/components/BlogList";

const BlogPage = () => {
  useEffect(() => {
    document.title = "Blog | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground mb-8">Thoughts, tutorials, and insights on C++, Java, and systems programming</p>
          
          <BlogList posts={blogPosts} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
