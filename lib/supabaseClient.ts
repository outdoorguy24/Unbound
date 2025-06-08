import { createClient } from '@supabase/supabase-js';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

const SUPABASE_URL = 'https://mvwrnvcyyxmabjhfpshk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3JudmN5eXhtYWJqaGZwc2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDI5NDUsImV4cCI6MjA2MjgxODk0NX0.VV-lgwQa43tfLYndPZeacQqoPkPmKtM7_qlgP0ceSb8';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Create Supabase client with proper auth configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Use custom scheme for mobile app
    scheme: 'unbound',
    // Detect URL automatically
    detectSessionInUrl: false,
    // Auto refresh tokens
    autoRefreshToken: true,
    // Persist session in AsyncStorage
    persistSession: true,
  },
});

// Fixed Google OAuth login
export async function loginWithGoogle() {
  console.log('Starting Google OAuth...');
  
  try {
    // Create proper redirect URI using your app scheme
    const redirectTo = AuthSession.makeRedirectUri({
      scheme: 'unbound',
      path: 'auth/callback'
    });
    
    console.log('Redirect URI:', redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        // Query params for mobile
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('OAuth error:', error);
      throw error;
    }

    console.log('OAuth initiated successfully');
    return data;
    
  } catch (err) {
    console.error('OAuth exception:', err);
    throw err;
  }
} 