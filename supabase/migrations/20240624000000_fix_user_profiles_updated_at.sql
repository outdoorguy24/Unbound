-- Ensure the updated_at column exists on user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;

-- Re-create the function to handle updated_at to ensure it's up to date
CREATE OR REPLACE FUNCTION public.handle_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Re-create the trigger to ensure it's attached and enabled
DROP TRIGGER IF EXISTS handle_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER handle_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_user_profiles_updated_at(); 