
import { Link } from "react-router-dom";
import { BlogPost } from "@/data/blogPosts";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";

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
          <article className={`flex flex-col lg:flex-row gap-6 p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/20 transition-all duration-300 ${
            index === 0 && !limit ? 'lg:flex-row-reverse' : ''
          }`}>
            {/* Featured Image */}
            <div className={`overflow-hidden rounded-lg ${
              index === 0 && !limit ? 'lg:w-2/3' : 'lg:w-1/3'
            }`}>
              <div className="aspect-video relative">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            {/* Content */}
            <div className={`flex flex-col justify-center ${
              index === 0 && !limit ? 'lg:w-1/3' : 'lg:w-2/3'
            }`}>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="font-mono text-xs px-2 py-1 bg-background border-border">
                    <Tag size={8} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Title */}
              <h2 className={`font-bold mb-3 group-hover:text-primary transition-colors font-mono leading-tight ${
                index === 0 && !limit ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'
              }`}>
                {post.title}
              </h2>
              
              {/* Excerpt */}
              <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              
              {/* Meta and CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.publishedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime} min read
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  <span className="font-mono">Read Article</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
