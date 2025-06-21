create or replace function public.match_and_create_pair(
  current_user_id uuid
)
returns table (
  matched boolean,
  partner_id uuid
) as $$
declare
  available_partner_id uuid;
  new_pair_id uuid;
begin
  -- Use a common table expression (CTE) to select and lock a row
  with potential_partner as (
    select
      user_id
    from
      public.partner_search_pool
    where
      user_id <> current_user_id
    order by
      created_at
    limit 1
    -- Lock the row to prevent other transactions from selecting it
    for update skip locked
  )
  select
    user_id into available_partner_id
  from
    potential_partner;

  -- If a partner was found in the pool
  if available_partner_id is not null then
    -- Remove both users from the search pool
    delete from public.partner_search_pool
    where user_id in (current_user_id, available_partner_id);

    -- Create the new pair
    insert into public.accountability_pairs (user_id, partner_id)
    values (current_user_id, available_partner_id)
    returning id into new_pair_id;

    -- Return success and the partner's ID
    return query select true, available_partner_id;

  -- If no partner was found
  else
    -- Add the current user to the pool (if not already there)
    insert into public.partner_search_pool (user_id)
    values (current_user_id)
    on conflict (user_id) do nothing;
    
    -- Return no match
    return query select false, null::uuid;
  end if;
end;
$$ language plpgsql security definer; 