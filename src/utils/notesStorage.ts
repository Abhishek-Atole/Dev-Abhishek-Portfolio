import { Note } from "../../Dev-Abhishek-Portfolio/src/types/note";

const STORAGE_KEY = "admin_html_notes";

export function getNotes(): Note[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}