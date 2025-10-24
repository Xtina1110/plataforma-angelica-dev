import React, { useState } from 'react';
import { Users, BookOpen, DollarSign, Activity, Shield, Settings, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [stats] = useState({
    totalUsers: 15247,
    activeUsers: 8956,
    totalCourses: 156,
    totalRevenue: 456789,
    monthlyGrowth: 12.5
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold mb-2">🛡️ Dashboard de Administrador</h1>
          <p className="text-xl">Control total de la plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <Users size={32} className="text-blue-600 mb-4" />
            <h3 className="text-gray-600 text-sm mb-1">Usuarios Totales</h3>
            <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <Activity size={32} className="text-green-600 mb-4" />
            <h3 className="text-gray-600 text-sm mb-1">Usuarios Activos</h3>
            <p className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <BookOpen size={32} className="text-purple-600 mb-4" />
            <h3 className="text-gray-600 text-sm mb-1">Cursos Totales</h3>
            <p className="text-3xl font-bold">{stats.totalCourses}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <DollarSign size={32} className="text-yellow-600 mb-4" />
            <h3 className="text-gray-600 text-sm mb-1">Ingresos Totales</h3>
            <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield size={28} className="text-red-600" />
            Panel de Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-left">
              <Users size={24} className="text-blue-600 mb-2" />
              <h3 className="font-bold">Gestionar Usuarios</h3>
              <p className="text-sm text-gray-600">Ver, editar, suspender usuarios</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-left">
              <BookOpen size={24} className="text-purple-600 mb-2" />
              <h3 className="font-bold">Gestionar Cursos</h3>
              <p className="text-sm text-gray-600">Aprobar, editar, eliminar cursos</p>
            </button>
            <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-left">
              <DollarSign size={24} className="text-green-600 mb-2" />
              <h3 className="font-bold">Finanzas</h3>
              <p className="text-sm text-gray-600">Reportes, pagos, comisiones</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
