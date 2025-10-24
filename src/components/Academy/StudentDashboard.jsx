import React, { useState } from 'react';
import { 
  BookOpen, Award, Clock, TrendingUp, Star, Download,
  Play, CheckCircle, Calendar, Target, Trophy, BarChart,
  Filter, Search, ChevronRight, Heart, Share2
} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import { AcademiaHeader } from '../headers';
import '../Dashboard.css';

const StudentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Datos del estudiante
  const studentData = {
    name: user?.name || 'Estudiante',
    enrolledCourses: 8,
    completedCourses: 3,
    certificates: 3,
    totalHours: 45.5,
    currentStreak: 7,
    points: 1250,
    level: 5,
    
    courses: [
      {
        id: 1,
        title: 'Fundamentos de Comunicación Angelical',
        instructor: 'María Luz Angelical',
        progress: 75,
        thumbnail: '👼',
        category: 'angeles',
        totalLessons: 24,
        completedLessons: 18,
        lastAccessed: '2 horas',
        rating: 4.8,
        status: 'in-progress'
      },
      {
        id: 2,
        title: 'Lectura de Cartas Angelicales Avanzada',
        instructor: 'Carlos Divino',
        progress: 100,
        thumbnail: '🎴',
        category: 'cartas',
        totalLessons: 18,
        completedLessons: 18,
        lastAccessed: '3 días',
        rating: 5.0,
        status: 'completed',
        certificateUrl: '/certificates/2'
      },
      {
        id: 3,
        title: 'Sanación con Cristales y Ángeles',
        instructor: 'Ana Cristalina',
        progress: 45,
        thumbnail: '💎',
        category: 'sanacion',
        totalLessons: 20,
        completedLessons: 9,
        lastAccessed: '1 día',
        rating: 4.9,
        status: 'in-progress'
      },
      {
        id: 4,
        title: 'Meditación Angelical para Principiantes',
        instructor: 'José Paz',
        progress: 100,
        thumbnail: '🧘',
        category: 'meditacion',
        totalLessons: 12,
        completedLessons: 12,
        lastAccessed: '1 semana',
        rating: 4.7,
        status: 'completed',
        certificateUrl: '/certificates/4'
      },
      {
        id: 5,
        title: 'Protección Energética Avanzada',
        instructor: 'Laura Escudo',
        progress: 30,
        thumbnail: '🛡️',
        category: 'proteccion',
        totalLessons: 15,
        completedLessons: 5,
        lastAccessed: '4 días',
        rating: 4.6,
        status: 'in-progress'
      },
      {
        id: 6,
        title: 'Numerología Angelical',
        instructor: 'Pedro Números',
        progress: 100,
        thumbnail: '🔢',
        category: 'numerologia',
        totalLessons: 16,
        completedLessons: 16,
        lastAccessed: '2 semanas',
        rating: 4.8,
        status: 'completed',
        certificateUrl: '/certificates/6'
      },
      {
        id: 7,
        title: 'Conexión con Arcángeles',
        instructor: 'Sofía Celestial',
        progress: 60,
        thumbnail: '⚡',
        category: 'arcangeles',
        totalLessons: 22,
        completedLessons: 13,
        lastAccessed: '5 horas',
        rating: 5.0,
        status: 'in-progress'
      },
      {
        id: 8,
        title: 'Terapia Angelical Holística',
        instructor: 'Miguel Sanador',
        progress: 15,
        thumbnail: '✨',
        category: 'terapia',
        totalLessons: 25,
        completedLessons: 4,
        lastAccessed: '1 semana',
        rating: 4.9,
        status: 'in-progress'
      }
    ],
    
    achievements: [
      { id: 1, title: 'Primera Lección', description: 'Completaste tu primera lección', icon: '🎯', earned: true },
      { id: 2, title: 'Primer Curso', description: 'Completaste tu primer curso', icon: '🏆', earned: true },
      { id: 3, title: 'Racha de 7 días', description: 'Estudiaste 7 días consecutivos', icon: '🔥', earned: true },
      { id: 4, title: 'Maestro Angelical', description: 'Completaste 5 cursos', icon: '👼', earned: false },
      { id: 5, title: 'Estudiante Dedicado', description: 'Acumula 100 horas de estudio', icon: '📚', earned: false },
      { id: 6, title: 'Perfeccionista', description: 'Obtén 100% en 3 quizzes', icon: '⭐', earned: false }
    ],
    
    recentActivity: [
      { type: 'lesson', title: 'Completaste "Los Arcángeles Principales"', time: '2 horas', course: 'Fundamentos de Comunicación Angelical' },
      { type: 'quiz', title: 'Aprobaste el Quiz de Jerarquía Angelical', time: '3 horas', score: 95 },
      { type: 'certificate', title: 'Obtuviste certificado de Lectura de Cartas', time: '3 días', course: 'Lectura de Cartas Angelicales Avanzada' },
      { type: 'enrollment', title: 'Te inscribiste en Terapia Angelical Holística', time: '1 semana' }
    ]
  };

  const filteredCourses = studentData.courses.filter(course => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'in-progress' && course.status === 'in-progress') ||
                      (activeTab === 'completed' && course.status === 'completed');
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = [
    {
      label: 'Cursos Activos',
      value: studentData.courses.filter(c => c.status === 'in-progress').length,
      icon: BookOpen,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      label: 'Cursos Completados',
      value: studentData.completedCourses,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Certificados',
      value: studentData.certificates,
      icon: Award,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Horas Totales',
      value: studentData.totalHours,
      icon: Clock,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido de vuelta, {studentData.name}! 👋
            </h1>
            <p className="text-gray-600">Continúa tu camino de aprendizaje espiritual</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={stat.textColor} size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Progress Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tu Progreso</h3>
                <Trophy size={24} />
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Nivel {studentData.level}</span>
                  <span className="text-sm">{studentData.points} puntos</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-xs text-white/80 mt-2">350 puntos para nivel {studentData.level + 1}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-sm font-semibold">{studentData.currentStreak} días</p>
                    <p className="text-xs text-white/80">Racha actual</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Continúa Aprendiendo</h3>
              {studentData.courses
                .filter(c => c.status === 'in-progress')
                .sort((a, b) => b.progress - a.progress)
                .slice(0, 2)
                .map(course => (
                  <div key={course.id} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                        {course.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 truncate">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-purple-600">{course.progress}%</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                        <Play size={16} />
                        Continuar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Tabs and Search */}
          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'Todos los Cursos' },
                    { id: 'in-progress', label: 'En Progreso' },
                    { id: 'completed', label: 'Completados' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar cursos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 w-full md:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div key={course.id} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all group">
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                      <span className="text-6xl">{course.thumbnail}</span>
                      {course.status === 'completed' && (
                        <div className="absolute top-3 right-3 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-white" size={20} />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Clock size={14} />
                          <span>Último acceso: {course.lastAccessed}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {course.completedLessons}/{course.totalLessons} lecciones
                          </span>
                          <span className="text-sm font-semibold text-purple-600">{course.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="text-yellow-500 fill-yellow-500" size={16} />
                        <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {course.status === 'completed' && course.certificateUrl ? (
                          <>
                            <button
                              onClick={() => window.location.href = course.certificateUrl}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                            >
                              <Award size={16} />
                              Certificado
                            </button>
                            <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                              <Share2 size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => window.location.href = `/academy/course/${course.id}/learn`}
                              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                            >
                              <Play size={16} />
                              Continuar
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                              <Heart size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No se encontraron cursos</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Logros</h3>
                <span className="text-sm text-gray-600">
                  {studentData.achievements.filter(a => a.earned).length}/{studentData.achievements.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {studentData.achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      achievement.earned
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente</h3>
              <div className="space-y-4">
                {studentData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'lesson' ? 'bg-purple-100' :
                      activity.type === 'quiz' ? 'bg-blue-100' :
                      activity.type === 'certificate' ? 'bg-green-100' :
                      'bg-yellow-100'
                    }`}>
                      {activity.type === 'lesson' && <Play className="text-purple-600" size={18} />}
                      {activity.type === 'quiz' && <CheckCircle className="text-blue-600" size={18} />}
                      {activity.type === 'certificate' && <Award className="text-green-600" size={18} />}
                      {activity.type === 'enrollment' && <BookOpen className="text-yellow-600" size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      {activity.course && (
                        <p className="text-xs text-gray-600 mt-1">{activity.course}</p>
                      )}
                      {activity.score && (
                        <p className="text-xs text-green-600 mt-1">Puntaje: {activity.score}%</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

