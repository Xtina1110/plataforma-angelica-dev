-- ============================================
-- SISTEMA MEJORADO DE ROLES Y PERMISOS
-- ============================================
-- Descripción: Sistema robusto de roles con permisos granulares
-- Permite múltiples roles por usuario y permisos específicos
-- ============================================

-- ============================================
-- 1. TABLA: roles (Roles del Sistema)
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para roles
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_is_active ON roles(is_active);

-- RLS para roles (solo lectura para todos)
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active roles" ON roles;
CREATE POLICY "Anyone can view active roles"
  ON roles FOR SELECT
  USING (is_active = true);

-- ============================================
-- 2. TABLA: permissions (Permisos del Sistema)
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para permissions
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions(name);
CREATE INDEX IF NOT EXISTS idx_permissions_category ON permissions(category);

-- RLS para permissions (solo lectura para todos)
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view permissions" ON permissions;
CREATE POLICY "Anyone can view permissions"
  ON permissions FOR SELECT
  USING (true);

-- ============================================
-- 3. TABLA: role_permissions (Permisos por Rol)
-- ============================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Índices para role_permissions
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- RLS para role_permissions (solo lectura para todos)
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view role permissions" ON role_permissions;
CREATE POLICY "Anyone can view role permissions"
  ON role_permissions FOR SELECT
  USING (true);

-- ============================================
-- 4. TABLA: user_roles (Roles por Usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, role_id)
);

-- Índices para user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_is_primary ON user_roles(is_primary);

-- RLS para user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
CREATE POLICY "Admins can view all user roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- ============================================
-- INSERTAR ROLES PREDEFINIDOS
-- ============================================

-- Limpiar roles existentes (solo si quieres empezar de cero)
-- TRUNCATE roles CASCADE;

INSERT INTO roles (name, display_name, description, icon, color) VALUES
  ('usuario', 'Usuario', 'Cliente normal de la plataforma', '👤', '#6B7280'),
  ('terapeuta', 'Terapeuta/Angelólogo', 'Profesional que ofrece consultas y sesiones', '🔮', '#8B5CF6'),
  ('instructor', 'Instructor', 'Profesor que crea y gestiona cursos', '👨‍🏫', '#3B82F6'),
  ('admin', 'Administrador', 'Administrador con acceso completo', '⚡', '#EF4444'),
  ('support', 'Soporte Técnico', 'Equipo de soporte y asistencia', '🛠️', '#10B981'),
  ('affiliate', 'Afiliado', 'Socio que refiere clientes', '🤝', '#F59E0B'),
  ('center', 'Centro/Empresa', 'Centro espiritual u organización', '🏢', '#EC4899'),
  ('moderator', 'Moderador', 'Moderador de contenido y comunidad', '🛡️', '#14B8A6'),
  ('author', 'Autor', 'Creador de contenido para blog', '✍️', '#A855F7')
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = NOW();

-- ============================================
-- INSERTAR PERMISOS PREDEFINIDOS
-- ============================================

INSERT INTO permissions (name, display_name, description, category) VALUES
  -- Lecturas de Cartas
  ('cards.read', 'Ver Lecturas de Cartas', 'Ver propias lecturas de cartas', 'cards'),
  ('cards.create', 'Crear Lecturas de Cartas', 'Realizar nuevas lecturas', 'cards'),
  ('cards.export', 'Exportar Lecturas', 'Exportar lecturas a PDF', 'cards'),
  ('cards.history', 'Ver Historial Completo', 'Ver historial completo de lecturas', 'cards'),
  
  -- Consultas
  ('consultations.book', 'Reservar Consultas', 'Reservar sesiones de consulta', 'consultations'),
  ('consultations.view_own', 'Ver Propias Consultas', 'Ver propias sesiones', 'consultations'),
  ('consultations.conduct', 'Realizar Consultas', 'Conducir sesiones como terapeuta', 'consultations'),
  ('consultations.view_all', 'Ver Todas las Consultas', 'Ver todas las sesiones', 'consultations'),
  ('consultations.manage', 'Gestionar Consultas', 'Gestionar todas las sesiones', 'consultations'),
  
  -- Cursos
  ('courses.view', 'Ver Cursos', 'Ver cursos publicados', 'courses'),
  ('courses.enroll', 'Inscribirse a Cursos', 'Inscribirse en cursos', 'courses'),
  ('courses.create', 'Crear Cursos', 'Crear nuevos cursos', 'courses'),
  ('courses.edit_own', 'Editar Propios Cursos', 'Editar cursos propios', 'courses'),
  ('courses.edit_all', 'Editar Todos los Cursos', 'Editar cualquier curso', 'courses'),
  ('courses.delete', 'Eliminar Cursos', 'Eliminar cursos', 'courses'),
  ('courses.publish', 'Publicar Cursos', 'Publicar/despublicar cursos', 'courses'),
  
  -- Chatbot
  ('chatbot.use', 'Usar Chatbot', 'Interactuar con el chatbot angelical', 'chatbot'),
  ('chatbot.history', 'Ver Historial de Chat', 'Ver historial de conversaciones', 'chatbot'),
  ('chatbot.unlimited', 'Chatbot Ilimitado', 'Sin límite de mensajes', 'chatbot'),
  
  -- Tienda
  ('shop.view', 'Ver Tienda', 'Ver productos de la tienda', 'shop'),
  ('shop.purchase', 'Comprar Productos', 'Realizar compras', 'shop'),
  ('shop.manage', 'Gestionar Tienda', 'Gestionar productos y pedidos', 'shop'),
  
  -- Blog
  ('blog.view', 'Ver Blog', 'Ver artículos publicados', 'blog'),
  ('blog.create', 'Crear Artículos', 'Crear nuevos artículos', 'blog'),
  ('blog.edit_own', 'Editar Propios Artículos', 'Editar artículos propios', 'blog'),
  ('blog.edit_all', 'Editar Todos los Artículos', 'Editar cualquier artículo', 'blog'),
  ('blog.publish', 'Publicar Artículos', 'Publicar/despublicar artículos', 'blog'),
  
  -- Dashboards
  ('dashboard.user', 'Dashboard Usuario', 'Acceso a dashboard de usuario', 'dashboard'),
  ('dashboard.therapist', 'Dashboard Terapeuta', 'Acceso a dashboard de terapeuta', 'dashboard'),
  ('dashboard.instructor', 'Dashboard Instructor', 'Acceso a dashboard de instructor', 'dashboard'),
  ('dashboard.admin', 'Dashboard Admin', 'Acceso a dashboard de administrador', 'dashboard'),
  ('dashboard.support', 'Dashboard Soporte', 'Acceso a dashboard de soporte', 'dashboard'),
  ('dashboard.affiliate', 'Dashboard Afiliado', 'Acceso a dashboard de afiliado', 'dashboard'),
  
  -- Administración
  ('admin.users', 'Gestionar Usuarios', 'Gestionar usuarios del sistema', 'admin'),
  ('admin.roles', 'Gestionar Roles', 'Asignar y gestionar roles', 'admin'),
  ('admin.settings', 'Configuración', 'Acceso a configuración del sistema', 'admin'),
  ('admin.analytics', 'Analytics', 'Ver analytics y estadísticas', 'admin'),
  ('admin.reports', 'Reportes', 'Generar reportes del sistema', 'admin'),
  
  -- Soporte
  ('support.tickets', 'Ver Tickets', 'Ver tickets de soporte', 'support'),
  ('support.respond', 'Responder Tickets', 'Responder tickets de soporte', 'support'),
  ('support.users', 'Asistir Usuarios', 'Asistir a usuarios', 'support'),
  
  -- Afiliados
  ('affiliate.dashboard', 'Dashboard Afiliado', 'Ver dashboard de afiliado', 'affiliate'),
  ('affiliate.links', 'Enlaces de Afiliado', 'Generar enlaces de afiliado', 'affiliate'),
  ('affiliate.earnings', 'Ver Ganancias', 'Ver ganancias de afiliado', 'affiliate')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- ASIGNAR PERMISOS A ROLES
-- ============================================

-- USUARIO (Cliente normal)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'usuario' AND p.name IN (
  'cards.read', 'cards.create', 'cards.export', 'cards.history',
  'consultations.book', 'consultations.view_own',
  'courses.view', 'courses.enroll',
  'chatbot.use', 'chatbot.history',
  'shop.view', 'shop.purchase',
  'blog.view',
  'dashboard.user'
)
ON CONFLICT DO NOTHING;

-- TERAPEUTA
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'terapeuta' AND p.name IN (
  -- Todo lo de usuario
  'cards.read', 'cards.create', 'cards.export', 'cards.history',
  'consultations.book', 'consultations.view_own',
  'courses.view', 'courses.enroll',
  'chatbot.use', 'chatbot.history', 'chatbot.unlimited',
  'shop.view', 'shop.purchase',
  'blog.view',
  'dashboard.user',
  -- Permisos adicionales de terapeuta
  'consultations.conduct',
  'dashboard.therapist'
)
ON CONFLICT DO NOTHING;

-- INSTRUCTOR
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'instructor' AND p.name IN (
  -- Todo lo de usuario
  'cards.read', 'cards.create', 'cards.export', 'cards.history',
  'consultations.book', 'consultations.view_own',
  'courses.view', 'courses.enroll',
  'chatbot.use', 'chatbot.history', 'chatbot.unlimited',
  'shop.view', 'shop.purchase',
  'blog.view',
  'dashboard.user',
  -- Permisos adicionales de instructor
  'courses.create', 'courses.edit_own', 'courses.publish',
  'dashboard.instructor'
)
ON CONFLICT DO NOTHING;

-- ADMIN (Todos los permisos)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- SUPPORT
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'support' AND p.name IN (
  'dashboard.support',
  'support.tickets', 'support.respond', 'support.users',
  'admin.users', 'admin.analytics',
  'consultations.view_all',
  'courses.view', 'courses.edit_all',
  'blog.view', 'blog.edit_all'
)
ON CONFLICT DO NOTHING;

-- AFFILIATE
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'affiliate' AND p.name IN (
  -- Todo lo de usuario
  'cards.read', 'cards.create', 'cards.export', 'cards.history',
  'consultations.book', 'consultations.view_own',
  'courses.view', 'courses.enroll',
  'chatbot.use', 'chatbot.history',
  'shop.view', 'shop.purchase',
  'blog.view',
  'dashboard.user',
  -- Permisos adicionales de afiliado
  'affiliate.dashboard', 'affiliate.links', 'affiliate.earnings',
  'dashboard.affiliate'
)
ON CONFLICT DO NOTHING;

-- CENTER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'center' AND p.name IN (
  -- Permisos de centro/empresa
  'consultations.view_all', 'consultations.manage',
  'courses.view', 'courses.create', 'courses.edit_all', 'courses.publish',
  'shop.manage',
  'admin.analytics', 'admin.reports',
  'dashboard.user'
)
ON CONFLICT DO NOTHING;

-- MODERATOR
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'moderator' AND p.name IN (
  'blog.view', 'blog.edit_all', 'blog.publish',
  'courses.view', 'courses.edit_all', 'courses.publish',
  'support.tickets', 'support.respond',
  'admin.users'
)
ON CONFLICT DO NOTHING;

-- AUTHOR
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'author' AND p.name IN (
  -- Todo lo de usuario
  'cards.read', 'cards.create', 'cards.export', 'cards.history',
  'consultations.book', 'consultations.view_own',
  'courses.view', 'courses.enroll',
  'chatbot.use', 'chatbot.history', 'chatbot.unlimited',
  'shop.view', 'shop.purchase',
  'blog.view',
  'dashboard.user',
  -- Permisos adicionales de autor
  'blog.create', 'blog.edit_own', 'blog.publish'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCIONES HELPER
-- ============================================

-- Función para verificar si un usuario tiene un permiso
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission_name VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
      AND p.name = p_permission_name
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener todos los permisos de un usuario
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS TABLE (
  permission_name VARCHAR,
  permission_display_name VARCHAR,
  category VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.name, p.display_name, p.category
  FROM user_roles ur
  JOIN role_permissions rp ON ur.role_id = rp.role_id
  JOIN permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = p_user_id
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  ORDER BY p.category, p.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener todos los roles de un usuario
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID)
RETURNS TABLE (
  role_name VARCHAR,
  role_display_name VARCHAR,
  is_primary BOOLEAN,
  icon VARCHAR,
  color VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.name, r.display_name, ur.is_primary, r.icon, r.color
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = p_user_id
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  ORDER BY ur.is_primary DESC, r.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para asignar un rol a un usuario
CREATE OR REPLACE FUNCTION assign_role_to_user(
  p_user_id UUID,
  p_role_name VARCHAR,
  p_is_primary BOOLEAN DEFAULT false,
  p_assigned_by UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_role_id UUID;
BEGIN
  -- Obtener ID del rol
  SELECT id INTO v_role_id FROM roles WHERE name = p_role_name;
  
  IF v_role_id IS NULL THEN
    RAISE EXCEPTION 'Role % does not exist', p_role_name;
  END IF;
  
  -- Si es rol primario, quitar el flag de otros roles
  IF p_is_primary THEN
    UPDATE user_roles SET is_primary = false WHERE user_id = p_user_id;
  END IF;
  
  -- Insertar o actualizar rol
  INSERT INTO user_roles (user_id, role_id, is_primary, assigned_by)
  VALUES (p_user_id, v_role_id, p_is_primary, p_assigned_by)
  ON CONFLICT (user_id, role_id) DO UPDATE
  SET is_primary = p_is_primary, assigned_at = NOW();
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para actualizar updated_at en roles
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRAR DATOS EXISTENTES (Si aplica)
-- ============================================

-- Si ya tienes usuarios con la columna 'role' en la tabla usuarios,
-- puedes migrar los datos así:

DO $$
DECLARE
  v_user RECORD;
  v_role_id UUID;
BEGIN
  -- Solo ejecutar si existe la columna 'role' en usuarios
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'role'
  ) THEN
    
    FOR v_user IN 
      SELECT id, role FROM usuarios WHERE role IS NOT NULL
    LOOP
      -- Obtener ID del rol
      SELECT id INTO v_role_id FROM roles WHERE name = v_user.role;
      
      IF v_role_id IS NOT NULL THEN
        -- Asignar rol al usuario
        INSERT INTO user_roles (user_id, role_id, is_primary)
        VALUES (v_user.id, v_role_id, true)
        ON CONFLICT (user_id, role_id) DO NOTHING;
      END IF;
    END LOOP;
    
    RAISE NOTICE 'Roles migrados exitosamente';
  END IF;
END $$;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE roles IS 'Roles del sistema con información de visualización';
COMMENT ON TABLE permissions IS 'Permisos granulares del sistema';
COMMENT ON TABLE role_permissions IS 'Relación muchos a muchos entre roles y permisos';
COMMENT ON TABLE user_roles IS 'Roles asignados a usuarios (un usuario puede tener múltiples roles)';

COMMENT ON FUNCTION user_has_permission IS 'Verifica si un usuario tiene un permiso específico';
COMMENT ON FUNCTION get_user_permissions IS 'Obtiene todos los permisos de un usuario';
COMMENT ON FUNCTION get_user_roles IS 'Obtiene todos los roles de un usuario';
COMMENT ON FUNCTION assign_role_to_user IS 'Asigna un rol a un usuario';

-- ============================================
-- FIN DEL ESQUEMA DE ROLES Y PERMISOS
-- ============================================

