import { supabase } from './supabaseClient';

export interface UserResponse {
  id: string;
  user_id: string;
  response_text: string;
  created_at: string;
}

export async function saveUserResponse(userId: string, responseText: string): Promise<UserResponse> {
  const { data, error } = await supabase
    .from('user_responses')
    .insert({
      user_id: userId,
      response_text: responseText,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save user response: ${error.message}`);
  }

  return data;
}

export async function getUserResponses(userId: string): Promise<UserResponse[]> {
  const { data, error } = await supabase
    .from('user_responses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch user responses: ${error.message}`);
  }

  return data || [];
}

export async function getLatestUserResponse(userId: string): Promise<UserResponse | null> {
  const { data, error } = await supabase
    .from('user_responses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
    throw new Error(`Failed to fetch latest user response: ${error.message}`);
  }

  return data || null;
}
