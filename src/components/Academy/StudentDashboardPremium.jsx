import React, { useState } from 'react';
import { 
  BookOpen, Award, Clock, TrendingUp, Star, Download,
  Play, CheckCircle, Calendar, Target, Trophy, BarChart,
  Filter, Search, ChevronRight, Heart, Share2, Users,
  Zap, Brain, MessageCircle, Shield, Sparkles
} from 'lucide-react';
import StudentProgress from './StudentProgress';
import AIRecommendations from './AIRecommendations';
import CommunityForum from './CommunityForum';
import CertificateSystem from './CertificateSystem';

const StudentDashboardPremium = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Datos del estudiante
  const studentData = {
    name: user?.user_metadata?.first_name || 'Estudiante',
    enrolledCourses: 8,
    completedCourses: 3,
    certificates: 3,
    totalHours: 45.5,
    currentStreak: 15,
    points: 2450,
    level: 12,
    xp: 2450,
    xpToNextLevel: 3000,
    rank: 'Aprendiz Angelical',
    
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
        status: 'in-progress',
        nextLesson: 'Los Arcángeles Principales'
      },
      {
        id: 2,
        title: 'Tarot Angelical Completo',
        instructor: 'Carlos Vidente',
        progress: 100,
        thumbnail: '🔮',
        category: 'tarot',
        totalLessons: 36,
        completedLessons: 36,
        lastAccessed: '3 días',
        rating: 4.9,
        status: 'completed',
        certificateUrl: '/certificates/2'
      },
      {
        id: 3,
        title: 'Cristales y Sanación Energética',
        instructor: 'Ana Cristal',
        progress: 100,
        thumbnail: '💎',
        category: 'cristales',
        totalLessons: 20,
        completedLessons: 20,
        lastAccessed: '1 día',
        rating: 4.7,
        status: 'completed',
        certificateUrl: '/certificates/3'
      },
      {
        id: 4,
        title: 'Meditación Angelical Avanzada',
        instructor: 'José Paz',
        progress: 45,
        thumbnail: '🧘',
        category: 'meditacion',
        totalLessons: 16,
        completedLessons: 7,
        lastAccessed: '1 semana',
        rating: 4.8,
        status: 'in-progress',
        nextLesson: 'Conexión con tu Ángel Guardián'
      },
      {
        id: 5,
        title: 'Reiki Angelical Nivel 1',
        instructor: 'Laura Energía',
        progress: 30,
        thumbnail: '✨',
        category: 'reiki',
        totalLessons: 15,
        completedLessons: 5,
        lastAccessed: '4 días',
        rating: 4.9,
        status: 'in-progress',
        nextLesson: 'Los Símbolos de Reiki'
      }
    ]
  };

  const menuItems = [
    { id: 'overview', name: 'Resumen', icon: BarChart },
    { id: 'my-courses', name: 'Mis Cursos', icon: BookOpen },
    { id: 'progress', name: 'Progreso y Logros', icon: Trophy },
    { id: 'recommendations', name: 'Recomendaciones IA', icon: Brain },
    { id: 'community', name: 'Comunidad', icon: Users },
    { id: 'certificates', name: 'Certificados', icon: Award }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">¡Bienvenido de vuelta, {studentData.name}! 👋</h1>
            <p className="text-purple-100 text-lg">Continúa tu viaje de aprendizaje angelical</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 justify-end mb-2">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <span className="text-5xl font-bold">Nivel {studentData.level}</span>
            </div>
            <p className="text-purple-100">{studentData.rank}</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>{studentData.xp} XP</span>
            <span>{studentData.xpToNextLevel} XP para nivel {studentData.level + 1}</span>
          </div>
          <div className="w-full bg-purple-800/30 rounded-full h-4">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${(studentData.xp / studentData.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-orange-600">{studentData.currentStreak}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Días de Racha 🔥</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-green-600">{studentData.completedCourses}/{studentData.enrolledCourses}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Cursos Completados</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-600">{studentData.totalHours}h</span>
          </div>
          <h3 className="text-gray-600 font-medium">Horas de Estudio</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-purple-600">{studentData.certificates}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Certificados</h3>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Continúa Aprendiendo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentData.courses
            .filter(course => course.status === 'in-progress')
            .map((course) => (
              <div 
                key={course.id}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-5xl">{course.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">Por {course.instructor}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{course.progress}% completado</span>
                        <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Siguiente: {course.nextLesson}</span>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Continuar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Completed Courses */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cursos Completados</h2>
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1">
            <span>Ver todos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentData.courses
            .filter(course => course.status === 'completed')
            .map((course) => (
              <div 
                key={course.id}
                className="border-2 border-green-200 rounded-xl p-6 bg-green-50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{course.thumbnail}</div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">Por {course.instructor}</p>
                <button className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Ver Certificado</span>
                </button>
              </div>
            ))}
        </div>
      </div>

    </div>
  );

  const renderMyCourses = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Todos Mis Cursos ({studentData.enrolledCourses})</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {studentData.courses.map((course) => (
            <div 
              key={course.id}
              className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start space-x-6">
                <div className="text-6xl">{course.thumbnail}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{course.title}</h3>
                      <p className="text-gray-600">Por {course.instructor}</p>
                    </div>
                    {course.status === 'completed' ? (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Completado</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                        <Play className="w-5 h-5" />
                        <span className="font-medium">En Progreso</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Progreso</div>
                      <div className="text-lg font-bold text-purple-600">{course.progress}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Lecciones</div>
                      <div className="text-lg font-bold text-gray-800">{course.completedLessons}/{course.totalLessons}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Calificación</div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-lg font-bold text-gray-800">{course.rating}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Último acceso</div>
                      <div className="text-lg font-bold text-gray-800">{course.lastAccessed}</div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    {course.status === 'completed' ? (
                      <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>Ver Certificado</span>
                      </button>
                    ) : (
                      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2">
                        <Play className="w-5 h-5" />
                        <span>Continuar Curso</span>
                      </button>
                    )}
                    <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-lg mb-8 flex items-center space-x-2 overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'my-courses' && renderMyCourses()}
        {activeSection === 'progress' && <StudentProgress user={user} />}
        {activeSection === 'recommendations' && <AIRecommendations user={user} completedCourses={studentData.courses.filter(c => c.status === 'completed')} inProgressCourses={studentData.courses.filter(c => c.status === 'in-progress')} />}
        {activeSection === 'community' && <CommunityForum courseId={null} user={user} />}
        {activeSection === 'certificates' && <CertificateSystem user={user} />}

      </div>
    </div>
  );
};

export default StudentDashboardPremium;

