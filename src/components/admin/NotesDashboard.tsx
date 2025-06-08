import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import NotesList from '../Notes/NotesList';
import AddNoteForm from '../Notes/AddNoteForm';
import { Note } from '../../types/note'; // Fix this path
import { getNotes, addNote } from '../../utils/notesStorage'; // Fix this path
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const NotesDashboard: React.FC<Props> = ({ onBack }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      const storedNotes = await getNotes();
      setNotes(storedNotes);
    };
    fetchNotes();
  }, []);

  const handlePreview = () => {
    if (!html.trim()) {
      setError('Please enter HTML content.');
      return;
    }
    setError('');
    setPreview(DOMPurify.sanitize(html, { ADD_TAGS: ['style', 'script'], ADD_ATTR: ['target'] }));
  };

  const handleAddNote = async (newNote: Note) => {
    await addNote(newNote);
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const handleSave = () => {
    if (!title.trim() || !html.trim()) {
      setError('Title and HTML are required.');
      return;
    }
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      html,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    addNote(updated);
    setShowForm(false);
    setTitle('');
    setHtml('');
    setPreview('');
    setError('');
  };

  return (
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <CardTitle className="text-2xl font-bold">Notes Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Notes management coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesDashboard;