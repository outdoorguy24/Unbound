import { supabase } from './supabaseClient';

// Find a waiting user and create a pair, or wait if none found
export async function findOrCreatePartner(currentUserId: string) {
  // 1. Find a waiting user (has profile, not in accountability_pairs)
  const { data: waitingUsers, error: waitingError } = await supabase
    .from('user_profiles')
    .select('user_id')
    .not('user_id', 'eq', currentUserId)
    .not('user_id', 'in', `(${await getPairedUserIds()})`);
  if (waitingError) throw waitingError;
  const waitingUser = waitingUsers && waitingUsers.length > 0 ? waitingUsers[0] : null;

  if (waitingUser) {
    // 2. Create a pair (insert two rows for bidirectional lookup)
    const { error: pairError1 } = await supabase.from('accountability_pairs').insert([
      { user_id: currentUserId, partner_id: waitingUser.user_id },
      { user_id: waitingUser.user_id, partner_id: currentUserId },
    ]);
    if (pairError1) throw pairError1;
    return { matched: true, partnerId: waitingUser.user_id };
  } else {
    // No partner found, user is waiting
    return { matched: false };
  }
}

// Helper: get all paired user_ids (for exclusion)
async function getPairedUserIds() {
  const { data, error } = await supabase.from('accountability_pairs').select('user_id');
  if (error) return '';
  return data.map((row: any) => `'${row.user_id}'`).join(',') || '';
}

// Get a user's partner_id from accountability_pairs
export async function getPartnerIdForUser(userId: string) {
  const { data, error } = await supabase
    .from('accountability_pairs')
    .select('partner_id')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data?.partner_id || null;
} 