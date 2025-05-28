
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bold, Italic, Underline, Link, List, ListOrdered, 
  Code, Quote, Image, Video, FileText, Heading1, 
  Heading2, Heading3, Eye, EyeOff 
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
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
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^1\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br>');

    // Wrap consecutive <li> elements in <ul> or <ol>
    html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

    return html;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Content Editor</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPreview && (
          <div className="border rounded-lg">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
              {formatActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={action.action}
                  title={action.tooltip}
                  className="h-8 w-8 p-0"
                >
                  <action.icon size={16} />
                </Button>
              ))}
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMedia("image")}
                title="Insert Image"
                className="h-8 w-8 p-0"
              >
                <Image size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMedia("video")}
                title="Insert Video"
                className="h-8 w-8 p-0"
              >
                <Video size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMedia("code")}
                title="Insert Code Block"
                className="h-8 w-8 p-0"
              >
                <FileText size={16} />
              </Button>
            </div>

            {/* Editor */}
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Start writing your blog post..."
              className="min-h-[400px] border-0 focus-visible:ring-0 resize-none font-mono"
            />
          </div>
        )}

        {isPreview && (
          <div className="border rounded-lg p-4 min-h-[400px] bg-background">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderPreview() }}
            />
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Markdown shortcuts:</strong></p>
          <p>**bold** | *italic* | `code` | [link](url) | # Heading | &gt; Quote | - List</p>
          <p>Use the toolbar buttons or type markdown directly</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
