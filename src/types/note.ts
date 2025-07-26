export interface Note {
  id: string;
  title: string;
  html: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
  admin_user_id?: string;
}

export interface DatabaseNote {
  id: string;
  title: string;
  html: string;
  slug: string;
  created_at: string;
  updated_at?: string;
  admin_user_id?: string;
}