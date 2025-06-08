import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getNoteBySlug } from '@/utils/notesStorage';
import { Note } from '@/types/note';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const foundNote = getNoteBySlug(slug);
      setNote(foundNote);
      setLoading(false);
      
      if (foundNote) {
        document.title = `${foundNote.title} | Abhishek Atole`;
      }
    }
  }, [slug]);

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
            
            <h1 className="text-4xl font-bold mb-4">{note.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              {note.updatedAt && (
                <div className="flex items-center gap-2">
                  <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: note.html }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotePage;