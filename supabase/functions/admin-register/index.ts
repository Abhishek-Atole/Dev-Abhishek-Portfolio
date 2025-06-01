
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { hash } from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const allowedOrigins = [
  'https://abhiatole.netlify.app',
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

  console.log('Admin registration request received from origin:', origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { invitationCode, username, email, password } = await req.json();
    console.log('Registration attempt for:', { username, email, invitationCode });

    if (!invitationCode || !username || !email || !password) {
      console.log('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Validating invitation code:', invitationCode);

    // Find and validate invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('admin_invitations')
      .select('*')
      .eq('invitation_code', invitationCode)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (invitationError || !invitation) {
      console.log('Invalid invitation:', invitationError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired invitation code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Invitation found:', invitation.id);

    // Check if email matches invitation
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      console.log('Email mismatch:', invitation.email, 'vs', email);
      return new Response(
        JSON.stringify({ error: 'Email does not match the invitation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if username already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      console.log('Username already exists:', username);
      return new Response(
        JSON.stringify({ error: 'Username already exists' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if email already exists
    const { data: existingEmail, error: existingEmailError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmail) {
      console.log('Email already registered:', email);
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Hash the password
    const passwordHash = await hash(password)
    console.log('Password hashed successfully');

    // Create the admin user
    const { data: newUser, error: createUserError } = await supabase
      .from('admin_users')
      .insert({
        username,
        email,
        password_hash: passwordHash,
        is_verified: true,
        invited_by: invitation.created_by
      })
      .select()
      .single()

    if (createUserError) {
      console.error('Error creating user:', createUserError)
      return new Response(
        JSON.stringify({ error: 'Failed to create admin user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Admin user created:', newUser.id);

    // Mark invitation as used
    const { error: updateInvitationError } = await supabase
      .from('admin_invitations')
      .update({
        used_at: new Date().toISOString(),
        used_by: newUser.id
      })
      .eq('id', invitation.id)

    if (updateInvitationError) {
      console.error('Error updating invitation:', updateInvitationError)
      // Don't fail the registration, but log the error
    }

    console.log('Registration successful for:', username);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin account created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
