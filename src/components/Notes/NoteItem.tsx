import React from 'react';

interface NoteItemProps {
  note: {
    id: string;
    title: string;
    content: string;
  };
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  return (
    <div className="note-item">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
    </div>
  );
};

export default NoteItem;