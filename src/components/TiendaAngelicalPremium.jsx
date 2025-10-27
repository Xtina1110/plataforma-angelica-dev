import React, { useState } from 'react';
import { 
  ShoppingCart, Star, Heart, Package, Sparkles, Gift, Crown, Zap,
  Search, Filter, Grid, List, BookOpen, Download, Eye, ChevronRight,
  TrendingUp, Award, Clock, Check, X, Plus, Minus, ShoppingBag
} from 'lucide-react';

const TiendaAngelicalPremium = ({ user, addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const categories = [
    { id: 'todos', name: 'Todos los Productos', icon: Package, count: 52 },
    { id: 'cristales', name: 'Cristales Angelicales', icon: Sparkles, count: 10 },
    { id: 'velas', name: 'Velas Sagradas', icon: Star, count: 8 },
    { id: 'aceites', name: 'Aceites Esenciales', icon: Heart, count: 6 },
    { id: 'inciensos', name: 'Inciensos Divinos', icon: Zap, count: 5 },
    { id: 'joyeria', name: 'Joyería Angelical', icon: Crown, count: 8 },
    { id: 'ebooks', name: 'Ebooks Espirituales', icon: BookOpen, count: 15 }
  ];

  const products = [
    // CRISTALES ANGELICALES (10 productos)
    {
      id: 1,
      name: 'Cuarzo Rosa Angelical',
      category: 'cristales',
      price: 25.99,
      originalPrice: 35.99,
      rating: 4.8,
      reviews: 124,
      image: '💎',
      description: 'Cristal de cuarzo rosa bendecido para el amor incondicional y la sanación del corazón. Ideal para meditación y conexión con el Arcángel Chamuel.',
      inStock: true,
      featured: true,
      benefits: ['Amor incondicional', 'Sanación emocional', 'Paz interior']
    },
    {
      id: 2,
      name: 'Amatista Purificadora',
      category: 'cristales',
      price: 32.00,
      originalPrice: 42.00,
      rating: 4.9,
      reviews: 156,
      image: '💜',
      description: 'Amatista de alta calidad para purificación espiritual y conexión con planos superiores. Potencia la intuición y la claridad mental.',
      inStock: true,
      featured: true,
      benefits: ['Purificación', 'Intuición', 'Protección psíquica']
    },
    {
      id: 3,
      name: 'Citrino de Abundancia',
      category: 'cristales',
      price: 28.50,
      originalPrice: 38.50,
      rating: 4.7,
      reviews: 98,
      image: '🟡',
      description: 'Citrino natural para atraer prosperidad y abundancia. Conecta con la energía del Arcángel Uriel.',
      inStock: true,
      featured: false,
      benefits: ['Abundancia', 'Prosperidad', 'Energía positiva']
    },
    {
      id: 4,
      name: 'Selenita Angelical',
      category: 'cristales',
      price: 22.00,
      originalPrice: 30.00,
      rating: 4.8,
      reviews: 87,
      image: '⚪',
      description: 'Selenita pura para limpiar y cargar otros cristales. Facilita la comunicación angelical.',
      inStock: true,
      featured: false,
      benefits: ['Limpieza energética', 'Comunicación angelical', 'Claridad']
    },
    {
      id: 5,
      name: 'Lapislázuli Celestial',
      category: 'cristales',
      price: 35.00,
      originalPrice: 45.00,
      rating: 4.9,
      reviews: 112,
      image: '🔵',
      description: 'Lapislázuli de grado premium para despertar el tercer ojo y la sabiduría interior.',
      inStock: true,
      featured: true,
      benefits: ['Sabiduría', 'Tercer ojo', 'Verdad interior']
    },
    {
      id: 6,
      name: 'Ágata Protectora',
      category: 'cristales',
      price: 18.99,
      originalPrice: 25.99,
      rating: 4.6,
      reviews: 76,
      image: '🟤',
      description: 'Ágata natural para protección y estabilidad emocional. Ideal para llevar contigo.',
      inStock: true,
      featured: false,
      benefits: ['Protección', 'Estabilidad', 'Equilibrio']
    },
    {
      id: 7,
      name: 'Turmalina Negra Guardiana',
      category: 'cristales',
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.8,
      reviews: 134,
      image: '⚫',
      description: 'Turmalina negra de alta calidad para protección contra energías negativas y radiación electromagnética.',
      inStock: true,
      featured: true,
      benefits: ['Protección máxima', 'Limpieza energética', 'Anclaje']
    },
    {
      id: 8,
      name: 'Cuarzo Transparente Maestro',
      category: 'cristales',
      price: 42.00,
      originalPrice: 55.00,
      rating: 4.9,
      reviews: 145,
      image: '💠',
      description: 'Cuarzo transparente de grado maestro para amplificar intenciones y energías. El cristal más versátil.',
      inStock: true,
      featured: true,
      benefits: ['Amplificación', 'Claridad', 'Versatilidad']
    },
    {
      id: 9,
      name: 'Jade Verde de Prosperidad',
      category: 'cristales',
      price: 38.00,
      originalPrice: 48.00,
      rating: 4.7,
      reviews: 92,
      image: '🟢',
      description: 'Jade verde auténtico para atraer buena fortuna y prosperidad. Usado tradicionalmente en rituales de abundancia.',
      inStock: true,
      featured: false,
      benefits: ['Buena fortuna', 'Prosperidad', 'Salud']
    },
    {
      id: 10,
      name: 'Cornalina Energizante',
      category: 'cristales',
      price: 24.50,
      originalPrice: 32.50,
      rating: 4.6,
      reviews: 68,
      image: '🟠',
      description: 'Cornalina vibrante para aumentar la energía vital y la creatividad. Estimula el chakra sacro.',
      inStock: true,
      featured: false,
      benefits: ['Energía vital', 'Creatividad', 'Motivación']
    },

    // VELAS SAGRADAS (8 productos)
    {
      id: 11,
      name: 'Vela de Arcángel Miguel',
      category: 'velas',
      price: 18.50,
      originalPrice: 24.99,
      rating: 4.9,
      reviews: 189,
      image: '🕯️',
      description: 'Vela consagrada al Arcángel Miguel para protección y fortaleza espiritual. Elaborada con cera de soja natural.',
      inStock: true,
      featured: true,
      benefits: ['Protección divina', 'Fortaleza', 'Coraje']
    },
    {
      id: 12,
      name: 'Vela de Arcángel Rafael',
      category: 'velas',
      price: 18.50,
      originalPrice: 24.99,
      rating: 4.8,
      reviews: 167,
      image: '🕯️',
      description: 'Vela dedicada al Arcángel Rafael para sanación física y emocional. Aroma terapéutico de eucalipto.',
      inStock: true,
      featured: true,
      benefits: ['Sanación', 'Salud', 'Bienestar']
    },
    {
      id: 13,
      name: 'Vela de Arcángel Gabriel',
      category: 'velas',
      price: 18.50,
      originalPrice: 24.99,
      rating: 4.7,
      reviews: 143,
      image: '🕯️',
      description: 'Vela del Arcángel Gabriel para claridad en la comunicación y mensajes divinos. Aroma de jazmín.',
      inStock: true,
      featured: false,
      benefits: ['Comunicación', 'Claridad', 'Mensajes divinos']
    },
    {
      id: 14,
      name: 'Vela de Arcángel Uriel',
      category: 'velas',
      price: 18.50,
      originalPrice: 24.99,
      rating: 4.8,
      reviews: 156,
      image: '🕯️',
      description: 'Vela del Arcángel Uriel para sabiduría e iluminación espiritual. Aroma de sándalo.',
      inStock: true,
      featured: false,
      benefits: ['Sabiduría', 'Iluminación', 'Conocimiento']
    },
    {
      id: 15,
      name: 'Vela de Luna Llena',
      category: 'velas',
      price: 22.00,
      originalPrice: 28.00,
      rating: 4.9,
      reviews: 198,
      image: '🌕',
      description: 'Vela especial para rituales de luna llena. Potencia manifestaciones y liberación. Aroma de lavanda.',
      inStock: true,
      featured: true,
      benefits: ['Manifestación', 'Liberación', 'Poder lunar']
    },
    {
      id: 16,
      name: 'Vela de Protección 7 Chakras',
      category: 'velas',
      price: 25.00,
      originalPrice: 32.00,
      rating: 4.8,
      reviews: 134,
      image: '🌈',
      description: 'Vela multicolor para equilibrar los 7 chakras y protección energética completa.',
      inStock: true,
      featured: true,
      benefits: ['Equilibrio chakras', 'Protección', 'Armonía']
    },
    {
      id: 17,
      name: 'Vela de Amor Incondicional',
      category: 'velas',
      price: 20.00,
      originalPrice: 26.00,
      rating: 4.7,
      reviews: 112,
      image: '💗',
      description: 'Vela rosa para atraer amor incondicional y sanar relaciones. Aroma de rosa búlgara.',
      inStock: true,
      featured: false,
      benefits: ['Amor', 'Relaciones', 'Sanación del corazón']
    },
    {
      id: 18,
      name: 'Vela de Abundancia Dorada',
      category: 'velas',
      price: 24.00,
      originalPrice: 30.00,
      rating: 4.8,
      reviews: 145,
      image: '🟡',
      description: 'Vela dorada para atraer prosperidad y abundancia en todos los aspectos. Aroma de canela.',
      inStock: true,
      featured: false,
      benefits: ['Abundancia', 'Prosperidad', 'Éxito']
    },

    // ACEITES ESENCIALES (6 productos)
    {
      id: 19,
      name: 'Aceite de Sanación Angelical',
      category: 'aceites',
      price: 32.00,
      originalPrice: 42.00,
      rating: 4.7,
      reviews: 156,
      image: '🧴',
      description: 'Mezcla sagrada de aceites esenciales para sanación energética y física. Contiene lavanda, eucalipto y menta.',
      inStock: true,
      featured: true,
      benefits: ['Sanación', 'Relajación', 'Purificación']
    },
    {
      id: 20,
      name: 'Aceite de Protección Divina',
      category: 'aceites',
      price: 35.00,
      originalPrice: 45.00,
      rating: 4.8,
      reviews: 178,
      image: '🧴',
      description: 'Aceite protector con romero, ruda y laurel. Ideal para ungir velas y crear escudos energéticos.',
      inStock: true,
      featured: true,
      benefits: ['Protección', 'Escudo energético', 'Limpieza']
    },
    {
      id: 21,
      name: 'Aceite de Abundancia',
      category: 'aceites',
      price: 38.00,
      originalPrice: 48.00,
      rating: 4.9,
      reviews: 192,
      image: '🧴',
      description: 'Aceite de atracción de prosperidad con canela, naranja y pachulí. Úsalo en rituales de abundancia.',
      inStock: true,
      featured: true,
      benefits: ['Prosperidad', 'Atracción', 'Éxito']
    },
    {
      id: 22,
      name: 'Aceite de Amor y Armonía',
      category: 'aceites',
      price: 34.00,
      originalPrice: 44.00,
      rating: 4.7,
      reviews: 134,
      image: '🧴',
      description: 'Aceite para atraer amor y armonizar relaciones. Con rosa, ylang-ylang y jazmín.',
      inStock: true,
      featured: false,
      benefits: ['Amor', 'Armonía', 'Relaciones']
    },
    {
      id: 23,
      name: 'Aceite de Claridad Mental',
      category: 'aceites',
      price: 30.00,
      originalPrice: 40.00,
      rating: 4.6,
      reviews: 98,
      image: '🧴',
      description: 'Aceite para mejorar concentración y claridad mental. Con romero, menta y limón.',
      inStock: true,
      featured: false,
      benefits: ['Claridad', 'Concentración', 'Enfoque']
    },
    {
      id: 24,
      name: 'Aceite de Conexión Angelical',
      category: 'aceites',
      price: 42.00,
      originalPrice: 55.00,
      rating: 4.9,
      reviews: 167,
      image: '🧴',
      description: 'Aceite premium para facilitar la comunicación con ángeles. Con incienso, mirra y sándalo.',
      inStock: true,
      featured: true,
      benefits: ['Conexión angelical', 'Espiritualidad', 'Meditación']
    },

    // INCIENSOS DIVINOS (5 productos)
    {
      id: 25,
      name: 'Incienso de Purificación',
      category: 'inciensos',
      price: 15.75,
      originalPrice: 20.00,
      rating: 4.6,
      reviews: 178,
      image: '🔥',
      description: 'Incienso natural de salvia blanca para limpiar energías negativas y purificar espacios.',
      inStock: true,
      featured: true,
      benefits: ['Purificación', 'Limpieza', 'Renovación']
    },
    {
      id: 26,
      name: 'Incienso de Palo Santo',
      category: 'inciensos',
      price: 18.00,
      originalPrice: 24.00,
      rating: 4.9,
      reviews: 234,
      image: '🔥',
      description: 'Palo Santo auténtico de Perú. Limpia energías y atrae buena fortuna.',
      inStock: true,
      featured: true,
      benefits: ['Limpieza profunda', 'Buena fortuna', 'Paz']
    },
    {
      id: 27,
      name: 'Incienso de Nag Champa',
      category: 'inciensos',
      price: 12.50,
      originalPrice: 16.50,
      rating: 4.7,
      reviews: 156,
      image: '🔥',
      description: 'Incienso tradicional indio para meditación y elevación espiritual.',
      inStock: true,
      featured: false,
      benefits: ['Meditación', 'Elevación', 'Paz interior']
    },
    {
      id: 28,
      name: 'Incienso de Sándalo',
      category: 'inciensos',
      price: 16.00,
      originalPrice: 21.00,
      rating: 4.8,
      reviews: 189,
      image: '🔥',
      description: 'Incienso de sándalo puro para conexión espiritual y calma mental.',
      inStock: true,
      featured: false,
      benefits: ['Conexión espiritual', 'Calma', 'Serenidad']
    },
    {
      id: 29,
      name: 'Incienso de Mirra y Copal',
      category: 'inciensos',
      price: 19.50,
      originalPrice: 25.50,
      rating: 4.8,
      reviews: 145,
      image: '🔥',
      description: 'Mezcla sagrada de mirra y copal para rituales y ceremonias espirituales.',
      inStock: true,
      featured: true,
      benefits: ['Rituales', 'Ceremonias', 'Protección']
    },

    // JOYERÍA ANGELICAL (8 productos)
    {
      id: 30,
      name: 'Collar de Amatista Angelical',
      category: 'joyeria',
      price: 65.00,
      originalPrice: 85.00,
      rating: 4.9,
      reviews: 145,
      image: '📿',
      description: 'Collar de amatista natural con símbolo angelical en plata 925. Diseño elegante y espiritual.',
      inStock: true,
      featured: true,
      benefits: ['Protección', 'Elegancia', 'Espiritualidad']
    },
    {
      id: 31,
      name: 'Pulsera de Cuarzo Rosa',
      category: 'joyeria',
      price: 42.00,
      originalPrice: 55.00,
      rating: 4.8,
      reviews: 198,
      image: '📿',
      description: 'Pulsera elástica con cuentas de cuarzo rosa natural. Atrae amor y armonía.',
      inStock: true,
      featured: true,
      benefits: ['Amor', 'Armonía', 'Belleza']
    },
    {
      id: 32,
      name: 'Anillo de Protección Angelical',
      category: 'joyeria',
      price: 58.00,
      originalPrice: 75.00,
      rating: 4.7,
      reviews: 123,
      image: '💍',
      description: 'Anillo de plata 925 con símbolo de protección angelical. Elegante y poderoso.',
      inStock: true,
      featured: false,
      benefits: ['Protección', 'Estilo', 'Poder']
    },
    {
      id: 33,
      name: 'Aretes de Ala de Ángel',
      category: 'joyeria',
      price: 38.00,
      originalPrice: 48.00,
      rating: 4.9,
      reviews: 167,
      image: '👂',
      description: 'Aretes en forma de alas de ángel en plata 925. Delicados y significativos.',
      inStock: true,
      featured: true,
      benefits: ['Belleza', 'Protección angelical', 'Elegancia']
    },
    {
      id: 34,
      name: 'Colgante de Arcángel Miguel',
      category: 'joyeria',
      price: 52.00,
      originalPrice: 68.00,
      rating: 4.8,
      reviews: 178,
      image: '📿',
      description: 'Colgante de plata con la imagen del Arcángel Miguel. Protección divina siempre contigo.',
      inStock: true,
      featured: true,
      benefits: ['Protección máxima', 'Fe', 'Fortaleza']
    },
    {
      id: 35,
      name: 'Pulsera de Chakras',
      category: 'joyeria',
      price: 45.00,
      originalPrice: 58.00,
      rating: 4.7,
      reviews: 156,
      image: '📿',
      description: 'Pulsera con 7 piedras naturales representando los chakras. Equilibrio y armonía.',
      inStock: true,
      featured: false,
      benefits: ['Equilibrio', 'Chakras', 'Energía']
    },
    {
      id: 36,
      name: 'Collar de Árbol de la Vida',
      category: 'joyeria',
      price: 48.00,
      originalPrice: 62.00,
      rating: 4.9,
      reviews: 189,
      image: '📿',
      description: 'Collar con colgante del Árbol de la Vida en plata. Símbolo de conexión y crecimiento.',
      inStock: true,
      featured: true,
      benefits: ['Conexión', 'Crecimiento', 'Vida']
    },
    {
      id: 37,
      name: 'Tobillera de Protección',
      category: 'joyeria',
      price: 35.00,
      originalPrice: 45.00,
      rating: 4.6,
      reviews: 98,
      image: '📿',
      description: 'Tobillera de plata con dijes protectores. Estilo bohemio y espiritual.',
      inStock: true,
      featured: false,
      benefits: ['Protección', 'Estilo', 'Libertad']
    },

    // EBOOKS ESPIRITUALES (15 productos)
    {
      id: 38,
      name: 'Mensajes Angelicales: Guía Completa',
      category: 'ebooks',
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.9,
      reviews: 456,
      image: '📖',
      description: 'Guía definitiva para conectar con tus ángeles guardianes y recibir mensajes divinos. 350 páginas de sabiduría angelical.',
      inStock: true,
      featured: true,
      benefits: ['Conexión angelical', 'Mensajes divinos', 'Guía práctica'],
      format: 'PDF',
      pages: 350,
      language: 'Español'
    },
    {
      id: 39,
      name: 'Tarot Angelical para Principiantes',
      category: 'ebooks',
      price: 15.99,
      originalPrice: 24.99,
      rating: 4.8,
      reviews: 389,
      image: '📖',
      description: 'Aprende a leer el tarot angelical desde cero. Incluye interpretaciones de todas las cartas y tiradas.',
      inStock: true,
      featured: true,
      benefits: ['Tarot', 'Lectura de cartas', 'Interpretación'],
      format: 'PDF',
      pages: 280,
      language: 'Español'
    },
    {
      id: 40,
      name: 'Meditaciones Angelicales: 30 Días',
      category: 'ebooks',
      price: 12.99,
      originalPrice: 19.99,
      rating: 4.9,
      reviews: 512,
      image: '📖',
      description: 'Programa de 30 días de meditaciones guiadas para conectar con diferentes arcángeles cada día.',
      inStock: true,
      featured: true,
      benefits: ['Meditación', 'Conexión diaria', 'Transformación'],
      format: 'PDF + Audio',
      pages: 180,
      language: 'Español'
    },
    {
      id: 41,
      name: 'Cristaloterapia Angelical',
      category: 'ebooks',
      price: 17.99,
      originalPrice: 26.99,
      rating: 4.7,
      reviews: 298,
      image: '📖',
      description: 'Guía completa sobre el uso de cristales en combinación con energía angelical para sanación.',
      inStock: true,
      featured: true,
      benefits: ['Cristales', 'Sanación', 'Energía'],
      format: 'PDF',
      pages: 240,
      language: 'Español'
    },
    {
      id: 42,
      name: 'Los 7 Arcángeles Principales',
      category: 'ebooks',
      price: 14.99,
      originalPrice: 22.99,
      rating: 4.8,
      reviews: 423,
      image: '📖',
      description: 'Conoce en profundidad a Miguel, Rafael, Gabriel, Uriel, Chamuel, Jophiel y Zadkiel.',
      inStock: true,
      featured: true,
      benefits: ['Arcángeles', 'Conocimiento', 'Conexión'],
      format: 'PDF',
      pages: 220,
      language: 'Español'
    },
    {
      id: 43,
      name: 'Numerología Angelical',
      category: 'ebooks',
      price: 16.99,
      originalPrice: 25.99,
      rating: 4.7,
      reviews: 267,
      image: '📖',
      description: 'Descubre el significado de los números angelicales y cómo interpretarlos en tu vida.',
      inStock: true,
      featured: false,
      benefits: ['Numerología', 'Números angelicales', 'Interpretación'],
      format: 'PDF',
      pages: 200,
      language: 'Español'
    },
    {
      id: 44,
      name: 'Protección Psíquica Angelical',
      category: 'ebooks',
      price: 18.99,
      originalPrice: 27.99,
      rating: 4.9,
      reviews: 378,
      image: '📖',
      description: 'Técnicas avanzadas de protección energética con ayuda de los ángeles.',
      inStock: true,
      featured: true,
      benefits: ['Protección', 'Seguridad energética', 'Técnicas'],
      format: 'PDF',
      pages: 260,
      language: 'Español'
    },
    {
      id: 45,
      name: 'Sanación con Ángeles',
      category: 'ebooks',
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.8,
      reviews: 445,
      image: '📖',
      description: 'Métodos de sanación física, emocional y espiritual con asistencia angelical.',
      inStock: true,
      featured: true,
      benefits: ['Sanación', 'Salud', 'Bienestar'],
      format: 'PDF',
      pages: 310,
      language: 'Español'
    },
    {
      id: 46,
      name: 'Rituales Angelicales para Cada Día',
      category: 'ebooks',
      price: 13.99,
      originalPrice: 20.99,
      rating: 4.7,
      reviews: 312,
      image: '📖',
      description: 'Rituales simples y efectivos para invocar la ayuda angelical en tu vida diaria.',
      inStock: true,
      featured: false,
      benefits: ['Rituales', 'Práctica diaria', 'Invocación'],
      format: 'PDF',
      pages: 190,
      language: 'Español'
    },
    {
      id: 47,
      name: 'Sueños y Mensajes Angelicales',
      category: 'ebooks',
      price: 15.99,
      originalPrice: 23.99,
      rating: 4.8,
      reviews: 356,
      image: '📖',
      description: 'Aprende a interpretar los mensajes que los ángeles te envían a través de los sueños.',
      inStock: true,
      featured: false,
      benefits: ['Sueños', 'Interpretación', 'Mensajes'],
      format: 'PDF',
      pages: 210,
      language: 'Español'
    },
    {
      id: 48,
      name: 'Chakras y Ángeles',
      category: 'ebooks',
      price: 17.99,
      originalPrice: 26.99,
      rating: 4.9,
      reviews: 401,
      image: '📖',
      description: 'Equilibra tus chakras con la ayuda de los ángeles. Incluye meditaciones y ejercicios.',
      inStock: true,
      featured: true,
      benefits: ['Chakras', 'Equilibrio', 'Energía'],
      format: 'PDF + Audio',
      pages: 250,
      language: 'Español'
    },
    {
      id: 49,
      name: 'Manifestación Angelical',
      category: 'ebooks',
      price: 18.99,
      originalPrice: 27.99,
      rating: 4.8,
      reviews: 423,
      image: '📖',
      description: 'Técnicas poderosas para manifestar tus deseos con la ayuda de los ángeles.',
      inStock: true,
      featured: true,
      benefits: ['Manifestación', 'Ley de atracción', 'Abundancia'],
      format: 'PDF',
      pages: 270,
      language: 'Español'
    },
    {
      id: 50,
      name: 'Ángeles de la Guarda: Tu Equipo Celestial',
      category: 'ebooks',
      price: 14.99,
      originalPrice: 21.99,
      rating: 4.7,
      reviews: 289,
      image: '📖',
      description: 'Conoce a tu ángel de la guarda y a todo tu equipo de apoyo celestial.',
      inStock: true,
      featured: false,
      benefits: ['Ángel guardián', 'Conexión personal', 'Guía'],
      format: 'PDF',
      pages: 195,
      language: 'Español'
    },
    {
      id: 51,
      name: 'Oráculo Angelical: Guía Práctica',
      category: 'ebooks',
      price: 16.99,
      originalPrice: 24.99,
      rating: 4.8,
      reviews: 367,
      image: '📖',
      description: 'Aprende a usar oráculos angelicales para recibir guía divina en tu vida.',
      inStock: true,
      featured: false,
      benefits: ['Oráculo', 'Guía divina', 'Práctica'],
      format: 'PDF',
      pages: 230,
      language: 'Español'
    },
    {
      id: 52,
      name: 'Ángeles y Abundancia',
      category: 'ebooks',
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.9,
      reviews: 478,
      image: '📖',
      description: 'Trabaja con los ángeles de la abundancia para atraer prosperidad en todas las áreas de tu vida.',
      inStock: true,
      featured: true,
      benefits: ['Abundancia', 'Prosperidad', 'Éxito'],
      format: 'PDF',
      pages: 290,
      language: 'Español'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
    alert(`${product.name} añadido al carrito!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tienda Angelical 🛍️</h1>
              <p className="text-orange-100 text-lg">Productos espirituales de alta calidad para tu camino</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{products.length}</div>
              <div className="text-orange-100">Productos Disponibles</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{categories.find(c => c.id === 'cristales')?.count || 0}</div>
              <div className="text-orange-100 text-sm">Cristales</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{categories.find(c => c.id === 'velas')?.count || 0}</div>
              <div className="text-orange-100 text-sm">Velas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{categories.find(c => c.id === 'joyeria')?.count || 0}</div>
              <div className="text-orange-100 text-sm">Joyería</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{categories.find(c => c.id === 'ebooks')?.count || 0}</div>
              <div className="text-orange-100 text-sm">Ebooks</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Categorías</span>
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-white/20'
                        : 'bg-gray-200'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Wishlist */}
              <div className="mt-8 p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <span className="font-bold text-gray-800">Lista de Deseos</span>
                </div>
                <p className="text-2xl font-bold text-pink-600">{wishlist.length}</p>
                <p className="text-sm text-gray-600">productos guardados</p>
              </div>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search and View Mode */}
            <div className="bg-white rounded-xl p-4 shadow-lg flex items-center justify-between">
              <div className="flex-1 relative mr-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-orange-300"
                >
                  {/* Product Image */}
                  <div className="relative bg-gradient-to-br from-orange-100 to-yellow-100 p-8 flex items-center justify-center">
                    <div className="text-8xl">{product.image}</div>
                    {product.featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-full text-xs font-bold flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Destacado</span>
                      </div>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-all"
                    >
                      <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
                    </button>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Agotado</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-orange-600">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                      {product.originalPrice && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Ebook specific info */}
                    {product.category === 'ebooks' && (
                      <div className="flex items-center space-x-4 mb-4 text-xs text-gray-600">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{product.pages} páginas</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{product.format}</span>
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                          product.inStock
                            ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{product.category === 'ebooks' ? 'Comprar' : 'Añadir'}</span>
                      </button>
                      <button
                        onClick={() => openProductModal(product)}
                        className="p-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600">Intenta con otra búsqueda o categoría</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">{selectedProduct.name}</h2>
                  <button onClick={() => setShowProductModal(false)}>
                    <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-12 flex items-center justify-center">
                    <div className="text-9xl">{selectedProduct.image}</div>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-gray-600">({selectedProduct.reviews} reseñas)</span>
                    </div>

                    <div className="flex items-center space-x-3 mb-6">
                      <span className="text-4xl font-bold text-orange-600">${selectedProduct.price}</span>
                      {selectedProduct.originalPrice && (
                        <>
                          <span className="text-xl text-gray-500 line-through">${selectedProduct.originalPrice}</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                            -{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{selectedProduct.description}</p>

                    {selectedProduct.benefits && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-3">Beneficios:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.benefits.map((benefit, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.category === 'ebooks' && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <h4 className="font-bold text-gray-800 mb-2">Detalles del Ebook:</h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{selectedProduct.pages} páginas</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Formato: {selectedProduct.format}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4" />
                            <span>Idioma: {selectedProduct.language}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span>Descarga instantánea</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setShowProductModal(false);
                      }}
                      disabled={!selectedProduct.inStock}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
                        selectedProduct.inStock
                          ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span>{selectedProduct.category === 'ebooks' ? 'Comprar Ahora' : 'Añadir al Carrito'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TiendaAngelicalPremium;

