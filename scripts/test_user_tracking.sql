-- Test user tracking functionality
-- Replace 'test_user_id' with an actual user ID from your auth.users table

-- 1. Test blocked session creation and time tracking
insert into public.blocked_sessions (user_id, start_time, apps_blocked, sites_blocked)
values ('test_user_id', now() - interval '2 hours', array['instagram'], array['instagram.com']);

-- Update the session with end time and duration
update public.blocked_sessions 
set 
  end_time = now(),
  duration_minutes = 120
where user_id = 'test_user_id' and end_time is null;

-- 2. Verify streak was created/updated
select * from public.streaks where id = 'test_user_id';

-- 3. Verify total time saved was updated
select total_time_saved_minutes from public.streaks where id = 'test_user_id';

-- 4. Test milestone creation
insert into public.milestones (user_id, milestone_type, milestone_value)
values ('test_user_id', 'time_saved', 120);

-- 5. Verify all data
select 
  s.current_streak,
  s.longest_streak,
  s.total_time_saved_minutes,
  s.last_milestone_reached,
  bs.duration_minutes as last_session_duration,
  m.milestone_type,
  m.milestone_value
from public.streaks s
left join public.blocked_sessions bs on bs.user_id = s.id
left join public.milestones m on m.user_id = s.id
where s.id = 'test_user_id'
order by bs.created_at desc, m.achieved_at desc
limit 1; 