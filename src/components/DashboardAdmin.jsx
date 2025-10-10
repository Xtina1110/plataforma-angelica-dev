import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Database, AlertTriangle, Activity } from 'lucide-react';

const DashboardAdmin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      setCurrentUser(user);

      // Get user role securely
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (error || !userData || userData.rol !== 'admin') {
        // Not authorized - redirect to dashboard
        navigate('/dashboard');
        return;
      }

      setUserRole(userData.rol);
      await loadAdminData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      // Load audit logs (only admins can see these due to RLS)
      const { data: logs } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setAuditLogs(logs || []);

      // Load all users (only admins can see all users)
      const { data: allUsers } = await supabase
        .from('usuarios')
        .select('id, nombre, apellidos, email, rol, created_at')
        .order('created_at', { ascending: false });

      setUsers(allUsers || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const assignRole = async (userId, newRole) => {
    try {
      const { error } = await supabase.rpc('assign_user_role', {
        target_user_id: userId,
        new_role: newRole
      });

      if (error) {
        alert('Error al asignar rol: ' + error.message);
        return;
      }

      alert('Rol asignado exitosamente');
      await loadAdminData(); // Reload data
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Error al asignar rol');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Verificando acceso de administrador...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null; // Component will redirect before this renders
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-800">Panel de Administrador</h1>
            </div>
            <div className="text-sm text-gray-600">
              Bienvenido, {currentUser?.email}
            </div>
          </div>
        </div>

        {/* Security Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">
              Panel de Administración - Acceso Restringido
            </p>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Este panel contiene funciones administrativas sensibles. Todas las acciones son monitoreadas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.nombre} {user.apellidos}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.rol === 'admin' ? 'bg-red-100 text-red-700' :
                      user.rol === 'tecnico' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.rol}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <select 
                      onChange={(e) => assignRole(user.id, e.target.value)}
                      defaultValue=""
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="">Cambiar rol</option>
                      <option value="usuario">Usuario</option>
                      <option value="tecnico">Técnico</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Registro de Auditoría</h2>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.operation === 'INSERT' ? 'bg-green-100 text-green-700' :
                      log.operation === 'UPDATE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {log.operation}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">
                    Tabla: <strong>{log.table_name}</strong>
                  </p>
                  {log.user_id && (
                    <p className="text-gray-600 text-xs">
                      Usuario: {log.user_id}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Estadísticas del Sistema</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 font-medium">Total Usuarios</p>
              <p className="text-2xl font-bold text-blue-700">{users.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 font-medium">Usuarios Activos</p>
              <p className="text-2xl font-bold text-green-700">
                {users.filter(u => u.rol === 'usuario').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-600 font-medium">Técnicos</p>
              <p className="text-2xl font-bold text-yellow-700">
                {users.filter(u => u.rol === 'tecnico').length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-600 font-medium">Administradores</p>
              <p className="text-2xl font-bold text-red-700">
                {users.filter(u => u.rol === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
