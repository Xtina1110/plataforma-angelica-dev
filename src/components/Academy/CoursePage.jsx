import React, { useState } from 'react';
import { 
  Play, Star, Users, Clock, BookOpen, Award, Download, 
  Check, ChevronDown, ChevronUp, Lock, Globe, Smartphone,
  MessageCircle, Share2, Heart, ShoppingCart
} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import { AcademiaHeader } from '../headers';
import '../Dashboard.css';

const CoursePage = ({ user, onLogout, courseId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState([0]);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Datos del curso (normalmente vendrían de la API)
  const course = {
    id: 1,
    title: 'Fundamentos de Comunicación Angelical',
    subtitle: 'Aprende a conectar con tus ángeles guardianes y recibir mensajes divinos',
    description: `Descubre el poder transformador de la comunicación angelical en este curso completo diseñado para principiantes. 
    
    A través de 24 lecciones cuidadosamente estructuradas, aprenderás técnicas probadas para establecer una conexión profunda con tus ángeles guardianes, interpretar sus mensajes y aplicar su sabiduría divina en tu vida diaria.
    
    Este curso combina enseñanzas ancestrales con métodos modernos de meditación y visualización, proporcionándote las herramientas necesarias para desarrollar tu intuición espiritual y recibir guía angelical clara y precisa.`,
    category: 'angeles',
    level: 'beginner',
    price: 49.99,
    originalPrice: 79.99,
    instructor: {
      name: 'María Luz Angelical',
      avatar: '👩‍🏫',
      title: 'Maestra Certificada en Terapia Angelical',
      bio: 'Con más de 15 años de experiencia en comunicación angelical, María ha ayudado a miles de estudiantes a conectar con sus ángeles guardianes.',
      students: 12500,
      courses: 8,
      rating: 4.9
    },
    rating: 4.8,
    reviews: 1250,
    students: 5420,
    duration: '8 horas',
    lessons: 24,
    language: 'Español',
    lastUpdated: 'Octubre 2025',
    certificate: true,
    lifetime: true,
    mobile: true,
    downloadable: true,
    
    whatYouLearn: [
      'Identificar y conectar con tus ángeles guardianes personales',
      'Recibir e interpretar mensajes angelicales con claridad',
      'Técnicas de meditación para fortalecer la conexión divina',
      'Uso de cartas angelicales para guía diaria',
      'Protección energética y limpieza espiritual',
      'Crear un espacio sagrado para la comunicación angelical',
      'Reconocer señales y sincronías en tu vida',
      'Pedir ayuda angelical de manera efectiva'
    ],
    
    requirements: [
      'Mente abierta y disposición para aprender',
      'No se requiere experiencia previa en espiritualidad',
      'Espacio tranquilo para meditar (recomendado)',
      'Cuaderno para tomar notas de tus experiencias'
    ],
    
    curriculum: [
      {
        id: 1,
        title: 'Introducción a los Ángeles',
        lessons: 6,
        duration: '1h 30min',
        lectures: [
          { id: 1, title: 'Bienvenida al Curso', duration: '5:30', type: 'video', preview: true },
          { id: 2, title: '¿Qué son los Ángeles?', duration: '12:45', type: 'video', preview: true },
          { id: 3, title: 'Jerarquía Angelical', duration: '18:20', type: 'video', preview: false },
          { id: 4, title: 'Los Arcángeles Principales', duration: '22:15', type: 'video', preview: false },
          { id: 5, title: 'Tu Ángel Guardián Personal', duration: '15:40', type: 'video', preview: false },
          { id: 6, title: 'Quiz: Conociendo a los Ángeles', duration: '10 preguntas', type: 'quiz', preview: false }
        ]
      },
      {
        id: 2,
        title: 'Preparación para la Conexión',
        lessons: 5,
        duration: '1h 15min',
        lectures: [
          { id: 7, title: 'Creando tu Espacio Sagrado', duration: '16:30', type: 'video', preview: false },
          { id: 8, title: 'Limpieza Energética Básica', duration: '14:20', type: 'video', preview: false },
          { id: 9, title: 'Protección Espiritual', duration: '18:45', type: 'video', preview: false },
          { id: 10, title: 'Herramientas y Cristales', duration: '12:10', type: 'video', preview: false },
          { id: 11, title: 'Recursos Descargables', duration: '5 archivos', type: 'resource', preview: false }
        ]
      },
      {
        id: 3,
        title: 'Técnicas de Comunicación',
        lessons: 7,
        duration: '2h 10min',
        lectures: [
          { id: 12, title: 'Meditación Guiada: Primer Contacto', duration: '25:30', type: 'video', preview: false },
          { id: 13, title: 'Escritura Automática Angelical', duration: '19:45', type: 'video', preview: false },
          { id: 14, title: 'Interpretando Señales', duration: '16:20', type: 'video', preview: false },
          { id: 15, title: 'Números Angelicales', duration: '22:15', type: 'video', preview: false },
          { id: 16, title: 'Sueños y Mensajes Nocturnos', duration: '18:40', type: 'video', preview: false },
          { id: 17, title: 'Práctica Guiada', duration: '15:30', type: 'video', preview: false },
          { id: 18, title: 'Quiz: Técnicas de Comunicación', duration: '15 preguntas', type: 'quiz', preview: false }
        ]
      },
      {
        id: 4,
        title: 'Aplicaciones Prácticas',
        lessons: 6,
        duration: '1h 45min',
        lectures: [
          { id: 19, title: 'Pedir Ayuda Angelical', duration: '17:30', type: 'video', preview: false },
          { id: 20, title: 'Sanación con Ángeles', duration: '20:45', type: 'video', preview: false },
          { id: 21, title: 'Guía en Decisiones Importantes', duration: '16:20', type: 'video', preview: false },
          { id: 22, title: 'Protección Diaria', duration: '14:15', type: 'video', preview: false },
          { id: 23, title: 'Compartiendo la Luz', duration: '12:40', type: 'video', preview: false },
          { id: 24, title: 'Examen Final y Certificación', duration: '20 preguntas', type: 'quiz', preview: false }
        ]
      }
    ],
    
    reviews: [
      {
        id: 1,
        user: 'Ana García',
        avatar: '👩',
        rating: 5,
        date: 'Hace 2 semanas',
        comment: 'Este curso cambió mi vida completamente. Ahora puedo sentir la presencia de mis ángeles y recibo guía clara en mi día a día. María es una instructora excepcional.',
        helpful: 45
      },
      {
        id: 2,
        user: 'Carlos Mendoza',
        avatar: '👨',
        rating: 5,
        date: 'Hace 1 mes',
        comment: 'Excelente curso para principiantes. Las meditaciones guiadas son muy poderosas y las técnicas son fáciles de aplicar. Totalmente recomendado.',
        helpful: 32
      },
      {
        id: 3,
        user: 'Laura Sánchez',
        avatar: '👩',
        rating: 4,
        date: 'Hace 3 semanas',
        comment: 'Muy buen contenido y bien explicado. Me hubiera gustado más práctica en vivo, pero en general estoy muy satisfecha con lo aprendido.',
        helpful: 18
      }
    ]
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLectureIcon = (type) => {
    switch (type) {
      case 'video': return <Play size={16} className="text-purple-600" />;
      case 'quiz': return <Award size={16} className="text-yellow-600" />;
      case 'resource': return <Download size={16} className="text-green-600" />;
      default: return <BookOpen size={16} className="text-gray-600" />;
    }
  };

  const handleEnroll = () => {
    // Lógica de inscripción
    setIsEnrolled(true);
    alert('¡Te has inscrito exitosamente! Redirigiendo a la primera lección...');
  };

  return (
    <div className="dashboard-container">
      <AppSidebar />

      <main className="main-content bg-gray-50" style={{ minHeight: '100vh', overflowY: 'auto' }}>
        <AcademiaHeader
          user={user}
          onLogout={onLogout}
          onNavigateHome={() => window.history.back()}
        />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-2">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                  <a href="/academy" className="hover:text-white">Academia</a>
                  <span>/</span>
                  <a href="/academy/category/angeles" className="hover:text-white">Ángeles y Arcángeles</a>
                  <span>/</span>
                  <span className="text-white">Fundamentos</span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-white/90 mb-6">{course.subtitle}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold text-lg">{course.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(course.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
                        />
                      ))}
                    </div>
                    <span className="text-white/70">({course.reviews.toLocaleString()} valoraciones)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span>{course.students.toLocaleString()} estudiantes</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{course.instructor.avatar}</span>
                  <div>
                    <p className="text-sm text-white/70">Creado por</p>
                    <p className="font-semibold">{course.instructor.name}</p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Última actualización: {course.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <span>{course.language}</span>
                  </div>
                </div>
              </div>

              {/* Right Card - Enrollment */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-6">
                  {/* Preview Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl mb-4 overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">👼</span>
                    </div>
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Play className="text-purple-600 ml-1" size={24} />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                      Vista Previa
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-purple-600">${course.price}</span>
                      {course.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">${course.originalPrice}</span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <div className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full inline-block">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% de descuento
                      </div>
                    )}
                  </div>

                  {/* Enroll Button */}
                  {!isEnrolled ? (
                    <>
                      <button
                        onClick={handleEnroll}
                        className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors mb-3"
                      >
                        Inscribirme Ahora
                      </button>
                      <button className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors mb-4">
                        Agregar al Carrito
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => window.location.href = `/academy/course/${course.id}/learn`}
                      className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors mb-4"
                    >
                      Ir al Curso
                    </button>
                  )}

                  {/* Includes */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <p className="font-semibold text-gray-900 mb-3">Este curso incluye:</p>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Clock size={18} className="text-purple-600" />
                      <span>{course.duration} de video bajo demanda</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <BookOpen size={18} className="text-purple-600" />
                      <span>{course.lessons} lecciones</span>
                    </div>
                    {course.downloadable && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Download size={18} className="text-purple-600" />
                        <span>Recursos descargables</span>
                      </div>
                    )}
                    {course.lifetime && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-purple-600" />
                        <span>Acceso de por vida</span>
                      </div>
                    )}
                    {course.mobile && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Smartphone size={18} className="text-purple-600" />
                        <span>Acceso en móvil y TV</span>
                      </div>
                    )}
                    {course.certificate && (
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Award size={18} className="text-purple-600" />
                        <span>Certificado de finalización</span>
                      </div>
                    )}
                  </div>

                  {/* Share */}
                  <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors">
                      <Share2 size={18} />
                      <span className="text-sm">Compartir</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors">
                      <Heart size={18} />
                      <span className="text-sm">Guardar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-lg mb-6">
                <div className="border-b border-gray-200">
                  <div className="flex gap-6 px-6">
                    {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 font-semibold border-b-2 transition-colors ${
                          activeTab === tab
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab === 'overview' && 'Descripción'}
                        {tab === 'curriculum' && 'Contenido del Curso'}
                        {tab === 'instructor' && 'Instructor'}
                        {tab === 'reviews' && 'Reseñas'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lo que aprenderás</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.whatYouLearn.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {course.description}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Requisitos</h2>
                        <ul className="space-y-2">
                          {course.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-700">
                              <span className="text-purple-600 mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Curriculum Tab */}
                  {activeTab === 'curriculum' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Contenido del Curso</h2>
                        <div className="text-sm text-gray-600">
                          {course.curriculum.length} secciones • {course.lessons} lecciones • {course.duration} total
                        </div>
                      </div>

                      {course.curriculum.map((section, index) => (
                        <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleSection(index)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {expandedSections.includes(index) ? (
                                <ChevronUp size={20} className="text-purple-600" />
                              ) : (
                                <ChevronDown size={20} className="text-gray-600" />
                              )}
                              <div className="text-left">
                                <h3 className="font-semibold text-gray-900">
                                  Sección {section.id}: {section.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {section.lessons} lecciones • {section.duration}
                                </p>
                              </div>
                            </div>
                          </button>

                          {expandedSections.includes(index) && (
                            <div className="bg-white">
                              {section.lectures.map(lecture => (
                                <div
                                  key={lecture.id}
                                  className="flex items-center justify-between p-4 border-t border-gray-100 hover:bg-purple-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {getLectureIcon(lecture.type)}
                                    <span className="text-gray-700">{lecture.title}</span>
                                    {lecture.preview && (
                                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                        Vista previa
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">{lecture.duration}</span>
                                    {!lecture.preview && !isEnrolled && (
                                      <Lock size={16} className="text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Instructor Tab */}
                  {activeTab === 'instructor' && (
                    <div>
                      <div className="flex items-start gap-6 mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-5xl flex-shrink-0">
                          {course.instructor.avatar}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">{course.instructor.name}</h2>
                          <p className="text-gray-600 mb-4">{course.instructor.title}</p>
                          <div className="flex gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Star className="text-yellow-500 fill-yellow-500" size={16} />
                              <span>{course.instructor.rating} rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={16} />
                              <span>{course.instructor.students.toLocaleString()} estudiantes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen size={16} />
                              <span>{course.instructor.courses} cursos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-8 mb-8">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-gray-900 mb-2">{course.rating}</div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                className={i < Math.floor(course.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">{course.reviews.toLocaleString()} valoraciones</div>
                        </div>
                      </div>

                      {course.reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                              {review.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{review.user}</h4>
                                  <p className="text-sm text-gray-600">{review.date}</p>
                                </div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              <button className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                                Útil ({review.helpful})
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Related Courses */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cursos Relacionados</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          👼
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                            Curso Relacionado {i}
                          </h4>
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="text-yellow-500 fill-yellow-500" size={12} />
                            <span className="text-xs text-gray-600">4.8</span>
                          </div>
                          <p className="text-sm font-bold text-purple-600">$39.99</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;

