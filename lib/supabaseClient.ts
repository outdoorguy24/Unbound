import { createClient } from '@supabase/supabase-js';
import * as AuthSession from 'expo-auth-session';

const SUPABASE_URL = 'https://mvwrnvcyyxmabjhfpshk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3JudmN5eXhtYWJqaGZwc2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDI5NDUsImV4cCI6MjA2MjgxODk0NX0.VV-lgwQa43tfLYndPZeacQqoPkPmKtM7_qlgP0ceSb8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Google OAuth login for Expo Go (web flow)
export async function loginWithGoogle() {
  console.log('Sign-in triggered');
  const redirectTo = AuthSession.makeRedirectUri({ useProxy: false });
  console.log('Redirect URI:', redirectTo);
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Google sign-in exception:', err);
    throw err;
  }
} 