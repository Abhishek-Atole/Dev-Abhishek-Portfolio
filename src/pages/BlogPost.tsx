
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";

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
          <Button variant="ghost" asChild className="mb-8 hover:bg-muted/50">
            <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
              Back to all posts
            </Link>
          </Button>
          
          {/* Article Header */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground">{post.title}</h1>
              
              {/* Author and Meta Info */}
              <div className="flex items-center gap-6 mb-8 text-muted-foreground border-b border-border pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Abhishek Atole</p>
                    <p className="text-sm">Software Developer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{post.publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="font-mono text-xs px-3 py-1 bg-muted hover:bg-muted/80">
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>
            
            {/* Featured Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-12 not-prose">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none
              prose-headings:font-mono prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-h1:mb-6 prose-h2:mb-4 prose-h2:mt-12 prose-h3:mb-3 prose-h3:mt-8
              prose-p:text-foreground/90 prose-p:leading-7 prose-p:mb-6
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
              prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4
              prose-pre:overflow-x-auto prose-pre:font-mono prose-pre:text-sm
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic
              prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              <Markdown>{post.content}</Markdown>
            </div>
          </article>
          
          {/* Related Posts */}
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-2xl font-bold mb-8 font-mono">More Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map(relatedPost => (
                  <Link 
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="block group hover:bg-muted/30 rounded-lg p-4 transition-colors"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <img 
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors font-mono">
                      {relatedPost.title}
                    </h4>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{relatedPost.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {relatedPost.publishedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
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
