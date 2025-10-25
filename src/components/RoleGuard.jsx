/**
 * Componentes para proteger rutas y contenido según roles y permisos
 * 
 * Uso:
 * <RequireRole role="admin">
 *   <AdminPanel />
 * </RequireRole>
 * 
 * <RequirePermission permission="courses.create">
 *   <CreateCourseButton />
 * </RequirePermission>
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import useRoles from '../hooks/useRoles';

/**
 * Componente que requiere un rol específico
 */
export const RequireRole = ({ 
  role, 
  roles, 
  children, 
  fallback = null,
  redirectTo = '/dashboard'
}) => {
  const { hasRole, hasAnyRole, isLoading } = useRoles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Verificar rol único o múltiples roles
  const hasRequiredRole = role 
    ? hasRole(role) 
    : roles 
      ? hasAnyRole(roles) 
      : false;

  if (!hasRequiredRole) {
    return fallback || <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

/**
 * Componente que requiere un permiso específico
 */
export const RequirePermission = ({ 
  permission, 
  permissions, 
  children, 
  fallback = null 
}) => {
  const { hasPermission, hasAnyPermission, isLoading } = useRoles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Verificar permiso único o múltiples permisos
  const hasRequiredPermission = permission 
    ? hasPermission(permission) 
    : permissions 
      ? hasAnyPermission(permissions) 
      : false;

  if (!hasRequiredPermission) {
    return fallback;
  }

  return <>{children}</>;
};

/**
 * Componente que muestra contenido solo para admins
 */
export const AdminOnly = ({ children, fallback = null }) => {
  return (
    <RequireRole role="admin" fallback={fallback}>
      {children}
    </RequireRole>
  );
};

/**
 * Componente que muestra contenido solo para terapeutas
 */
export const TherapistOnly = ({ children, fallback = null }) => {
  return (
    <RequireRole role="terapeuta" fallback={fallback}>
      {children}
    </RequireRole>
  );
};

/**
 * Componente que muestra contenido solo para instructores
 */
export const InstructorOnly = ({ children, fallback = null }) => {
  return (
    <RequireRole role="instructor" fallback={fallback}>
      {children}
    </RequireRole>
  );
};

/**
 * Componente que oculta contenido si el usuario NO tiene el rol
 */
export const HideForRole = ({ role, roles, children }) => {
  const { hasRole, hasAnyRole, isLoading } = useRoles();

  if (isLoading) return null;

  const hasExcludedRole = role 
    ? hasRole(role) 
    : roles 
      ? hasAnyRole(roles) 
      : false;

  if (hasExcludedRole) return null;

  return <>{children}</>;
};

/**
 * Componente que muestra diferentes contenidos según el rol
 */
export const RoleSwitch = ({ children, defaultContent = null }) => {
  const { roles, isLoading } = useRoles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Buscar el primer hijo que coincida con el rol del usuario
  const matchingChild = React.Children.toArray(children).find(child => {
    if (!child.props || !child.props.role) return false;
    return roles.some(r => r.role_name === child.props.role);
  });

  return matchingChild || defaultContent;
};

/**
 * Componente hijo de RoleSwitch para definir contenido por rol
 */
export const RoleCase = ({ role, children }) => {
  return <>{children}</>;
};

/**
 * Badge de rol para mostrar en UI
 */
export const RoleBadge = ({ roleName, className = '' }) => {
  const roleConfig = {
    'usuario': { label: 'Usuario', color: 'bg-gray-500', icon: '👤' },
    'terapeuta': { label: 'Terapeuta', color: 'bg-purple-500', icon: '🔮' },
    'instructor': { label: 'Instructor', color: 'bg-blue-500', icon: '👨‍🏫' },
    'admin': { label: 'Admin', color: 'bg-red-500', icon: '⚡' },
    'support': { label: 'Soporte', color: 'bg-green-500', icon: '🛠️' },
    'affiliate': { label: 'Afiliado', color: 'bg-yellow-500', icon: '🤝' },
    'center': { label: 'Centro', color: 'bg-pink-500', icon: '🏢' },
    'moderator': { label: 'Moderador', color: 'bg-teal-500', icon: '🛡️' },
    'author': { label: 'Autor', color: 'bg-purple-400', icon: '✍️' }
  };

  const config = roleConfig[roleName] || roleConfig['usuario'];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${config.color} ${className}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

/**
 * Lista de roles del usuario
 */
export const UserRolesList = ({ userId = null, className = '' }) => {
  const { roles, isLoading } = useRoles(userId);

  if (isLoading) {
    return <div className="text-sm text-gray-500">Cargando roles...</div>;
  }

  if (roles.length === 0) {
    return <div className="text-sm text-gray-500">Sin roles asignados</div>;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {roles.map((role, index) => (
        <RoleBadge key={index} roleName={role.role_name} />
      ))}
    </div>
  );
};

/**
 * Componente que deshabilita elementos según permisos
 */
export const PermissionGate = ({ 
  permission, 
  permissions, 
  children, 
  fallback = null,
  disabledMessage = 'No tienes permisos para esta acción'
}) => {
  const { hasPermission, hasAnyPermission, isLoading } = useRoles();

  if (isLoading) return children;

  const hasRequiredPermission = permission 
    ? hasPermission(permission) 
    : permissions 
      ? hasAnyPermission(permissions) 
      : false;

  if (!hasRequiredPermission) {
    return fallback || (
      <div className="relative group">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/75 text-white text-xs px-2 py-1 rounded">
            {disabledMessage}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default {
  RequireRole,
  RequirePermission,
  AdminOnly,
  TherapistOnly,
  InstructorOnly,
  HideForRole,
  RoleSwitch,
  RoleCase,
  RoleBadge,
  UserRolesList,
  PermissionGate
};

