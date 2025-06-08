import React, { useState } from 'react';
import { Note } from '../../types/note'; // Fix this path
import { addNote } from '../../utils/notesStorage'; // Fix this path

const AddNoteForm: React.FC<{ onAdd: (note: Note) => void }> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      html: content, // Fix property name to match Note interface
      createdAt: new Date().toISOString(),
    };
    addNote(newNote);
    onAdd(newNote);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="HTML Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full p-2 border rounded h-32"
      />
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
        Add Note
      </button>
    </form>
  );
};

export default AddNoteForm;