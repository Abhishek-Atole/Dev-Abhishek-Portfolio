import React, { useState } from 'react';
import { Note } from '../../../Dev-Abhishek-Portfolio/src/types/note';
import { addNote } from '../../utils/notesStorage';

const AddNoteForm: React.FC<{ onAdd: (note: Note) => void }> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: Note = {
      id: Date.now(),
      title,
      content,
    };
    addNote(newNote);
    onAdd(newNote);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Add Note</button>
    </form>
  );
};

export default AddNoteForm;