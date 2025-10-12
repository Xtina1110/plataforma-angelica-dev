import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import {
  Home, Heart, Headphones, Zap, BookOpen, GraduationCap,
  MessageSquare, Mic, ShoppingCart, LogOut, User, Menu, X,
  Calendar, Clock, MapPin, Users, Star, ChevronRight, Volume2, VolumeX, Video,
  Search, Bell, Loader2, Award
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio } from '../contexts/AudioContext';
import { useIsMobile } from '../hooks/use-mobile';
import LanguageSelector from './LanguageSelector';

import TiradaAngelical from './TiradaAngelical';
import CanalizacionesSonoterapia from './CanalizacionesSonoterapia';
import TerapiasLimpiezas from './TerapiasLimpiezas';
import AcademiaAngelical from './AcademiaAngelical';

import TiendaAngelical from './TiendaAngelical';
import DashboardHeader from './DashboardHeader';
import FooterLegal from './FooterLegal';
import FilterBar from './FilterBar';
import MensajeDelDia from './MensajeDelDia';
import AudioButton from './AudioButton';

// Importar componentes premium
import GlobalSearchModal from './GlobalSearchModal';
import EventCalendar from './EventCalendar';
import ProgressCharts from './ProgressCharts';
import NotificationsCenter from './NotificationsCenter';
import AchievementsModal from './AchievementsModal';
import ProfileSettings from './ProfileSettings';

// Importar servicios
import { 
  loadUserData, 
  loadUserActivity, 
  updateLastLogin,
  loadCartCount,
  loadUnreadNotifications,
  loadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/userDataService';
import { getDailyMessage, getArchangelInfo } from '../services/aiMessageService';

// Importar headers
import { 
  AperturaAngelicaHeader, 
  SonoterapiaHeader, 
  TerapiasHeader, 
  AcademiaHeader, 
  TiendaHeader, 
  BlogHeader,
  MensajeHeader,
  EventosHeader 
} from './headers';

// Importar componente de eventos
import EventosModernos from './EventosModernos';
import EventCarouselIndicators from './EventCarouselIndicators';

import logo from '../assets/Logosinfondo.png';
import fondoMarmoleado from '../assets/Fondomarmoleado.jpg';
import iconoAngelDashboard from '../assets/IconoDashboard.png';
import iconNivel from '../assets/IconoNivel.png';
import iconPuntos from '../assets/IconoPuntos.png';
import iconDias from '../assets/IconoDias.png';
import iconSonoterapia from '../assets/IconoSonoterapia.png';
import iconCanalizaciones from '../assets/IconoCanalizaciones.png';
import iconCursos from '../assets/IconoCursos.png';

import './Dashboard.css';
import './EventosModernos.css';
import './Dashboard-sidebar-colors.css';

const Dashboard = ({ user, onLogout, initialSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLanguage, getCurrentTranslation } = useLanguage();
  const { isPlaying, toggleAudio, changeSectionMusic } = useAudio();
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);
  
  // Estados específicos para blog
  const [blogFilter, setBlogFilter] = useState('todos');
  const [blogArticles, setBlogArticles] = useState([]);
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);

  // Efecto para manejar navegación desde rutas externas y URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sectionParam = urlParams.get('section');

    if (sectionParam) {
      setActiveSection(sectionParam);
    } else if (location.state?.section) {
      setActiveSection(location.state.section);
    } else if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [location.search, location.state, initialSection]);

  useEffect(() => {
    changeSectionMusic(activeSection);
  }, [activeSection, changeSectionMusic]);

  useEffect(() => {
    const accentColors = {
      home: '#6E3CBC',
      tirada: '#00BCD4',
      canalizaciones: '#9C27B0',
      terapias: '#E91E63',
      academia: '#4CAF50',
      mensaje: '#B388FF',
      eventos: '#3F51B5',
      blog: '#FFC107',
      tienda: '#FF9800'
    };
    const color = accentColors[activeSection] || '#6E3CBC';
    document.body.style.setProperty('--app-accent', color);
  }, [activeSection]);

  // Hooks para responsividad y multi-idioma
  const isMobile = useIsMobile();
  const translations = getCurrentTranslation();
  const t = translations.dashboard;
  
  // Ref para el plugin de autoplay del carousel
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  
  // Ref para el carrusel de eventos
  const eventCarouselRef = useRef(null);

  // Estados para los filtros de cada aplicación
  const [filters, setFilters] = useState({});

  // Función para manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Estado del carrito de compra global
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Función para agregar items al carrito
  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id && cartItem.type === item.type);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id && cartItem.type === item.type
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    
    // Actualizar total
    updateCartTotal();
  };

  // Función para remover items del carrito
  const removeFromCart = (itemId, itemType) => {
    setCartItems(cartItems.filter(item => !(item.id === itemId && item.type === itemType)));
    updateCartTotal();
  };

  // Función para actualizar cantidad
  const updateQuantity = (itemId, itemType, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, itemType);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === itemId && item.type === itemType
        ? { ...item, quantity: newQuantity }
        : item
    ));
    updateCartTotal();
  };

  // Función para actualizar el total del carrito
  const updateCartTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  };

  // Actualizar total cuando cambie cartItems
  React.useEffect(() => {
    updateCartTotal();
  }, [cartItems]);

  // Estados para datos del usuario desde Supabase
  const [userData, setUserData] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [dailyMessage, setDailyMessage] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(true);
  
  // Estados para componentes premium
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState(new Date());

  // Debug: Log user cuando cambie
  useEffect(() => {
    console.log('Dashboard - User object:', user);
    console.log('Dashboard - User email:', user?.email);
    console.log('Dashboard - User metadata:', user?.user_metadata);
  }, [user]);

  // Cargar todos los datos del usuario desde Supabase
  useEffect(() => {
    const loadAllUserData = async () => {
      if (!user) {
        setLoadingUserData(false);
        return;
      }

      setLoadingUserData(true);
      console.log('Dashboard - Loading all data for user:', user.id);

      try {
        // Cargar datos del perfil
        const profileResult = await loadUserData(user.id);
        if (profileResult.success && profileResult.data) {
          setUserData(profileResult.data);
        } else {
          // Fallback a datos básicos - usar nombre del email si no hay datos
          const emailName = user.email ? user.email.split('@')[0] : 'Usuario';
          const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[^a-zA-Z]/g, '');
          
          setUserData({
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || displayName,
            last_name: user.user_metadata?.last_name || '',
            full_name: user.user_metadata?.full_name || displayName,
            spiritual_level: 'Iniciado',
            light_points: 0,
            total_sessions: 0
          });
        }

        // Cargar actividad del usuario (racha de días)
        const activityResult = await loadUserActivity(user.id);
        if (activityResult.success) {
          setUserActivity(activityResult.data);
        }

        // Actualizar último login
        await updateLastLogin(user.id);

        // Cargar mensaje del día
        const messageResult = await getDailyMessage(user.id, profileResult.data);
        if (messageResult.success) {
          setDailyMessage(messageResult.data);
        }

        // Cargar contador del carrito
        const cartCountResult = await loadCartCount(user.id);
        setCartCount(cartCountResult);

        // Cargar notificaciones no leídas
        const unreadCount = await loadUnreadNotifications(user.id);
        setUnreadNotifications(unreadCount);

        // Cargar notificaciones
        const notificationsList = await loadNotifications(user.id, 10);
        setNotifications(notificationsList);

      } catch (error) {
        console.error('Dashboard - Error loading user data:', error);
      } finally {
        setLoadingUserData(false);
      }
    };

    loadAllUserData();
  }, [user]);

  // Efecto para cargar datos del blog cuando sea necesario
  useEffect(() => {
    const loadBlogData = async () => {
      if (activeSection === 'blog') {
        setBlogLoading(true);
        try {
          const { data: articles } = await supabase
            .from('articulos_blog')
            .select('*')
            .order('fecha', { ascending: false });
          
          const { data: episodes } = await supabase
            .from('episodios_podcast')
            .select('*')
            .order('fecha_publicacion', { ascending: false });
            
          setBlogArticles(articles || []);
          setPodcastEpisodes(episodes || []);
        } catch (error) {
          console.error('Error cargando contenido del blog:', error);
          setBlogArticles([]);
          setPodcastEpisodes([]);
        }
        setBlogLoading(false);
      }
    };

    loadBlogData();
  }, [activeSection]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    });
  };

  const renderBlogContent = () => {
    if (blogLoading) {
      return (
        <div className="blog-loading">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="blog-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-meta"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const contenidosBase = [
      ...(blogFilter !== 'podcast' ? blogArticles.map(a => ({ tipo: 'blog', ...a })) : []),
      ...(blogFilter !== 'blog' ? podcastEpisodes.map(e => ({ tipo: 'podcast', ...e })) : [])
    ].sort((a, b) => new Date(b.fecha || b.fecha_publicacion) - new Date(a.fecha || a.fecha_publicacion));

    if (!contenidosBase.length) {
      return (
        <div className="blog-empty">
          <div className="empty-icon">🕊️</div>
          <h3>Sin contenido</h3>
          <p>No hay publicaciones angelicales aún.</p>
        </div>
      );
    }

    return contenidosBase.map((item) => (
      <div key={`${item.tipo}-${item.id}`} className="blog-card-dashboard">
        <div className="blog-card-image">
          <img 
            src={item.imagen || '/assets/angel-music-background.jpg'} 
            alt={item.titulo}
            onError={(e) => {
              e.target.src = '/assets/angel-music-background.jpg';
            }}
          />
        </div>
        <div className="blog-card-content">
          <h3 className="blog-card-title">{item.titulo}</h3>
          <p className="blog-card-text">
            {item.descripcion || item.resumen?.substring(0, 100) + '...'}
          </p>
          <div className="blog-card-meta">
            <span className="blog-date">
              {formatearFecha(item.fecha || item.fecha_publicacion)}
            </span>
            <span className={`blog-badge ${item.tipo}`}>
              {item.tipo === 'blog' ? 'Artículo' : 'Podcast'}
            </span>
          </div>
          <button 
            className="blog-button"
            onClick={() => navigate(`/${item.tipo === 'blog' ? 'blog/articulo' : 'podcast/episodio'}/${item.id}`)}
          >
            {item.tipo === 'blog' ? 'Leer más' : 'Escuchar'}
          </button>
        </div>
      </div>
    ));
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.nombre || user?.user_metadata?.name || user?.user_metadata?.full_name) {
      return user.user_metadata.nombre || user.user_metadata.name || user.user_metadata.full_name;
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[^a-zA-Z]/g, '');
    }
    return 'Usuario';
  };


  // Datos de eventos del angelólogo - Eventos destacados del mes (5-10 eventos)
  const [eventos] = useState([
    {
      id: 1,
      titulo: "Meditación Grupal con Arcángeles",
      fecha: "2025-01-15",
      hora: "19:00",
      duracion: "90 min",
      modalidad: "Presencial",
      ubicacion: "Centro Angelical Madrid",
      precio: "25€",
      cupos: 15,
      inscritos: 8,
      descripcion: "Sesión de meditación guiada para conectar con la energía de los arcángeles",
      instructor: "Juan Carlos Ávila",
      categoria: "Meditación",
      inscrito: false,
      imagen: "/lovable-uploads/47ef7f54-3afd-48c7-b3b4-9234a0e15f40.png"
    },
    {
      id: 2,
      titulo: "Taller de Cartas Angelicales",
      fecha: "2025-01-18",
      hora: "16:30",
      duracion: "3 horas",
      modalidad: "Online",
      ubicacion: "Zoom",
      precio: "45€",
      cupos: 25,
      inscritos: 18,
      descripcion: "Aprende a interpretar las cartas angelicales y conectar con tus guías espirituales",
      instructor: "Juan Carlos Ávila",
      categoria: "Formación",
      inscrito: true,
      imagen: "/lovable-uploads/41785f1b-8058-4018-b1dd-7e0f8aad7c1a.png"
    },
    {
      id: 3,
      titulo: "Sanación con Frecuencias Angelicales",
      fecha: "2025-01-22",
      hora: "20:00",
      duracion: "60 min",
      modalidad: "Online",
      ubicacion: "Plataforma Angelical",
      precio: "20€",
      cupos: 50,
      inscritos: 32,
      descripcion: "Sesión de sanación utilizando frecuencias sagradas y energía angelical",
      instructor: "Juan Carlos Ávila",
      categoria: "Sanación",
      inscrito: false
    },
    {
      id: 4,
      titulo: "Círculo de Canalización Angelical",
      fecha: "2025-01-25",
      hora: "18:00",
      duracion: "2 horas",
      modalidad: "Presencial",
      ubicacion: "Centro Angelical Barcelona",
      precio: "35€",
      cupos: 12,
      inscritos: 12,
      descripcion: "Círculo íntimo para recibir mensajes canalizados de los ángeles",
      instructor: "Juan Carlos Ávila",
      categoria: "Canalización",
      inscrito: true,
      imagen: "/lovable-uploads/60b720c5-213f-4fda-a0a6-d993b76ae9dd.png"
    },
    {
      id: 5,
      titulo: "Retiro Espiritual de Fin de Semana",
      fecha: "2025-01-28",
      hora: "09:00",
      duracion: "2 días",
      modalidad: "Presencial",
      ubicacion: "Casa Rural Espiritual",
      precio: "150€",
      cupos: 20,
      inscritos: 5,
      descripcion: "Retiro completo de conexión angelical en la naturaleza con múltiples actividades",
      instructor: "Juan Carlos Ávila",
      categoria: "Retiro",
      inscrito: false,
      imagen: "/lovable-uploads/33d96817-de42-465c-8058-0b3b7487524f.png"
    },
    {
      id: 6,
      titulo: "Masterclass: Comunicación Angelical",
      fecha: "2025-02-02",
      hora: "19:30",
      duracion: "2.5 horas",
      modalidad: "Online",
      ubicacion: "Zoom Premium",
      precio: "65€",
      cupos: 100,
      inscritos: 45,
      descripcion: "Aprende técnicas avanzadas para comunicarte directamente con tus ángeles guardianes",
      instructor: "Juan Carlos Ávila",
      categoria: "Masterclass",
      inscrito: false,
      imagen: "/lovable-uploads/deb55c40-df77-4638-80ca-e9642a28e6d4.png"
    },
    {
      id: 7,
      titulo: "Sesión de Sanación Grupal",
      fecha: "2025-02-05",
      hora: "20:30",
      duracion: "90 min",
      modalidad: "Online",
      ubicacion: "Sala Virtual",
      precio: "30€",
      cupos: 30,
      inscritos: 22,
      descripcion: "Sanación energética grupal con canalizaciones personalizadas para cada participante",
      instructor: "Juan Carlos Ávila",
      categoria: "Sanación",
      inscrito: true,
      imagen: "/lovable-uploads/0e4dc951-2dd5-421e-a75d-d42306297cb8.png"
    }
  ]);

  const [eventosInscritos, setEventosInscritos] = useState(
    eventos.filter(evento => evento.inscrito).map(evento => evento.id)
  );

  const toggleInscripcion = (eventoId) => {
    const evento = eventos.find(e => e.id === eventoId);
    
    setEventosInscritos(prev => {
      if (prev.includes(eventoId)) {
        // Si ya está inscrito, lo cancelamos y removemos del carrito
        removeFromCart(eventoId, 'evento');
        return prev.filter(id => id !== eventoId);
      } else {
        // Si no está inscrito, lo inscribimos y agregamos al carrito
        if (evento) {
          const cartItem = {
            id: evento.id,
            type: 'evento',
            name: evento.titulo,
            price: parseFloat(evento.precio.replace('$', '').replace(',', '')),
            image: evento.imagen,
            category: 'Eventos'
          };
          addToCart(cartItem);
        }
        return [...prev, eventoId];
      }
    });
  };

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  // Función para manejar la navegación
  const handleMenuNavigation = (sectionId) => {
    if (sectionId === 'blog') {
      navigate('/podcast-blog');
      return;
    }
    if (sectionId === 'reservas') {
      navigate('/reservas');
      return;
    }
    if (sectionId === 'videollamada') {
      navigate('/consulta-online');
      return;
    }
    setActiveSection(sectionId);
  };

  const menuItems = [
    { id: 'home', icon: '/iconos-apps/icono-3d-inicio.png', label: t.home, color: '#6E3CBC' },
    { id: 'tirada', icon: '/iconos-apps/icono-3d-apertura.png', label: t.angelicReading, color: '#00BCD4' },
    { id: 'canalizaciones', icon: '/iconos-apps/icono-3d-sonoterapia.png', label: t.soundTherapy, color: '#9C27B0' },
    { id: 'terapias', icon: '/iconos-apps/icono-3d-terapias.png', label: t.therapies, color: '#E91E63' },
    { id: 'academia', icon: '/iconos-apps/icono-3d-academia.png', label: t.academy, color: '#4CAF50' },
    { id: 'mensaje', icon: '/iconos-apps/icono-3d-mensaje.png', label: t.dailyMessage, color: '#B388FF' },
    { id: 'eventos', icon: '/iconos-apps/icono-3d-eventos.png', label: 'Eventos Angelicales', color: '#3F51B5' },
    { id: 'blog', icon: '/iconos-apps/icono-3d-blog.png', label: t.blogPodcast, color: '#FFC107' },
    { id: 'tienda', icon: '/iconos-apps/icono-3d-tienda.png', label: t.store, color: '#FF9800' },
  ];

  const renderCart = () => (
    <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>{t.cart}</h2>
          <button onClick={() => setShowCart(false)} className="close-cart">
            <X size={24} />
          </button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={48} />
              <p>{t.emptyCart}</p>
              <span>{t.addProducts}</span>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={`${item.type}-${item.id}-${index}`} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-type">{item.type}</p>
                    <p className="cart-item-description">{item.description}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-item-price">
                      <span className="unit-price">{item.price}€ c/u</span>
                      <span className="total-price">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.id, item.type)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="total-label">{t.total}: </span>
              <span className="total-amount">{cartTotal.toFixed(2)}€</span>
            </div>
            <div className="cart-actions">
              <button className="btn-clear-cart" onClick={() => setCartItems([])}>
                {t.clearCart}
              </button>
              <button className="btn-checkout">
                {t.proceedPayment}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>{t.settings}</h2>
          <button onClick={() => setShowSettings(false)} className="close-settings">
            <X size={24} />
          </button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3>{t.personalInfo}</h3>
            <div className="settings-grid">
              <div className="setting-field">
                <label>{t.name}</label>
                <input 
                  type="text" 
                  value={userData.nombre}
                  onChange={(e) => updateUserData({ nombre: e.target.value })}
                />
              </div>
              <div className="setting-field">
                <label>{t.lastName}</label>
                <input 
                  type="text" 
                  value={userData.apellido}
                  onChange={(e) => updateUserData({ apellido: e.target.value })}
                />
              </div>
              <div className="setting-field">
                <label>{t.email}</label>
                <input 
                  type="email" 
                  value={userData.email}
                  onChange={(e) => updateUserData({ email: e.target.value })}
                />
              </div>
              <div className="setting-field">
                <label>{t.phone}</label>
                <input 
                  type="tel" 
                  value={userData.telefono}
                  onChange={(e) => updateUserData({ telefono: e.target.value })}
                />
              </div>
              <div className="setting-field">
                <label>{t.birthDate}</label>
                <input 
                  type="date" 
                  value={userData.fechaNacimiento}
                  onChange={(e) => updateUserData({ fechaNacimiento: e.target.value })}
                />
              </div>
              <div className="setting-field">
                <label>{t.country}</label>
                <input 
                  type="text" 
                  value={userData.pais}
                  onChange={(e) => updateUserData({ pais: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>{t.platformPrefs}</h3>
            <div className="settings-grid">
              <div className="setting-field">
                <label>{t.language}</label>
                <select 
                  value={userData.idioma}
                  onChange={(e) => updateUserData({ idioma: e.target.value })}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div className="setting-toggle">
                <label>
                  <input 
                    type="checkbox" 
                    checked={userData.notificaciones}
                    onChange={(e) => updateUserData({ notificaciones: e.target.checked })}
                  />
                  <span>{t.notifications}</span>
                </label>
              </div>
              <div className="setting-toggle">
                <label>
                  <input 
                    type="checkbox" 
                    checked={userData.emailMarketing}
                    onChange={(e) => updateUserData({ emailMarketing: e.target.checked })}
                  />
                  <span>{t.emailMarketing}</span>
                </label>
              </div>
              <div className="setting-toggle">
                <label>
                  <input 
                    type="checkbox" 
                    checked={userData.modoOscuro}
                    onChange={(e) => updateUserData({ modoOscuro: e.target.checked })}
                  />
                  <span>{t.darkMode}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-footer">
          <button onClick={() => setShowSettings(false)} className="btn-guardar">
            {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );


  // Estado para modal de evento seleccionado
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const renderCalendarioEventos = () => (
    <div className="eventos-carousel-container">
      {/* Título fuera del recuadro con estilo dashboard */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        padding: '0 20px'
      }}>
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #6a0dad 50%, transparent 100%)',
          flex: 1,
          marginRight: '20px'
        }}></div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #6a0dad 0%, #8a2be2 50%, #9370db 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          margin: 0,
          fontFamily: 'Poppins, sans-serif',
          letterSpacing: '2px',
          textShadow: '0 4px 8px rgba(106, 13, 173, 0.2)',
          position: 'relative'
        }}>
          Próximos Eventos
        </h1>
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #6a0dad 50%, transparent 100%)',
          flex: 1,
          marginLeft: '20px'
        }}></div>
      </div>
      
      {/* Calendario de eventos del mes */}
      <div className="mb-6">
        <EventCalendar 
          events={eventos}
          onDateSelect={(date) => {
            // Buscar evento en esa fecha
            const eventoIndex = eventos.findIndex(e => {
              const eventDate = new Date(e.fecha);
              return eventDate.toDateString() === date.toDateString();
            });
            
            if (eventoIndex !== -1 && eventCarouselRef.current) {
              // Scroll al evento correspondiente
              const carouselContent = eventCarouselRef.current.querySelector('.eventos-content');
              if (carouselContent) {
                const slideWidth = eventCarouselRef.current.offsetWidth;
                carouselContent.scrollTo({
                  left: slideWidth * eventoIndex,
                  behavior: 'smooth'
                });
              }
            }
          }}
        />
      </div>
      
      {/* Carrusel horizontal de eventos con navegación manual */}
      <div ref={eventCarouselRef} className="eventos-carousel-horizontal">
        <Carousel 
          className="carousel-eventos-manual"
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="eventos-content">
            {eventos.map((evento, index) => {
              const estaInscrito = eventosInscritos.includes(evento.id);
              const fechaEvento = new Date(evento.fecha);
              
              // Diferentes imágenes para cada evento
              const imagenesEventos = [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop&crop=center', // Montañas/paisaje
                'https://images.unsplash.com/photo-1518796745430-c6d5ac5cc2bf?w=500&h=400&fit=crop&crop=center', // Cartas/místico
                'https://images.unsplash.com/photo-1528319725582-ddc096101511?w=500&h=400&fit=crop&crop=center', // Frecuencias/sonido
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop&crop=center', // Círculo/meditación
                'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&h=400&fit=crop&crop=center', // Retiro/naturaleza
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop&crop=center', // Masterclass/comunicación
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop&crop=center'  // Sanación grupal
              ];
              
              return (
                <CarouselItem key={evento.id} className="carousel-item-evento">
                  <div className="evento-card-horizontal">
                    <div className="evento-imagen-container-horizontal">
                      <img 
                        src={evento.imagen || imagenesEventos[index % imagenesEventos.length]}
                        alt={evento.titulo}
                        className="evento-imagen"
                      />
                      
                      {/* Fecha en esquina superior izquierda */}
                      <div className="evento-fecha-badge">
                        <div className="dia">{fechaEvento.getDate()}</div>
                        <div className="mes">{fechaEvento.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}</div>
                      </div>
                      
                      {/* Estado de inscripción en esquina superior derecha */}
                      <div className={`evento-estado-badge ${estaInscrito ? 'inscrito' : 'disponible'}`}>
                        {estaInscrito ? 'INSCRITO' : 'DISPONIBLE'}
                      </div>
                      
                      {/* Título superpuesto */}
                      <div className="evento-titulo-superpuesto">
                        <h3>{evento.titulo}</h3>
                      </div>

                      {/* Hover información completa */}
                      <div className="evento-hover-info">
                        <div className="hover-content">
                          <div className="hover-time">
                            <Clock size={16} />
                            <span>{evento.hora} - {evento.duracion}</span>
                          </div>
                          <div className="hover-location">
                            <MapPin size={16} />
                            <span>{evento.ubicacion}</span>
                          </div>
                          <p className="hover-description">{evento.descripcion}</p>
                          <div className="hover-instructor">
                            <User size={16} />
                            <span>{evento.instructor}</span>
                          </div>
                            <div className="hover-footer-stacked">
                              <div className="hover-precio-linea">
                                <span className="hover-precio">Precio: {evento.precio}</span>
                              </div>
                              <div className="hover-boton-linea">
                                {eventosInscritos.includes(evento.id) ? (
                                  <button 
                                    className="hover-btn-inscribir"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleInscripcion(evento.id);
                                    }}
                                    style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
                                  >
                                    ✓ Inscrito - Cancelar
                                  </button>
                                ) : (
                                  <button 
                                    className="hover-btn-inscribir"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (evento.inscritos < evento.cupos) {
                                        toggleInscripcion(evento.id);
                                      }
                                    }}
                                    disabled={evento.inscritos >= evento.cupos}
                                    style={evento.inscritos >= evento.cupos ? { 
                                      background: '#ccc', 
                                      cursor: 'not-allowed' 
                                    } : {}}
                                  >
                                    {evento.inscritos >= evento.cupos ? 'Evento Completo' : 'Inscribirse Ahora'}
                                  </button>
                                )}
                                <button 
                                  className="hover-btn-detalle"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEventoSeleccionado(evento);
                                  }}
                                >
                                  Ver detalles
                                </button>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          {/* Controles de navegación personalizados */}
          <CarouselPrevious className="carousel-prev-eventos">
            <span className="sr-only">{translations.dashboard?.events?.previous || 'Anterior'}</span>
          </CarouselPrevious>
          <CarouselNext className="carousel-next-eventos">
            <span className="sr-only">{translations.dashboard?.events?.next || 'Siguiente'}</span>
          </CarouselNext>
        </Carousel>
        
      </div>
      
      {/* Indicadores dinámicos con auto-scroll */}
      <EventCarouselIndicators 
        totalSlides={eventos.length}
        containerRef={eventCarouselRef}
        autoScrollInterval={5000}
        enableAutoScroll={true}
      />
      
      {/* Espacio adicional antes del botón "Ver todos" */}
      <div style={{ height: '40px' }}></div>
      
      <button className="ver-todos-eventos-nuevo" onClick={() => setActiveSection('eventos')}>
        Ver todos los eventos
        <ChevronRight size={16} />
      </button>
      
      {/* Modal de evento seleccionado */}
      {eventoSeleccionado && (
        <div className="evento-modal-overlay" onClick={() => setEventoSeleccionado(null)}>
          <div className="evento-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="evento-modal-close" onClick={() => setEventoSeleccionado(null)}>
              <X size={24} />
            </button>
            
            <div className="evento-modal-imagen">
              <img 
                src={eventoSeleccionado.imagen || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&crop=center`}
                alt={eventoSeleccionado.titulo}
              />
            </div>
            
            <div className="evento-modal-info">
              <div className="evento-modal-header">
                <h2>{eventoSeleccionado.titulo}</h2>
                <span className={`categoria-badge-modal ${eventoSeleccionado.categoria.toLowerCase()}`}>
                  {eventoSeleccionado.categoria}
                </span>
              </div>
              
              <p className="evento-modal-descripcion">{eventoSeleccionado.descripcion}</p>
              
              <div className="evento-modal-detalles">
                <div className="detalle-modal">
                  <Calendar size={18} />
                  <span>{new Date(eventoSeleccionado.fecha).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="detalle-modal">
                  <Clock size={18} />
                  <span>{eventoSeleccionado.hora} - {eventoSeleccionado.duracion}</span>
                </div>
                <div className="detalle-modal">
                  <MapPin size={18} />
                  <span>{eventoSeleccionado.modalidad} - {eventoSeleccionado.ubicacion}</span>
                </div>
                <div className="detalle-modal">
                  <Users size={18} />
                  <span>{eventoSeleccionado.inscritos}/{eventoSeleccionado.cupos} participantes</span>
                </div>
                <div className="detalle-modal">
                  <User size={18} />
                  <span>Instructor: {eventoSeleccionado.instructor}</span>
                </div>
              </div>
              
              <div className="evento-modal-footer">
                <span className="evento-modal-precio">{eventoSeleccionado.precio}</span>
                {eventosInscritos.includes(eventoSeleccionado.id) ? (
                  <button className="btn-modal-inscrito" onClick={() => toggleInscripcion(eventoSeleccionado.id)}>
                    <Star size={16} />
                    Cancelar Inscripción
                  </button>
                ) : (
                  <button 
                    className={`btn-modal-inscribir ${eventoSeleccionado.inscritos >= eventoSeleccionado.cupos ? 'completo' : ''}`}
                    onClick={() => {
                      if (eventoSeleccionado.inscritos < eventoSeleccionado.cupos) {
                        toggleInscripcion(eventoSeleccionado.id);
                      }
                    }}
                    disabled={eventoSeleccionado.inscritos >= eventoSeleccionado.cupos}
                  >
                    {eventoSeleccionado.inscritos >= eventoSeleccionado.cupos ? 'Evento Completo' : 'Inscribirse Ahora'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Función para renderizar el header correspondiente
  const renderHeader = () => {
    const headerProps = {
      cartCount: cartItems.length,
      user: user,
      onCartClick: () => setShowCart(true),
      onProfileClick: () => setShowSettings(true),
      onLogout: async () => { await onLogout(); navigate('/inicio'); },
      onNavigateHome: () => setActiveSection('home'),
      audioActive: isPlaying,
      onToggleAudio: toggleAudio
    };

    switch (activeSection) {
      case 'tirada':
        return <AperturaAngelicaHeader {...headerProps} />;
      case 'canalizaciones':
        return null; // Header eliminado
      case 'terapias':
        return <TerapiasHeader {...headerProps} />;
      case 'academia':
        return <AcademiaHeader {...headerProps} />;
      case 'tienda':
        return <TiendaHeader {...headerProps} />;
      case 'mensaje':
        return <MensajeHeader {...headerProps} />;
      case 'eventos':
        return <EventosHeader {...headerProps} />;
      default:
        return null;
    }
  };

  const renderSection = () => {
    switch (activeSection) {
       case 'tirada': 
        return (
          <div>
            {renderHeader()}
            <TiradaAngelical onVolver={() => setActiveSection('home')} />
          </div>
        );
       case 'canalizaciones': 
        return (
          <div>
            <SonoterapiaHeader 
              onBack={() => setActiveSection('home')}
              cartItems={cartItems}
              cartTotal={cartTotal}
              onCartClick={() => setShowCart(true)}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              actionLabel="Nueva Sesión"
            />
            <FilterBar
              type="canalizaciones"
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <CanalizacionesSonoterapia onVolver={() => setActiveSection('home')} addToCart={addToCart} />
          </div>
        );
       case 'terapias': 
        return (
          <div>
            {renderHeader()}
            <FilterBar
              type="terapias"
              filters={filters}
              onFilterChange={handleFilterChange}
              onActionClick={() => console.log('Iniciar terapia')}
              actionLabel="Iniciar Terapia"
            />
            <TerapiasLimpiezas onVolver={() => setActiveSection('home')} addToCart={addToCart} />
          </div>
        );
       case 'academia': 
        return (
          <div>
            {renderHeader()}
            <FilterBar
              type="academia"
              filters={filters}
              onFilterChange={handleFilterChange}
              onActionClick={() => console.log('Ver cursos')}
              actionLabel="Ver Cursos"
            />
            <AcademiaAngelical onVolver={() => setActiveSection('home')} addToCart={addToCart} />
          </div>
        );
      case 'blog':
        return (
          <div>
            <BlogHeader 
              user={user}
              onNavigateHome={() => setActiveSection('home')}
              onLogout={onLogout}
              onCartClick={() => setShowCart(true)}
            />
            <div className="blog-podcast-content">
              <div className="filter-buttons-dashboard">
                <button 
                  className={blogFilter === 'todos' ? 'active' : ''} 
                  onClick={() => setBlogFilter('todos')}
                >
                  Todos
                </button>
                <button 
                  className={blogFilter === 'blog' ? 'active' : ''} 
                  onClick={() => setBlogFilter('blog')}
                >
                  Artículos
                </button>
                <button 
                  className={blogFilter === 'podcast' ? 'active' : ''} 
                  onClick={() => setBlogFilter('podcast')}
                >
                  Podcast
                </button>
              </div>
              <div className="blog-grid-dashboard">
                {renderBlogContent()}
              </div>
            </div>
          </div>
        );
      case 'mensaje':
        return (
          <div>
            {renderHeader()}
            <div className="mensaje-del-dia-container">
              <MensajeDelDia />
            </div>
          </div>
        );
      case 'eventos':
        return (
          <div>
            {renderHeader()}
            <FilterBar
              type="eventos"
              filters={filters}
              onFilterChange={handleFilterChange}
              onActionClick={() => console.log('Crear evento')}
              actionLabel="Crear Evento"
            />
            {/* Calendario mensual de eventos */}
            <div className="mb-8">
              <EventCalendar
                selectedDate={selectedEventDate}
                onDateSelect={setSelectedEventDate}
                events={eventos}
                userId={user?.id}
              />
            </div>
            
            <EventosModernos 
              eventos={eventos} 
              eventosInscritos={eventosInscritos} 
              onEventoClick={() => {}} 
              onToggleInscripcion={() => {}}
            />
          </div>
        );
      case 'tienda':
        return (
          <div>
            {renderHeader()}
            <FilterBar
              type="tienda"
              filters={filters}
              onFilterChange={handleFilterChange}
              onActionClick={() => console.log('Ver productos')}
              actionLabel="Ver Productos"
            />
            <TiendaAngelical onVolver={() => setActiveSection('home')} addToCart={addToCart} />
          </div>
        );
      default:
        return (
          <div className="dashboard-home">
            {/* Nuevo header personalizado para el dashboard principal */}
            <DashboardHeader 
              cartCount={cartItems.length}
              user={user}
              userData={userData}
              onCartClick={() => setShowCart(true)}
              onProfileClick={() => setProfileSettingsOpen(true)}
              onLogout={async () => { await onLogout(); navigate('/inicio'); }}
            />

            {/* Título fuera del recuadro con estilo dashboard */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              padding: '0 20px'
            }}>
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, #6a0dad 50%, transparent 100%)',
                flex: 1,
                marginRight: '20px'
              }}></div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #6a0dad 0%, #8a2be2 50%, #9370db 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                margin: 0,
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '2px',
                textShadow: '0 4px 8px rgba(106, 13, 173, 0.2)',
                position: 'relative'
              }}>
                {t.welcome} {userData?.first_name || userData?.full_name || getUserDisplayName()}
              </h1>
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, #6a0dad 50%, transparent 100%)',
                flex: 1,
                marginLeft: '20px'
              }}></div>
            </div>

            {/* Fondo angelical con transparencia */}
            <div
              className="seccion-dashboard relative overflow-hidden rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6"
              style={{
                backgroundImage: `url(${fondoMarmoleado})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Capa de transparencia */}
              <div className="absolute inset-0 bg-white/40 z-0 pointer-events-none rounded-xl" />

              {/* Imagen del ángel - MÁS GRANDE según figura 4 */}
              <div className="relative z-10">
                <img src={iconoAngelDashboard} alt="Ángel" className="imagen-angel-dashboard" />
              </div>

              {/* Tarjetas métricas con datos reales */}
              <div className="bloque-metricas relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                {loadingUserData ? (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="metrica-card animate-pulse">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-400">Cargando...</span>
                        <strong className="text-gray-400">--</strong>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="metrica-card">
                      <img src={iconNivel} alt="Nivel" />
                      <span>{t.level}</span>
                      <strong>{userData?.spiritual_level || 'Iniciado'}</strong>
                    </div>
                    <div className="metrica-card">
                      <img src={iconPuntos} alt="Puntos" />
                      <span>{t.points}</span>
                      <strong>{userData?.light_points || 0}</strong>
                    </div>
                    <div className="metrica-card">
                      <img src={iconDias} alt="Días" />
                      <span>{t.consecutiveDays}</span>
                      <strong>{userActivity?.consecutive_days || 1}</strong>
                    </div>
                    <div className="metrica-card">
                      <img src={iconSonoterapia} alt="Sesiones" />
                      <span>{t.completedSessions}</span>
                      <strong>{userData?.total_sessions || 0}</strong>
                    </div>
                    <div className="metrica-card">
                      <img src={iconCanalizaciones} alt="Canalizaciones" />
                      <span>{t.channelingsListened}</span>
                      <strong>{userData?.total_channeling_sessions || 0}</strong>
                    </div>
                    <div className="metrica-card">
                      <img src={iconCursos} alt="Cursos" />
                      <span>{t.coursesFinished}</span>
                      <strong>{userData?.courses_completed || 0}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Gráficos de Progreso */}
            {!loadingUserData && (
              <ProgressCharts userData={userData} userActivity={userActivity} />
            )}

            {/* Botón de Logros */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setAchievementsOpen(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
              >
                <Award className="w-6 h-6" />
                <span className="font-bold text-lg">Ver Mis Logros</span>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                  {userActivity?.consecutive_days || 0}
                </div>
              </button>
            </div>

            {/* Título Mensaje del Día */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              marginTop: '40px',
              padding: '0 20px'
            }}>
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, #6a0dad 50%, transparent 100%)',
                flex: 1,
                marginRight: '20px'
              }}></div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #6a0dad 0%, #8a2be2 50%, #9370db 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                margin: 0,
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '1px',
                textShadow: '0 4px 8px rgba(106, 13, 173, 0.2)',
                position: 'relative'
              }}>
                Mensaje del Día
              </h2>
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, #6a0dad 50%, transparent 100%)',
                flex: 1,
                marginLeft: '20px'
              }}></div>
            </div>

            {/* Mensaje del Día */}
            <MensajeDelDia />

            {/* Calendario de Eventos */}
            {renderCalendarioEventos()}

            {/* Título fuera del recuadro con estilo dashboard */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              padding: '0 20px'
            }}>
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, #6a0dad 50%, transparent 100%)',
                flex: 1,
                marginRight: '20px'
              }}></div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #6a0dad 0%, #8a2be2 50%, #9370db 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                margin: 0,
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '2px',
                textShadow: '0 4px 8px rgba(106, 13, 173, 0.2)',
                position: 'relative'
              }}>
                Aplicaciones Angelicas
              </h1>
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, #6a0dad 50%, transparent 100%)',
                flex: 1,
                marginLeft: '20px'
              }}></div>
            </div>
            
            <div className={`aplicaciones-grid-correcto ${isMobile ? 'mobile-grid' : ''}`}> {/* Force refresh colors fix */}
              {[
                 { id: 'tirada', icon: <Heart />, titulo: t.angelicReading, desc: 'Conecta con la sabiduría de los ángeles', disponible: true, color: '#00BFFF' },
                { id: 'canalizaciones', icon: <Headphones />, titulo: t.soundTherapy, desc: 'Frecuencias sagradas de sanación', disponible: true, color: '#9900CC' },
                { id: 'terapias', icon: <Zap />, titulo: t.therapies, desc: 'Sanación angelica profunda', disponible: true, color: '#FF1493' },
                { id: 'academia', icon: <GraduationCap />, titulo: t.academy, desc: 'Formación espiritual completa', disponible: true, color: '#00CC00' },
                { id: 'reservas', icon: <Calendar />, titulo: 'Sistema de Reservas', desc: 'Agenda tu sesión de sanación angelical', disponible: true, color: '#8B5CF6' },
                { id: 'videollamada', icon: <Video />, titulo: 'Consulta en Vivo', desc: 'Videollamadas angelicales personalizadas', disponible: true, color: '#DC143C' },
                { id: 'mensaje', icon: <MessageSquare />, titulo: t.dailyMessage, desc: 'Recibe una canalización espiritual', disponible: true, color: '#C489FF' },
                { id: 'eventos', icon: <Calendar />, titulo: 'Eventos Angelicales', desc: 'Ceremonias y encuentros espirituales', disponible: true, color: '#0000FF' },
                { id: 'blog', icon: <Mic />, titulo: t.blogPodcast, desc: 'Contenido espiritual diario', disponible: true, color: '#FFCC00' },
                { id: 'tienda', icon: <ShoppingCart />, titulo: t.store, desc: 'Cartas y recursos espirituales', disponible: false, color: '#FF6600' }
              ].map(app => (
                <div key={app.id} className="app-card-correcto">
                  {/* Header con color específico */}
                  <div className="app-header-correcto" style={{ backgroundColor: app.color }}>
                    <div className="app-icon-correcto">
                      {React.cloneElement(app.icon, { size: 24, color: 'white' })}
                    </div>
                    <div className={`app-status-badge ${app.disponible ? 'disponible' : 'proximamente'}`}>
                      {app.disponible ? 'DISPONIBLE' : 'PRÓXIMAMENTE'}
                    </div>
                  </div>
                  
                  {/* Contenido de la tarjeta */}
                  <div className="app-content-correcto">
                    <h4 className="app-title-correcto">{app.titulo}</h4>
                    <p className="app-desc-correcto">{app.desc}</p>
                    <button 
                      className="app-button-correcto"
                      onClick={() => app.disponible && handleMenuNavigation(app.id)}
                      disabled={!app.disponible}
                    >
                      Acceder
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer al final del dashboard */}
            <FooterLegal />
          </div>
        );
    }
  };

  // Atajo de teclado Ctrl+K para búsqueda
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Componentes Premium */}
      <GlobalSearchModal 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        userId={user?.id}
      />

      <NotificationsCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={() => markAllNotificationsAsRead(user?.id)}
      />

      <AchievementsModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        userId={user?.id}
      />

      <ProfileSettings
        isOpen={profileSettingsOpen}
        onClose={() => setProfileSettingsOpen(false)}
        user={user}
      />
      
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile-sidebar' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo JCA" className="sidebar-logo" />
          {!sidebarCollapsed && <h3 className="sidebar-title">{translations.title}</h3>}
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        
        <ul className="sidebar-nav">
          {menuItems.map(item => {
            return (
              <li
                key={item.id}
                onClick={() => handleMenuNavigation(item.id)}
                className={activeSection === item.id ? 'active' : ''}
                style={{
                  '--item-color': item.color,
                  '--hover-color': item.color,
                  '--active-color': item.color
                }}
              >
                <div className="nav-item-content">
                  <img src={item.icon} alt={item.label} className="nav-item-icon-3d" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
              </li>
            );
          })}
        </ul>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar" onClick={() => setShowSettings(true)}>
              <User size={20} />
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <span className="user-email">{userData?.email || user?.email || 'usuario@email.com'}</span>
                <span className="user-status">{userData?.subscription_plan || 'Free'}</span>
              </div>
            )}
          </div>
          
          {/* Botón de audio */}
          <div className="audio-button-container">
            <AudioButton 
              variant="sidebar" 
              showText={!sidebarCollapsed}
              className="w-full"
            />
          </div>
          
          {/* Botón del carrito */}
          <div className="cart-button-container">
            <button onClick={() => setShowCart(true)} className="cart-button cart-button-orange">
              <ShoppingCart size={16} />
              {!sidebarCollapsed && <span>{t.cart}</span>}
              {(cartCount > 0 || cartItems.length > 0) && (
                <span className="cart-badge">{cartCount || cartItems.length}</span>
              )}
            </button>
          </div>
          
          {/* Botón de notificaciones */}
          <div className="notifications-button-container">
            <button onClick={() => setNotificationsOpen(true)} className="cart-button cart-button-blue">
              <Bell size={16} />
              {!sidebarCollapsed && <span>Notificaciones</span>}
              {unreadNotifications > 0 && (
                <span className="cart-badge">{unreadNotifications}</span>
              )}
            </button>
          </div>
          
          {/* Botón de búsqueda */}
          <div className="search-button-container">
            <button onClick={() => setSearchOpen(true)} className="cart-button cart-button-teal" title="Buscar (Ctrl+K)">
              <Search size={16} />
              {!sidebarCollapsed && <span>Buscar</span>}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <button onClick={onLogout} className="logout-button">
              <LogOut size={16} />
              {t.logout}
            </button>
          )}
        </div>
      </aside>
      
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''} ${isMobile ? 'mobile-main' : ''}`}>
        {renderSection()}
      </main>
      
      {showSettings && renderSettings()}
      {showCart && renderCart()}
    </div>
  );
};

export default Dashboard;
