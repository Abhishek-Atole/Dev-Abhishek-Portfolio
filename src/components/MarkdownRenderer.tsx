
import React from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Terminal, Code } from 'lucide-react';
import VideoEmbed from './VideoEmbed';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getLanguageDisplayName = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'cpp': 'C++',
      'c': 'C',
      'java': 'Java',
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'bash': 'Bash',
      'shell': 'Shell',
      'sql': 'SQL',
      'json': 'JSON',
      'xml': 'XML',
      'html': 'HTML',
      'css': 'CSS',
    };
    return languageMap[lang] || lang.toUpperCase();
  };

  return (
    <Markdown
      components={{
        // Custom component for handling video embeds
        p: ({ children }) => {
          const childrenArray = React.Children.toArray(children);
          
          for (const child of childrenArray) {
            if (typeof child === 'string' && child.includes('[video]')) {
              const videoMatch = child.match(/\[video\]\((.*?)\)(?:\s*"(.*?)")?/);
              if (videoMatch) {
                const [, url, title] = videoMatch;
                return <VideoEmbed url={url} title={title} />;
              }
            }
          }
          
          return <p className="leading-relaxed my-4">{children}</p>;
        },

        // Enhanced headings
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-12 mb-6 font-mono border-b border-border pb-3 flex items-center gap-3">
            <Code size={24} className="text-primary" />
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-10 mb-5 font-mono border-l-4 border-primary pl-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold mt-8 mb-4 font-mono text-primary">
            {children}
          </h3>
        ),

        // Enhanced blockquotes
        blockquote: ({ children }) => (
          <Card className="my-6 p-6 border-l-4 border-primary bg-muted/30">
            <div className="flex items-start gap-3">
              <Terminal size={20} className="text-primary mt-1 flex-shrink-0" />
              <div className="text-sm leading-relaxed">{children}</div>
            </div>
          </Card>
        ),

        // Enhanced lists
        ul: ({ children }) => (
          <ul className="my-4 space-y-2 list-none">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0"></div>
            <div>{children}</div>
          </li>
        ),

        // Enhanced code blocks
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const isInline = !className || !className.startsWith('language-');
          
          if (!isInline) {
            const codeString = String(children).replace(/\n$/, '');
            const isCopied = copiedCode === codeString;
            
            return (
              <Card className="relative group my-6 overflow-hidden bg-card border-border">
                {/* Code header */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-primary" />
                    <Badge variant="secondary" className="text-xs font-mono">
                      {getLanguageDisplayName(language) || 'CODE'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(codeString)}
                    className="h-8 px-3 text-xs opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} className="mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Code content */}
                <pre className="overflow-x-auto p-4 text-sm leading-relaxed font-mono bg-card">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </Card>
            );
          }
          
          return (
            <code className="bg-muted px-2 py-1 rounded font-mono text-sm text-primary font-medium border" {...props}>
              {children}
            </code>
          );
        },

        // Enhanced tables
        table: ({ children }) => (
          <Card className="my-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {children}
              </table>
            </div>
          </Card>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted/50">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left font-mono font-semibold text-sm border-b border-border">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm border-b border-border/50">
            {children}
          </td>
        ),

        // Enhanced links
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors font-medium"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownRenderer;
