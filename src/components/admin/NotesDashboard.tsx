import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import NotesList from '../Notes/NotesList';
import AddNoteForm from '../Notes/AddNoteForm';
import { Note } from '../../Dev-Abhishek-Portfolio/src/types/note';
import { getNotes, addNote } from '../../utils/notesStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
        <CardTitle>Manage HTML Notes</CardTitle>
        <Button variant="outline" onClick={onBack} className="mt-2">Back to Dashboard</Button>
      </CardHeader>
      <CardContent>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-6">New Note</Button>
        )}
        {showForm && (
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Note Title"
              required
            />
            <Textarea
              value={html}
              onChange={e => setHtml(e.target.value)}
              rows={10}
              placeholder="Paste your HTML, CSS, and scripts here"
              required
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handlePreview}>Preview</Button>
              <Button type="submit">Save Note</Button>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {preview && (
              <div className="mt-4 border rounded bg-muted p-4">
                <div className="font-semibold mb-2">Preview:</div>
                <div dangerouslySetInnerHTML={{ __html: preview }} />
              </div>
            )}
          </form>
        )}
        {!showForm && notes.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Existing Notes</h3>
            <ul className="space-y-2">
              {notes.map(note => (
                <li key={note.id} className="border rounded p-3 bg-card">
                  <span className="font-mono font-bold">{note.title}</span>
                  <div className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesDashboard;