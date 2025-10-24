import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, DollarSign, Star, TrendingUp, Eye,
  MessageSquare, Video, Edit, Plus, BarChart3, Download,
  Award, Clock, CheckCircle, AlertCircle, PlayCircle,
  FileText, Settings, Filter, Search, Sparkles
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InstructorDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    completionRate: 0
  });
  const [courses, setCourses] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // TODO: Implementar carga real desde Supabase
      setStats({
        totalCourses: 12,
        publishedCourses: 10,
        totalStudents: 1247,
        activeStudents: 856,
        totalRevenue: 45600,
        monthlyRevenue: 6800,
        averageRating: 4.7,
        totalReviews: 324,
        completionRate: 68
      });

      setCourses([
        {
          id: 1,
          title: 'Conexión Angelical Profunda',
          thumbnail: '/api/placeholder/400/225',
          students: 342,
          revenue: 12800,
          rating: 4.8,
          reviews: 89,
          status: 'published',
          lastUpdated: '2025-01-15',
          completionRate: 72
        },
        {
          id: 2,
          title: 'Sanación con Ángeles',
          thumbnail: '/api/placeholder/400/225',
          students: 256,
          revenue: 9600,
          rating: 4.7,
          reviews: 67,
          status: 'published',
          lastUpdated: '2025-01-10',
          completionRate: 65
        },
        {
          id: 3,
          title: 'Manifestación Angelical',
          thumbnail: '/api/placeholder/400/225',
          students: 198,
          revenue: 7400,
          rating: 4.9,
          reviews: 54,
          status: 'published',
          lastUpdated: '2025-01-05',
          completionRate: 78
        },
        {
          id: 4,
          title: 'Meditación con Arcángeles',
          thumbnail: '/api/placeholder/400/225',
          students: 0,
          revenue: 0,
          rating: 0,
          reviews: 0,
          status: 'draft',
          lastUpdated: '2025-01-20',
          completionRate: 0
        }
      ]);

      setRevenueData([
        { month: 'Jul', revenue: 4200 },
        { month: 'Ago', revenue: 5100 },
        { month: 'Sep', revenue: 4800 },
        { month: 'Oct', revenue: 6200 },
        { month: 'Nov', revenue: 5900 },
        { month: 'Dic', revenue: 7300 },
        { month: 'Ene', revenue: 6800 }
      ]);

      setEnrollmentData([
        { month: 'Jul', students: 45 },
        { month: 'Ago', students: 62 },
        { month: 'Sep', students: 51 },
        { month: 'Oct', students: 78 },
        { month: 'Nov', students: 69 },
        { month: 'Dic', students: 94 },
        { month: 'Ene', students: 82 }
      ]);

      setReviews([
        {
          id: 1,
          student: 'María González',
          course: 'Conexión Angelical Profunda',
          rating: 5,
          comment: 'Curso transformador. Excelente contenido y presentación.',
          date: '2025-01-20'
        },
        {
          id: 2,
          student: 'Carlos Ruiz',
          course: 'Sanación con Ángeles',
          rating: 5,
          comment: 'Profundo y bien estructurado. Altamente recomendado.',
          date: '2025-01-18'
        }
      ]);

      setQuestions([
        {
          id: 1,
          student: 'Ana Martínez',
          course: 'Conexión Angelical Profunda',
          question: '¿Cómo puedo profundizar en la conexión con mi ángel guardián?',
          date: '2025-01-22',
          answered: false
        },
        {
          id: 2,
          student: 'Luis Pérez',
          course: 'Manifestación Angelical',
          question: '¿Cuánto tiempo debo practicar diariamente?',
          date: '2025-01-21',
          answered: true
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <BookOpen size={24} className="text-green-600" />
          </div>
          <TrendingUp size={20} className="text-green-500" />
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">Cursos Publicados</h3>
        <p className="text-3xl font-bold text-gray-800">{stats.publishedCourses}</p>
        <p className="text-sm text-gray-500 mt-2">de {stats.totalCourses} totales</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users size={24} className="text-blue-600" />
          </div>
          <TrendingUp size={20} className="text-blue-500" />
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">Estudiantes Activos</h3>
        <p className="text-3xl font-bold text-gray-800">{stats.activeStudents}</p>
        <p className="text-sm text-gray-500 mt-2">{stats.totalStudents} totales</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <DollarSign size={24} className="text-purple-600" />
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

  const renderCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <DollarSign size={24} className="text-purple-600" />
          Ingresos Mensuales
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Users size={24} className="text-blue-600" />
          Nuevos Estudiantes
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen size={28} className="text-green-600" />
          Mis Cursos
        </h2>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all">
          <Plus size={20} />
          Crear Nuevo Curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl overflow-hidden hover:shadow-xl transition-all">
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                <PlayCircle size={64} className="text-white/80" />
              </div>
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                course.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}>
                {course.status === 'published' ? 'Publicado' : 'Borrador'}
              </span>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-3">{course.title}</h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-white rounded-lg">
                  <Users size={20} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Estudiantes</p>
                  <p className="font-bold text-gray-800">{course.students}</p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <DollarSign size={20} className="text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Ingresos</p>
                  <p className="font-bold text-gray-800">${course.revenue}</p>
                </div>
              </div>

              {course.status === 'published' && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {course.rating} ({course.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Tasa de Completación</span>
                      <span>{course.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all">
                  <Edit size={18} />
                  Editar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
                  <BarChart3 size={18} />
                  Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviewsAndQuestions = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <Star size={28} className="text-yellow-500" />
          Reseñas Recientes
        </h2>

        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-800">{review.student}</h3>
                  <p className="text-sm text-gray-600">{review.course}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic text-sm">"{review.comment}"</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.date).toLocaleDateString('es-ES')}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <MessageSquare size={28} className="text-blue-600" />
          Preguntas de Estudiantes
        </h2>

        <div className="space-y-4">
          {questions.map(question => (
            <div key={question.id} className={`p-4 rounded-xl ${
              question.answered ? 'bg-green-50' : 'bg-blue-50'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{question.student}</h3>
                    {question.answered ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <AlertCircle size={16} className="text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{question.course}</p>
                  <p className="text-gray-700">{question.question}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  {new Date(question.date).toLocaleDateString('es-ES')}
                </p>
                {!question.answered && (
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all">
                    Responder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📚 Dashboard de Instructor</h1>
              <p className="text-xl text-white/90">Bienvenido, {user?.name || 'Instructor'}</p>
              <p className="text-white/80 mt-1">Gestiona tus cursos, estudiantes y contenido</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all">
              <Settings size={20} />
              Configuración
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {renderStats()}

        {/* Gráficos */}
        {renderCharts()}

        {/* Cursos */}
        {renderCourses()}

        {/* Reseñas y Preguntas */}
        {renderReviewsAndQuestions()}
      </div>
    </div>
  );
};

export default InstructorDashboard;

