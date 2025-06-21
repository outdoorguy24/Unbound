import { supabase } from './supabaseClient';

interface PartnerMatchResult {
  matched: boolean;
  partnerId?: string;
  error?: string;
}

/**
 * Find or create an accountability partner pairing
 * @param currentUserId The ID of the user seeking a partner
 * @returns Object containing match status and partner info
 */
export async function findOrCreatePartner(currentUserId: string): Promise<PartnerMatchResult> {
  try {
    // First, check if the user already has a partner.
    const existingPartnerId = await getPartnerIdForUser(currentUserId);
    if (existingPartnerId) {
      return { matched: true, partnerId: existingPartnerId };
    }

    // Call the atomic database function to find/create a pair.
    const { data, error } = await supabase.rpc('match_and_create_pair', {
      current_user_id: currentUserId
    });

    if (error) {
      console.error('Error calling match_and_create_pair:', error);
      return { matched: false, error: 'Failed to execute matching function' };
    }
    
    // The RPC returns an array of rows, we expect only one.
    const result = data[0];
    if (!result) {
      return { matched: false, error: 'Invalid response from matching function' };
    }

    return {
      matched: result.matched,
      partnerId: result.partner_id,
    };
    
  } catch (error) {
    console.error('Unexpected error in findOrCreatePartner:', error);
    return { matched: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Get a user's partner ID from accountability_pairs
 * @param userId The ID of the user to find a partner for
 * @returns The partner's user ID if found, null otherwise
 */
export async function getPartnerIdForUser(userId: string): Promise<string | null> {
  try {
    // Check both user_id and partner_id columns since partnerships are one-way now
    const { data, error } = await supabase
      .from('accountability_pairs')
      .select('partner_id, user_id')
      .or(`user_id.eq.${userId},partner_id.eq.${userId}`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      throw error;
    }

    // If user is the partner_id, return the user_id, otherwise return partner_id
    return data.user_id === userId ? data.partner_id : data.user_id;
  } catch (error) {
    console.error('Error getting partner ID:', error);
    return null;
  }
}

/**
 * Remove a partnership between users
 * @param userId The ID of the user whose partnership to remove
 */
export async function removePartnership(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('accountability_pairs')
      .delete()
      .or(`user_id.eq.${userId},partner_id.eq.${userId}`);

    if (error) {
      console.error('Error removing partnership:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in removePartnership:', error);
    return false;
  }
}

/**
 * Fully resets a user's pairing status by removing them from any existing
 * pairs and from the search pool.
 * @param userId The ID of the user to reset.
 * @returns True if the reset was successful, false otherwise.
 */
export async function resetUserPairing(userId: string): Promise<boolean> {
  try {
    // Both operations are wrapped in a Promise.all to run concurrently
    const [pairResult, poolResult] = await Promise.all([
      supabase.from('accountability_pairs').delete().or(`user_id.eq.${userId},partner_id.eq.${userId}`),
      supabase.from('partner_search_pool').delete().eq('user_id', userId)
    ]);

    if (pairResult.error) {
      console.error('Error removing partnership during reset:', pairResult.error);
      throw pairResult.error;
    }

    if (poolResult.error) {
      console.error('Error removing from search pool during reset:', poolResult.error);
      throw poolResult.error;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in resetUserPairing:', error);
    return false;
  }
} 