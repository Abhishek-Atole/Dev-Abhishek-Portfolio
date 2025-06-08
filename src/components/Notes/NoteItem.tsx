import React from 'react';
import { Note } from '../../types/note';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{note.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: note.html }}
        />
      </CardContent>
    </Card>
  );
};

export default NoteItem;