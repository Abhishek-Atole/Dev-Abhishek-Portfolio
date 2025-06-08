import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getNotes } from '@/utils/notesStorage';
import { Note } from '@/types/note';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotesIndexPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    document.title = "Notes | Abhishek Atole";
    const allNotes = getNotes().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotes(allNotes);
  }, []);

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
              {notes.map((note) => (
                <Link key={note.id} to={`/notes/${note.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div 
                          className="text-sm text-muted-foreground line-clamp-3"
                          dangerouslySetInnerHTML={{ 
                            __html: note.html.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                          }}
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Read More
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotesIndexPage;