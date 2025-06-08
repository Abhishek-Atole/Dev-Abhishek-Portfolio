export interface Note {
  id: string;
  title: string;
  html: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DatabaseNote {
  id: string;
  title: string;
  html: string;
  slug: string;
  created_at: string;
  updated_at?: string;
}