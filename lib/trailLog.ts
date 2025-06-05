import { supabase } from './supabaseClient';

// Add a new trail log entry
export async function addTrailLog({
  userId,
  action,
  numericValue = null,
  textDescription = null,
  appOrSite = null,
  metadata = null,
  partnerVisibility = true,
}: {
  userId: string;
  action: string;
  numericValue?: number | null;
  textDescription?: string | null;
  appOrSite?: string | null;
  metadata?: any;
  partnerVisibility?: boolean;
}) {
  const { error } = await supabase.from('trail_logs').insert({
    user_id: userId,
    action,
    numeric_value: numericValue,
    text_description: textDescription,
    app_or_site: appOrSite,
    metadata,
    partner_visibility: partnerVisibility,
  });
  if (error) throw error;
}

// Get a user's trail log (paginated, newest first, with optional filters)
export async function getTrailLog(userId: string, { limit = 50, offset = 0, action, fromDate, toDate }: {
  limit?: number;
  offset?: number;
  action?: string;
  fromDate?: string;
  toDate?: string;
} = {}) {
  let query = supabase
    .from('trail_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (action) query = query.eq('action', action);
  if (fromDate) query = query.gte('created_at', fromDate);
  if (toDate) query = query.lte('created_at', toDate);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Get a partner's trail log (only partner_visible entries)
export async function getPartnerTrailLog(partnerId: string, { limit = 50, offset = 0, action, fromDate, toDate }: {
  limit?: number;
  offset?: number;
  action?: string;
  fromDate?: string;
  toDate?: string;
} = {}) {
  let query = supabase
    .from('trail_logs')
    .select('*')
    .eq('user_id', partnerId)
    .eq('partner_visibility', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (action) query = query.eq('action', action);
  if (fromDate) query = query.gte('created_at', fromDate);
  if (toDate) query = query.lte('created_at', toDate);
  const { data, error } = await query;
  if (error) throw error;
  return data;
} 