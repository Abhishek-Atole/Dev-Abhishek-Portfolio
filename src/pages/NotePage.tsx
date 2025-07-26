import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getNoteBySlug } from '@/services/notesService';
import { Note } from '@/types/note';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Code, Globe, Palette, Terminal, Brackets, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      if (slug) {
        try {
          const foundNote = await getNoteBySlug(slug);
          setNote(foundNote);
          
          if (foundNote) {
            document.title = `${foundNote.title} | Abhishek Atole`;
          }
        } catch (error) {
          console.error('Error loading note:', error);
          setNote(null);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadNote();
  }, [slug]);

  // Helper function to detect language from content
  const detectLanguage = (content: string) => {
    const langMatch = content.match(/^```(\w+)/);
    if (langMatch) {
      const lang = langMatch[1];
      const languageMap: Record<string, { label: string; icon: any; color: string }> = {
        'html': { label: 'HTML', icon: Globe, color: 'text-orange-500' },
        'css': { label: 'CSS', icon: Palette, color: 'text-blue-500' },
        'javascript': { label: 'JavaScript', icon: Code, color: 'text-yellow-500' },
        'typescript': { label: 'TypeScript', icon: Code, color: 'text-blue-600' },
        'python': { label: 'Python', icon: Terminal, color: 'text-green-500' },
        'java': { label: 'Java', icon: Code, color: 'text-red-500' },
        'cpp': { label: 'C++', icon: Brackets, color: 'text-purple-500' },
        'c': { label: 'C', icon: Brackets, color: 'text-gray-600' },
        'sql': { label: 'SQL', icon: Database, color: 'text-indigo-500' },
        'markdown': { label: 'Markdown', icon: FileText, color: 'text-gray-500' },
      };
      return languageMap[lang] || { label: lang.toUpperCase(), icon: Code, color: 'text-gray-400' };
    }
    return { label: 'Markdown', icon: FileText, color: 'text-gray-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading note...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!note) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/notes">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft size={16} className="mr-2" />
                Back to Notes
              </Button>
            </Link>
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold flex-1">{note.title}</h1>
              
              {/* Language Badge */}
              {(() => {
                const langInfo = detectLanguage(note.html);
                const Icon = langInfo.icon;
                return (
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <Icon size={16} className={langInfo.color} />
                    {langInfo.label}
                  </Badge>
                );
              })()}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <div className="flex items-center gap-2">
                  <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="prose prose-lg max-w-none">
                <MarkdownRenderer content={note.html} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotePage;