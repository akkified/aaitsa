-- Add automatic admin role for president@aaitsa.org
-- This script grants admin privileges to the president email

-- Update existing president user if they exist
UPDATE profiles
SET role = 'admin'
WHERE email = 'president@aaitsa.org';

-- Update the handle_new_user function to check for admin emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, school_year, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'school_year', ''),
    -- Check if email is president@aaitsa.org and set admin role
    CASE 
      WHEN NEW.email = 'president@aaitsa.org' THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
