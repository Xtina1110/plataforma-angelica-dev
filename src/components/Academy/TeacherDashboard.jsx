import React, { useState } from 'react';
import { 
  BookOpen, Users, DollarSign, TrendingUp, Plus, Edit,
  Eye, BarChart3, MessageCircle, Star, Calendar, Award,
  Video, FileText, Settings, Download, Filter, Search
} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import { AcademiaHeader } from '../headers';
import '../Dashboard.css';

const TeacherDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Datos del instructor
  const instructorData = {
    name: user?.name || 'Instructor',
    totalStudents: 12500,
    totalCourses: 8,
    totalRevenue: 45280,
    avgRating: 4.9,
    
    courses: [
      {
        id: 1,
        title: 'Fundamentos de Comunicación Angelical',
        students: 5420,
        revenue: 18950,
        rating: 4.8,
        reviews: 1250,
        published: true,
        thumbnail: '👼',
        lessons: 24,
        enrollmentTrend: '+12%',
        lastUpdated: '2 semanas'
      },
      {
        id: 2,
        title: 'Lectura de Cartas Angelicales Avanzada',
        students: 3200,
        revenue: 12400,
        rating: 5.0,
        reviews: 890,
        published: true,
        thumbnail: '🎴',
        lessons: 18,
        enrollmentTrend: '+8%',
        lastUpdated: '1 mes'
      },
      {
        id: 3,
        title: 'Sanación con Cristales y Ángeles',
        students: 2100,
        revenue: 8200,
        rating: 4.9,
        reviews: 650,
        published: true,
        thumbnail: '💎',
        lessons: 20,
        enrollmentTrend: '+15%',
        lastUpdated: '3 días'
      },
      {
        id: 4,
        title: 'Meditación Angelical Profunda',
        students: 1800,
        revenue: 5730,
        rating: 4.7,
        reviews: 420,
        published: true,
        thumbnail: '🧘',
        lessons: 12,
        enrollmentTrend: '+5%',
        lastUpdated: '1 semana'
      },
      {
        id: 5,
        title: 'Protección Energética Avanzada',
        students: 0,
        revenue: 0,
        rating: 0,
        reviews: 0,
        published: false,
        thumbnail: '🛡️',
        lessons: 8,
        enrollmentTrend: 'Borrador',
        lastUpdated: 'Hoy'
      }
    ],
    
    recentReviews: [
      {
        id: 1,
        student: 'Ana García',
        course: 'Fundamentos de Comunicación Angelical',
        rating: 5,
        comment: 'Excelente curso, muy bien explicado. Aprendí muchísimo.',
        date: '2 horas'
      },
      {
        id: 2,
        student: 'Carlos Mendoza',
        course: 'Lectura de Cartas Angelicales Avanzada',
        rating: 5,
        comment: 'Las técnicas son muy efectivas. Totalmente recomendado.',
        date: '5 horas'
      },
      {
        id: 3,
        student: 'Laura Sánchez',
        course: 'Sanación con Cristales y Ángeles',
        rating: 4,
        comment: 'Muy buen contenido, me hubiera gustado más práctica.',
        date: '1 día'
      }
    ],
    
    questions: [
      {
        id: 1,
        student: 'Pedro López',
        course: 'Fundamentos de Comunicación Angelical',
        question: '¿Cómo puedo saber si estoy conectando realmente con mi ángel guardián?',
        lesson: 'Tu Ángel Guardián Personal',
        date: '3 horas',
        answered: false
      },
      {
        id: 2,
        student: 'María Fernández',
        course: 'Lectura de Cartas Angelicales Avanzada',
        question: '¿Qué hago si las cartas me dan un mensaje confuso?',
        lesson: 'Interpretación Avanzada',
        date: '1 día',
        answered: true
      }
    ],
    
    earnings: [
      { month: 'Ene', amount: 3200 },
      { month: 'Feb', amount: 3800 },
      { month: 'Mar', amount: 4200 },
      { month: 'Abr', amount: 4800 },
      { month: 'May', amount: 5200 },
      { month: 'Jun', amount: 6100 }
    ]
  };

  const stats = [
    {
      label: 'Estudiantes Totales',
      value: instructorData.totalStudents.toLocaleString(),
      icon: Users,
      color: 'purple',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Cursos Publicados',
      value: instructorData.courses.filter(c => c.published).length,
      icon: BookOpen,
      color: 'blue',
      trend: '+2',
      trendUp: true
    },
    {
      label: 'Ingresos Totales',
      value: `$${instructorData.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      trend: '+18%',
      trendUp: true
    },
    {
      label: 'Rating Promedio',
      value: instructorData.avgRating,
      icon: Star,
      color: 'yellow',
      trend: '+0.1',
      trendUp: true
    }
  ];

  return (
    <div className="dashboard-container">
      <AppSidebar />

      <main className="main-content" style={{ minHeight: '100vh', overflowY: 'auto' }}>
        <AcademiaHeader
          user={user}
          onLogout={onLogout}
          onNavigateHome={() => window.location.href = '/dashboard'}
        />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Panel del Instructor 👩‍🏫
              </h1>
              <p className="text-gray-600">Gestiona tus cursos y estudiantes</p>
            </div>
            <button
              onClick={() => window.location.href = '/academy/teacher/create-course'}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Crear Nuevo Curso
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp size={16} />
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <div className="flex gap-6 px-6 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Resumen', icon: BarChart3 },
                  { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
                  { id: 'reviews', label: 'Reseñas', icon: Star },
                  { id: 'questions', label: 'Preguntas', icon: MessageCircle },
                  { id: 'earnings', label: 'Ingresos', icon: DollarSign }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Earnings Chart */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ingresos Mensuales</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                      <div className="flex items-end justify-between gap-2 h-64">
                        {instructorData.earnings.map((item, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg hover:from-purple-700 hover:to-blue-700 transition-all cursor-pointer relative group"
                              style={{ height: `${(item.amount / 7000) * 100}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                ${item.amount.toLocaleString()}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Courses */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Cursos Más Populares</h3>
                    <div className="space-y-3">
                      {instructorData.courses
                        .filter(c => c.published)
                        .sort((a, b) => b.students - a.students)
                        .slice(0, 3)
                        .map((course, index) => (
                          <div key={course.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
                            <div className="text-2xl font-bold text-purple-600 w-8">#{index + 1}</div>
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                              {course.thumbnail}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Users size={14} />
                                  <span>{course.students.toLocaleString()} estudiantes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="text-yellow-500 fill-yellow-500" size={14} />
                                  <span>{course.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign size={14} />
                                  <span>${course.revenue.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-green-600 font-semibold">{course.enrollmentTrend}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Todos los Cursos</h3>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2">
                        <Filter size={16} />
                        Filtrar
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructorData.courses.map(course => (
                      <div key={course.id} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all">
                        {/* Thumbnail */}
                        <div className="relative h-40 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                          <span className="text-5xl">{course.thumbnail}</span>
                          {!course.published && (
                            <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              Borrador
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">{course.title}</h3>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-purple-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="text-purple-600" size={16} />
                                <span className="text-xs text-gray-600">Estudiantes</span>
                              </div>
                              <p className="text-lg font-bold text-purple-600">{course.students.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="text-green-600" size={16} />
                                <span className="text-xs text-gray-600">Ingresos</span>
                              </div>
                              <p className="text-lg font-bold text-green-600">${course.revenue.toLocaleString()}</p>
                            </div>
                          </div>

                          {course.published && (
                            <div className="flex items-center gap-2 mb-4">
                              <Star className="text-yellow-500 fill-yellow-500" size={16} />
                              <span className="font-semibold text-gray-900">{course.rating}</span>
                              <span className="text-sm text-gray-600">({course.reviews} reseñas)</span>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => window.location.href = `/academy/teacher/edit-course/${course.id}`}
                              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                            >
                              <Edit size={16} />
                              Editar
                            </button>
                            <button
                              onClick={() => window.location.href = `/academy/course/${course.id}`}
                              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                              <Settings size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Reseñas Recientes</h3>
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-500 fill-yellow-500" size={24} />
                      <span className="text-2xl font-bold text-gray-900">{instructorData.avgRating}</span>
                      <span className="text-gray-600">rating promedio</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {instructorData.recentReviews.map(review => (
                      <div key={review.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-purple-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.student}</h4>
                            <p className="text-sm text-gray-600">{review.course}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Preguntas de Estudiantes</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">
                        {instructorData.questions.filter(q => !q.answered).length} sin responder
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {instructorData.questions.map(question => (
                      <div key={question.id} className={`rounded-2xl p-6 border-2 ${
                        question.answered ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{question.student}</h4>
                              {!question.answered && (
                                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                  Nueva
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{question.course} • {question.lesson}</p>
                            <p className="text-gray-900 font-medium mb-2">{question.question}</p>
                            <p className="text-sm text-gray-500">{question.date}</p>
                          </div>
                        </div>
                        {!question.answered && (
                          <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                            Responder Pregunta
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Earnings Tab */}
              {activeTab === 'earnings' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Resumen de Ingresos</h3>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                      <Download size={16} />
                      Exportar Reporte
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                      <p className="text-sm mb-2">Ingresos Este Mes</p>
                      <p className="text-4xl font-bold mb-1">$6,100</p>
                      <p className="text-sm text-white/80">+18% vs mes anterior</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                      <p className="text-sm mb-2">Ingresos Totales</p>
                      <p className="text-4xl font-bold mb-1">${instructorData.totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-white/80">Desde el inicio</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                      <p className="text-sm mb-2">Promedio por Curso</p>
                      <p className="text-4xl font-bold mb-1">
                        ${Math.round(instructorData.totalRevenue / instructorData.courses.filter(c => c.published).length).toLocaleString()}
                      </p>
                      <p className="text-sm text-white/80">Por curso publicado</p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Curso</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estudiantes</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ingresos</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tendencia</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {instructorData.courses.filter(c => c.published).map(course => (
                          <tr key={course.id} className="hover:bg-purple-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center text-xl">
                                  {course.thumbnail}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{course.title}</p>
                                  <p className="text-sm text-gray-600">{course.lessons} lecciones</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900">{course.students.toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-green-600">${course.revenue.toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {course.enrollmentTrend}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;

