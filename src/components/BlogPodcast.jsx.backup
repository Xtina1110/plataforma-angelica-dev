import React, { useState, useContext, createContext, useRef, useEffect } from 'react';
import './BlogPodcast.css';
import { 
  ArrowLeft, BookOpen, Mic, Play, Pause, Volume2, Heart, Share2, Download, 
  Filter, Grid, List, Calendar, Clock, User, Tag, Eye, Bookmark,
  Maximize2, X, Settings, RotateCcw, Headphones, Youtube, Facebook, 
  Instagram, MessageCircle, Send, Star, TrendingUp, Award, Users, Sparkles
} from 'lucide-react';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import FooterLegal from './FooterLegal';

// Context para el Blog y Podcast
const BlogPodcastContext = createContext();

// Provider del contexto
export const BlogPodcastProvider = ({ children }) => {
  const [blogPodcastState, setBlogPodcastState] = useState({
    seccionActiva: null, // null, 'blog', 'podcast'
    vistaActual: 'grid', // 'grid', 'list'
    filtroActivo: 'todos',
    busqueda: '',
    favoritos: [],
    historial: [],
    configuracion: {
      autoplay: false,
      calidad: 'alta',
      notificaciones: true
    },
    // Estados específicos del podcast
    episodioReproduciendo: null,
    audioReproduciendo: false,
    volumen: 0.8,
    progreso: 0,
    // Estados específicos del blog
    articuloSeleccionado: null,
    modalExpandido: false
  });

  const updateBlogPodcastState = (updates) => {
    setBlogPodcastState(prev => ({ ...prev, ...updates }));
  };

  const agregarFavorito = (item) => {
    setBlogPodcastState(prev => ({
      ...prev,
      favoritos: [...prev.favoritos.filter(f => f.id !== item.id), item]
    }));
  };

  const quitarFavorito = (itemId) => {
    setBlogPodcastState(prev => ({
      ...prev,
      favoritos: prev.favoritos.filter(f => f.id !== itemId)
    }));
  };

  const agregarHistorial = (item) => {
    setBlogPodcastState(prev => ({
      ...prev,
      historial: [
        item,
        ...prev.historial.filter(h => h.id !== item.id).slice(0, 19)
      ]
    }));
  };

  return (
    <BlogPodcastContext.Provider value={{
      blogPodcastState,
      updateBlogPodcastState,
      agregarFavorito,
      quitarFavorito,
      agregarHistorial
    }}>
      {children}
    </BlogPodcastContext.Provider>
  );
};

// Hook para usar el contexto
const useBlogPodcast = () => {
  const context = useContext(BlogPodcastContext);
  if (!context) {
    throw new Error('useBlogPodcast must be used within a BlogPodcastProvider');
  }
  return context;
};

// Datos de ejemplo expandidos
const articulosBlog = [
  {
    id: 'conexion-angelical-diaria',
    titulo: 'Cómo Mantener una Conexión Angelical Diaria',
    categoria: 'Guías Espirituales',
    autor: 'Angélica Luz',
    fecha: '2024-12-15',
    tiempoLectura: '8 min',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    resumen: 'Descubre técnicas simples pero poderosas para mantener una comunicación constante con tus ángeles guardianes a lo largo del día.',
    contenido: `La conexión con nuestros ángeles guardianes no tiene que ser algo reservado solo para momentos especiales o rituales elaborados. De hecho, los ángeles están constantemente a nuestro lado, esperando que abramos nuestro corazón y mente para recibir su guía amorosa.

**Técnicas para la Conexión Diaria:**

1. **Oración Matutina de Gratitud**
Cada mañana, antes de levantarte de la cama, toma unos momentos para agradecer a tus ángeles por su protección durante la noche. Esta simple práctica establece una vibración de gratitud que atrae más bendiciones angelicales.

2. **Respiración Angelical**
Durante el día, cuando sientas estrés o confusión, practica la respiración angelical: inhala luz dorada por 4 segundos, mantén por 4, exhala cualquier tensión por 4. Visualiza a tus ángeles rodeándote con cada respiración.

3. **Señales y Sincronicidades**
Mantente atento a las señales que tus ángeles te envían: números repetidos, plumas que aparecen en tu camino, canciones que escuchas en el momento perfecto. Estas son formas en que los ángeles confirman su presencia.

4. **Diario Angelical**
Antes de dormir, escribe en un diario cualquier experiencia angelical del día, por pequeña que sea. Esto fortalece tu conexión y te ayuda a reconocer patrones en la comunicación angelical.

**Creando un Espacio Sagrado:**

No necesitas un altar elaborado. Un pequeño rincón con una vela blanca, un cristal de cuarzo y una imagen que te inspire es suficiente. Lo importante es la intención y el amor que pongas en ese espacio.

**Mantener la Fe:**

Recuerda que los ángeles respetan nuestro libre albedrío. No siempre recibirás respuestas inmediatas o de la forma que esperas. Confía en que están trabajando para tu mayor bien, incluso cuando no puedas verlo claramente.

La conexión angelical diaria transforma no solo tu día, sino tu vida entera. Cuando vives en constante comunicación con estos seres de luz, cada momento se vuelve una oportunidad para el crecimiento espiritual y la sanación.`,
    tags: ['conexión', 'ángeles', 'diario', 'espiritualidad', 'guía'],
    vistas: 2450,
    likes: 189,
    compartidos: 67,
    destacado: true
  },
  {
    id: 'cristales-angelicales',
    titulo: 'Los 7 Cristales Más Poderosos para la Comunicación Angelical',
    categoria: 'Herramientas Espirituales',
    autor: 'Angélica Luz',
    fecha: '2024-12-10',
    tiempoLectura: '12 min',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    resumen: 'Conoce los cristales que amplifican tu conexión con los reinos angelicales y cómo usarlos en tu práctica espiritual diaria.',
    contenido: `Los cristales han sido utilizados durante milenios como herramientas para amplificar la energía espiritual y facilitar la comunicación con los reinos superiores. Cuando se trata de conectar con los ángeles, ciertos cristales actúan como antenas que sintonizan nuestra frecuencia vibratoria con la de estos seres de luz.

**Los 7 Cristales Angelicales Esenciales:**

**1. Angelita - La Piedra de los Ángeles**
Este hermoso cristal azul claro es conocido como la piedra oficial de la comunicación angelical. Facilita el contacto con los ángeles guardianes y promueve la paz interior. Colócala bajo tu almohada para recibir mensajes angelicales en sueños.

**2. Celestita - Portal al Reino Celestial**
Con su color azul etéreo, la celestita abre canales de comunicación con los reinos superiores. Es especialmente efectiva para conectar con el Arcángel Miguel y recibir protección divina.

**3. Selenita - Purificación y Claridad**
Este cristal blanco translúcido purifica el aura y eleva la vibración del espacio. Crea una columna de luz que facilita la comunicación angelical clara y sin interferencias.

**4. Amatista - Sabiduría Espiritual**
La amatista violeta estimula el tercer ojo y la corona, facilitando la recepción de mensajes angelicales. Es perfecta para meditaciones angelicales profundas.

**5. Cuarzo Rosa - Amor Incondicional**
Este cristal rosa conecta con los ángeles del amor y la sanación emocional. Ideal para trabajar con el Arcángel Chamuel en temas del corazón.

**6. Cuarzo Transparente - Amplificador Universal**
El maestro sanador amplifica la energía de otros cristales y clarifica la comunicación angelical. Programa tu cuarzo con la intención de conectar con tus ángeles.

**7. Labradorita - Protección Psíquica**
Este cristal iridiscente protege durante la comunicación espiritual y fortalece la intuición. Perfecto para principiantes en la comunicación angelical.

**Cómo Usar los Cristales Angelicales:**

- **Meditación:** Sostén el cristal en tu mano no dominante mientras meditas
- **Rejilla Angelical:** Coloca los cristales en un círculo alrededor de tu espacio de meditación
- **Elixir de Cristal:** Carga agua con la energía del cristal (solo con cristales seguros)
- **Joyería Sagrada:** Lleva el cristal contigo como colgante o pulsera

**Limpieza y Programación:**

Antes de usar cualquier cristal, límpialo con agua corriente, humo de salvia o luz lunar. Luego, sosténlo en tus manos y programa tu intención de conectar con los ángeles.

Recuerda que los cristales son herramientas que amplifican tu propia capacidad de conexión. La verdadera magia está en tu corazón abierto y tu fe en la presencia angelical.`,
    tags: ['cristales', 'herramientas', 'meditación', 'energía', 'sanación'],
    vistas: 1890,
    likes: 156,
    compartidos: 43,
    destacado: false
  },
  {
    id: 'arcangeles-proposito',
    titulo: 'Los 4 Arcángeles que Te Ayudan a Descubrir Tu Propósito de Vida',
    categoria: 'Arcángeles',
    autor: 'Angélica Luz',
    fecha: '2024-12-05',
    tiempoLectura: '10 min',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    resumen: 'Conoce a los Arcángeles que te guían hacia tu misión divina y cómo invocar su ayuda para encontrar tu verdadero propósito.',
    contenido: `Encontrar nuestro propósito de vida es uno de los viajes más importantes que podemos emprender. Los Arcángeles, como mensajeros divinos, están aquí para guiarnos hacia nuestra misión sagrada en esta encarnación.

**Arcángel Miguel - El Guerrero de la Luz**

Miguel te ayuda a tener el valor necesario para seguir tu propósito, incluso cuando el camino parece incierto. Su espada de luz azul corta las dudas y los miedos que te impiden avanzar.

*Oración a Miguel:* "Arcángel Miguel, dame el valor para seguir mi propósito divino. Corta todas las dudas y miedos que me impiden brillar con mi luz única."

**Arcángel Gabriel - El Mensajero Divino**

Gabriel te ayuda a recibir claridad sobre tu misión y te da las palabras para expresar tu verdad. Es especialmente útil para quienes sienten que su propósito involucra comunicación o enseñanza.

*Oración a Gabriel:* "Arcángel Gabriel, ilumina mi mente con claridad sobre mi propósito. Ayúdame a comunicar mi verdad con amor y sabiduría."

**Arcángel Uriel - La Luz de Dios**

Uriel te proporciona la sabiduría para entender cómo tu propósito se conecta con el plan divino mayor. Te ayuda a ver el panorama completo de tu misión.

*Oración a Uriel:* "Arcángel Uriel, ilumina mi camino con tu sabiduría dorada. Ayúdame a entender cómo mi propósito sirve al bien mayor."

**Arcángel Raguel - La Justicia Divina**

Raguel te ayuda a alinear tu propósito con la justicia divina y a encontrar tu lugar correcto en el mundo. Te guía hacia relaciones y oportunidades que apoyan tu misión.

*Oración a Raguel:* "Arcángel Raguel, guíame hacia las personas y oportunidades que apoyan mi propósito divino. Ayúdame a encontrar mi lugar correcto en el mundo."

**Ritual para Descubrir Tu Propósito:**

1. Crea un espacio sagrado con velas de colores: azul (Miguel), blanco (Gabriel), dorado (Uriel), verde (Raguel)
2. Medita en silencio pidiendo claridad sobre tu propósito
3. Escribe en un diario cualquier insight que recibas
4. Presta atención a las señales en los próximos días

**Señales de que Estás Alineado con Tu Propósito:**

- Sientes pasión y energía por ciertas actividades
- Las oportunidades fluyen naturalmente hacia ti
- Experimentas sincronicidades frecuentes
- Sientes paz interior incluso en momentos desafiantes
- Otros se sienten inspirados por tu presencia

Recuerda que tu propósito puede evolucionar a lo largo de tu vida. Los Arcángeles están siempre disponibles para guiarte en cada etapa de tu viaje espiritual.`,
    tags: ['arcángeles', 'propósito', 'misión', 'vida', 'guía'],
    vistas: 3120,
    likes: 234,
    compartidos: 89,
    destacado: true
  }
];

const episodiosPodcast = [
  {
    id: 'meditacion-arcangel-miguel',
    titulo: 'Meditación Guiada con el Arcángel Miguel - Protección y Valor',
    categoria: 'Meditaciones',
    fecha: '2024-12-18',
    duracion: '25:30',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    descripcion: 'Una poderosa meditación guiada para conectar con el Arcángel Miguel, recibir su protección divina y desarrollar el valor interior necesario para enfrentar cualquier desafío.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    youtubeUrl: 'https://youtube.com/watch?v=ejemplo1',
    tags: ['meditación', 'miguel', 'protección', 'valor', 'guiada'],
    reproducciones: 8450,
    likes: 567,
    comentarios: 89,
    destacado: true,
    tipo: 'meditacion'
  },
  {
    id: 'entrevista-medium-angelical',
    titulo: 'Entrevista: Cómo Desarrollar tu Don de Medium Angelical',
    categoria: 'Entrevistas',
    fecha: '2024-12-15',
    duracion: '45:20',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    descripcion: 'Conversamos con María Elena, medium angelical con 20 años de experiencia, sobre cómo desarrollar y confiar en tu capacidad natural de comunicarte con los ángeles.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    youtubeUrl: 'https://youtube.com/watch?v=ejemplo2',
    tags: ['entrevista', 'medium', 'desarrollo', 'dones', 'comunicación'],
    reproducciones: 6230,
    likes: 423,
    comentarios: 156,
    destacado: false,
    tipo: 'entrevista',
    invitado: 'María Elena Rodríguez'
  },
  {
    id: 'frecuencias-angelicales-528hz',
    titulo: 'Frecuencias Angelicales 528Hz - Sanación del Corazón',
    categoria: 'Frecuencias',
    fecha: '2024-12-12',
    duracion: '60:00',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    descripcion: 'Una hora completa de frecuencias angelicales en 528Hz, conocida como la frecuencia del amor, diseñada para sanar el corazón y abrir el chakra cardíaco.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    youtubeUrl: 'https://youtube.com/watch?v=ejemplo3',
    tags: ['frecuencias', '528hz', 'sanación', 'corazón', 'chakras'],
    reproducciones: 12890,
    likes: 789,
    comentarios: 234,
    destacado: true,
    tipo: 'frecuencia'
  },
  {
    id: 'historia-aparicion-angelical',
    titulo: 'Historias Reales: Mi Primera Aparición Angelical',
    categoria: 'Testimonios',
    fecha: '2024-12-08',
    duracion: '18:45',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
    descripcion: 'Comparto mi experiencia personal de la primera vez que vi físicamente a un ángel y cómo esta experiencia transformó completamente mi vida espiritual.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    youtubeUrl: 'https://youtube.com/watch?v=ejemplo4',
    tags: ['testimonio', 'aparición', 'experiencia', 'personal', 'transformación'],
    reproducciones: 4560,
    likes: 345,
    comentarios: 78,
    destacado: false,
    tipo: 'testimonio'
  }
];

// Componente principal
const BlogPodcast = ({ onVolver }) => {
  const { 
    blogPodcastState, 
    updateBlogPodcastState, 
    agregarFavorito, 
    quitarFavorito,
    agregarHistorial 
  } = useBlogPodcast();
  
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  // Si hay una sección activa, mostrar el componente correspondiente
  if (blogPodcastState.seccionActiva === 'blog') {
    return <BlogSection onVolver={() => updateBlogPodcastState({ seccionActiva: null })} />;
  }

  if (blogPodcastState.seccionActiva === 'podcast') {
    return <PodcastSection onVolver={() => updateBlogPodcastState({ seccionActiva: null })} />;
  }

  // Pantalla principal de selección
  return (
    <div className="blog-podcast-principal">
      {/* Header */}
      <header className="header-blog-podcast">
        <div className="header-content">
          <button
            onClick={onVolver}
            className="btn-volver-blog-podcast"
          >
            <ArrowLeft className="w-5 h-5" /> 
            Volver al Dashboard
          </button>
          
          <div className="header-title-blog-podcast">
            <h1>📚 Blog & Podcast Angelical</h1>
            <p>Sabiduría, inspiración y conexión divina para tu crecimiento espiritual</p>
          </div>
          
          <div className="header-actions">
            <button className="btn-header" onClick={() => setMostrarConfiguracion(true)}>
              <Settings size={20} />
              Config
            </button>
          </div>
        </div>
      </header>

      {/* Instrucciones preparatorias */}
      <InstruccionesAngelicales
        titulo="Blog & Podcast Angelical"
        descripcion="Sumérgete en contenido angelical de alta calidad. Artículos profundos y episodios inspiradores te conectan con la sabiduría divina."
        colorPrimario="amber"
        instrucciones={[
          {
            icono: BookOpen,
            titulo: "Momento de Reflexión",
            descripcion: "Crea un espacio tranquilo para absorber profundamente el contenido angelical que vas a explorar."
          },
          {
            icono: Heart,
            titulo: "Corazón Abierto",
            descripcion: "Permite que los mensajes y enseñanzas resuenen en tu corazón con amor y comprensión."
          },
          {
            icono: Sparkles,
            titulo: "Integración Práctica",
            descripcion: "Reflexiona sobre cómo aplicar la sabiduría angelical en tu vida diaria y crecimiento espiritual."
          }
        ]}
        llamadaAccion="Explorar Contenido Angelical"
      />

      {/* Hero Section */}
      <div className="hero-blog-podcast">
        <div className="hero-content">
          <div className="hero-stats">
            <div className="stat-item">
              <BookOpen className="w-8 h-8" />
              <div>
                <span className="stat-number">{articulosBlog.length}</span>
                <span className="stat-label">Artículos</span>
              </div>
            </div>
            <div className="stat-item">
              <Mic className="w-8 h-8" />
              <div>
                <span className="stat-number">{episodiosPodcast.length}</span>
                <span className="stat-label">Episodios</span>
              </div>
            </div>
            <div className="stat-item">
              <Users className="w-8 h-8" />
              <div>
                <span className="stat-number">25K+</span>
                <span className="stat-label">Seguidores</span>
              </div>
            </div>
          </div>
          
          <h2 className="hero-titulo">Contenido Angelical de Calidad</h2>
          <p className="hero-descripcion">
            Descubre artículos profundos sobre espiritualidad y escucha episodios inspiradores 
            que te conectan con la sabiduría angelical y tu crecimiento personal.
          </p>
        </div>
      </div>

      {/* Opciones principales */}
      <div className="opciones-blog-podcast">
        {/* Blog */}
        <div 
          className="opcion-card blog-card" 
          style={{ 
            borderColor: '#DAA520',
            borderWidth: '3px'
          }}
          onClick={() => updateBlogPodcastState({ seccionActiva: 'blog' })}
        >
          <div className="card-header">
            <div className="card-icono blog-icono">
              <BookOpen className="w-12 h-12" />
            </div>
            <div className="card-badge nuevo">Actualizado</div>
          </div>
          
          <div className="card-content">
            <h3 className="card-titulo">Blog Espiritual</h3>
            <p className="card-descripcion">
              Artículos profundos sobre conexión angelical, guías espirituales, 
              herramientas de sanación y crecimiento personal.
            </p>
            
            <div className="contenido-preview">
              <h4>Últimos Artículos:</h4>
              <ul>
                {articulosBlog.slice(0, 3).map(articulo => (
                  <li key={articulo.id}>
                    <span className="preview-titulo">{articulo.titulo}</span>
                    <span className="preview-meta">{articulo.tiempoLectura} • {articulo.vistas} vistas</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card-stats">
              <div className="stat">
                <Eye className="w-4 h-4" />
                <span>50K+ lecturas</span>
              </div>
              <div className="stat">
                <Heart className="w-4 h-4" />
                <span>2.5K likes</span>
              </div>
              <div className="stat">
                <Star className="w-4 h-4" />
                <span>4.8 rating</span>
              </div>
            </div>
            
            <button className="btn-acceder blog-btn">
              <BookOpen className="w-5 h-5" />
              Explorar Artículos
            </button>
          </div>
        </div>

        {/* Podcast */}
        <div 
          className="opcion-card podcast-card"
          style={{ 
            borderColor: '#DAA520',
            borderWidth: '3px'
          }}
          onClick={() => updateBlogPodcastState({ seccionActiva: 'podcast' })}
        >
          <div className="card-header">
            <div className="card-icono podcast-icono">
              <Mic className="w-12 h-12" />
            </div>
            <div className="card-badge popular">Popular</div>
          </div>
          
          <div className="card-content">
            <h3 className="card-titulo">Podcast Angelical</h3>
            <p className="card-descripcion">
              Episodios inspiradores con meditaciones guiadas, entrevistas especiales, 
              frecuencias de sanación y testimonios reales.
            </p>
            
            <div className="contenido-preview">
              <h4>Episodios Recientes:</h4>
              <ul>
                {episodiosPodcast.slice(0, 3).map(episodio => (
                  <li key={episodio.id}>
                    <span className="preview-titulo">{episodio.titulo}</span>
                    <span className="preview-meta">{episodio.duracion} • {episodio.reproducciones} reproducciones</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card-stats">
              <div className="stat">
                <Headphones className="w-4 h-4" />
                <span>100K+ reproducciones</span>
              </div>
              <div className="stat">
                <Users className="w-4 h-4" />
                <span>15K suscriptores</span>
              </div>
              <div className="stat">
                <Star className="w-4 h-4" />
                <span>4.9 rating</span>
              </div>
            </div>
            
            <button className="btn-acceder podcast-btn">
              <Mic className="w-5 h-5" />
              Escuchar Episodios
            </button>
          </div>
        </div>
      </div>

      {/* Contenido destacado */}
      <div className="contenido-destacado">
        <h3>Contenido Destacado Esta Semana</h3>
        <div className="destacado-grid">
          {/* Artículo destacado */}
          <div className="destacado-item blog-destacado">
            <div className="destacado-imagen">
              <img src={articulosBlog[0].imagen} alt={articulosBlog[0].titulo} />
              <div className="destacado-overlay">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <div className="destacado-info">
              <span className="destacado-tipo">📚 Artículo Destacado</span>
              <h4>{articulosBlog[0].titulo}</h4>
              <p>{articulosBlog[0].resumen}</p>
              <div className="destacado-meta">
                <span>{articulosBlog[0].tiempoLectura}</span>
                <span>{articulosBlog[0].vistas} vistas</span>
              </div>
            </div>
          </div>

          {/* Episodio destacado */}
          <div className="destacado-item podcast-destacado">
            <div className="destacado-imagen">
              <img src={episodiosPodcast[0].imagen} alt={episodiosPodcast[0].titulo} />
              <div className="destacado-overlay">
                <Play className="w-8 h-8" />
              </div>
            </div>
            <div className="destacado-info">
              <span className="destacado-tipo">🎙️ Episodio Destacado</span>
              <h4>{episodiosPodcast[0].titulo}</h4>
              <p>{episodiosPodcast[0].descripcion}</p>
              <div className="destacado-meta">
                <span>{episodiosPodcast[0].duracion}</span>
                <span>{episodiosPodcast[0].reproducciones} reproducciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redes sociales */}
      <div className="redes-sociales-section">
        <div className="redes-content">
          <h3>Síguenos en Redes Sociales</h3>
          <p>Contenido diario de inspiración angelical y actualizaciones exclusivas</p>
          <div className="redes-grid">
            <a href="#" className="red-social youtube">
              <Youtube className="w-6 h-6" />
              <div>
                <span className="red-nombre">YouTube</span>
                <span className="red-seguidores">25K suscriptores</span>
              </div>
            </a>
            <a href="#" className="red-social instagram">
              <Instagram className="w-6 h-6" />
              <div>
                <span className="red-nombre">Instagram</span>
                <span className="red-seguidores">18K seguidores</span>
              </div>
            </a>
            <a href="#" className="red-social facebook">
              <Facebook className="w-6 h-6" />
              <div>
                <span className="red-nombre">Facebook</span>
                <span className="red-seguidores">12K seguidores</span>
              </div>
            </a>
            <a href="#" className="red-social telegram">
              <Send className="w-6 h-6" />
              <div>
                <span className="red-nombre">Telegram</span>
                <span className="red-seguidores">8K miembros</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Modal de configuración */}
      {mostrarConfiguracion && (
        <ModalConfiguracion onCerrar={() => setMostrarConfiguracion(false)} />
      )}

      {/* Footer */}
      <FooterLegal />
    </div>
  );
};

// Componente del Blog
const BlogSection = ({ onVolver }) => {
  const { 
    blogPodcastState, 
    updateBlogPodcastState, 
    agregarFavorito, 
    quitarFavorito,
    agregarHistorial 
  } = useBlogPodcast();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  
  const categorias = ['Todos', 'Guías Espirituales', 'Herramientas Espirituales', 'Arcángeles', 'Testimonios'];

  // Filtrar artículos
  const articulosFiltrados = articulosBlog.filter(articulo => {
    const coincideBusqueda = articulo.titulo.toLowerCase().includes(blogPodcastState.busqueda.toLowerCase()) ||
                            articulo.resumen.toLowerCase().includes(blogPodcastState.busqueda.toLowerCase()) ||
                            articulo.tags.some(tag => tag.toLowerCase().includes(blogPodcastState.busqueda.toLowerCase()));
    
    const coincideCategoria = categoriaSeleccionada === 'Todos' || articulo.categoria === categoriaSeleccionada;
    
    const coincideFiltro = blogPodcastState.filtroActivo === 'todos' ||
                          (blogPodcastState.filtroActivo === 'favoritos' && blogPodcastState.favoritos.some(f => f.id === articulo.id)) ||
                          (blogPodcastState.filtroActivo === 'destacados' && articulo.destacado);
    
    return coincideBusqueda && coincideCategoria && coincideFiltro;
  });

  const seleccionarArticulo = (articulo) => {
    updateBlogPodcastState({ articuloSeleccionado: articulo });
    agregarHistorial(articulo);
  };

  const toggleFavorito = (articulo) => {
    const esFavorito = blogPodcastState.favoritos.some(f => f.id === articulo.id);
    if (esFavorito) {
      quitarFavorito(articulo.id);
    } else {
      agregarFavorito(articulo);
    }
  };

  // Si hay un artículo seleccionado, mostrar la vista del artículo
  if (blogPodcastState.articuloSeleccionado) {
    return (
      <ArticuloView 
        articulo={blogPodcastState.articuloSeleccionado}
        onVolver={() => updateBlogPodcastState({ articuloSeleccionado: null })}
      />
    );
  }

  return (
    <div className="blog-section">
      {/* Header del Blog */}
      <div className="blog-header">
        <div className="header-content">
          <button onClick={onVolver} className="btn-volver">
            <ArrowLeft size={20} />
            Volver a Opciones
          </button>
          
          <div className="header-title">
            <h1>📚 Blog Espiritual</h1>
            <p>Artículos profundos sobre conexión angelical y crecimiento espiritual</p>
          </div>
          
          <div className="header-spacer"></div>
        </div>
      </div>

      {/* Controles - Sin búsqueda temporalmente */}
      <div className="blog-controles">        
        <div className="filtros-container">
          <select
            value={blogPodcastState.filtroActivo}
            onChange={(e) => updateBlogPodcastState({ filtroActivo: e.target.value })}
            className="filtro-select"
          >
            <option value="todos">Todos los Artículos</option>
            <option value="favoritos">Favoritos</option>
            <option value="destacados">Destacados</option>
          </select>
          
          <div className="vista-controles">
            <button
              className={`btn-vista ${blogPodcastState.vistaActual === 'grid' ? 'activo' : ''}`}
              onClick={() => updateBlogPodcastState({ vistaActual: 'grid' })}
            >
              <Grid size={20} />
            </button>
            <button
              className={`btn-vista ${blogPodcastState.vistaActual === 'list' ? 'activo' : ''}`}
              onClick={() => updateBlogPodcastState({ vistaActual: 'list' })}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="categorias-blog">
        {categorias.map(categoria => (
          <button
            key={categoria}
            className={`categoria-btn ${categoriaSeleccionada === categoria ? 'activa' : ''}`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* Grid de artículos */}
      <div className={`articulos-container vista-${blogPodcastState.vistaActual}`}>
        {articulosFiltrados.length === 0 ? (
          <div className="sin-resultados">
            <BookOpen size={64} className="sin-resultados-icono" />
            <h3>No se encontraron artículos</h3>
            <p>Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          articulosFiltrados.map((articulo) => (
            <ArticuloCard
              key={articulo.id}
              articulo={articulo}
              esFavorito={blogPodcastState.favoritos.some(f => f.id === articulo.id)}
              onSeleccionar={seleccionarArticulo}
              onToggleFavorito={toggleFavorito}
              vista={blogPodcastState.vistaActual}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Componente del Podcast
const PodcastSection = ({ onVolver }) => {
  const { 
    blogPodcastState, 
    updateBlogPodcastState, 
    agregarFavorito, 
    quitarFavorito,
    agregarHistorial 
  } = useBlogPodcast();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const audioRef = useRef(null);
  
  const categorias = ['Todos', 'Meditaciones', 'Entrevistas', 'Frecuencias', 'Testimonios'];

  // Filtrar episodios
  const episodiosFiltrados = episodiosPodcast.filter(episodio => {
    const coincideBusqueda = episodio.titulo.toLowerCase().includes(blogPodcastState.busqueda.toLowerCase()) ||
                            episodio.descripcion.toLowerCase().includes(blogPodcastState.busqueda.toLowerCase()) ||
                            episodio.tags.some(tag => tag.toLowerCase().includes(blogPodcastState.busqueda.toLowerCase()));
    
    const coincideCategoria = categoriaSeleccionada === 'Todos' || episodio.categoria === categoriaSeleccionada;
    
    const coincideFiltro = blogPodcastState.filtroActivo === 'todos' ||
                          (blogPodcastState.filtroActivo === 'favoritos' && blogPodcastState.favoritos.some(f => f.id === episodio.id)) ||
                          (blogPodcastState.filtroActivo === 'destacados' && episodio.destacado);
    
    return coincideBusqueda && coincideCategoria && coincideFiltro;
  });

  const reproducirEpisodio = (episodio) => {
    if (blogPodcastState.episodioReproduciendo?.id === episodio.id) {
      // Toggle play/pause
      const nuevoEstado = !blogPodcastState.audioReproduciendo;
      updateBlogPodcastState({ audioReproduciendo: nuevoEstado });
      
      if (audioRef.current) {
        if (nuevoEstado) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    } else {
      // Nuevo episodio
      updateBlogPodcastState({ 
        episodioReproduciendo: episodio,
        audioReproduciendo: true 
      });
      agregarHistorial(episodio);
      
      if (audioRef.current) {
        audioRef.current.src = episodio.audioUrl;
        audioRef.current.play();
      }
    }
  };

  const toggleFavorito = (episodio) => {
    const esFavorito = blogPodcastState.favoritos.some(f => f.id === episodio.id);
    if (esFavorito) {
      quitarFavorito(episodio.id);
    } else {
      agregarFavorito(episodio);
    }
  };

  return (
    <div className="podcast-section">
      <audio ref={audioRef} />
      
      {/* Header del Podcast */}
      <div className="podcast-header">
        <div className="header-content">
          <button onClick={onVolver} className="btn-volver">
            <ArrowLeft size={20} />
            Volver a Opciones
          </button>
          
          <div className="header-title">
            <h1>🎙️ Podcast Angelical</h1>
            <p>Episodios inspiradores con meditaciones y sabiduría angelical</p>
          </div>
          
          <div className="header-spacer"></div>
        </div>
      </div>

      {/* Información del canal */}
      <div className="canal-info">
        <div className="canal-content">
          <div className="canal-avatar">
            <Mic className="w-12 h-12" />
          </div>
          <div className="canal-details">
            <h2>Podcast Angélica Luz</h2>
            <p>
              Conecta con la sabiduría angelical a través de meditaciones guiadas, 
              entrevistas inspiradoras y enseñanzas espirituales profundas.
            </p>
            <div className="canal-stats">
              <span>📺 {episodiosPodcast.length} Episodios</span>
              <span>👥 15K Suscriptores</span>
              <span>⭐ 4.9/5 Calificación</span>
            </div>
          </div>
          <button className="btn-suscribir">
            <Youtube className="w-5 h-5" />
            Suscribirse
          </button>
        </div>
      </div>

      {/* Controles - Sin búsqueda temporalmente */}
      <div className="podcast-controles">        
        <div className="filtros-container">
          <select
            value={blogPodcastState.filtroActivo}
            onChange={(e) => updateBlogPodcastState({ filtroActivo: e.target.value })}
            className="filtro-select"
          >
            <option value="todos">Todos los Episodios</option>
            <option value="favoritos">Favoritos</option>
            <option value="destacados">Destacados</option>
          </select>
          
          <div className="vista-controles">
            <button
              className={`btn-vista ${blogPodcastState.vistaActual === 'grid' ? 'activo' : ''}`}
              onClick={() => updateBlogPodcastState({ vistaActual: 'grid' })}
            >
              <Grid size={20} />
            </button>
            <button
              className={`btn-vista ${blogPodcastState.vistaActual === 'list' ? 'activo' : ''}`}
              onClick={() => updateBlogPodcastState({ vistaActual: 'list' })}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="categorias-podcast">
        {categorias.map(categoria => (
          <button
            key={categoria}
            className={`categoria-btn ${categoriaSeleccionada === categoria ? 'activa' : ''}`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* Grid de episodios */}
      <div className={`episodios-container vista-${blogPodcastState.vistaActual}`}>
        {episodiosFiltrados.length === 0 ? (
          <div className="sin-resultados">
            <Mic size={64} className="sin-resultados-icono" />
            <h3>No se encontraron episodios</h3>
            <p>Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          episodiosFiltrados.map((episodio) => (
            <EpisodioCard
              key={episodio.id}
              episodio={episodio}
              esFavorito={blogPodcastState.favoritos.some(f => f.id === episodio.id)}
              estaReproduciendo={blogPodcastState.episodioReproduciendo?.id === episodio.id && blogPodcastState.audioReproduciendo}
              onReproducir={reproducirEpisodio}
              onToggleFavorito={toggleFavorito}
              vista={blogPodcastState.vistaActual}
            />
          ))
        )}
      </div>

      {/* Reproductor flotante */}
      {blogPodcastState.episodioReproduciendo && (
        <ReproductorFlotante
          episodio={blogPodcastState.episodioReproduciendo}
          estaReproduciendo={blogPodcastState.audioReproduciendo}
          onTogglePlay={() => reproducirEpisodio(blogPodcastState.episodioReproduciendo)}
          onCerrar={() => updateBlogPodcastState({ episodioReproduciendo: null, audioReproduciendo: false })}
        />
      )}
    </div>
  );
};

// Componentes auxiliares
const ArticuloCard = ({ articulo, esFavorito, onSeleccionar, onToggleFavorito, vista }) => {
  return (
    <div className={`articulo-card ${vista}`} onClick={() => onSeleccionar(articulo)}>
      <div className="articulo-imagen">
        <img src={articulo.imagen} alt={articulo.titulo} />
        {articulo.destacado && (
          <div className="destacado-badge">
            <Star size={16} fill="currentColor" />
            Destacado
          </div>
        )}
        <button
          className={`btn-favorito-card ${esFavorito ? 'activo' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito(articulo);
          }}
        >
          <Heart size={20} fill={esFavorito ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="articulo-info">
        <div className="articulo-header">
          <span className="categoria-badge">{articulo.categoria}</span>
          <span className="tiempo-lectura">{articulo.tiempoLectura}</span>
        </div>
        
        <h3 className="articulo-titulo">{articulo.titulo}</h3>
        <p className="articulo-resumen">{articulo.resumen}</p>
        
        <div className="articulo-meta">
          <div className="meta-item">
            <User size={16} />
            <span>{articulo.autor}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>{articulo.fecha}</span>
          </div>
          <div className="meta-item">
            <Eye size={16} />
            <span>{articulo.vistas}</span>
          </div>
        </div>
        
        <div className="articulo-tags">
          {articulo.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const EpisodioCard = ({ episodio, esFavorito, estaReproduciendo, onReproducir, onToggleFavorito, vista }) => {
  return (
    <div className={`episodio-card ${vista}`}>
      <div className="episodio-imagen">
        <img src={episodio.imagen} alt={episodio.titulo} />
        <div className="episodio-overlay">
          <button
            className="btn-play-overlay"
            onClick={() => onReproducir(episodio)}
          >
            {estaReproduciendo ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>
        <div className="duracion-badge">{episodio.duracion}</div>
        {episodio.destacado && (
          <div className="destacado-badge">
            <Star size={16} fill="currentColor" />
            Destacado
          </div>
        )}
        <button
          className={`btn-favorito-card ${esFavorito ? 'activo' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito(episodio);
          }}
        >
          <Heart size={20} fill={esFavorito ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="episodio-info">
        <div className="episodio-header">
          <span className="categoria-badge">{episodio.categoria}</span>
          <span className="fecha">{episodio.fecha}</span>
        </div>
        
        <h3 className="episodio-titulo">{episodio.titulo}</h3>
        <p className="episodio-descripcion">{episodio.descripcion}</p>
        
        <div className="episodio-meta">
          <div className="meta-item">
            <Headphones size={16} />
            <span>{episodio.reproducciones}</span>
          </div>
          <div className="meta-item">
            <Heart size={16} />
            <span>{episodio.likes}</span>
          </div>
          <div className="meta-item">
            <MessageCircle size={16} />
            <span>{episodio.comentarios}</span>
          </div>
        </div>
        
        <div className="episodio-tags">
          {episodio.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="episodio-acciones">
          <button
            className="btn-reproducir"
            onClick={() => onReproducir(episodio)}
          >
            {estaReproduciendo ? <Pause size={20} /> : <Play size={20} />}
            {estaReproduciendo ? 'Pausar' : 'Reproducir'}
          </button>
          <button
            className="btn-youtube"
            onClick={() => window.open(episodio.youtubeUrl, '_blank')}
          >
            <Youtube size={20} />
            YouTube
          </button>
        </div>
      </div>
    </div>
  );
};

const ArticuloView = ({ articulo, onVolver }) => {
  const { blogPodcastState, updateBlogPodcastState } = useBlogPodcast();

  const expandirModal = () => {
    updateBlogPodcastState({ modalExpandido: !blogPodcastState.modalExpandido });
  };

  return (
    <div className={`articulo-view ${blogPodcastState.modalExpandido ? 'expandido' : ''}`}>
      {blogPodcastState.modalExpandido && (
        <div className="modal-overlay-expandido">
          <button className="btn-cerrar-expandido" onClick={expandirModal}>
            <X size={24} />
          </button>
        </div>
      )}
      
      <div className="articulo-header">
        <button onClick={onVolver} className="btn-volver">
          <ArrowLeft size={20} />
          Volver a Artículos
        </button>
        <button className="btn-expandir" onClick={expandirModal}>
          <Maximize2 size={20} />
        </button>
      </div>
      
      <article className="articulo-contenido">
        <div className="articulo-imagen-principal">
          <img src={articulo.imagen} alt={articulo.titulo} />
        </div>
        
        <div className="articulo-texto">
          <div className="articulo-meta-principal">
            <span className="categoria-badge">{articulo.categoria}</span>
            <span className="tiempo-lectura">{articulo.tiempoLectura}</span>
          </div>
          
          <h1 className="articulo-titulo-principal">{articulo.titulo}</h1>
          
          <div className="articulo-autor-fecha">
            <span>Por {articulo.autor} • {articulo.fecha}</span>
          </div>
          
          <div className="articulo-tags-principales">
            {articulo.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="articulo-contenido-texto">
            <p className="articulo-resumen-principal">{articulo.resumen}</p>
            <div className="articulo-texto-completo">
              {articulo.contenido.split('\n').map((parrafo, index) => (
                <p key={index} className={parrafo.trim() === '' ? 'espacio' : ''}>
                  {parrafo}
                </p>
              ))}
            </div>
          </div>
          
          <div className="articulo-acciones">
            <button className="btn-accion primario">
              <Share2 size={20} />
              Compartir Artículo
            </button>
            <button className="btn-accion secundario">
              <Bookmark size={20} />
              Guardar
            </button>
            <button className="btn-accion secundario">
              <Download size={20} />
              Descargar PDF
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

const ReproductorFlotante = ({ episodio, estaReproduciendo, onTogglePlay, onCerrar }) => {
  return (
    <div className="reproductor-flotante">
      <div className="reproductor-info">
        <img src={episodio.imagen} alt={episodio.titulo} className="reproductor-imagen" />
        <div className="reproductor-detalles">
          <h4 className="reproductor-titulo">{episodio.titulo}</h4>
          <p className="reproductor-categoria">{episodio.categoria}</p>
        </div>
      </div>
      
      <div className="reproductor-controles">
        <button className="btn-control" onClick={onTogglePlay}>
          {estaReproduciendo ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button className="btn-control" onClick={onCerrar}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

const ModalConfiguracion = ({ onCerrar }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Configuración de Blog & Podcast</h3>
          <button onClick={onCerrar} className="btn-cerrar">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="config-section">
            <h4>Reproducción</h4>
            <label className="config-item">
              <input type="checkbox" />
              <span>Reproducción automática</span>
            </label>
            <label className="config-item">
              <span>Calidad de audio:</span>
              <select className="config-select-inline">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </label>
          </div>
          
          <div className="config-section">
            <h4>Notificaciones</h4>
            <label className="config-item">
              <input type="checkbox" />
              <span>Nuevos artículos</span>
            </label>
            <label className="config-item">
              <input type="checkbox" />
              <span>Nuevos episodios</span>
            </label>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onCerrar} className="btn-guardar">
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal con Provider
const BlogPodcastConProvider = ({ onVolver }) => {
  return (
    <BlogPodcastProvider>
      <BlogPodcast onVolver={onVolver} />
    </BlogPodcastProvider>
  );
};

export default BlogPodcastConProvider;

