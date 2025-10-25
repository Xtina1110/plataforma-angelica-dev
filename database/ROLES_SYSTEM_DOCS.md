# 🔐 Sistema Mejorado de Roles y Permisos

## 🎯 Descripción General

Sistema robusto y flexible de roles y permisos que permite:

- ✅ **Múltiples roles por usuario** (un usuario puede ser terapeuta E instructor)
- ✅ **Permisos granulares** (control fino de acceso)
- ✅ **Roles con expiración** (roles temporales)
- ✅ **Rol primario** (para determinar dashboard principal)
- ✅ **9 roles predefinidos** con permisos específicos
- ✅ **40+ permisos** organizados por categoría
- ✅ **Funciones helper** para verificar permisos
- ✅ **React hooks** para uso en componentes
- ✅ **Componentes de protección** (RequireRole, RequirePermission)

---

## 📊 Arquitectura

### Tablas

```
roles (9 roles predefinidos)
  ↓
role_permissions (relación muchos a muchos)
  ↓
permissions (40+ permisos)

user_roles (usuarios ← → roles)
```

### Flujo

1. Usuario tiene uno o más **roles**
2. Cada rol tiene múltiples **permisos**
3. Usuario hereda todos los permisos de sus roles
4. Se puede verificar si usuario tiene permiso específico

---

## 🎭 Roles Predefinidos

### 1. 👤 Usuario (usuario)
**Cliente normal de la plataforma**

**Color**: Gris (#6B7280)

**Permisos**:
- Ver y crear lecturas de cartas
- Reservar consultas
- Ver e inscribirse en cursos
- Usar chatbot
- Comprar productos
- Ver blog

**Dashboard**: `/dashboard`

---

### 2. 🔮 Terapeuta (terapeuta)
**Profesional que ofrece consultas**

**Color**: Púrpura (#8B5CF6)

**Permisos**:
- Todo lo de Usuario +
- Conducir sesiones de consulta
- Chatbot ilimitado
- Dashboard de terapeuta

**Dashboard**: `/dashboard-terapeuta`

**Casos de uso**:
- Angelólogos
- Terapeutas espirituales
- Lectores de cartas profesionales

---

### 3. 👨‍🏫 Instructor (instructor)
**Profesor que crea cursos**

**Color**: Azul (#3B82F6)

**Permisos**:
- Todo lo de Usuario +
- Crear y editar propios cursos
- Publicar cursos
- Chatbot ilimitado
- Dashboard de instructor

**Dashboard**: `/dashboard-instructor`

**Casos de uso**:
- Profesores de la Academia
- Creadores de contenido educativo

---

### 4. ⚡ Admin (admin)
**Administrador con acceso completo**

**Color**: Rojo (#EF4444)

**Permisos**:
- **TODOS** los permisos del sistema
- Gestionar usuarios
- Gestionar roles
- Configuración del sistema
- Analytics y reportes

**Dashboard**: `/dashboard-admin`

**Casos de uso**:
- Dueño de la plataforma
- Administradores principales

---

### 5. 🛠️ Soporte (support)
**Equipo de soporte técnico**

**Color**: Verde (#10B981)

**Permisos**:
- Ver y responder tickets
- Asistir usuarios
- Ver todas las consultas
- Editar cursos y blog
- Ver analytics

**Dashboard**: `/dashboard-support`

**Casos de uso**:
- Equipo de atención al cliente
- Soporte técnico

---

### 6. 🤝 Afiliado (affiliate)
**Socio que refiere clientes**

**Color**: Naranja (#F59E0B)

**Permisos**:
- Todo lo de Usuario +
- Ver dashboard de afiliado
- Generar enlaces de afiliado
- Ver ganancias

**Dashboard**: `/dashboard-affiliate`

**Casos de uso**:
- Partners que refieren clientes
- Influencers espirituales

---

### 7. 🏢 Centro/Empresa (center)
**Centro espiritual u organización**

**Color**: Rosa (#EC4899)

**Permisos**:
- Ver todas las consultas
- Gestionar consultas
- Crear y editar cursos
- Gestionar tienda
- Ver analytics y reportes

**Dashboard**: `/dashboard-center`

**Casos de uso**:
- Centros espirituales
- Empresas de terapias
- Organizaciones

---

### 8. 🛡️ Moderador (moderator)
**Moderador de contenido**

**Color**: Teal (#14B8A6)

**Permisos**:
- Editar y publicar blog
- Editar y publicar cursos
- Ver y responder tickets
- Gestionar usuarios

**Dashboard**: `/dashboard`

**Casos de uso**:
- Moderadores de comunidad
- Editores de contenido

---

### 9. ✍️ Autor (author)
**Creador de contenido para blog**

**Color**: Púrpura claro (#A855F7)

**Permisos**:
- Todo lo de Usuario +
- Crear y editar propios artículos
- Publicar artículos
- Chatbot ilimitado

**Dashboard**: `/dashboard`

**Casos de uso**:
- Escritores del blog
- Creadores de contenido

---

## 🔑 Permisos por Categoría

### Lecturas de Cartas (cards)
- `cards.read` - Ver propias lecturas
- `cards.create` - Crear lecturas
- `cards.export` - Exportar a PDF
- `cards.history` - Ver historial completo

### Consultas (consultations)
- `consultations.book` - Reservar consultas
- `consultations.view_own` - Ver propias consultas
- `consultations.conduct` - Conducir sesiones
- `consultations.view_all` - Ver todas las consultas
- `consultations.manage` - Gestionar todas

### Cursos (courses)
- `courses.view` - Ver cursos
- `courses.enroll` - Inscribirse
- `courses.create` - Crear cursos
- `courses.edit_own` - Editar propios
- `courses.edit_all` - Editar todos
- `courses.delete` - Eliminar
- `courses.publish` - Publicar/despublicar

### Chatbot (chatbot)
- `chatbot.use` - Usar chatbot
- `chatbot.history` - Ver historial
- `chatbot.unlimited` - Sin límite de mensajes

### Tienda (shop)
- `shop.view` - Ver tienda
- `shop.purchase` - Comprar
- `shop.manage` - Gestionar tienda

### Blog (blog)
- `blog.view` - Ver blog
- `blog.create` - Crear artículos
- `blog.edit_own` - Editar propios
- `blog.edit_all` - Editar todos
- `blog.publish` - Publicar

### Dashboards (dashboard)
- `dashboard.user` - Dashboard usuario
- `dashboard.therapist` - Dashboard terapeuta
- `dashboard.instructor` - Dashboard instructor
- `dashboard.admin` - Dashboard admin
- `dashboard.support` - Dashboard soporte
- `dashboard.affiliate` - Dashboard afiliado

### Administración (admin)
- `admin.users` - Gestionar usuarios
- `admin.roles` - Gestionar roles
- `admin.settings` - Configuración
- `admin.analytics` - Ver analytics
- `admin.reports` - Generar reportes

### Soporte (support)
- `support.tickets` - Ver tickets
- `support.respond` - Responder tickets
- `support.users` - Asistir usuarios

### Afiliados (affiliate)
- `affiliate.dashboard` - Dashboard afiliado
- `affiliate.links` - Enlaces de afiliado
- `affiliate.earnings` - Ver ganancias

---

## 🔧 Funciones SQL Helper

### user_has_permission(user_id, permission_name)
Verifica si un usuario tiene un permiso específico.

```sql
SELECT user_has_permission(
  '123e4567-e89b-12d3-a456-426614174000',
  'courses.create'
);
-- Retorna: true o false
```

### get_user_permissions(user_id)
Obtiene todos los permisos de un usuario.

```sql
SELECT * FROM get_user_permissions('123e4567-e89b-12d3-a456-426614174000');
-- Retorna: tabla con permission_name, display_name, category
```

### get_user_roles(user_id)
Obtiene todos los roles de un usuario.

```sql
SELECT * FROM get_user_roles('123e4567-e89b-12d3-a456-426614174000');
-- Retorna: tabla con role_name, display_name, is_primary, icon, color
```

### assign_role_to_user(user_id, role_name, is_primary, assigned_by)
Asigna un rol a un usuario.

```sql
SELECT assign_role_to_user(
  '123e4567-e89b-12d3-a456-426614174000',
  'terapeuta',
  true,
  '456e7890-e89b-12d3-a456-426614174000'
);
-- Retorna: true si exitoso
```

---

## 💻 Uso en React

### Hook useRoles

```javascript
import useRoles from '../hooks/useRoles';

function MyComponent() {
  const { 
    roles, 
    permissions, 
    hasRole, 
    hasPermission,
    isAdmin,
    isTherapist,
    getDashboardRoute 
  } = useRoles();

  if (hasRole('admin')) {
    return <AdminPanel />;
  }

  if (hasPermission('courses.create')) {
    return <CreateCourseButton />;
  }

  return <UserDashboard />;
}
```

### Componente RequireRole

```javascript
import { RequireRole } from '../components/RoleGuard';

function App() {
  return (
    <RequireRole role="admin">
      <AdminPanel />
    </RequireRole>
  );
}
```

### Componente RequirePermission

```javascript
import { RequirePermission } from '../components/RoleGuard';

function CoursePage() {
  return (
    <div>
      <h1>Cursos</h1>
      
      <RequirePermission permission="courses.create">
        <button>Crear Curso</button>
      </RequirePermission>
    </div>
  );
}
```

### Componente AdminOnly

```javascript
import { AdminOnly } from '../components/RoleGuard';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <AdminOnly>
        <SettingsPanel />
      </AdminOnly>
    </div>
  );
}
```

### Componente RoleSwitch

```javascript
import { RoleSwitch, RoleCase } from '../components/RoleGuard';

function Dashboard() {
  return (
    <RoleSwitch defaultContent={<UserDashboard />}>
      <RoleCase role="admin">
        <AdminDashboard />
      </RoleCase>
      <RoleCase role="terapeuta">
        <TherapistDashboard />
      </RoleCase>
      <RoleCase role="instructor">
        <InstructorDashboard />
      </RoleCase>
    </RoleSwitch>
  );
}
```

### Badge de Rol

```javascript
import { RoleBadge, UserRolesList } from '../components/RoleGuard';

function UserProfile() {
  return (
    <div>
      <h2>Mis Roles</h2>
      <UserRolesList />
    </div>
  );
}
```

---

## 🚀 Instalación

### Paso 1: Ejecutar SQL

```sql
-- Abrir Supabase SQL Editor
-- Copiar y ejecutar: database/roles-and-permissions.sql
```

### Paso 2: Asignar Roles a Usuarios

```sql
-- Asignar rol de admin
SELECT assign_role_to_user(
  'user-id-aqui',
  'admin',
  true  -- es rol primario
);

-- Asignar rol de terapeuta
SELECT assign_role_to_user(
  'user-id-aqui',
  'terapeuta',
  false  -- no es rol primario
);
```

### Paso 3: Usar en React

```javascript
// Ya está listo para usar
import useRoles from './hooks/useRoles';
import { RequireRole } from './components/RoleGuard';
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Usuario con Múltiples Roles

```sql
-- Usuario que es terapeuta E instructor
SELECT assign_role_to_user('user-id', 'terapeuta', true);
SELECT assign_role_to_user('user-id', 'instructor', false);

-- Ahora tiene permisos de ambos roles:
-- - Puede conducir consultas (terapeuta)
-- - Puede crear cursos (instructor)
```

### Ejemplo 2: Verificar Permisos en Componente

```javascript
function CreateCourseButton() {
  const { hasPermission } = useRoles();

  if (!hasPermission('courses.create')) {
    return null;
  }

  return <button onClick={createCourse}>Crear Curso</button>;
}
```

### Ejemplo 3: Proteger Ruta

```javascript
import { RequireRole } from './components/RoleGuard';

<Route 
  path="/admin" 
  element={
    <RequireRole role="admin" redirectTo="/dashboard">
      <AdminPanel />
    </RequireRole>
  } 
/>
```

### Ejemplo 4: Dashboard Dinámico

```javascript
function DashboardRedirect() {
  const { getDashboardRoute } = useRoles();
  const route = getDashboardRoute();
  
  return <Navigate to={route} />;
}
```

---

## 🔄 Migración de Datos Existentes

Si ya tienes usuarios con la columna `role` en la tabla `usuarios`, el SQL automáticamente migra los datos:

```sql
-- Se ejecuta automáticamente al correr roles-and-permissions.sql
-- Migra roles existentes a la nueva tabla user_roles
```

---

## 🎯 Ventajas del Nuevo Sistema

### Antes (Sistema Simple)
- ❌ Un usuario = un rol
- ❌ Permisos hardcodeados
- ❌ Difícil de mantener
- ❌ No escalable

### Ahora (Sistema Mejorado)
- ✅ Un usuario = múltiples roles
- ✅ Permisos granulares y flexibles
- ✅ Fácil de mantener y extender
- ✅ Escalable y profesional
- ✅ Roles con expiración
- ✅ Auditoría (quién asignó el rol)

---

## 📊 Casos de Uso Reales

### Caso 1: Terapeuta que También Enseña
```sql
-- María es terapeuta Y instructora
SELECT assign_role_to_user('maria-id', 'terapeuta', true);
SELECT assign_role_to_user('maria-id', 'instructor', false);

-- Ahora María puede:
-- - Conducir sesiones de consulta
-- - Crear y vender cursos
-- - Acceder a ambos dashboards
```

### Caso 2: Rol Temporal
```sql
-- Juan es moderador por 30 días
INSERT INTO user_roles (user_id, role_id, expires_at)
SELECT 
  'juan-id',
  (SELECT id FROM roles WHERE name = 'moderator'),
  NOW() + INTERVAL '30 days';

-- Después de 30 días, pierde el rol automáticamente
```

### Caso 3: Centro con Múltiples Terapeutas
```sql
-- Centro "Luz Divina" gestiona varios terapeutas
SELECT assign_role_to_user('centro-luz-divina-id', 'center', true);

-- Puede ver todas las consultas de sus terapeutas
-- Puede gestionar cursos
-- Puede ver analytics
```

---

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS activado:

- ✅ Usuarios solo ven sus propios roles
- ✅ Admins ven todos los roles
- ✅ Permisos son de solo lectura
- ✅ Roles son de solo lectura

### Funciones SECURITY DEFINER

Las funciones helper usan `SECURITY DEFINER` para:

- ✅ Ejecutarse con permisos elevados
- ✅ Permitir verificación de permisos sin exponer datos
- ✅ Mantener seguridad de datos

---

## 🎓 Mejores Prácticas

### 1. Usar Permisos, No Roles

❌ **Malo**:
```javascript
if (hasRole('admin')) {
  // mostrar botón
}
```

✅ **Bueno**:
```javascript
if (hasPermission('courses.create')) {
  // mostrar botón
}
```

**Por qué**: Los permisos son más específicos y flexibles.

### 2. Verificar Permisos en Backend

❌ **Malo**:
```javascript
// Solo verificar en frontend
if (hasPermission('courses.delete')) {
  await deleteCourse(id);
}
```

✅ **Bueno**:
```javascript
// Verificar en frontend Y backend
if (hasPermission('courses.delete')) {
  await deleteCourse(id); // Backend también verifica
}
```

### 3. Usar Componentes de Protección

❌ **Malo**:
```javascript
{hasRole('admin') && <AdminPanel />}
```

✅ **Bueno**:
```javascript
<AdminOnly>
  <AdminPanel />
</AdminOnly>
```

---

## 📞 Soporte

Para preguntas o problemas:
- Revisar esta documentación
- Consultar ejemplos en el código
- Verificar permisos en Supabase Dashboard

---

## 🎉 Conclusión

El nuevo sistema de roles y permisos proporciona:

- ✅ Flexibilidad total
- ✅ Seguridad robusta
- ✅ Fácil de usar
- ✅ Escalable
- ✅ Profesional

**¡Tu plataforma ahora tiene un sistema de roles de nivel enterprise!** 🚀

---

**Última actualización**: Octubre 2024
**Versión**: 2.0.0
**Autor**: Plataforma Angélica Team

