/**
 * Hook personalizado para gestión de roles y permisos
 * 
 * Uso:
 * const { roles, permissions, hasRole, hasPermission, isLoading } = useRoles();
 */

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const useRoles = (userId = null) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserRolesAndPermissions();
  }, [userId]);

  const fetchUserRolesAndPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener usuario actual si no se proporciona
      let targetUserId = userId;
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setRoles([]);
          setPermissions([]);
          setIsLoading(false);
          return;
        }
        targetUserId = user.id;
      }

      // Obtener roles del usuario
      const { data: userRoles, error: rolesError } = await supabase
        .rpc('get_user_roles', { p_user_id: targetUserId });

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        setError(rolesError.message);
      } else {
        setRoles(userRoles || []);
      }

      // Obtener permisos del usuario
      const { data: userPermissions, error: permissionsError } = await supabase
        .rpc('get_user_permissions', { p_user_id: targetUserId });

      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        setError(permissionsError.message);
      } else {
        setPermissions(userPermissions || []);
      }

    } catch (err) {
      console.error('Error in fetchUserRolesAndPermissions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} roleName - Nombre del rol (ej: 'admin', 'terapeuta')
   * @returns {boolean}
   */
  const hasRole = (roleName) => {
    return roles.some(role => role.role_name === roleName);
  };

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   * @param {string[]} roleNames - Array de nombres de roles
   * @returns {boolean}
   */
  const hasAnyRole = (roleNames) => {
    return roles.some(role => roleNames.includes(role.role_name));
  };

  /**
   * Verifica si el usuario tiene todos los roles especificados
   * @param {string[]} roleNames - Array de nombres de roles
   * @returns {boolean}
   */
  const hasAllRoles = (roleNames) => {
    return roleNames.every(roleName => 
      roles.some(role => role.role_name === roleName)
    );
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param {string} permissionName - Nombre del permiso (ej: 'courses.create')
   * @returns {boolean}
   */
  const hasPermission = (permissionName) => {
    return permissions.some(perm => perm.permission_name === permissionName);
  };

  /**
   * Verifica si el usuario tiene alguno de los permisos especificados
   * @param {string[]} permissionNames - Array de nombres de permisos
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionNames) => {
    return permissions.some(perm => 
      permissionNames.includes(perm.permission_name)
    );
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   * @param {string[]} permissionNames - Array de nombres de permisos
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionNames) => {
    return permissionNames.every(permissionName =>
      permissions.some(perm => perm.permission_name === permissionName)
    );
  };

  /**
   * Obtiene el rol primario del usuario
   * @returns {object|null}
   */
  const getPrimaryRole = () => {
    return roles.find(role => role.is_primary) || roles[0] || null;
  };

  /**
   * Obtiene todos los permisos de una categoría específica
   * @param {string} category - Categoría de permisos
   * @returns {array}
   */
  const getPermissionsByCategory = (category) => {
    return permissions.filter(perm => perm.category === category);
  };

  /**
   * Verifica si el usuario es admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole('admin');
  };

  /**
   * Verifica si el usuario es terapeuta
   * @returns {boolean}
   */
  const isTherapist = () => {
    return hasRole('terapeuta');
  };

  /**
   * Verifica si el usuario es instructor
   * @returns {boolean}
   */
  const isInstructor = () => {
    return hasRole('instructor');
  };

  /**
   * Obtiene la ruta del dashboard según el rol primario
   * @returns {string}
   */
  const getDashboardRoute = () => {
    const primaryRole = getPrimaryRole();
    if (!primaryRole) return '/dashboard';

    const dashboardRoutes = {
      'admin': '/dashboard-admin',
      'terapeuta': '/dashboard-terapeuta',
      'instructor': '/dashboard-instructor',
      'support': '/dashboard-support',
      'affiliate': '/dashboard-affiliate',
      'center': '/dashboard-center',
      'usuario': '/dashboard'
    };

    return dashboardRoutes[primaryRole.role_name] || '/dashboard';
  };

  return {
    // Estado
    roles,
    permissions,
    isLoading,
    error,

    // Funciones de verificación de roles
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getPrimaryRole,

    // Funciones de verificación de permisos
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissionsByCategory,

    // Helpers de roles comunes
    isAdmin,
    isTherapist,
    isInstructor,

    // Utilidades
    getDashboardRoute,
    refresh: fetchUserRolesAndPermissions
  };
};

export default useRoles;

