
import React from 'react';
import Markdown from 'react-markdown';
import { Copy } from 'lucide-react';
import VideoEmbed from './VideoEmbed';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Markdown
      components={{
        // Custom component for handling video embeds
        p: ({ children }) => {
          // Handle case where children might be an array or multiple elements
          const childrenArray = React.Children.toArray(children);
          
          // Check if any child contains video embed syntax
          for (const child of childrenArray) {
            if (typeof child === 'string' && child.includes('[video]')) {
              const videoMatch = child.match(/\[video\]\((.*?)\)(?:\s*"(.*?)")?/);
              if (videoMatch) {
                const [, url, title] = videoMatch;
                return <VideoEmbed url={url} title={title} />;
              }
            }
          }
          
          return <p>{children}</p>;
        },
        
        // Enhanced code blocks
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          
          // Check if this is an inline code block by checking if className exists
          // Block code elements typically have language- classes, inline ones don't
          const isInline = !className || !className.startsWith('language-');
          
          if (!isInline) {
            const codeString = String(children).replace(/\n$/, '');
            
            return (
              <div className="relative group">
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                    {language || 'code'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(codeString)}
                    className="p-2 rounded bg-muted hover:bg-muted/80 transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy code"
                  >
                    <Copy size={14} />
                  </button>
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
