
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bold, Italic, Underline, Link, List, ListOrdered, 
  Code, Quote, Image, Video, FileText, Heading1, 
  Heading2, Heading3, Eye, EyeOff, Terminal, Copy, Check 
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback((before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      textarea.focus();
    }, 0);
  }, [content, onChange]);

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = content.substring(0, start) + text + content.substring(start);
    onChange(newText);

    setTimeout(() => {
      textarea.setSelectionRange(start + text.length, start + text.length);
      textarea.focus();
    }, 0);
  }, [content, onChange]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatActions = [
    { icon: Bold, action: () => insertText("**", "**"), tooltip: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), tooltip: "Italic" },
    { icon: Underline, action: () => insertText("<u>", "</u>"), tooltip: "Underline" },
    { icon: Code, action: () => insertText("`", "`"), tooltip: "Inline Code" },
    { icon: Link, action: () => insertText("[", "](url)"), tooltip: "Link" },
    { icon: Quote, action: () => insertText("> "), tooltip: "Quote" },
    { icon: List, action: () => insertText("- "), tooltip: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("1. "), tooltip: "Numbered List" },
    { icon: Heading1, action: () => insertText("# "), tooltip: "Heading 1" },
    { icon: Heading2, action: () => insertText("## "), tooltip: "Heading 2" },
    { icon: Heading3, action: () => insertText("### "), tooltip: "Heading 3" },
  ];

  const insertMedia = (type: "image" | "video" | "code") => {
    switch (type) {
      case "image":
        insertAtCursor("\n![Alt text](image-url)\n");
        break;
      case "video":
        insertAtCursor("\n<video controls>\n  <source src=\"video-url\" type=\"video/mp4\">\n</video>\n");
        break;
      case "code":
        insertAtCursor("\n```language\n// Your code here\n```\n");
        break;
    }
  };

  const renderPreview = () => {
    // Simple markdown-to-HTML conversion for preview
    let html = content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-8 mb-4 font-mono text-primary">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-5 font-mono border-l-4 border-primary pl-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-6 font-mono border-b border-border pb-3">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-2 py-1 rounded font-mono text-sm text-primary font-medium border">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors font-medium">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 bg-muted/30 py-2 my-4">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="flex items-start gap-3"><div class="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0"></div><div>$1</div></li>')
      .replace(/^1\. (.*$)/gim, '<li class="flex items-start gap-3"><div class="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0"></div><div>$1</div></li>')
      .replace(/\n/g, '<br>');

    // Wrap consecutive <li> elements in <ul>
    html = html.replace(/(<li>.*?<\/li>)+/g, '<ul class="space-y-2">$&</ul>');

    return html;
  };

  return (
    <Card className="border-border bg-card shadow-lg">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={20} className="text-primary" />
            <CardTitle className="text-lg font-mono">Content Editor</CardTitle>
            <Badge variant="secondary" className="text-xs font-mono">
              Markdown
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="font-mono"
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {!isPreview && (
          <div className="border rounded-lg overflow-hidden bg-card border-border">
            {/* Enhanced Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-muted/50 border-border">
              <Badge variant="secondary" className="text-xs font-mono mr-2">
                <Code size={12} className="mr-1" />
                Formatting
              </Badge>
              {formatActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={action.action}
                  title={action.tooltip}
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <action.icon size={16} />
                </Button>
              ))}
              <div className="w-px h-6 bg-border mx-2" />
              <Badge variant="secondary" className="text-xs font-mono mr-2">
                <Image size={12} className="mr-1" />
                Media
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMedia("image")}
                title="Insert Image"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Image size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMedia("video")}
                title="Insert Video"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Video size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMedia("code")}
                title="Insert Code Block"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <FileText size={16} />
              </Button>
            </div>

            {/* Enhanced Editor */}
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Start writing your blog post... Use markdown for formatting."
              className="min-h-[500px] border-0 focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed bg-card"
            />
          </div>
        )}

        {isPreview && (
          <Card className="border rounded-lg min-h-[500px] bg-background border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-primary" />
                <CardTitle className="text-sm font-mono">Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className="prose prose-sm max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderPreview() }}
              />
            </CardContent>
          </Card>
        )}

        {/* Enhanced Help Text */}
        <Card className="bg-muted/30 border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Terminal size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-xs text-muted-foreground">
                <p><strong className="text-foreground">Markdown Shortcuts:</strong></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <p><code className="bg-background px-1 rounded">**bold**</code> | <code className="bg-background px-1 rounded">*italic*</code></p>
                  <p><code className="bg-background px-1 rounded">`code`</code> | <code className="bg-background px-1 rounded">[link](url)</code></p>
                  <p><code className="bg-background px-1 rounded"># Heading</code> | <code className="bg-background px-1 rounded">&gt; Quote</code></p>
                  <p><code className="bg-background px-1 rounded">- List</code> | <code className="bg-background px-1 rounded">```code block```</code></p>
                </div>
                <p className="text-primary font-medium">Use the toolbar buttons or type markdown directly for rich formatting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
