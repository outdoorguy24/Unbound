import { supabase } from '@/lib/supabaseClient';
import { getUserProfile } from '@/lib/supabaseUserProfile';
import { useEffect, useState } from 'react';

export function useProfileCheck() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError || !data?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        setUser(data.user);
        const prof = await getUserProfile(data.user.id);
        setProfile(prof);
      } catch (e: any) {
        setError(e.message || 'Error checking profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndProfile();
  }, []);

  return { user, profile, loading, error };
} 