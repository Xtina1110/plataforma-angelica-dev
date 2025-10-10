import React, { useState } from 'react';
import { ArrowRight, Heart, Target, Sparkles, Star, Moon, Sun, Zap, Users, BookOpen, Award, Calendar, Presentation, GraduationCap } from 'lucide-react';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import useAutoScrollToContent from '../hooks/useAutoScrollToContent';
import './Dashboard.css';

const AcademiaAngelical = ({ addToCart, user, onLogout }) => {
  // Auto-scroll to main content after 5 seconds
  useAutoScrollToContent('.main-content', 5000);
  
  const [selectedType, setSelectedType] = useState('todos');

  const mainCategories = [
    {
      id: 'cursos',
      title: 'Cursos',
      count: 67,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=80&fit=crop&crop=center',
      icon: BookOpen,
      description: 'Programas completos de formación angelical'
    },
    {
      id: 'talleres',
      title: 'Talleres',
      count: 32,
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=100&h=80&fit=crop&crop=center',
      icon: Presentation,
      description: 'Experiencias prácticas intensivas'
    },
    {
      id: 'conferencias',
      title: 'Conferencias',
      count: 14,
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=100&h=80&fit=crop&crop=center',
      icon: GraduationCap,
      description: 'Charlas magistrales con expertos'
    }
  ];

  const categories = [
    {
      id: 1,
      title: 'Sanación Angelical',
      type: 'cursos',
      courses: 18,
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-pink-500 to-rose-500',
      description: 'Técnicas de sanación con energía angelical para restaurar el equilibrio físico y emocional',
      href: '#',
      students: 1250,
      rating: 4.9
    },
    {
      id: 2,
      title: 'Canalización Divina',
      type: 'talleres',
      courses: 12,
      icon: Target,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Conecta con mensajes celestiales y desarrolla tu capacidad de comunicación angelical',
      href: '#',
      students: 890,
      rating: 4.8
    },
    {
      id: 3,
      title: 'Despertar Espiritual',
      type: 'cursos',
      courses: 15,
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Eleva tu conciencia espiritual y descubre tu propósito divino en la vida',
      href: '#',
      students: 1450,
      rating: 4.9
    },
    {
      id: 4,
      title: 'Protección Energética',
      type: 'talleres',
      courses: 9,
      icon: Star,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Aprende a crear escudos de luz y protección contra energías negativas',
      href: '#',
      students: 720,
      rating: 4.7
    },
    {
      id: 5,
      title: 'Meditación Angelical',
      type: 'cursos',
      courses: 21,
      icon: Moon,
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-indigo-500 to-purple-500',
      description: 'Prácticas contemplativas sagradas para conectar con la presencia angelical',
      href: '#',
      students: 1680,
      rating: 4.9
    },
    {
      id: 6,
      title: 'Manifestación Divina',
      type: 'conferencias',
      courses: 14,
      icon: Sun,
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-amber-500 to-yellow-500',
      description: 'Co-crea con el universo y materializa tus sueños con ayuda angelical',
      href: '#',
      students: 1120,
      rating: 4.8
    },
    {
      id: 7,
      title: 'Terapias Energéticas',
      type: 'talleres',
      courses: 16,
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-emerald-500 to-teal-500',
      description: 'Equilibra tu campo energético con técnicas avanzadas de sanación',
      href: '#',
      students: 950,
      rating: 4.8
    },
    {
      id: 8,
      title: 'Numerología Angelical',
      type: 'conferencias',
      courses: 8,
      icon: Target,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-violet-500 to-purple-500',
      description: 'Descifra los números sagrados y sus mensajes angelicales para tu vida',
      href: '#',
      students: 640,
      rating: 4.6
    }
  ];

  const filteredCategories = selectedType === 'todos' 
    ? categories 
    : categories.filter(category => category.type === selectedType);

  const getTypeTitle = () => {
    switch(selectedType) {
      case 'cursos': return 'Cursos Angelicales';
      case 'talleres': return 'Talleres Prácticos';
      case 'conferencias': return 'Conferencias Magistrales';
      default: return 'Todas las Categorías';
    }
  };

  return (
    <div className="dashboard-container">
      <main className="main-content min-h-screen bg-gradient-to-b from-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
        
        {/* Sección de instrucciones */}
        <InstruccionesAngelicales 
          titulo="Academia Angelical"
          descripcion="Descubre tu propósito divino a través de nuestros programas especializados en sabiduría angelical"
          colorPrimario="purple"
          instrucciones={[
            {
              icono: BookOpen,
              titulo: "Mente Receptiva",
              descripcion: "Abre tu corazón al aprendizaje y prepárate para recibir sabiduría celestial."
            },
            {
              icono: Star,
              titulo: "Práctica Constante", 
              descripcion: "Dedica tiempo diario a los ejercicios para integrar las enseñanzas angelicales."
            },
            {
              icono: Heart,
              titulo: "Conexión Divina",
              descripcion: "Cultiva una relación personal con tus guías espirituales a través del estudio."
            }
          ]}
          llamadaAccion="Comienza tu formación"
        />

        {/* Main Categories Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Categorías Populares</h2>
            <button 
              onClick={() => setSelectedType('todos')}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1 transition-colors"
            >
              <span>Ver Todo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedType(category.id)}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedType === category.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 rounded-lg"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-1 ${
                        selectedType === category.id ? 'text-purple-700' : 'text-gray-900'
                      }`}>
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          selectedType === category.id ? 'text-purple-600' : 'text-gray-500'
                        }`}>
                          {category.count} Disponibles
                        </span>
                        <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                          selectedType === category.id ? 'text-purple-600' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered Categories Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {getTypeTitle()}
            </h2>
            <span className="text-gray-600">{filteredCategories.length} disponibles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="group">
                  <a 
                    href={category.href} 
                    className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Category Image */}
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-80`}></div>
                      
                      {/* Icon and Badge */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-800 capitalize">
                          {category.type}
                        </span>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-gray-800">{category.rating}</span>
                        </div>
                      </div>
                      
                      {/* Students Count */}
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                          <Users className="w-3 h-3 text-white" />
                          <span className="text-xs font-medium text-white">{category.students.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Category Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      
                      {/* Course Count and CTA */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-purple-600 font-medium text-sm">
                            {category.courses} Programas
                          </span>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Certificado</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      
                      {/* Botón de Inscripción */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (addToCart) {
                            const cartItem = {
                              id: category.id,
                              type: 'curso',
                              name: category.title,
                              price: 99.99, // Precio por defecto para cursos
                              image: category.image,
                              category: 'Academia Angelical'
                            };
                            addToCart(cartItem);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Inscribirse Ahora</span>
                      </button>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute top-8 right-8 animate-pulse" style={{animationDelay: '1s'}}>
              <Heart className="w-5 h-5" />
            </div>
            <div className="absolute bottom-4 left-8 animate-pulse" style={{animationDelay: '2s'}}>
              <Star className="w-4 h-4" />
            </div>
            <div className="absolute bottom-8 right-4 animate-pulse" style={{animationDelay: '0.5s'}}>
              <Target className="w-5 h-5" />
            </div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Comenzar tu Transformación Angelical?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Únete a más de 8,000 estudiantes que ya han descubierto su propósito divino a través de nuestros programas especializados
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Explorar Todos los Programas
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button className="border border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-lg flex items-center transition-all duration-300">
                <Heart className="w-5 h-5 mr-2" />
                Consulta Gratuita
              </button>
            </div>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-white border-opacity-20">
              <div>
                <div className="text-3xl font-bold mb-1">8,000+</div>
                <div className="text-sm opacity-80">Estudiantes Activos</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">113</div>
                <div className="text-sm opacity-80">Programas Disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">4.8</div>
                <div className="text-sm opacity-80">Rating Promedio</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm opacity-80">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default AcademiaAngelical;

