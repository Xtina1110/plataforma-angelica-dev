import React, { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, Star, Users, Clock, BookOpen,
  Brain, Target, Zap, Award, ChevronRight, Play
} from 'lucide-react';

const AIRecommendations = ({ user, completedCourses = [], inProgressCourses = [] }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [learningPath, setLearningPath] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    // Simular análisis de IA
    generateRecommendations();
    generateLearningPath();
    generateInsights();
  }, [completedCourses, inProgressCourses]);

  const generateRecommendations = () => {
    // En producción, esto vendría de un modelo de IA
    const recs = [
      {
        id: 1,
        title: 'Reiki Angelical Nivel 2',
        reason: 'Basado en tu interés en sanación energética',
        match: 95,
        category: 'reiki',
        level: 'intermediate',
        price: 79.99,
        rating: 4.9,
        students: 2340,
        duration: '10 horas',
        instructor: 'Laura Energía',
        image: '/courses/reiki-2.jpg',
        tags: ['Reiki', 'Sanación', 'Energía']
      },
      {
        id: 2,
        title: 'Astrología Angelical Avanzada',
        reason: 'Complementa tu conocimiento en numerología',
        match: 88,
        category: 'astrologia',
        level: 'advanced',
        price: 99.99,
        rating: 4.8,
        students: 1890,
        duration: '15 horas',
        instructor: 'Carlos Astral',
        image: '/courses/astrology-advanced.jpg',
        tags: ['Astrología', 'Cartas Natales', 'Planetas']
      },
      {
        id: 3,
        title: 'Meditación Profunda con Arcángeles',
        reason: 'Perfecto para tu nivel actual',
        match: 92,
        category: 'meditacion',
        level: 'intermediate',
        price: 59.99,
        rating: 4.9,
        students: 3120,
        duration: '8 horas',
        instructor: 'Ana Meditación',
        image: '/courses/meditation-archangels.jpg',
        tags: ['Meditación', 'Arcángeles', 'Conexión']
      }
    ];
    setRecommendations(recs);
  };

  const generateLearningPath = () => {
    // Path personalizado basado en objetivos del estudiante
    const path = {
      title: 'Tu Camino hacia Maestro Angelical',
      description: 'Un plan personalizado basado en tus intereses y progreso',
      totalDuration: '45 horas',
      estimatedCompletion: '3 meses',
      steps: [
        {
          id: 1,
          title: 'Fundamentos Completados',
          status: 'completed',
          courses: ['Comunicación Angelical Básica', 'Introducción al Tarot'],
          icon: CheckCircle,
          color: 'green'
        },
        {
          id: 2,
          title: 'Profundización en Progreso',
          status: 'in-progress',
          courses: ['Tarot Angelical Avanzado', 'Cristales y Sanación'],
          icon: Play,
          color: 'blue',
          progress: 65
        },
        {
          id: 3,
          title: 'Especialización Recomendada',
          status: 'recommended',
          courses: ['Reiki Angelical Nivel 2', 'Astrología Espiritual'],
          icon: Star,
          color: 'purple'
        },
        {
          id: 4,
          title: 'Maestría y Certificación',
          status: 'locked',
          courses: ['Programa de Certificación Profesional'],
          icon: Award,
          color: 'yellow'
        }
      ]
    };
    setLearningPath(path);
  };

  const generateInsights = () => {
    // Insights generados por IA sobre el comportamiento de aprendizaje
    const insightsData = [
      {
        id: 1,
        type: 'strength',
        icon: '💪',
        title: 'Tu Fortaleza',
        description: 'Excelente consistencia en el estudio. Tu racha de 15 días te coloca en el top 10% de estudiantes.',
        color: 'green'
      },
      {
        id: 2,
        type: 'opportunity',
        icon: '🎯',
        title: 'Oportunidad de Mejora',
        description: 'Considera estudiar en las mañanas. Los datos muestran que retienes un 25% más de información entre 8-10 AM.',
        color: 'blue'
      },
      {
        id: 3,
        type: 'prediction',
        icon: '🔮',
        title: 'Predicción IA',
        description: 'A tu ritmo actual, completarás tu certificación en 2.5 meses. ¡Vas por buen camino!',
        color: 'purple'
      },
      {
        id: 4,
        type: 'social',
        icon: '👥',
        title: 'Aprendizaje Social',
        description: 'Estudiantes con tu perfil se benefician de grupos de estudio. ¿Te gustaría unirte a uno?',
        color: 'orange'
      }
    ];
    setInsights(insightsData);
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-600 bg-green-100';
    if (match >= 80) return 'text-blue-600 bg-blue-100';
    return 'text-purple-600 bg-purple-100';
  };

  return (
    <div className="space-y-8">
      
      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-white/20 rounded-xl">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Insights de IA Personalizados</h2>
            <p className="text-purple-100">Análisis inteligente de tu aprendizaje</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="flex items-start space-x-4">
                <span className="text-4xl">{insight.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{insight.title}</h3>
                  <p className="text-purple-100 text-sm leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      {learningPath && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{learningPath.title}</h2>
              <p className="text-gray-600">{learningPath.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Duración total</div>
              <div className="text-2xl font-bold text-purple-600">{learningPath.totalDuration}</div>
              <div className="text-sm text-gray-500">≈ {learningPath.estimatedCompletion}</div>
            </div>
          </div>

          <div className="relative">
            {/* Línea de conexión vertical */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-gray-300" />

            <div className="space-y-8">
              {learningPath.steps.map((step, index) => (
                <div key={step.id} className="relative flex items-start space-x-6">
                  {/* Icono del paso */}
                  <div className={`relative z-10 p-4 rounded-xl shadow-lg ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'in-progress' ? 'bg-blue-500' :
                    step.status === 'recommended' ? 'bg-purple-500' :
                    'bg-gray-300'
                  }`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Contenido del paso */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                      {step.status === 'completed' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ Completado
                        </span>
                      )}
                      {step.status === 'in-progress' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          En Progreso {step.progress}%
                        </span>
                      )}
                      {step.status === 'recommended' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          ⭐ Recomendado
                        </span>
                      )}
                    </div>

                    {step.progress && (
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {step.courses.map((course, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-gray-700">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{course}</span>
                        </div>
                      ))}
                    </div>

                    {step.status === 'recommended' && (
                      <button className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                        <span>Comenzar Ahora</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Cursos Recomendados para Ti</h2>
              <p className="text-gray-600">Seleccionados por nuestra IA basándose en tu perfil</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all group"
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-400 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-20 h-20 text-white/30" />
                </div>
                
                {/* Match Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full font-bold text-sm ${getMatchColor(course.match)}`}>
                    {course.match}% Match
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <div className="transform scale-0 group-hover:scale-100 transition-transform">
                    <div className="p-4 bg-white rounded-full">
                      <Play className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="italic">{course.reason}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-2xl font-bold text-purple-600">${course.price}</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Ver Curso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AIRecommendations;

