import { loginWithGoogle, supabase } from "@/lib/supabaseClient";
import { getStoredPushToken } from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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
  logout: () => Promise<void>;
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

  // Check if user is logged in
  const isLoggedIn = !!user;

  // TODO: AuthContext routing logic disabled to prevent navigation interference
  // Current behavior: Only handles authentication state, no automatic routing
  // Future: Need to implement proper routing logic that doesn't interfere with user navigation
  
  // Minimal auth state setup - handles session management only
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

  // TODO: DISABLED - Routing logic commented out to prevent navigation interference
  // Issue: This was causing Login/Get Started buttons to jitter and not navigate properly
  // Future: Need to implement smarter routing that only redirects on app startup, not on every navigation
  // 
  // useEffect(() => {
  //   const checkInitialRoute = async () => {
  //     if (isLoadingAuth) return;
      
  //     // Only redirect to welcome if we're at the root and not logged in
  //     if (!isLoggedIn && segments.length === 0) {
  //       console.log("🚀 Redirecting to welcome screen (initial route)");
  //       router.replace("/(welcome)/WelcomeScreen");
  //     }
  //   };
  //   checkInitialRoute();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoadingAuth]);

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
      const userData: User = {
        id: "1",
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
        logout,
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
