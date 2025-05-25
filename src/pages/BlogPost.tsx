
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, Calendar, Clock, Tag, User, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate("/blog", { replace: true });
      return;
    }

    document.title = `${post.title} | Abhishek Atole`;
    window.scrollTo(0, 0);
  }, [post, navigate]);

  if (!post) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <Button variant="ghost" asChild className="mb-8 hover:bg-muted/70 hover:scale-105 transition-all duration-300 group">
            <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              Back to all posts
            </Link>
          </Button>
          
          {/* Article Header */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground 
                bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent 
                animate-fade-in">{post.title}</h1>
              
              {/* Author and Meta Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 text-muted-foreground 
                border-b border-border/50 pb-6 hover:border-border transition-colors duration-300">
                <div className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 
                    flex items-center justify-center group-hover:scale-110 transition-transform duration-300 
                    group-hover:shadow-lg group-hover:shadow-primary/20">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">Abhishek Atole</p>
                    <p className="text-sm">Software Developer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors duration-300">
                    <Calendar size={14} className="text-primary" />
                    <span>{post.publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors duration-300">
                    <Clock size={14} className="text-primary" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <Share2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <Bookmark size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="font-mono text-xs px-3 py-1.5 bg-muted/50 hover:bg-primary/10 
                      hover:text-primary hover:scale-105 transition-all duration-300 cursor-pointer
                      hover:shadow-lg hover:shadow-primary/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>
            
            {/* Featured Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 not-prose group">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none
              prose-headings:font-mono prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-h1:mb-6 prose-h2:mb-4 prose-h2:mt-12 prose-h3:mb-3 prose-h3:mt-8
              prose-p:text-foreground/90 prose-p:leading-7 prose-p:mb-6
              prose-strong:text-foreground prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic
              prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary/80">
              <MarkdownRenderer content={post.content} />
            </div>
          </article>
          
          {/* Related Posts */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <h3 className="text-2xl font-bold mb-8 font-mono bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              More Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map(relatedPost => (
                  <Link 
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="block group hover:bg-gradient-to-br hover:from-muted/40 hover:to-muted/20 
                      rounded-2xl p-4 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 
                      hover:-translate-y-1 border border-transparent hover:border-border/50"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                      <img 
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300 font-mono
                      group-hover:tracking-wide">
                      {relatedPost.title}
                    </h4>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3 group-hover:text-foreground/80 transition-colors duration-300">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 group-hover:bg-muted transition-colors duration-300">
                        <Calendar size={12} className="text-primary" />
                        {relatedPost.publishedDate}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 group-hover:bg-muted transition-colors duration-300">
                        <Clock size={12} className="text-primary" />
                        {relatedPost.readTime} min
                      </span>
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
