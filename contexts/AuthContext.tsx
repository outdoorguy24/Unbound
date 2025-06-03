import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  // Simulate checking auth state on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle protected routes
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!isLoadingAuth) {
      if (!isLoggedIn && !inAuthGroup && !inOnboardingGroup) {
        // Redirect to login if not logged in and trying to access protected route
        router.replace('/(auth)/login');
      } else if (isLoggedIn && (inAuthGroup || inOnboardingGroup)) {
        // Redirect to home if logged in and trying to access auth/onboarding
        router.replace('/(tabs)');
      }
    }
  }, [isLoggedIn, segments, isLoadingAuth]);

  // Simulate checking auth state
  const checkAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Simulate login
  const login = async (email: string, password: string) => {
    setIsLoadingAuth(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create placeholder user
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      
      // Store user
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      setUser(user);
      
      // Navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Simulate signup
  const signup = async (email: string, password: string, name: string) => {
    setIsLoadingAuth(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create placeholder user
      const user: User = {
        id: '1',
        email,
        name,
      };
      
      // Store user
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      setUser(user);
      
      // Navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Simulate logout
  const logout = async () => {
    setIsLoadingAuth(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear stored user
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      
      // Navigate to login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
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