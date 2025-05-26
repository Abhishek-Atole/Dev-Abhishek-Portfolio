
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, Calendar, Clock, Tag, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ShareButton from "@/components/ShareButton";
import SaveButton from "@/components/SaveButton";

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-40" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <NavBar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Enhanced Back Button */}
          <Button 
            variant="ghost" 
            asChild 
            className="mb-8 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
              hover:scale-105 transition-all duration-300 group border border-border/50 
              hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
          >
            <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-mono font-medium">Back to all posts</span>
            </Link>
          </Button>
          
          {/* Enhanced Article Header */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="mb-12 not-prose relative">
              {/* Floating decorative elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl opacity-50" />
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-lg opacity-40" />
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-foreground 
                bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent 
                animate-fade-in font-mono tracking-tight hover:tracking-wide transition-all duration-500">
                {post.title}
              </h1>
              
              {/* Enhanced Author and Meta Info */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8 text-muted-foreground 
                border border-border/30 rounded-2xl p-6 bg-gradient-to-r from-card/50 to-muted/20 
                backdrop-blur-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 
                transition-all duration-500 hover:-translate-y-1">
                
                <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 
                    flex items-center justify-center group-hover:scale-110 transition-transform duration-300 
                    group-hover:shadow-2xl group-hover:shadow-primary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <User size={24} className="text-primary relative z-10" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 font-mono">
                      Abhishek Atole
                    </p>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                      Software Developer & Technical Writer
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 
                    hover:from-primary/10 hover:to-accent/10 transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <Calendar size={16} className="text-primary" />
                    <span className="font-mono font-medium">{post.publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 
                    hover:from-primary/10 hover:to-accent/10 transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <Clock size={16} className="text-primary" />
                    <span className="font-mono font-medium">{post.readTime} min read</span>
                  </div>
                </div>

                {/* Enhanced Action buttons with working functionality */}
                <div className="flex items-center gap-3 ml-auto">
                  <ShareButton title={post.title} />
                  <SaveButton postId={post.id} postTitle={post.title} />
                </div>
              </div>
              
              {/* Enhanced Tags */}
              <div className="flex flex-wrap gap-3 mb-10">
                {post.tags.map((tag, index) => {
                  const tagStyle: React.CSSProperties = {
                    animationDelay: `${index * 100}ms`
                  };
                  
                  return (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="font-mono text-sm px-4 py-2 bg-gradient-to-r from-muted/40 to-muted/60 
                        hover:from-primary/15 hover:to-accent/15 hover:text-primary hover:scale-110 
                        transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/20 
                        border border-border/50 hover:border-primary/40 group relative overflow-hidden"
                      style={tagStyle}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Tag size={12} className="mr-2 relative z-10" />
                      <span className="relative z-10 font-semibold">{tag}</span>
                    </Badge>
                  );
                })}
              </div>
            </header>
            
            {/* Enhanced Featured Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 not-prose group shadow-2xl shadow-black/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
              
              {/* Reading indicator overlay */}
              <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20">
                  <p className="text-sm font-mono font-medium">Featured Article</p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Article Content */}
            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none relative
              prose-headings:font-mono prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
              prose-h1:mb-8 prose-h2:mb-6 prose-h2:mt-16 prose-h3:mb-4 prose-h3:mt-12 prose-h4:mb-3 prose-h4:mt-8
              prose-p:text-foreground/90 prose-p:leading-8 prose-p:mb-8 prose-p:text-lg
              prose-strong:text-foreground prose-strong:font-semibold prose-strong:text-primary
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:bg-gradient-to-r prose-blockquote:from-muted/30 prose-blockquote:to-transparent prose-blockquote:py-4 prose-blockquote:rounded-r-lg
              prose-ul:mb-8 prose-ol:mb-8 prose-li:mb-3 prose-li:text-lg
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary/80 prose-a:font-medium
              prose-img:rounded-2xl prose-img:shadow-xl prose-img:shadow-black/10">
              
              {/* Content background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-primary/2 to-transparent rounded-3xl -z-10" />
              
              <MarkdownRenderer content={post.content} />
            </div>
          </article>
          
          {/* Enhanced Related Posts */}
          <div className="mt-20 pt-12 border-t border-gradient-to-r from-transparent via-border to-transparent relative">
            {/* Section decoration */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-primary to-accent" />
            
            <h3 className="text-3xl font-bold mb-12 font-mono bg-gradient-to-r from-foreground via-primary to-foreground 
              bg-clip-text text-transparent text-center hover:tracking-wide transition-all duration-300">
              Continue Reading
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost, index) => {
                  const cardStyle: React.CSSProperties = {
                    animationDelay: `${index * 200}ms`
                  };
                  
                  return (
                    <Link 
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="block group hover:bg-gradient-to-br hover:from-muted/30 hover:to-muted/10 
                        rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 
                        hover:-translate-y-2 border border-border/30 hover:border-primary/40 relative overflow-hidden
                        bg-gradient-to-br from-card/50 to-muted/20 backdrop-blur-sm"
                      style={cardStyle}
                    >
                      {/* Card background decoration */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                      
                      <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative shadow-lg">
                        <img 
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-95 group-hover:brightness-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                        
                        {/* Read more indicator */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          <div className="bg-black/80 backdrop-blur-sm text-white p-2 rounded-full">
                            <ExternalLink size={16} />
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors duration-300 font-mono
                        group-hover:tracking-wide leading-tight relative z-10">
                        {relatedPost.title}
                      </h4>
                      <p className="text-muted-foreground text-base line-clamp-2 mb-4 group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed relative z-10">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground relative z-10">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 group-hover:bg-muted/60 transition-colors duration-300">
                          <Calendar size={12} className="text-primary" />
                          <span className="font-mono">{relatedPost.publishedDate}</span>
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 group-hover:bg-muted/60 transition-colors duration-300">
                          <Clock size={12} className="text-primary" />
                          <span className="font-mono">{relatedPost.readTime} min</span>
                        </span>
                      </div>
                    </Link>
                  );
                })
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
