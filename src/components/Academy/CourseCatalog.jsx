import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Star, Users, Clock, BookOpen, 
  Play, TrendingUp, Award, ChevronDown, X
} from 'lucide-react';
// Header is rendered by Dashboard
import '../Dashboard.css';

const CourseCatalog = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Categorías angelicales
  const categories = [
    { id: 'all', name: 'Todos los Cursos', icon: '📚', color: 'purple' },
    { id: 'angeles', name: 'Ángeles y Arcángeles', icon: '👼', color: 'blue' },
    { id: 'tarot', name: 'Tarot Angelical', icon: '🔮', color: 'indigo' },
    { id: 'cristales', name: 'Cristales y Gemas', icon: '💎', color: 'pink' },
    { id: 'meditacion', name: 'Meditación Guiada', icon: '🧘', color: 'green' },
    { id: 'reiki', name: 'Reiki Angelical', icon: '✨', color: 'yellow' },
    { id: 'numerologia', name: 'Numerología Sagrada', icon: '🔢', color: 'orange' },
    { id: 'astrologia', name: 'Astrología Espiritual', icon: '⭐', color: 'purple' },
    { id: 'chakras', name: 'Chakras y Energía', icon: '🌈', color: 'cyan' }
  ];

  const levels = [
    { id: 'all', name: 'Todos los Niveles' },
    { id: 'beginner', name: 'Principiante' },
    { id: 'intermediate', name: 'Intermedio' },
    { id: 'advanced', name: 'Avanzado' },
    { id: 'master', name: 'Maestro' }
  ];

  const priceRanges = [
    { id: 'all', name: 'Todos los Precios' },
    { id: 'free', name: 'Gratis' },
    { id: 'under50', name: 'Menos de $50' },
    { id: 'under100', name: 'Menos de $100' },
    { id: 'premium', name: 'Premium ($100+)' }
  ];

  // Cursos de ejemplo
  const sampleCourses = [
    {
      id: 1,
      title: 'Fundamentos de Comunicación Angelical',
      description: 'Aprende a conectar con tus ángeles guardianes y recibir mensajes divinos',
      category: 'angeles',
      level: 'beginner',
      price: 49.99,
      originalPrice: 79.99,
      instructor: 'María Luz Angelical',
      instructorAvatar: '👩‍🏫',
      rating: 4.8,
      reviews: 1250,
      students: 5420,
      duration: '8 horas',
      lessons: 24,
      image: '/courses/angels-basics.jpg',
      featured: true,
      bestseller: true,
      tags: ['Ángeles', 'Meditación', 'Conexión Divina']
    },
    {
      id: 2,
      title: 'Tarot Angelical Completo',
      description: 'Domina el arte del tarot angelical desde cero hasta nivel profesional',
      category: 'tarot',
      level: 'intermediate',
      price: 89.99,
      instructor: 'Carlos Vidente',
      instructorAvatar: '👨‍🏫',
      rating: 4.9,
      reviews: 980,
      students: 3200,
      duration: '12 horas',
      lessons: 36,
      image: '/courses/tarot-complete.jpg',
      featured: true,
      tags: ['Tarot', 'Lectura', 'Interpretación']
    },
    {
      id: 3,
      title: 'Cristales y Sanación Energética',
      description: 'Descubre el poder de los cristales para sanar y equilibrar tu energía',
      category: 'cristales',
      level: 'beginner',
      price: 39.99,
      instructor: 'Ana Cristal',
      instructorAvatar: '👩‍🏫',
      rating: 4.7,
      reviews: 650,
      students: 2100,
      duration: '6 horas',
      lessons: 18,
      image: '/courses/crystals.jpg',
      tags: ['Cristales', 'Sanación', 'Energía']
    },
    {
      id: 4,
      title: 'Meditación con Arcángeles',
      description: 'Meditaciones guiadas para conectar con los 7 arcángeles principales',
      category: 'meditacion',
      level: 'beginner',
      price: 0,
      instructor: 'Sofía Paz',
      instructorAvatar: '👩‍🏫',
      rating: 4.6,
      reviews: 2100,
      students: 8500,
      duration: '4 horas',
      lessons: 12,
      image: '/courses/meditation.jpg',
      free: true,
      tags: ['Meditación', 'Arcángeles', 'Gratis']
    },
    {
      id: 5,
      title: 'Reiki Angelical Nivel 1 y 2',
      description: 'Certificación profesional en Reiki Angelical con sintonizaciones',
      category: 'reiki',
      level: 'intermediate',
      price: 149.99,
      instructor: 'Dr. Miguel Sanador',
      instructorAvatar: '👨‍🏫',
      rating: 5.0,
      reviews: 450,
      students: 1200,
      duration: '16 horas',
      lessons: 48,
      image: '/courses/reiki.jpg',
      featured: true,
      certificate: true,
      tags: ['Reiki', 'Certificación', 'Sanación']
    },
    {
      id: 6,
      title: 'Numerología Angelical Avanzada',
      description: 'Interpreta los números angelicales y su significado profundo',
      category: 'numerologia',
      level: 'advanced',
      price: 69.99,
      instructor: 'Laura Números',
      instructorAvatar: '👩‍🏫',
      rating: 4.8,
      reviews: 320,
      students: 890,
      duration: '10 horas',
      lessons: 30,
      image: '/courses/numerology.jpg',
      tags: ['Numerología', 'Números', 'Interpretación']
    }
  ];

  useEffect(() => {
    setCourses(sampleCourses);
    setFilteredCourses(sampleCourses);
  }, []);

  // Filtrar y ordenar cursos
  useEffect(() => {
    let filtered = [...courses];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro de categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filtro de nivel
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Filtro de precio
    if (selectedPrice !== 'all') {
      filtered = filtered.filter(course => {
        if (selectedPrice === 'free') return course.price === 0;
        if (selectedPrice === 'under50') return course.price > 0 && course.price < 50;
        if (selectedPrice === 'under100') return course.price >= 50 && course.price < 100;
        if (selectedPrice === 'premium') return course.price >= 100;
        return true;
      });
    }

    // Ordenar
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.students - a.students);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, selectedLevel, selectedPrice, sortBy, courses]);

  const getLevelBadgeColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700 border-green-300',
      intermediate: 'bg-blue-100 text-blue-700 border-blue-300',
      advanced: 'bg-purple-100 text-purple-700 border-purple-300',
      master: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getLevelName = (level) => {
    const names = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      master: 'Maestro'
    };
    return names[level] || level;
  };

  return (
    <div className="dashboard-container">
      <main className="main-content"
        style={{
          backgroundImage: 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          overflowY: 'auto'
        }}>

        {/* Header is rendered by Dashboard */}

        <div className="p-6 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">Academia Angelical</h1>
                <p className="text-xl text-white/90 mb-4">
                  Transforma tu vida con sabiduría divina. Más de 100 cursos certificados.
                </p>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="text-white/80" size={20} />
                    <span className="text-white/90">15,000+ Estudiantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="text-white/80" size={20} />
                    <span className="text-white/90">Certificaciones Oficiales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-white/80" size={20} />
                    <span className="text-white/90">4.8 Rating Promedio</span>
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-6xl">👼</span>
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar cursos, instructores, temas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Filter size={20} />
                Filtros
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="popular">Más Populares</option>
                <option value="rating">Mejor Valorados</option>
                <option value="newest">Más Recientes</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
              </select>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nivel</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  >
                    {levels.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  >
                    {priceRanges.map(range => (
                      <option key={range.id} value={range.id}>{range.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-700">
              Mostrando <span className="font-bold text-purple-600">{filteredCourses.length}</span> cursos
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/academia/course/${course.id}`)}
              >
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-400 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">{categories.find(c => c.id === course.category)?.icon || '📚'}</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {course.bestseller && (
                      <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ⭐ Bestseller
                      </span>
                    )}
                    {course.featured && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ✨ Destacado
                      </span>
                    )}
                    {course.free && (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        🎁 Gratis
                      </span>
                    )}
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100">
                      <Play className="text-purple-600 ml-1" size={24} />
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  {/* Level Badge */}
                  <div className="mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getLevelBadgeColor(course.level)}`}>
                      {getLevelName(course.level)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{course.instructorAvatar}</span>
                    <span className="text-sm text-gray-700">{course.instructor}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500 fill-yellow-500" size={16} />
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-gray-400">({course.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{course.lessons} lecciones</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      {course.price === 0 ? (
                        <span className="text-2xl font-bold text-green-600">Gratis</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-purple-600">
                            ${course.price}
                          </span>
                          {course.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ${course.originalPrice}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-semibold">
                      Ver Curso
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-purple-600" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron cursos</h3>
              <p className="text-gray-600 mb-6">
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSelectedPrice('all');
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseCatalog;

