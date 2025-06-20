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
    // First check if user already has a partner
    const partnerId = await getPartnerIdForUser(currentUserId);
    if (partnerId) {
      return { matched: true, partnerId: partnerId };
    }

    // Get all available users with profiles
    const { data: allUsers, error: usersError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .neq('user_id', currentUserId);

    if (usersError) {
      console.error('Error getting users:', usersError);
      return { matched: false, error: 'Failed to get users' };
    }

    // Get all existing pairs
    const { data: pairs, error: pairsError } = await supabase
      .from('accountability_pairs')
      .select('user_id, partner_id');

    if (pairsError) {
      console.error('Error getting pairs:', pairsError);
      return { matched: false, error: 'Failed to get pairs' };
    }

    // Create set of paired users
    const pairedUsers = new Set();
    pairs?.forEach(pair => {
      pairedUsers.add(pair.user_id);
      pairedUsers.add(pair.partner_id);
    });

    // Find first available user who isn't paired
    const availableUser = allUsers?.find(user => !pairedUsers.has(user.user_id));

    // No available users found
    if (!availableUser) {
      return { matched: false };
    }

    // Create partnership
    const { error: insertError } = await supabase
      .from('accountability_pairs')
      .insert({
        user_id: currentUserId,
        partner_id: availableUser.user_id
      });

    if (insertError) {
      console.error('Error creating partnership:', insertError);
      return { matched: false, error: 'Failed to create partnership' };
    }

    return { matched: true, partnerId: availableUser.user_id };
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