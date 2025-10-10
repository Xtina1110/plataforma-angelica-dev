-- Security fixes migration

-- 1. Fix role escalation vulnerability - remove ability for users to set their own role
-- Drop existing policies that allow unrestricted INSERT
DROP POLICY IF EXISTS "Users can insert their own data" ON public.usuarios;

-- Create a more secure INSERT policy that prevents role escalation
CREATE POLICY "Users can insert their profile data" 
ON public.usuarios 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = id AND 
  (rol IS NULL OR rol = 'usuario')  -- Only allow default user role or null
);

-- 2. Create admin-only policy for role updates
CREATE POLICY "Only admins can update roles" 
ON public.usuarios 
FOR UPDATE 
TO authenticated
USING (
  -- Current user is admin OR updating their own non-role data
  (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin')) OR
  (auth.uid() = id AND rol = (SELECT rol FROM public.usuarios WHERE id = auth.uid()))
)
WITH CHECK (
  -- Admin can update anything, users can only update their own non-role data
  (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin')) OR
  (auth.uid() = id AND rol = (SELECT rol FROM public.usuarios WHERE id = auth.uid()))
);

-- 3. Create a function to securely check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN (SELECT rol FROM public.usuarios WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. Add audit triggers for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_log 
FOR SELECT 
TO authenticated
USING (public.get_user_role() = 'admin');

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_log (
    table_name,
    operation,
    user_id,
    old_data,
    new_data
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger to usuarios table
DROP TRIGGER IF EXISTS usuarios_audit_trigger ON public.usuarios;
CREATE TRIGGER usuarios_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- 5. Add constraint to ensure valid roles
ALTER TABLE public.usuarios 
DROP CONSTRAINT IF EXISTS valid_roles;

ALTER TABLE public.usuarios 
ADD CONSTRAINT valid_roles 
CHECK (rol IN ('admin', 'tecnico', 'usuario'));

-- 6. Create function for secure role assignment (admin only)
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id UUID, new_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is admin
  IF public.get_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can assign roles';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('admin', 'tecnico', 'usuario') THEN
    RAISE EXCEPTION 'Invalid role specified';
  END IF;
  
  -- Update user role
  UPDATE public.usuarios 
  SET rol = new_role 
  WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;