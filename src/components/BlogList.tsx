
import { Link } from "react-router-dom";
import { BlogPost } from "@/data/blogPosts";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, ArrowRight, Eye } from "lucide-react";

interface BlogListProps {
  posts: BlogPost[];
  limit?: number;
}

const BlogList = ({ posts, limit }: BlogListProps) => {
  const displayedPosts = limit ? posts.slice(0, limit) : posts;
  
  return (
    <div className="space-y-8">
      {displayedPosts.map((post, index) => (
        <Link 
          to={`/blog/${post.slug}`} 
          key={post.id}
          className="block group"
        >
          <article className={`relative flex flex-col lg:flex-row gap-6 p-6 rounded-2xl border border-border/50 
            hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-muted/10 
            transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-primary/5
            transform hover:-translate-y-1 overflow-hidden ${
            index === 0 && !limit ? 'lg:flex-row-reverse' : ''
          }`}>
            
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            
            {/* Featured Image */}
            <div className={`relative overflow-hidden rounded-xl ${
              index === 0 && !limit ? 'lg:w-2/3' : 'lg:w-1/3'
            }`}>
              <div className="aspect-video relative">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                
                {/* Floating read indicator */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium 
                  opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-1">
                  <Eye size={12} />
                  Read
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className={`relative flex flex-col justify-center z-10 ${
              index === 0 && !limit ? 'lg:w-1/3' : 'lg:w-2/3'
            }`}>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="font-mono text-xs px-3 py-1.5 bg-background/80 border-border/50 
                      hover:border-primary/50 hover:bg-primary/10 transition-all duration-300
                      group-hover:animate-pulse"
                    style={{ animationDelay: `${tagIndex * 100}ms` }}
                  >
                    <Tag size={8} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Title */}
              <h2 className={`font-bold mb-4 group-hover:text-primary transition-all duration-300 font-mono leading-tight
                group-hover:tracking-wide ${
                index === 0 && !limit ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'
              }`}>
                {post.title}
              </h2>
              
              {/* Excerpt */}
              <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
                {post.excerpt}
              </p>
              
              {/* Meta and CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 group-hover:bg-muted transition-colors duration-300">
                    <Calendar size={12} className="text-primary" />
                    {post.publishedDate}
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 group-hover:bg-muted transition-colors duration-300">
                    <Clock size={12} className="text-primary" />
                    {post.readTime} min read
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-primary font-medium text-sm 
                  group-hover:gap-4 transition-all duration-300 px-4 py-2 rounded-full 
                  group-hover:bg-primary/10 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <span className="font-mono group-hover:font-semibold transition-all duration-300">Read Article</span>
                  <ArrowRight size={16} className="transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};

export default BlogList;
