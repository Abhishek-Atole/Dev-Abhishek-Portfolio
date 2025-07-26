import React, { useEffect, useState } from 'react';
import { Note } from '../../types/note';
import { getNotes, addNote, deleteNote, updateNote } from '../../services/notesService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, Plus, Eye, Edit, Trash2, Save, X, Loader2, Code, 
  FileText, Globe, Database, Palette, Terminal, Brackets
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import MarkdownRenderer from '../MarkdownRenderer';

interface Props {
  onBack: () => void;
}

// Programming language options
const LANGUAGE_OPTIONS = [
  { value: 'html', label: 'HTML', icon: Globe, color: 'text-orange-500' },
  { value: 'css', label: 'CSS', icon: Palette, color: 'text-blue-500' },
  { value: 'javascript', label: 'JavaScript', icon: Code, color: 'text-yellow-500' },
  { value: 'typescript', label: 'TypeScript', icon: Code, color: 'text-blue-600' },
  { value: 'python', label: 'Python', icon: Terminal, color: 'text-green-500' },
  { value: 'java', label: 'Java', icon: Code, color: 'text-red-500' },
  { value: 'cpp', label: 'C++', icon: Brackets, color: 'text-purple-500' },
  { value: 'c', label: 'C', icon: Brackets, color: 'text-gray-600' },
  { value: 'sql', label: 'SQL', icon: Database, color: 'text-indigo-500' },
  { value: 'php', label: 'PHP', icon: Code, color: 'text-purple-400' },
  { value: 'ruby', label: 'Ruby', icon: Code, color: 'text-red-400' },
  { value: 'go', label: 'Go', icon: Code, color: 'text-cyan-500' },
  { value: 'rust', label: 'Rust', icon: Code, color: 'text-orange-600' },
  { value: 'swift', label: 'Swift', icon: Code, color: 'text-orange-400' },
  { value: 'kotlin', label: 'Kotlin', icon: Code, color: 'text-purple-600' },
  { value: 'dart', label: 'Dart', icon: Code, color: 'text-blue-400' },
  { value: 'shell', label: 'Shell/Bash', icon: Terminal, color: 'text-green-600' },
  { value: 'powershell', label: 'PowerShell', icon: Terminal, color: 'text-blue-700' },
  { value: 'json', label: 'JSON', icon: Brackets, color: 'text-yellow-600' },
  { value: 'xml', label: 'XML', icon: Brackets, color: 'text-green-400' },
  { value: 'yaml', label: 'YAML', icon: FileText, color: 'text-red-300' },
  { value: 'markdown', label: 'Markdown', icon: FileText, color: 'text-gray-500' },
  { value: 'other', label: 'Other', icon: Code, color: 'text-gray-400' }
];

const NotesManager: React.FC<Props> = ({ onBack }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [language, setLanguage] = useState('markdown');
  const [tags, setTags] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: "Error loading notes",
        description: "Failed to load notes from the database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!editingId) {
      setSlug(generateSlug(newTitle));
    }
  };

  const formatContentForLanguage = (content: string, lang: string): string => {
    switch (lang) {
      case 'html':
      case 'css':
      case 'javascript':
      case 'typescript':
      case 'python':
      case 'java':
      case 'cpp':
      case 'c':
      case 'sql':
      case 'php':
      case 'ruby':
      case 'go':
      case 'rust':
      case 'swift':
      case 'kotlin':
      case 'dart':
      case 'shell':
      case 'powershell':
      case 'json':
      case 'xml':
      case 'yaml':
        return `\`\`\`${lang}\n${content}\n\`\`\``;
      case 'markdown':
        return content;
      default:
        return `\`\`\`\n${content}\n\`\`\``;
    }
  };

  const extractContentFromMarkdown = (formattedContent: string): string => {
    // Extract content from markdown code blocks
    const codeBlockRegex = /^```[\w]*\n([\s\S]*?)\n```$/;
    const match = formattedContent.match(codeBlockRegex);
    return match ? match[1] : formattedContent;
  };

  // Helper function to get content preview for display
  const getContentPreview = (html: string, maxLength: number = 200): string => {
    let preview = extractContentFromMarkdown(html);
    
    // Remove markdown syntax for preview
    preview = preview
      .replace(/^#{1,6}\s+/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/^\s*[-*+]\s+/gm, '• ') // Convert list items
      .trim();
    
    return preview.length > maxLength 
      ? preview.substring(0, maxLength) + '...' 
      : preview;
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const formattedContent = formatContentForLanguage(content, language);
      
      if (editingId) {
        await updateNote(editingId, {
          title: title.trim(),
          html: formattedContent,
          slug: slug.trim() || generateSlug(title),
        });
        toast({
          title: "Note updated",
          description: "Your note has been successfully updated.",
        });
      } else {
        await addNote({
          title: title.trim(),
          html: formattedContent,
          slug: slug.trim() || generateSlug(title),
        });
        toast({
          title: "Note created",
          description: "Your note has been successfully created.",
        });
      }

      await loadNotes();
      resetForm();
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error saving note",
        description: "Failed to save the note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setSlug(note.slug);
    
    // Extract content from markdown if it's a code block
    const extractedContent = extractContentFromMarkdown(note.html);
    setContent(extractedContent);
    
    // Detect language from markdown
    const langMatch = note.html.match(/^```(\w+)/);
    if (langMatch) {
      const detectedLang = langMatch[1];
      const langExists = LANGUAGE_OPTIONS.some(opt => opt.value === detectedLang);
      setLanguage(langExists ? detectedLang : 'other');
    } else {
      setLanguage('markdown');
    }
    
    setShowForm(true);
    setShowPreview(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteNote(id);
      await loadNotes();
      toast({
        title: "Note deleted",
        description: "The note has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error deleting note",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSlug('');
    setLanguage('markdown');
    setTags('');
    setEditingId(null);
    setShowForm(false);
    setShowPreview(false);
  };

  const getLanguageInfo = (lang: string) => {
    return LANGUAGE_OPTIONS.find(opt => opt.value === lang) || LANGUAGE_OPTIONS[LANGUAGE_OPTIONS.length - 1];
  };

  // Helper function to provide language-specific examples
  const getLanguageExample = (lang: string): string => {
    const examples: Record<string, string> = {
      'html': '<div class="container">\n  <h1>Hello World</h1>\n</div>',
      'css': '.container {\n  display: flex;\n  justify-content: center;\n}',
      'javascript': 'function greet(name) {\n  return `Hello, ${name}!`;\n}',
      'typescript': 'interface User {\n  name: string;\n  age: number;\n}',
      'python': 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)',
      'java': 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
      'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}',
      'c': '#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}',
      'sql': 'SELECT users.name, orders.total\nFROM users\nJOIN orders ON users.id = orders.user_id\nWHERE orders.total > 100;',
      'php': '<?php\nfunction greet($name) {\n    return "Hello, " . $name . "!";\n}\necho greet("World");\n?>',
      'ruby': 'class Person\n  def initialize(name)\n    @name = name\n  end\n  \n  def greet\n    "Hello, #{@name}!"\n  end\nend',
      'go': 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      'rust': 'fn main() {\n    println!("Hello, world!");\n}\n\nfn fibonacci(n: u32) -> u32 {\n    match n {\n        0 => 0,\n        1 => 1,\n        _ => fibonacci(n - 1) + fibonacci(n - 2),\n    }\n}',
      'swift': 'func greet(name: String) -> String {\n    return "Hello, \\(name)!"\n}\n\nprint(greet(name: "World"))',
      'kotlin': 'fun main() {\n    println("Hello, World!")\n}\n\nfun greet(name: String): String {\n    return "Hello, $name!"\n}',
      'dart': 'void main() {\n  print("Hello, World!");\n}\n\nString greet(String name) {\n  return "Hello, $name!";\n}',
      'shell': '#!/bin/bash\necho "Hello, World!"\nfor i in {1..5}; do\n  echo "Count: $i"\ndone',
      'powershell': 'Write-Host "Hello, World!"\n$numbers = 1..5\nforeach ($num in $numbers) {\n    Write-Host "Count: $num"\n}',
      'json': '{\n  "name": "John Doe",\n  "age": 30,\n  "skills": ["JavaScript", "Python", "Java"]\n}',
      'xml': '<?xml version="1.0" encoding="UTF-8"?>\n<person>\n  <name>John Doe</name>\n  <age>30</age>\n</person>',
      'yaml': 'name: John Doe\nage: 30\nskills:\n  - JavaScript\n  - Python\n  - Java',
      'markdown': '# Hello World\n\nThis is a **markdown** example with:\n\n- Lists\n- `inline code`\n- [links](https://example.com)\n\n```javascript\nconsole.log("Hello, World!");\n```',
      'other': 'Enter your code or content here...'
    };
    
    return examples[lang] || examples['other'];
  };

  const renderPreview = () => {
    const formattedContent = formatContentForLanguage(content, language);
    return (
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Code size={14} />
            Preview Mode - {getLanguageInfo(language).label}
          </div>
        </div>
        <MarkdownRenderer content={formattedContent} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg">Loading notes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Notes Management</h1>
            <p className="text-muted-foreground">Manage code snippets and technical notes</p>
          </div>
        </div>
        
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Note
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code size={20} />
              {editingId ? 'Edit Note' : 'Create New Note'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter note title"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((lang) => {
                      const Icon = lang.icon;
                      return (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={lang.color} />
                            {lang.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Content *</label>
                <div className="flex gap-2">
                  <Button
                    variant={showPreview ? "outline" : "default"}
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant={showPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    disabled={!content.trim()}
                  >
                    <Eye size={14} className="mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
              
              {showPreview ? (
                <Card className="min-h-[400px] p-4 overflow-auto">
                  {renderPreview()}
                </Card>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Enter your ${getLanguageInfo(language).label} code here...\n\nExample for ${getLanguageInfo(language).label}:\n${getLanguageExample(language)}`}
                    className="min-h-[400px] font-mono text-sm resize-none"
                  />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Code size={12} />
                    <span>
                      Content will be automatically formatted as {getLanguageInfo(language).label} code block
                      {language === 'markdown' ? ' (supports mixed content)' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSave} 
                disabled={saving || !title.trim() || !content.trim()}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? 'Saving...' : 'Save Note'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetForm}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      {!showForm && (
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Notes ({notes.length})</h2>
          </div>

          {notes.length === 0 ? (
            <Card className="p-12 text-center">
              <Code size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Notes Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first note to start building your knowledge base
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus size={16} className="mr-2" />
                Create Your First Note
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {notes.map((note) => {
                const langMatch = note.html.match(/^```(\w+)/);
                const detectedLang = langMatch ? langMatch[1] : 'markdown';
                const langInfo = getLanguageInfo(detectedLang);
                const Icon = langInfo.icon;
                const contentPreview = getContentPreview(note.html, 300);

                return (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-medium">{note.title}</h3>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Icon size={12} className={langInfo.color} />
                              {langInfo.label}
                            </Badge>
                          </div>
                          
                          {/* Content Preview */}
                          <div className="mb-3 p-3 bg-muted/50 rounded-lg border">
                            <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                              {contentPreview}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Slug: /{note.slug}</span>
                            <span>•</span>
                            <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                            {note.updatedAt !== note.createdAt && (
                              <>
                                <span>•</span>
                                <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Preview the full note content
                              const previewWindow = window.open('', '_blank');
                              if (previewWindow) {
                                previewWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>${note.title} - Preview</title>
                                      <style>
                                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
                                        pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
                                        code { background: #f0f0f0; padding: 2px 4px; border-radius: 4px; font-family: 'Monaco', 'Consolas', monospace; }
                                        h1, h2, h3 { color: #333; }
                                        .language-badge { display: inline-block; background: #e2e8f0; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 16px; }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="language-badge">${langInfo.label}</div>
                                      <h1>${note.title}</h1>
                                      <div>${note.html.replace(/```(\w+)?\n/g, '<pre><code>').replace(/\n```/g, '</code></pre>').replace(/\n/g, '<br>')}</div>
                                    </body>
                                  </html>
                                `);
                                previewWindow.document.close();
                              }
                            }}
                            title="Preview in new window"
                          >
                            <Eye size={14} />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(note)}
                            title="Edit note"
                          >
                            <Edit size={14} />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(note.id)}
                            className="text-destructive hover:text-destructive"
                            title="Delete note"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesManager;
