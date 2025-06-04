
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  url?: string;
  text?: string;
  className?: string;
}

const ShareButton = ({ title, url = window.location.href, text, className }: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Use native share API if available
        await navigator.share({
          title: title,
          url: url,
          text: text,
        });
        toast({
          title: "Shared successfully!",
          description: "The article has been shared.",
        });
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Article link has been copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Share failed",
        description: "Unable to share the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleShare}
      className={`hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
        hover:text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg 
        hover:shadow-primary/20 border border-border/50 hover:border-primary/40 ${className}`}
    >
      <Share2 size={16} />
    </Button>
  );
};

export default ShareButton;
