-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "submissions_select_admin" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update_admin" ON public.submissions;

-- Create a function to check if user is admin/officer without causing recursion
CREATE OR REPLACE FUNCTION public.is_admin_or_officer()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_role IN ('admin', 'officer', 'teacher');
END;
$$;

-- Recreate admin policies using the function (which bypasses RLS with SECURITY DEFINER)
CREATE POLICY "profiles_select_admin" ON public.profiles 
  FOR SELECT USING (public.is_admin_or_officer());

CREATE POLICY "submissions_select_admin" ON public.submissions 
  FOR SELECT USING (public.is_admin_or_officer());

CREATE POLICY "submissions_update_admin" ON public.submissions 
  FOR UPDATE USING (public.is_admin_or_officer());
