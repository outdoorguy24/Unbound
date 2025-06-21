SELECT cron.schedule(
  'weekly-summary-notification', -- The name of our job
  '0 23 * * 0', -- 11:00 PM UTC on Sunday (7:00 PM EST / 6:00 PM CST)
  $$
  SELECT
    net.http_post(
      url:='https://mvwrnvcyyxmabjhfpshk.supabase.co/functions/v1/send-weekly-summary',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY"}'::jsonb
    )
  $$
); 