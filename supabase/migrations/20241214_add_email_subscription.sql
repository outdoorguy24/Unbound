-- Add email subscription preference to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN email_subscription_enabled BOOLEAN DEFAULT true;

-- Add comment to explain the column
COMMENT ON COLUMN user_profiles.email_subscription_enabled IS 'Whether the user has opted in to receive the Unbound Dispatch monthly email';
