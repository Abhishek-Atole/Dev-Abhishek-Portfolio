import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Note } from '../../types/note';
import { getNotes, addNote, deleteNote, updateNote } from '../../utils/notesStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Eye, Edit, Trash2, Save, X, Loader2, Database, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface Props {
  onBack: () => void;
}

const NotesDashboard: React.FC<Props> = ({ onBack }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [slug, setSlug] = useState('');
  const [preview, setPreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth(); // Get adminUser to ensure they are logged in

  useEffect(() => {
    loadNotes();
    
    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const storedNotes = await getNotes();
      setNotes(storedNotes);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notes. Using local backup.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handlePreview = () => {
    if (!html.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter HTML content to preview.',
        variant: 'destructive'
      });
      return;
    }
    setPreview(DOMPurify.sanitize(html));
    setShowPreview(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !html.trim()) {
      toast({
        title: 'Error',
        description: 'Title and HTML content are required.',
        variant: 'destructive'
      });
      return;
    }

    if (!adminUser) { // Check if admin is logged in
      toast({
        title: 'Authentication Error',
        description: 'Admin user not authenticated. Please log in again.',
        variant: 'destructive'
      });
      setSaving(false);
      return;
    }

    setSaving(true);
    try {
      const notePayloadBase = { title, html, slug: slug || generateSlug(title) };

      if (editingId) {
        // For updates, you'll need a similar 'update-note-admin' Edge Function
        // await updateNote(editingId, notePayloadBase); 
        toast({ title: 'Info', description: 'Update functionality via Edge Function needs to be implemented.'});
      } else {
        await addNote(notePayloadBase); // Pass only core note data
      }
      
      await loadNotes();
      resetForm();
      toast({
        title: 'Success',
        description: editingId ? 'Note updated successfully!' : 'Note created successfully!'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || (isOnline ? 'Failed to save note to database.' : 'Saved locally. Will sync when online.'),
        variant: isOnline && error.message !== 'Admin session token not found. Please log in.' ? 'destructive' : 'default'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setHtml(note.html);
    setSlug(note.slug || generateSlug(note.title));
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        await loadNotes();
        toast({
          title: 'Success',
          description: 'Note deleted successfully!'
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete note.',
          variant: 'destructive'
        });
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle('');
    setHtml('');
    setSlug('');
    setPreview('');
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft size={16} />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-bold">Notes Management</CardTitle>
                  <div className="flex items-center gap-1">
                    <Database size={16} className="text-blue-600" />
                    {isOnline ? (
                      <Wifi size={16} className="text-green-600" />
                    ) : (
                      <WifiOff size={16} className="text-red-600" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage HTML notes that will be accessible as individual pages
                  {!isOnline && ' (Offline - changes saved locally)'}
                </p>
              </div>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus size={16} className="mr-2" />
                Add New Note
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingId ? 'Edit Note' : 'Create New Note'}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={resetForm}>
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter note title..."
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-slug"
                  className="font-mono text-sm"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Will be accessible at: /notes/{slug}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">HTML Content *</label>
              <Textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="Enter your HTML content here..."
                className="min-h-[300px] font-mono text-sm"
                disabled={saving}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview} disabled={saving}>
                <Eye size={16} className="mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                {editingId ? 'Update Note' : 'Save Note'}
              </Button>
            </div>

            {/* Preview */}
            {showPreview && preview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: preview }}
                  />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Existing Notes ({notes.length})</CardTitle>
            {loading && <Loader2 size={20} className="animate-spin" />}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 size={24} className="animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No notes created yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} className="mr-2" />
                Create Your First Note
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{note.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            /notes/{note.slug || generateSlug(note.title)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Created: {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                          {note.id.startsWith('local_') && (
                            <Badge variant="secondary" className="text-xs">
                              Local
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {note.html.length > 100 
                            ? `${note.html.substring(0, 100)}...` 
                            : note.html
                          }
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/notes/${note.slug || generateSlug(note.title)}`, '_blank')}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(note)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(note.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesDashboard;