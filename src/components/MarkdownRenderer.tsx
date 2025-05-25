
import React from 'react';
import Markdown from 'react-markdown';
import VideoEmbed from './VideoEmbed';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Markdown
      components={{
        // Custom component for handling video embeds
        p: ({ children }) => {
          const child = React.Children.only(children);
          
          // Check if this is a video embed (look for [video] syntax)
          if (typeof child === 'string' && child.includes('[video]')) {
            const videoMatch = child.match(/\[video\]\((.*?)\)(?:\s*"(.*?)")?/);
            if (videoMatch) {
              const [, url, title] = videoMatch;
              return <VideoEmbed url={url} title={title} />;
            }
          }
          
          return <p>{children}</p>;
        },
        
        // Enhanced code blocks
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          
          if (!inline) {
            return (
              <div className="relative group">
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                    {language || 'code'}
                  </span>
                </div>
                <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto font-mono text-sm">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          }
          
          return (
            <code className="bg-muted px-2 py-1 rounded font-mono text-sm text-primary" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownRenderer;
