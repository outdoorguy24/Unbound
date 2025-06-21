-- Add push notification support to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS push_token TEXT,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"weekly_summary": true}'::jsonb;

-- Create index for push token lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_push_token ON public.user_profiles(push_token) WHERE push_token IS NOT NULL;

-- Create index for notification preferences
CREATE INDEX IF NOT EXISTS idx_user_profiles_notification_prefs ON public.user_profiles USING GIN(notification_preferences);

-- Add comment for documentation
COMMENT ON COLUMN public.user_profiles.push_token IS 'Expo push token for sending notifications';
COMMENT ON COLUMN public.user_profiles.notification_preferences IS 'JSON object storing user notification preferences'; 