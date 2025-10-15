import { supabase } from './supabaseClient';

export interface CommunityResponse {
  id: string;
  response_text: string;
  created_at: string;
  user_name: string;
  user_location: string;
}

export async function getRecentCommunityResponses(limit: number = 3): Promise<CommunityResponse[]> {
  try {
    const { data, error } = await supabase
      .from('user_responses')
      .select(`
        id,
        response_text,
        created_at,
        user_profiles!inner(
          first_name,
          city
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching community responses:', error);
      throw error;
    }

    // Transform the data to match our interface
    const responses: CommunityResponse[] = data?.map((response: any) => ({
      id: response.id,
      response_text: response.response_text,
      created_at: response.created_at,
      user_name: response.user_profiles?.first_name || 'Anonymous',
      user_location: response.user_profiles?.city || '',
    })) || [];

    return responses;
  } catch (error) {
    console.error('Error in getRecentCommunityResponses:', error);
    throw error;
  }
}

// Mock data for development/testing
export function getMockCommunityResponses(): CommunityResponse[] {
  return [
    {
      id: 'mock-1',
      response_text: "Finally called my mom to say hi instead of doomscrolling",
      created_at: new Date().toISOString(),
      user_name: 'Mark',
      user_location: 'Denver',
    },
    {
      id: 'mock-2',
      response_text: "Started learning guitar and actually practiced for 2 hours today",
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      user_name: 'Alex',
      user_location: 'Seattle',
    },
    {
      id: 'mock-3',
      response_text: "Went for a long walk and read a book in the park",
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      user_name: 'Jordan',
      user_location: 'Austin',
    },
  ];
}
