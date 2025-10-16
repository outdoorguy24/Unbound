import { loginWithGoogle, supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/lib/supabaseUserProfile";
import { getStoredPushToken } from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

// Types
interface User {
  id: string;
  email: string;
  name?: string;
  pushToken?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoadingAuth: boolean;
  login: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signInWithApple: (identityToken: string, nonce?: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const AUTH_STORAGE_KEY = "@auth_user";

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check if user is logged in
  const isLoggedIn = !!user;

  // Listen for auth state changes
  useEffect(() => {
    const getSession = async () => {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Profile check and protected routes
  useEffect(() => {
    const checkProfileAndRoute = async () => {
      if (isLoadingAuth) return;
      const inAuthGroup = segments[0] === "(auth)";
      const inOnboardingGroup = segments[0] === "(onboarding)";
      console.log("isLoggedIn ====>", isLoggedIn)
      console.log("inAuthGroup ====>", inAuthGroup)
      console.log("inOnboardingGroup ====>", inOnboardingGroup)
      console.log("segments ====>", segments)

      if (!isLoggedIn && !inAuthGroup && !inOnboardingGroup) {
        console.log("1111 ====>", segments)
        router.replace("/(auth)/login");
        return;
      }
      if (isLoggedIn) {
        // Check for user profile
        try {
          const profile = await getUserProfile(user!.id);
          console.log("profile ==> ", profile);
          if (!profile) {
            // No profile, go to profile setup
            // if (segments[1] !== "ScreenProfileSetup") {
            //   router.replace("/(onboarding)/ScreenProfileSetup");
            // }
            console.log("2222 ====>", segments)

            if (segments[1] === "signup") {

              console.log("2222 ====> signup");
              router.replace("/(onboarding)/EmailVerificationScreen");

            } else if (segments[1] === "SignupOptionsScreen") {

              console.log("2222 ====> SignupOptionsScreen");
              router.replace("/(onboarding)/ScreenTimePermission");

            } else if (segments[1] === "login") {

              console.log("2222 ====> login");
              router.replace("/(tabs)/camp");
            }
            return;
          } else {
            console.log("3333 ====>", segments)

            if (segments[1] === "signup") {

              console.log("3333 ====> signup");
              router.replace("/(onboarding)/EmailVerificationScreen");

            } else if (segments[1] === "SignupOptionsScreen") {

              console.log("3333 ====> SignupOptionsScreen");
              router.replace("/(onboarding)/ScreenTimePermission");

            } else if (segments[1] === "login") {

              console.log("3333 ====> login");
              router.replace("/(tabs)/camp");
            }
          }
          // Profile exists, go to partner matching
          // if (inAuthGroup || (inOnboardingGroup && segments[1] !== "Screen13")) {
          //   router.replace("/(onboarding)/Screen13");
          // }
        } catch (e) {
          // If error is not 'no rows found', log it
          console.error("Profile check error:", e);
        }
      }
    };
    checkProfileAndRoute();
    //TODO: FOR TESTING

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, segments, isLoadingAuth, user]);

  // Login with Google
  const login = async () => {
    setIsLoadingAuth(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Simulate signup
  const signup = async (email: string, password: string, name: string) => {
    setIsLoadingAuth(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const pushToken = await getStoredPushToken();
      
      // Generate a proper UUID for the user
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const userData: User = {
        id: generateUUID(),
        email,
        name,
        pushToken: pushToken || undefined,
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      router.replace("/(onboarding)/ScreenProfileSetup");
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Sign in with Apple
  const signInWithApple = async (identityToken: string, nonce?: string) => {
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: identityToken,
        nonce: nonce,
      });

      if (error) {
        console.error('Apple Sign-In error:', error);
        throw error;
      }

      if (data.user) {
        // The user will be set automatically by the auth state listener
        console.log('Apple Sign-In successful');
        // Navigation will be handled by the useEffect that listens to auth state changes
      }
    } catch (error) {
      console.error('Apple Sign-In error:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      // Check if this is a mock user (short ID) or real Supabase user
      const isMockUser = user?.id && user.id.length <= 10;
      
      if (isMockUser) {
        // For mock users, just simulate success
        console.log('Mock user password update:', { userId: user?.id, newPassword });
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        return;
      } else {
        // For real Supabase users, check if they have email/password authentication
        // OAuth users (Google/Apple) cannot change password through this method
        const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error("Unable to verify user authentication method");
        }
        
        // Check if user has email/password provider (not OAuth)
        const hasPasswordProvider = supabaseUser?.app_metadata?.providers?.includes('email') || 
                                   supabaseUser?.identities?.some(identity => identity.provider === 'email');
        
        if (!hasPasswordProvider) {
          throw new Error("Password cannot be changed for accounts signed in with Google or Apple");
        }
        
        // Update password for email/password users
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) {
          console.error("Password update error:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setIsLoadingAuth(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoadingAuth,
        login,
        signup,
        signInWithApple,
        logout,
        updatePassword,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
