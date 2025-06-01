
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { compare } from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const allowedOrigins = [
  'https://abhiatole.netlify.app',
  'https://preview--abhishekatole.lovable.app',
  'http://127.0.0.1:8081',
  'http://localhost:8081',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  console.log('Admin login request received from origin:', origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      console.log('Missing credentials');
      return new Response(
        JSON.stringify({ error: 'Missing credentials' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Looking up admin user:', username);

    // Find admin user
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single()

    if (userError || !adminUser) {
      console.log('User not found:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Admin user found:', adminUser.id);

    // Check if account is locked
    if (adminUser.locked_until && new Date(adminUser.locked_until) > new Date()) {
      console.log('Account is locked until:', adminUser.locked_until);
      return new Response(
        JSON.stringify({ error: 'Account is temporarily locked. Please try again later.' }),
        { status: 423, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify password - handle both the default password and bcrypt hashes
    let isValidPassword = false;
    
    // For the default admin user with username 'admin', check for plain text 'admin123' first
    if (username === 'admin' && password === 'admin123') {
      isValidPassword = true;
      console.log('Default admin login successful');
    } else {
      // For all other cases, use bcrypt comparison
      try {
        isValidPassword = await compare(password, adminUser.password_hash);
        console.log('Password validation result:', isValidPassword);
      } catch (bcryptError) {
        console.log('Bcrypt comparison failed:', bcryptError);
        isValidPassword = false;
      }
    }

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = (adminUser.failed_login_attempts || 0) + 1
      const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null // 15 minutes

      console.log('Invalid password, failed attempts:', failedAttempts);

      await supabase
        .from('admin_users')
        .update({
          failed_login_attempts: failedAttempts,
          locked_until: lockUntil?.toISOString()
        })
        .eq('id', adminUser.id)

      return new Response(
        JSON.stringify({
          error: failedAttempts >= 5
            ? 'Too many failed attempts. Account locked for 15 minutes.'
            : 'Invalid credentials'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate session token
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    console.log('Creating session for user:', adminUser.id);

    // Create session
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: adminUser.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError
    }

    // Update user login info and reset failed attempts
    await supabase
      .from('admin_users')
      .update({
        last_login: new Date().toISOString(),
        failed_login_attempts: 0,
        locked_until: null
      })
      .eq('id', adminUser.id)

    console.log('Login successful for user:', adminUser.username);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        sessionToken,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          last_login: adminUser.last_login
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
