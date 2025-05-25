
import React from 'react';

interface VideoEmbedProps {
  url: string;
  title?: string;
  autoplay?: boolean;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title = "Video", autoplay = false }) => {
  const getEmbedUrl = (url: string) => {
    // YouTube URL handling
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtube.com')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop()?.split('?')[0] || '';
      }
      
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
    }
    
    // Vimeo URL handling
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?color=ffffff&title=0&byline=0&portrait=0${autoplay ? '&autoplay=1' : ''}`;
    }
    
    // For direct video URLs (mp4, webm, etc.)
    return url;
  };

  const embedUrl = getEmbedUrl(url);
  const isDirectVideo = !url.includes('youtube.com') && !url.includes('youtu.be') && !url.includes('vimeo.com');

  return (
    <div className="relative w-full my-8">
      <div className="aspect-video rounded-xl overflow-hidden bg-card border border-border shadow-lg">
        {isDirectVideo ? (
          <video 
            className="w-full h-full object-cover"
            controls
            autoPlay={autoplay}
            muted={autoplay}
            preload="metadata"
          >
            <source src={embedUrl} type="video/mp4" />
            <source src={embedUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {title && (
        <p className="text-sm text-muted-foreground mt-3 text-center italic">
          {title}
        </p>
      )}
    </div>
  );
};

export default VideoEmbed;
