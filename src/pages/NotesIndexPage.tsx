import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getNotes } from '@/services/notesService';
import { Note } from '@/types/note';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Loader2, Code, Globe, Palette, Terminal, Brackets, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotesIndexPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Notes | Abhishek Atole";
    
    const loadNotes = async () => {
      try {
        const notesData = await getNotes();
        const sortedNotes = Array.isArray(notesData)
          ? [...notesData].sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          : [];
        setNotes(sortedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotes();
  }, []);

  // Helper function to detect language and get appropriate icon/color
  const getLanguageInfo = (content: string) => {
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
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading notes...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Technical Notes</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of programming concepts, tutorials, and technical insights
            </p>
          </div>

          {/* Notes Grid */}
          {notes.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Notes Available</h3>
              <p className="text-muted-foreground">
                Notes will appear here once they are published.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => {
                const langInfo = getLanguageInfo(note.html);
                const Icon = langInfo.icon;
                
                // Extract preview text from content
                const previewText = note.html
                  .replace(/```[\w]*\n/, '') // Remove opening code block
                  .replace(/\n```$/, '') // Remove closing code block
                  .replace(/[#*`]/g, '') // Remove markdown symbols
                  .substring(0, 150) + '...';

                return (
                  <Link key={note.id} to={`/notes/${note.slug}`}>
                    <Card className="h-full hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                            {note.title}
                          </CardTitle>
                          <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                            <Icon size={12} className={langInfo.color} />
                            <span className="text-xs">{langInfo.label}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {previewText}
                          </p>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar size={12} />
                              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Badge variant="outline" className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              Read More →
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotesIndexPage;