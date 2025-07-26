-- Add admin_user_id column to existing notes table
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_notes_admin_user_id ON public.notes(admin_user_id);

-- Update RLS policies for notes table
DROP POLICY IF EXISTS "Admin users can insert notes" ON public.notes;
DROP POLICY IF EXISTS "Admin users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Admin users can delete their own notes" ON public.notes;

-- Create updated policies
CREATE POLICY "Admin users can insert notes" ON public.notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_sessions 
            WHERE admin_sessions.admin_user_id = notes.admin_user_id 
            AND admin_sessions.expires_at > NOW()
        )
    );

CREATE POLICY "Admin users can update their own notes" ON public.notes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_sessions 
            WHERE admin_sessions.admin_user_id = notes.admin_user_id 
            AND admin_sessions.expires_at > NOW()
        )
    );

CREATE POLICY "Admin users can delete their own notes" ON public.notes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.admin_sessions 
            WHERE admin_sessions.admin_user_id = notes.admin_user_id 
            AND admin_sessions.expires_at > NOW()
        )
    );
