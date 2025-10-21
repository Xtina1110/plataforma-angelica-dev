// Data de Sonoterapias Angelicales
// Más de 20 audios de alta calidad para meditación y sanación

export const getSonoterapias = () => {
  return [
    // ===== FRECUENCIAS SAGRADAS =====
    {
      id: 1,
      titulo: "432Hz - Frecuencia del Amor Universal",
      descripcion: "Armoniza tu corazón con la frecuencia del amor incondicional. Equilibra emociones y restaura la paz interior.",
      categoria: "Frecuencias Sagradas",
      duracionMinutos: 30,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-pink-500 to-rose-500",
      arcangel: "Chamuel",
      beneficios: ["Equilibrio emocional", "Paz interior", "Conexión con el amor"],
      audioUrl: "/audios/432hz-amor.mp3"
    },
    {
      id: 2,
      titulo: "528Hz - Frecuencia de la Transformación",
      descripcion: "La frecuencia milagrosa que repara el ADN y transforma tu energía. Sanación profunda a nivel celular.",
      categoria: "Frecuencias Sagradas",
      duracionMinutos: 45,
      precio: 7.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-500",
      arcangel: "Rafael",
      beneficios: ["Sanación celular", "Transformación energética", "Reparación del ADN"],
      audioUrl: "/audios/528hz-transformacion.mp3"
    },
    {
      id: 3,
      titulo: "639Hz - Frecuencia de las Relaciones",
      descripcion: "Armoniza tus relaciones y conexiones. Fomenta la comunicación y el entendimiento mutuo.",
      categoria: "Frecuencias Sagradas",
      duracionMinutos: 25,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-orange-500 to-amber-500",
      arcangel: "Jofiel",
      beneficios: ["Mejora relaciones", "Comunicación clara", "Armonía social"],
      audioUrl: "/audios/639hz-relaciones.mp3"
    },
    {
      id: 4,
      titulo: "741Hz - Frecuencia de la Purificación",
      descripcion: "Limpia tu campo energético de toxinas y energías negativas. Despierta la intuición.",
      categoria: "Frecuencias Sagradas",
      duracionMinutos: 35,
      precio: 5.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-500",
      arcangel: "Miguel",
      beneficios: ["Purificación energética", "Despertar intuitivo", "Limpieza de toxinas"],
      audioUrl: "/audios/741hz-purificacion.mp3"
    },
    {
      id: 5,
      titulo: "852Hz - Frecuencia del Despertar Espiritual",
      descripcion: "Activa tu tercer ojo y conecta con dimensiones superiores. Expande tu conciencia.",
      categoria: "Frecuencias Sagradas",
      duracionMinutos: 40,
      precio: 9.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-purple-500 to-indigo-500",
      arcangel: "Metatrón",
      beneficios: ["Despertar espiritual", "Activación del tercer ojo", "Expansión de conciencia"],
      audioUrl: "/audios/852hz-despertar.mp3"
    },

    // ===== MEDITACIONES GUIADAS =====
    {
      id: 6,
      titulo: "Meditación con Arcángel Miguel",
      descripcion: "Protección divina y liberación de miedos. Miguel te envuelve en su luz azul protectora.",
      categoria: "Meditaciones Guiadas",
      duracionMinutos: 20,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      color: "from-blue-600 to-indigo-600",
      arcangel: "Miguel",
      beneficios: ["Protección divina", "Liberación de miedos", "Fortaleza interior"],
      audioUrl: "/audios/meditacion-miguel.mp3"
    },
    {
      id: 7,
      titulo: "Meditación con Arcángel Rafael",
      descripcion: "Sanación profunda de cuerpo, mente y espíritu. Rafael te envuelve en su luz verde esmeralda.",
      categoria: "Meditaciones Guiadas",
      duracionMinutos: 25,
      precio: 6.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      color: "from-green-600 to-emerald-600",
      arcangel: "Rafael",
      beneficios: ["Sanación integral", "Restauración energética", "Bienestar físico"],
      audioUrl: "/audios/meditacion-rafael.mp3"
    },
    {
      id: 8,
      titulo: "Meditación con Arcángel Gabriel",
      descripcion: "Claridad mental y comunicación divina. Gabriel te ayuda a expresar tu verdad interior.",
      categoria: "Meditaciones Guiadas",
      duracionMinutos: 18,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      color: "from-white to-blue-200",
      arcangel: "Gabriel",
      beneficios: ["Claridad mental", "Comunicación clara", "Expresión auténtica"],
      audioUrl: "/audios/meditacion-gabriel.mp3"
    },
    {
      id: 9,
      titulo: "Meditación con Arcángel Uriel",
      descripcion: "Sabiduría divina e iluminación. Uriel te guía hacia el conocimiento superior.",
      categoria: "Meditaciones Guiadas",
      duracionMinutos: 30,
      precio: 7.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      color: "from-yellow-500 to-orange-500",
      arcangel: "Uriel",
      beneficios: ["Sabiduría divina", "Iluminación", "Conocimiento superior"],
      audioUrl: "/audios/meditacion-uriel.mp3"
    },

    // ===== SANACIÓN DE CHAKRAS =====
    {
      id: 10,
      titulo: "Activación del Chakra Raíz",
      descripcion: "Enraízate y conecta con la Tierra. Seguridad, estabilidad y abundancia material.",
      categoria: "Sanación de Chakras",
      duracionMinutos: 15,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-red-600 to-rose-600",
      arcangel: "Uriel",
      beneficios: ["Enraizamiento", "Seguridad", "Estabilidad"],
      audioUrl: "/audios/chakra-raiz.mp3"
    },
    {
      id: 11,
      titulo: "Equilibrio del Chakra Sacro",
      descripcion: "Despierta tu creatividad y pasión. Equilibra tus emociones y sexualidad sagrada.",
      categoria: "Sanación de Chakras",
      duracionMinutos: 20,
      precio: 4.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-orange-600 to-amber-600",
      arcangel: "Gabriel",
      beneficios: ["Creatividad", "Equilibrio emocional", "Vitalidad"],
      audioUrl: "/audios/chakra-sacro.mp3"
    },
    {
      id: 12,
      titulo: "Poder del Chakra del Plexo Solar",
      descripcion: "Fortalece tu poder personal y autoestima. Confianza y determinación.",
      categoria: "Sanación de Chakras",
      duracionMinutos: 18,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-yellow-500 to-amber-500",
      arcangel: "Jofiel",
      beneficios: ["Poder personal", "Autoestima", "Confianza"],
      audioUrl: "/audios/chakra-plexo.mp3"
    },
    {
      id: 13,
      titulo: "Apertura del Chakra del Corazón",
      descripcion: "Amor incondicional y compasión. Sana heridas emocionales y abre tu corazón.",
      categoria: "Sanación de Chakras",
      duracionMinutos: 25,
      precio: 5.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-500",
      arcangel: "Chamuel",
      beneficios: ["Amor incondicional", "Sanación emocional", "Compasión"],
      audioUrl: "/audios/chakra-corazon.mp3"
    },
    {
      id: 14,
      titulo: "Expresión del Chakra de la Garganta",
      descripcion: "Comunica tu verdad con claridad. Expresa tu autenticidad sin miedo.",
      categoria: "Sanación de Chakras",
      duracionMinutos: 20,
      precio: 4.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-500",
      arcangel: "Miguel",
      beneficios: ["Comunicación clara", "Expresión auténtica", "Verdad personal"],
      audioUrl: "/audios/chakra-garganta.mp3"
    },
    {
      id: 15,
      titulo: "Activación del Tercer Ojo",
      descripcion: "Despierta tu intuición y clarividencia. Visión espiritual y percepción expandida.",
      categoria: "Sanación de Chakras",
      duracionMinutos: 30,
      precio: 7.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      color: "from-indigo-600 to-purple-600",
      arcangel: "Rafael",
      beneficios: ["Intuición", "Clarividencia", "Visión espiritual"],
      audioUrl: "/audios/chakra-tercer-ojo.mp3"
    },
    {
      id: 16,
      titulo: "Conexión del Chakra Corona",
      descripcion: "Unión con lo Divino. Iluminación espiritual y conciencia cósmica.",
      categoria: "Sanación de Chakras",
      duracionMinutos: 35,
      precio: 9.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      color: "from-purple-500 to-pink-500",
      arcangel: "Metatrón",
      beneficios: ["Conexión divina", "Iluminación", "Conciencia cósmica"],
      audioUrl: "/audios/chakra-corona.mp3"
    },

    // ===== ONDAS BINAURALES =====
    {
      id: 17,
      titulo: "Ondas Delta - Sueño Profundo",
      descripcion: "Induce un sueño reparador y profundo. Regeneración celular durante el descanso.",
      categoria: "Ondas Binaurales",
      duracionMinutos: 60,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      color: "from-indigo-900 to-purple-900",
      arcangel: "Gabriel",
      beneficios: ["Sueño profundo", "Regeneración", "Descanso reparador"],
      audioUrl: "/audios/ondas-delta.mp3"
    },
    {
      id: 18,
      titulo: "Ondas Theta - Meditación Profunda",
      descripcion: "Estado de meditación profunda y creatividad. Acceso al subconsciente.",
      categoria: "Ondas Binaurales",
      duracionMinutos: 40,
      precio: 6.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      color: "from-purple-600 to-indigo-600",
      arcangel: "Uriel",
      beneficios: ["Meditación profunda", "Creatividad", "Acceso al subconsciente"],
      audioUrl: "/audios/ondas-theta.mp3"
    },
    {
      id: 19,
      titulo: "Ondas Alpha - Relajación Consciente",
      descripcion: "Relajación profunda manteniendo la conciencia. Reduce estrés y ansiedad.",
      categoria: "Ondas Binaurales",
      duracionMinutos: 30,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-500",
      arcangel: "Rafael",
      beneficios: ["Relajación", "Reducción de estrés", "Calma mental"],
      audioUrl: "/audios/ondas-alpha.mp3"
    },
    {
      id: 20,
      titulo: "Ondas Beta - Concentración y Enfoque",
      descripcion: "Aumenta tu concentración y productividad. Estado de alerta mental óptimo.",
      categoria: "Ondas Binaurales",
      duracionMinutos: 45,
      precio: 5.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-yellow-500 to-orange-500",
      arcangel: "Jofiel",
      beneficios: ["Concentración", "Productividad", "Alerta mental"],
      audioUrl: "/audios/ondas-beta.mp3"
    },

    // ===== MÚSICA ANGELICAL =====
    {
      id: 21,
      titulo: "Coro Angelical Celestial",
      descripcion: "Voces angelicales que elevan tu vibración. Conexión directa con el reino angelical.",
      categoria: "Música Angelical",
      duracionMinutos: 50,
      precio: 8.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-white to-blue-300",
      arcangel: "Todos los Arcángeles",
      beneficios: ["Elevación vibratoria", "Conexión angelical", "Paz celestial"],
      audioUrl: "/audios/coro-angelical.mp3"
    },
    {
      id: 22,
      titulo: "Arpas Celestiales",
      descripcion: "Melodías de arpa que calman el alma. Música del cielo para tu sanación.",
      categoria: "Música Angelical",
      duracionMinutos: 35,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: "from-gold-400 to-yellow-300",
      arcangel: "Gabriel",
      beneficios: ["Calma del alma", "Sanación suave", "Paz interior"],
      audioUrl: "/audios/arpas-celestiales.mp3"
    },
    {
      id: 23,
      titulo: "Campanas Tibetanas Sagradas",
      descripcion: "Vibraciones ancestrales para limpieza energética profunda. Armonización total.",
      categoria: "Música Angelical",
      duracionMinutos: 40,
      precio: 7.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-amber-600 to-orange-600",
      arcangel: "Metatrón",
      beneficios: ["Limpieza energética", "Armonización", "Equilibrio vibracional"],
      audioUrl: "/audios/campanas-tibetanas.mp3"
    },
    {
      id: 24,
      titulo: "Mantras Angelicales",
      descripcion: "Mantras sagrados cantados por voces angelicales. Protección y elevación espiritual.",
      categoria: "Música Angelical",
      duracionMinutos: 28,
      precio: 6.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      color: "from-purple-500 to-pink-500",
      arcangel: "Miguel",
      beneficios: ["Protección espiritual", "Elevación", "Conexión sagrada"],
      audioUrl: "/audios/mantras-angelicales.mp3"
    },

    // ===== SANACIÓN ESPECÍFICA =====
    {
      id: 25,
      titulo: "Sanación del Niño Interior",
      descripcion: "Sana heridas de la infancia con amor angelical. Recupera tu inocencia y alegría.",
      categoria: "Sanación Específica",
      duracionMinutos: 35,
      precio: 9.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      color: "from-pink-400 to-rose-400",
      arcangel: "Chamuel",
      beneficios: ["Sanación infantil", "Recuperación emocional", "Alegría interior"],
      audioUrl: "/audios/nino-interior.mp3"
    },
    {
      id: 26,
      titulo: "Liberación de Ansiedad",
      descripcion: "Calma tu mente y libera la ansiedad. Paz mental y serenidad profunda.",
      categoria: "Sanación Específica",
      duracionMinutos: 25,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      color: "from-blue-400 to-cyan-400",
      arcangel: "Rafael",
      beneficios: ["Calma mental", "Liberación de ansiedad", "Serenidad"],
      audioUrl: "/audios/liberacion-ansiedad.mp3"
    },
    {
      id: 27,
      titulo: "Abundancia y Prosperidad",
      descripcion: "Abre los canales de abundancia en tu vida. Atrae prosperidad divina.",
      categoria: "Sanación Específica",
      duracionMinutos: 30,
      precio: 8.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-500",
      arcangel: "Uriel",
      beneficios: ["Abundancia", "Prosperidad", "Manifestación"],
      audioUrl: "/audios/abundancia.mp3"
    },
    {
      id: 28,
      titulo: "Protección Energética Nocturna",
      descripcion: "Protección angelical durante el sueño. Sueños lúcidos y descanso sagrado.",
      categoria: "Sanación Específica",
      duracionMinutos: 480,
      precio: 7.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-indigo-800 to-purple-800",
      arcangel: "Miguel",
      beneficios: ["Protección nocturna", "Sueños lúcidos", "Descanso sagrado"],
      audioUrl: "/audios/proteccion-nocturna.mp3"
    }
  ];
};

// Obtener categorías únicas
export const getCategoriasSonoterapia = () => {
  const sonoterapias = getSonoterapias();
  const categoriasSet = new Set(sonoterapias.map(s => s.categoria));
  return Array.from(categoriasSet);
};

// Obtener arcángeles únicos
export const getArcangelessonoterapia = () => {
  const sonoterapias = getSonoterapias();
  const arcangelesSet = new Set(sonoterapias.map(s => s.arcangel));
  return Array.from(arcangelesSet);
};

// Filtrar por categoría
export const getSonoterapiasPorCategoria = (categoria) => {
  const sonoterapias = getSonoterapias();
  if (categoria === 'todas') return sonoterapias;
  return sonoterapias.filter(s => s.categoria === categoria);
};

// Filtrar por arcángel
export const getSonoterapiasPorArcangel = (arcangel) => {
  const sonoterapias = getSonoterapias();
  if (arcangel === 'todos') return sonoterapias;
  return sonoterapias.filter(s => s.arcangel === arcangel);
};

// Obtener sonoterapias gratuitas
export const getSonoterapiasGratuitas = () => {
  const sonoterapias = getSonoterapias();
  return sonoterapias.filter(s => !s.premium || s.precio === 0);
};

// Obtener sonoterapias premium
export const getSonoterapiasPremium = () => {
  const sonoterapias = getSonoterapias();
  return sonoterapias.filter(s => s.premium && s.precio > 0);
};

