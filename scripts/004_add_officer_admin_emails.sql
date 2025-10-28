-- Add automatic admin role for all TSA officer emails
-- This script grants admin privileges to all officer email addresses

-- List of officer emails that should have admin access
DO $$
DECLARE
  admin_emails TEXT[] := ARRAY[
    'advisor@aaitsa.org',
    'president@aaitsa.org',
    'vp@aaitsa.org',
    'secondvp@aaitsa.org',
    'secretary@aaitsa.org',
    'treasurer@aaitsa.org',
    'sergeant@aaitsa.org',
    'reporter@aaitsa.org',
    'mechvp@aaitsa.org',
    'csvp@aaitsa.org'
  ];
  admin_email TEXT;
BEGIN
  -- Update existing users with these emails to admin role
  FOREACH admin_email IN ARRAY admin_emails
  LOOP
    UPDATE profiles
    SET role = 'admin'
    WHERE email = admin_email;
  END LOOP;
END $$;

-- Update the handle_new_user function to check for all officer emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_emails TEXT[] := ARRAY[
    'advisor@aaitsa.org',
    'president@aaitsa.org',
    'vp@aaitsa.org',
    'secondvp@aaitsa.org',
    'secretary@aaitsa.org',
    'treasurer@aaitsa.org',
    'sergeant@aaitsa.org',
    'reporter@aaitsa.org',
    'mechvp@aaitsa.org',
    'csvp@aaitsa.org'
  ];
BEGIN
  INSERT INTO public.profiles (id, email, full_name, school_year, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'school_year', ''),
    -- Check if email is in the admin list
    CASE 
      WHEN NEW.email = ANY(admin_emails) THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
