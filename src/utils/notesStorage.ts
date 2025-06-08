import { Note } from "/workspaces/Dev-Abhishek-Portfolio/src/types/note.ts";

const STORAGE_KEY = "admin_html_notes";

export function getNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export async function addNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
  const notes = getNotes();
  const newNote: Note = {
    id: Date.now().toString(),
    ...note,
    createdAt: new Date().toISOString()
  };
  
  const updatedNotes = [...notes, newNote];
  saveNotes(updatedNotes);
  
  return newNote;
}