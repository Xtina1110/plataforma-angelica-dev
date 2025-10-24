import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, DollarSign, Star, TrendingUp, Clock,
  MessageSquare, Video, CheckCircle, XCircle, AlertCircle,
  Settings, Plus, Filter, Download, BarChart3, Eye,
  Phone, Mail, MapPin, Award, Heart, Sparkles
} from 'lucide-react';

const ConsultantDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState([]);

  // Cargar datos
  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // TODO: Implementar carga real desde Supabase
      // Datos de ejemplo
      setStats({
        totalClients: 45,
        activeClients: 28,
        totalSessions: 156,
        completedSessions: 142,
        upcomingSessions: 8,
        totalRevenue: 28400,
        monthlyRevenue: 4200,
        averageRating: 4.8,
        totalReviews: 67
      });

      setSessions([
        {
          id: 1,
          client: 'María González',
          type: 'Lectura Angelical',
          date: '2025-01-25',
          time: '10:00',
          duration: 60,
          status: 'confirmed',
          price: 200
        },
        {
          id: 2,
          client: 'Carlos Ruiz',
          type: 'Sanación Angelical',
          date: '2025-01-25',
          time: '14:00',
          duration: 90,
          status: 'pending',
          price: 300
        },
        {
          id: 3,
          client: 'Ana Martínez',
          type: 'Consulta Espiritual',
          date: '2025-01-26',
          time: '11:00',
          duration: 60,
          status: 'confirmed',
          price: 200
        }
      ]);

      setClients([
        {
          id: 1,
          name: 'María González',
          email: 'maria@example.com',
          phone: '+34 600 123 456',
          totalSessions: 8,
          lastSession: '2025-01-15',
          status: 'active',
          notes: 'Cliente regular, prefiere sesiones matutinas'
        },
        {
          id: 2,
          name: 'Carlos Ruiz',
          email: 'carlos@example.com',
          phone: '+34 600 234 567',
          totalSessions: 3,
          lastSession: '2025-01-10',
          status: 'active',
          notes: 'Primera vez, muy receptivo'
        }
      ]);

      setReviews([
        {
          id: 1,
          client: 'María González',
          rating: 5,
          comment: 'Experiencia transformadora. Altamente recomendado.',
          date: '2025-01-15',
          session: 'Lectura Angelical'
        },
        {
          id: 2,
          client: 'Ana Martínez',
          rating: 5,
          comment: 'Profunda conexión espiritual. Gracias por tu guía.',
          date: '2025-01-12',
          session: 'Sanación Angelical'
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  // Renderizar estadísticas
  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Users size={24} className="text-purple-600" />
          </div>
          <TrendingUp size={20} className="text-green-500" />
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">Clientes Activos</h3>
        <p className="text-3xl font-bold text-gray-800">{stats.activeClients}</p>
        <p className="text-sm text-gray-500 mt-2">de {stats.totalClients} totales</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <Clock size={20} className="text-blue-500" />
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">Sesiones Próximas</h3>
        <p className="text-3xl font-bold text-gray-800">{stats.upcomingSessions}</p>
        <p className="text-sm text-gray-500 mt-2">{stats.completedSessions} completadas</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <TrendingUp size={20} className="text-green-500" />
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">Ingresos del Mes</h3>
        <p className="text-3xl font-bold text-gray-800">${stats.monthlyRevenue}</p>
        <p className="text-sm text-gray-500 mt-2">${stats.totalRevenue} totales</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Star size={24} className="text-yellow-600" />
          </div>
          <Award size={20} className="text-yellow-500" />
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">Valoración</h3>
        <p className="text-3xl font-bold text-gray-800">{stats.averageRating}</p>
        <p className="text-sm text-gray-500 mt-2">{stats.totalReviews} reseñas</p>
      </div>
    </div>
  );

  // Renderizar sesiones próximas
  const renderUpcomingSessions = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar size={28} className="text-purple-600" />
          Sesiones Próximas
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all">
          <Plus size={20} />
          Nueva Sesión
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map(session => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                session.status === 'confirmed' ? 'bg-green-100' :
                session.status === 'pending' ? 'bg-yellow-100' :
                'bg-gray-100'
              }`}>
                <Video size={28} className={
                  session.status === 'confirmed' ? 'text-green-600' :
                  session.status === 'pending' ? 'text-yellow-600' :
                  'text-gray-600'
                } />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">{session.client}</h3>
                <p className="text-gray-600">{session.type}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(session.date).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {session.time} ({session.duration} min)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">${session.price}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  session.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {session.status === 'confirmed' ? 'Confirmada' :
                   session.status === 'pending' ? 'Pendiente' :
                   'Cancelada'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button className="p-2 bg-white rounded-lg hover:bg-purple-50 transition-all">
                <Eye size={20} className="text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-lg hover:bg-blue-50 transition-all">
                <MessageSquare size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar clientes
  const renderClients = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users size={28} className="text-blue-600" />
          Mis Clientes
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
            <Filter size={20} />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Contacto</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Sesiones</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Última Sesión</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.notes}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail size={14} />
                      {client.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone size={14} />
                      {client.phone}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    {client.totalSessions}
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-gray-600">
                  {new Date(client.lastSession).toLocaleDateString('es-ES')}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {client.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                      <Eye size={18} className="text-blue-600" />
                    </button>
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all">
                      <MessageSquare size={18} className="text-purple-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Renderizar reseñas
  const renderReviews = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Star size={28} className="text-yellow-500" />
        Reseñas Recientes
      </h2>

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-800">{review.client}</h3>
                <p className="text-sm text-gray-600">{review.session}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700 italic">"{review.comment}"</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(review.date).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">✨ Dashboard de Consultor</h1>
              <p className="text-xl text-white/90">Bienvenido, {user?.name || 'Consultor'}</p>
              <p className="text-white/80 mt-1">Gestiona tus sesiones, clientes e ingresos</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all">
              <Settings size={20} />
              Configuración
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {renderStats()}

        {/* Sesiones Próximas */}
        {renderUpcomingSessions()}

        {/* Grid de Clientes y Reseñas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderClients()}
          </div>
          <div>
            {renderReviews()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;

