-- Ensure admins can view all submissions
-- This script fixes any RLS policy issues that might prevent admin access to submissions

-- First, ensure the is_admin_or_officer function exists and is updated
CREATE OR REPLACE FUNCTION public.is_admin_or_officer()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the user's role from profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  -- Return true if user is admin, officer, or teacher
  RETURN COALESCE(user_role IN ('admin', 'officer', 'teacher'), false);
END;
$$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "submissions_select_admin" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update_admin" ON public.submissions;

-- Create policy for admins/officers/teachers to select all submissions
CREATE POLICY "submissions_select_admin" ON public.submissions 
  FOR SELECT USING (public.is_admin_or_officer());

-- Create policy for admins/officers/teachers to update all submissions (for review)
CREATE POLICY "submissions_update_admin" ON public.submissions 
  FOR UPDATE USING (public.is_admin_or_officer());

-- Also ensure profiles can be viewed by admins
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;

CREATE POLICY "profiles_select_admin" ON public.profiles 
  FOR SELECT USING (public.is_admin_or_officer());

-- Ensure teachers are also included in admin policies
COMMENT ON FUNCTION public.is_admin_or_officer() IS 'Returns true if current user is admin, officer, or teacher';

