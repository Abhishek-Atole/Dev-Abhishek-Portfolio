
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface SaveButtonProps {
  postId: string;
  postTitle: string;
  className?: string;
}

const SaveButton = ({ postId, postTitle, className }: SaveButtonProps) => {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if post is already saved in localStorage
    const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
    setIsSaved(savedPosts.includes(postId));
  }, [postId]);

  const handleSave = () => {
    try {
      const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
      
      if (isSaved) {
        // Remove from saved posts
        const updatedPosts = savedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('savedBlogPosts', JSON.stringify(updatedPosts));
        setIsSaved(false);
        toast({
          title: "Removed from saved",
          description: `"${postTitle}" has been removed from your saved articles.`,
        });
      } else {
        // Add to saved posts
        const updatedPosts = [...savedPosts, postId];
        localStorage.setItem('savedBlogPosts', JSON.stringify(updatedPosts));
        setIsSaved(true);
        toast({
          title: "Saved successfully!",
          description: `"${postTitle}" has been saved to your reading list.`,
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Save failed",
        description: "Unable to save the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleSave}
      className={`hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
        hover:text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg 
        hover:shadow-primary/20 border border-border/50 hover:border-primary/40 ${className}`}
    >
      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
    </Button>
  );
};

export default SaveButton;
