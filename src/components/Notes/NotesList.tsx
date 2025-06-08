import React from 'react';
import NoteItem from './NoteItem';
import { Note } from '../../types/note'; // Fix this path

interface NotesListProps {
  notes: Note[];
}

const NotesList: React.FC<NotesListProps> = ({ notes }) => {
  return (
    <div className="space-y-4">
      {notes.map(note => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NotesList;