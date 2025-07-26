import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS configuration
const allowedOrigins = [
  'https://abhishekatole.netlify.app',
  'https://preview--abhishekatole.lovable.app',
  'http://127.0.0.1:8081',
  'http://localhost:8081',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:8082',
  'http://127.0.0.1:8082',
  'http://localhost:8083',
  'http://127.0.0.1:8083',
  'https://super-trout-qg7px57wvxxc6xpr-8080.app.github.dev',
  'https://super-trout-qg7px57wvxxc6xpr-8081.app.github.dev',
  'https://super-trout-qg7px57wvxxc6xpr-8082.app.github.dev',
  'https://super-trout-qg7px57wvxxc6xpr-5173.app.github.dev'
];

serve(async (req) => {
  const origin = req.headers.get('origin') || '*';
  
  // Check if origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin) || origin.includes('github.dev');
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
  };

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Parse request body
    const { notePayload, adminSessionToken } = await req.json();
    
    console.log('Create note request received:');
    console.log('- notePayload:', notePayload);
    console.log('- adminSessionToken present:', adminSessionToken ? 'YES' : 'NO');
    console.log('- adminSessionToken value:', adminSessionToken);

    // Validate request data
    if (!notePayload || !adminSessionToken) {
      console.error('Missing required fields:', { notePayload: !!notePayload, adminSessionToken: !!adminSessionToken });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: notePayload and adminSessionToken' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { title, html, slug } = notePayload;

    if (!title || !html || !slug) {
      return new Response(
        JSON.stringify({ error: 'Missing required note fields: title, html, slug' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Initializing Supabase client...');
    console.log('- Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
    console.log('- Service key:', supabaseServiceKey ? 'SET' : 'NOT SET');

        // Verify admin session
    console.log('Verifying admin session...');
    let session, sessionError;
    try {
      const result = await supabase
        .from('admin_sessions')
        .select(`
          id,
          admin_user_id,
          expires_at,
          admin_users!admin_sessions_admin_user_id_fkey(id, username, email)
        `)
        .eq('session_token', adminSessionToken)
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();
      
      session = result.data;
      sessionError = result.error;
    } catch (queryError) {
      console.error('Session query failed with exception:', queryError);
      return new Response(
        JSON.stringify({ error: 'Session verification failed', details: queryError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if slug already exists
    const { data: existingNote, error: slugError } = await supabase
      .from('notes')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (slugError && slugError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
      console.error('Slug check error:', slugError);
      return new Response(
        JSON.stringify({ error: 'Error checking slug uniqueness' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (existingNote) {
      return new Response(
        JSON.stringify({ error: 'A note with this slug already exists' }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create the note
    const { data: newNote, error: createError } = await supabase
      .from('notes')
      .insert({
        title: title.trim(),
        html: html,
        slug: slug.trim(),
        admin_user_id: session.admin_user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        id,
        title,
        html,
        slug,
        created_at,
        updated_at,
        admin_user_id
      `)
      .single();

    if (createError) {
      console.error('Note creation error:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create note' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Note created successfully:', newNote.id);

    // Transform the note to match frontend expectations
    const responseNote = {
      id: newNote.id,
      title: newNote.title,
      html: newNote.html,
      slug: newNote.slug,
      createdAt: newNote.created_at,
      updatedAt: newNote.updated_at
    };

    return new Response(
      JSON.stringify(responseNote),
      { 
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Create note admin error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
