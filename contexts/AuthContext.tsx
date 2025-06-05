import { loginWithGoogle, supabase } from '@/lib/supabaseClient';
import { getUserProfile } from '@/lib/supabaseUserProfile';
import { getStoredPushToken } from '@/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  pushToken?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoadingAuth: boolean;
  login: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const AUTH_STORAGE_KEY = '@auth_user';

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
      const inAuthGroup = segments[0] === '(auth)';
      const inOnboardingGroup = segments[0] === '(onboarding)';
      if (!isLoggedIn && !inAuthGroup && !inOnboardingGroup) {
        router.replace('/(auth)/login');
        return;
      }
      if (isLoggedIn) {
        // Check for user profile
        try {
          const profile = await getUserProfile(user!.id);
          if (!profile) {
            // No profile, go to profile setup
            if (segments[1] !== 'ScreenProfileSetup') {
              router.replace('/(onboarding)/ScreenProfileSetup');
            }
            return;
          }
          // Profile exists, go to main app
          if (inAuthGroup || inOnboardingGroup) {
            router.replace('/(tabs)/home');
          }
        } catch (e) {
          // If error is not 'no rows found', log it
          console.error('Profile check error:', e);
        }
      }
    };
    checkProfileAndRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, segments, isLoadingAuth, user]);

  // Login with Google
  const login = async () => {
    setIsLoadingAuth(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Simulate signup
  const signup = async (email: string, password: string, name: string) => {
    setIsLoadingAuth(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pushToken = await getStoredPushToken();
      const user: User = {
        id: '1',
        email,
        name,
        pushToken: pushToken || undefined,
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      setUser(user);
      router.replace('/(onboarding)/signup');
    } catch (error) {
      console.error('Error signing up:', error);
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
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 