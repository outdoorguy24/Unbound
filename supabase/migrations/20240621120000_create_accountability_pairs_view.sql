-- Create a view to easily see accountability pairs with user names
create or replace view public.v_accountability_pairs_with_names as
select
    ap.id,
    ap.user_id,
    u1.first_name as user_name,
    ap.partner_id,
    u2.first_name as partner_name,
    ap.created_at,
    ap.updated_at
from
    public.accountability_pairs ap
    left join public.user_profiles u1 on ap.user_id = u1.user_id
    left join public.user_profiles u2 on ap.partner_id = u2.user_id;

-- Add a comment to the view
comment on view public.v_accountability_pairs_with_names is 'View to display accountability pairs with user first names for easier debugging and administration.';

-- The view does not require its own RLS policies if it is for admin use in the Supabase dashboard.
-- The underlying tables (accountability_pairs, user_profiles) should have their own RLS policies
-- which will protect the data from being accessed by unauthorized users from the client application.
-- For admin access via Supabase UI, you usually have permissions to bypass RLS. 