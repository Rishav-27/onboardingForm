// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// The client-side Supabase client (for use in front-end components)
// Uses the public anon key.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// The server-side Supabase client (for use in API routes and server components)
// Uses the service role key for full access.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);