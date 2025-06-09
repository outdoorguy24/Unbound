import { createClient } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

const SUPABASE_URL = "https://mvwrnvcyyxmabjhfpshk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3JudmN5eXhtYWJqaGZwc2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDI5NDUsImV4cCI6MjA2MjgxODk0NX0.VV-lgwQa43tfLYndPZeacQqoPkPmKtM7_qlgP0ceSb8";

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Create Supabase client with proper auth configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Detect URL automatically - enable for mobile OAuth
    detectSessionInUrl: true,
    // Auto refresh tokens
    autoRefreshToken: true,
    // Persist session in AsyncStorage
    persistSession: true,
  },
});

// Fixed Google OAuth login
export async function loginWithGoogle() {
  console.log("Starting Google OAuth...");

  try {
    // Create a proper redirect URI for Expo
    const redirectUri = makeRedirectUri({
      scheme: "unbound",
      path: "auth/callback",
    });
    console.log("Using redirect URI:", redirectUri);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("OAuth error:", error);
      throw error;
    }

    if (!data?.url) {
      throw new Error("No OAuth URL returned");
    }

    console.log("OAuth URL:", data.url);
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri, {
      showInRecents: false,
    });

    console.log("WebBrowser result:", result);

    if (result.type === "success" && result.url) {
      console.log("OAuth success, handling URL:", result.url);

      // Parse the URL to extract tokens
      const url = result.url;
      let params: URLSearchParams;

      if (url.includes("#")) {
        // Handle fragment-based parameters
        const fragment = url.split("#")[1];
        params = new URLSearchParams(fragment);
      } else if (url.includes("?")) {
        // Handle query-based parameters
        const query = url.split("?")[1];
        params = new URLSearchParams(query);
      } else {
        throw new Error("No parameters found in OAuth callback URL");
      }

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      console.log("Extracted tokens:", { accessToken: !!accessToken, refreshToken: !!refreshToken });

      if (accessToken) {
        // Set the session manually
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        console.log("Session set successfully");
        return sessionData;
      } else {
        throw new Error("No access token found in OAuth callback");
      }
    }

    if (result.type === "cancel") {
      throw new Error("OAuth was cancelled by user");
    }

    throw new Error(`OAuth failed with type: ${result.type}`);
  } catch (err) {
    console.error("OAuth exception:", err);
    throw err;
  }
}
