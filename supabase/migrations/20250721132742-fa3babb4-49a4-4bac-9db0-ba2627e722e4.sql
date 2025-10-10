-- Eliminar la política de INSERT existente que puede estar causando problemas
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.usuarios;

-- Crear políticas RLS completas para la tabla usuarios
-- Política para INSERT - permite a usuarios autenticados insertar sus propios datos
CREATE POLICY "Users can insert their own data" 
ON public.usuarios 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Política para SELECT - permite a usuarios ver sus propios datos
CREATE POLICY "Users can view their own data" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Política para UPDATE - permite a usuarios actualizar sus propios datos
CREATE POLICY "Users can update their own data" 
ON public.usuarios 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política para DELETE - permite a usuarios eliminar sus propios datos
CREATE POLICY "Users can delete their own data" 
ON public.usuarios 
FOR DELETE 
TO authenticated
USING (auth.uid() = id);