import { supabase } from '@/integrations/supabase/client';
import { Note, DatabaseNote } from '@/types/note';

const STORAGE_KEY = "admin_html_notes";

// Helper function to transform database note to app note
function transformDatabaseNote(dbNote: DatabaseNote): Note {
  return {
    id: dbNote.id,
    title: dbNote.title,
    html: dbNote.html,
    slug: dbNote.slug,
    createdAt: dbNote.created_at,
    updatedAt: dbNote.updated_at
  };
}

// Helper function to transform app note to database note
function transformToDatabase(note: Partial<Note>): Partial<DatabaseNote> {
  return {
    title: note.title,
    html: note.html,
    slug: note.slug,
  };
}

// Backup functions for localStorage
function getNotesFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotesToStorage(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export async function getNotes(): Promise<Note[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      // Fallback to localStorage
      return getNotesFromStorage();
    }

    const notes = data?.map(transformDatabaseNote) || [];
    
    // Backup to localStorage
    saveNotesToStorage(notes);
    
    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    // Fallback to localStorage
    return getNotesFromStorage();
  }
}

export async function addNote(noteData: Omit<Note, 'id' | 'createdAt' | 'admin_user_id' | 'updatedAt'>): Promise<Note> {
  try {
    const adminSessionToken = localStorage.getItem('admin_session_token');
    if (!adminSessionToken) {
      throw new Error('Admin session token not found. Please log in.');
    }

    const payload = {
      notePayload: { 
        title: noteData.title,
        html: noteData.html,
        slug: noteData.slug,
      },
      adminSessionToken // Make sure this token is valid and being retrieved correctly
    };
    
    const { data: newNoteData, error } = await supabase.functions.invoke('create-note-admin', {
      body: payload, 
    });

    if (error) throw error;
    if (!newNoteData) throw new Error('No data returned from create-note-admin function');
    
    // Assuming newNoteData is compatible with your Note type or needs transformation
    // If your Edge function returns data matching the DatabaseNote structure:
    // return transformDatabaseNote(newNoteData); 
    // If it already matches the Note structure:
    return newNoteData as Note;

  } catch (error) {
    console.error('Error adding note:', error); // Keep this log
    
    // Fallback: create note with local ID and save to localStorage
    const localNote: Note = {
      id: `local_${Date.now()}`,
      ...noteData,
      createdAt: new Date().toISOString(),
      // admin_user_id: adminUserId, // You'd need adminUserId here if storing locally with it
    };
    
    const localNotes = getNotesFromStorage();
    saveNotesToStorage([localNote, ...localNotes]);
    
    // Re-throw to inform the UI component
    throw error; 
  }
}

export async function updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note> {
  try {
    const { data, error } = await (supabase as any)
      .from('notes')
      .update(transformToDatabase(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const updatedNote = transformDatabaseNote(data);
    
    // Update localStorage backup
    const localNotes = getNotesFromStorage();
    const noteIndex = localNotes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      localNotes[noteIndex] = updatedNote;
      saveNotesToStorage(localNotes);
    }
    
    return updatedNote;
  } catch (error) {
    console.error('Error updating note:', error);
    
    // Fallback: update in localStorage
    const localNotes = getNotesFromStorage();
    const noteIndex = localNotes.findIndex(note => note.id === id);
    
    if (noteIndex !== -1) {
      const updatedNote = {
        ...localNotes[noteIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localNotes[noteIndex] = updatedNote;
      saveNotesToStorage(localNotes);
      return updatedNote;
    }
    
    throw error;
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const { error } = await (supabase as any)
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Update localStorage backup
    const localNotes = getNotesFromStorage();
    const filteredNotes = localNotes.filter(note => note.id !== id);
    saveNotesToStorage(filteredNotes);
  } catch (error) {
    console.error('Error deleting note:', error);
    
    // Fallback: delete from localStorage
    const localNotes = getNotesFromStorage();
    const filteredNotes = localNotes.filter(note => note.id !== id);
    saveNotesToStorage(filteredNotes);
    
    throw error;
  }
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('notes')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      // Fallback to localStorage
      const localNotes = getNotesFromStorage();
      return localNotes.find(note => note.slug === slug) || null;
    }

    return data ? transformDatabaseNote(data) : null;
  } catch (error) {
    console.error('Error fetching note by slug:', error);
    
    // Fallback to localStorage
    const localNotes = getNotesFromStorage();
    return localNotes.find(note => note.slug === slug) || null;
  }
}

// Sync function to sync localStorage notes to database (useful for migration)
export async function syncLocalNotesToDatabase(): Promise<void> {
  try {
    const localNotes = getNotesFromStorage();
    
    for (const note of localNotes) {
      // Check if note already exists in database
      const { data: existingNote } = await (supabase as any)
        .from('notes')
        .select('id')
        .eq('slug', note.slug)
        .single();

      if (!existingNote) {
        // Note doesn't exist in database, add it
        await (supabase as any)
          .from('notes')
          .insert([transformToDatabase(note)]);
      }
    }
    
    console.log('Local notes synced to database');
  } catch (error) {
    console.error('Error syncing local notes to database:', error);
  }
}