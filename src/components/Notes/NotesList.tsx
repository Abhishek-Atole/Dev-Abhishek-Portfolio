import React from 'react';
import NoteItem from './NoteItem';
import { Note } from '../../../Dev-Abhishek-Portfolio/src/types/note';

interface NotesListProps {
  notes: Note[];
}

const NotesList: React.FC<NotesListProps> = ({ notes }) => {
  return (
    <div>
      {notes.map(note => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NotesList;