// Catálogo de Terapias Angelicales
// Servicios de sanación energética guiados por arcángeles

export const getTerapias = () => {
  return [
    // ===== TERAPIAS DE SANACIÓN EMOCIONAL =====
    {
      id: 1,
      titulo: "Sanación del Corazón Roto",
      descripcion: "Terapia profunda para sanar heridas emocionales, rupturas amorosas y dolor del corazón. El Arcángel Chamuel te envuelve en amor incondicional.",
      categoria: "Sanación Emocional",
      duracionMinutos: 60,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-pink-500 to-rose-500",
      arcangel: "Chamuel",
      beneficios: ["Sana heridas emocionales", "Libera dolor del corazón", "Restaura capacidad de amar"],
      modalidad: "Presencial/Online",
      incluye: ["Diagnóstico energético", "Sanación con cristales de cuarzo rosa", "Meditación guiada"]
    },
    {
      id: 2,
      titulo: "Liberación de Ansiedad y Estrés",
      descripcion: "Terapia especializada para liberar tensiones, calmar la mente y restaurar la paz interior. El Arcángel Miguel te protege y fortalece.",
      categoria: "Sanación Emocional",
      duracionMinutos: 45,
      precio: 8.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-blue-500 to-indigo-500",
      arcangel: "Miguel",
      beneficios: ["Reduce ansiedad", "Calma mental", "Fortalece sistema nervioso"],
      modalidad: "Presencial/Online",
      incluye: ["Técnicas de respiración angelical", "Corte de cordones energéticos", "Escudo protector"]
    },
    {
      id: 3,
      titulo: "Sanación de Traumas del Pasado",
      descripcion: "Libera memorias dolorosas y patrones traumáticos almacenados en tu campo energético. Sanación profunda con el Arcángel Rafael.",
      categoria: "Sanación Emocional",
      duracionMinutos: 90,
      precio: 12.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-500",
      arcangel: "Rafael",
      beneficios: ["Libera traumas", "Sana memoria celular", "Restaura integridad emocional"],
      modalidad: "Presencial",
      incluye: ["Regresión energética", "Sanación multidimensional", "Integración del niño interior"]
    },

    // ===== TERAPIAS DE SANACIÓN FÍSICA =====
    {
      id: 4,
      titulo: "Sanación Energética Corporal",
      descripcion: "Terapia de sanación para dolencias físicas, dolores crónicos y desequilibrios del cuerpo. El Arcángel Rafael canaliza energía sanadora.",
      categoria: "Sanación Física",
      duracionMinutos: 60,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: "from-emerald-500 to-teal-500",
      arcangel: "Rafael",
      beneficios: ["Alivia dolores", "Acelera recuperación", "Equilibra energía vital"],
      modalidad: "Presencial",
      incluye: ["Imposición de manos", "Sanación con luz verde esmeralda", "Activación de chakras"]
    },
    {
      id: 5,
      titulo: "Equilibrio de Chakras",
      descripcion: "Alineación y equilibrio de los 7 chakras principales. Restaura el flujo energético y la vitalidad. Guiado por el Arcángel Metatrón.",
      categoria: "Sanación Física",
      duracionMinutos: 75,
      precio: 10.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-purple-500 to-violet-500",
      arcangel: "Metatrón",
      beneficios: ["Alinea chakras", "Aumenta vitalidad", "Mejora salud integral"],
      modalidad: "Presencial/Online",
      incluye: ["Diagnóstico de chakras", "Limpieza energética", "Activación con cristales"]
    },
    {
      id: 6,
      titulo: "Sanación del Sistema Nervioso",
      descripcion: "Terapia especializada para calmar y sanar el sistema nervioso. Ideal para fatiga crónica, insomnio y agotamiento.",
      categoria: "Sanación Física",
      duracionMinutos: 60,
      precio: 9.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      color: "from-cyan-500 to-blue-500",
      arcangel: "Rafael",
      beneficios: ["Calma sistema nervioso", "Mejora sueño", "Restaura energía"],
      modalidad: "Presencial/Online",
      incluye: ["Técnicas de relajación profunda", "Sanación con sonidos", "Meditación restaurativa"]
    },

    // ===== TERAPIAS DE ABUNDANCIA Y PROSPERIDAD =====
    {
      id: 7,
      titulo: "Desbloqueo de Abundancia",
      descripcion: "Libera bloqueos financieros y creencias limitantes sobre el dinero. El Arcángel Uriel ilumina tu camino hacia la prosperidad.",
      categoria: "Abundancia y Prosperidad",
      duracionMinutos: 60,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-amber-500 to-yellow-500",
      arcangel: "Uriel",
      beneficios: ["Libera bloqueos financieros", "Atrae abundancia", "Transforma mentalidad"],
      modalidad: "Online",
      incluye: ["Identificación de bloqueos", "Reprogramación de creencias", "Ritual de prosperidad"]
    },
    {
      id: 8,
      titulo: "Activación del Propósito de Vida",
      descripcion: "Descubre y activa tu misión de vida. Conecta con tu propósito divino y alinea tu trabajo con tu alma.",
      categoria: "Abundancia y Prosperidad",
      duracionMinutos: 90,
      precio: 14.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-indigo-500 to-purple-500",
      arcangel: "Metatrón",
      beneficios: ["Clarifica propósito", "Alinea misión de vida", "Activa dones espirituales"],
      modalidad: "Presencial",
      incluye: ["Lectura akáshica", "Canalización de propósito", "Plan de acción divino"]
    },

    // ===== TERAPIAS DE RELACIONES =====
    {
      id: 9,
      titulo: "Sanación de Relaciones Familiares",
      descripcion: "Sana vínculos familiares rotos, conflictos generacionales y patrones heredados. El Arcángel Jofiel trae armonía.",
      categoria: "Relaciones",
      duracionMinutos: 75,
      precio: 11.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-orange-500 to-pink-500",
      arcangel: "Jofiel",
      beneficios: ["Sana vínculos familiares", "Libera patrones heredados", "Restaura armonía"],
      modalidad: "Presencial/Online",
      incluye: ["Sanación transgeneracional", "Corte de lazos tóxicos", "Bendición familiar"]
    },
    {
      id: 10,
      titulo: "Atracción del Amor Verdadero",
      descripcion: "Prepara tu corazón y energía para atraer una relación amorosa sana y divina. El Arcángel Chamuel te guía.",
      categoria: "Relaciones",
      duracionMinutos: 60,
      precio: 9.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: "from-rose-500 to-pink-500",
      arcangel: "Chamuel",
      beneficios: ["Atrae amor verdadero", "Sana patrones románticos", "Eleva vibración amorosa"],
      modalidad: "Online",
      incluye: ["Limpieza del campo amoroso", "Activación del corazón", "Ritual de atracción"]
    },

    // ===== TERAPIAS ESPIRITUALES =====
    {
      id: 11,
      titulo: "Activación del Tercer Ojo",
      descripcion: "Despierta y activa tu tercer ojo para desarrollar intuición, clarividencia y conexión espiritual profunda.",
      categoria: "Desarrollo Espiritual",
      duracionMinutos: 90,
      precio: 13.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-indigo-500 to-purple-500",
      arcangel: "Metatrón",
      beneficios: ["Activa tercer ojo", "Desarrolla clarividencia", "Expande conciencia"],
      modalidad: "Presencial",
      incluye: ["Activación energética", "Ejercicios de visión interior", "Conexión con guías"]
    },
    {
      id: 12,
      titulo: "Conexión con tu Ángel Guardián",
      descripcion: "Establece una conexión consciente y directa con tu ángel guardián personal. Recibe guía y protección constante.",
      categoria: "Desarrollo Espiritual",
      duracionMinutos: 60,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-500",
      arcangel: "Gabriel",
      beneficios: ["Conecta con tu ángel", "Recibe guía divina", "Fortalece protección"],
      modalidad: "Online",
      incluye: ["Meditación de conexión", "Mensaje personalizado", "Técnicas de comunicación"]
    },

    // ===== TERAPIAS DE PROTECCIÓN =====
    {
      id: 13,
      titulo: "Escudo de Protección Angelical",
      descripcion: "Crea un escudo energético poderoso que te protege de energías negativas, ataques psíquicos y vampirismo energético.",
      categoria: "Protección Energética",
      duracionMinutos: 45,
      precio: 7.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-blue-600 to-indigo-600",
      arcangel: "Miguel",
      beneficios: ["Protección energética", "Bloquea ataques psíquicos", "Fortalece aura"],
      modalidad: "Presencial/Online",
      incluye: ["Instalación de escudo", "Sellado áurico", "Mantenimiento del escudo"]
    },
    {
      id: 14,
      titulo: "Liberación de Entidades y Energías Oscuras",
      descripcion: "Terapia especializada para liberar entidades, energías oscuras y presencias no deseadas de tu campo energético.",
      categoria: "Protección Energética",
      duracionMinutos: 120,
      precio: 19.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-purple-600 to-blue-600",
      arcangel: "Miguel",
      beneficios: ["Libera entidades", "Limpia energías oscuras", "Restaura luz interior"],
      modalidad: "Presencial",
      incluye: ["Diagnóstico espiritual", "Exorcismo energético", "Sellado de protección"]
    },

    // ===== TERAPIAS DE NIÑOS Y ADOLESCENTES =====
    {
      id: 15,
      titulo: "Sanación para Niños Índigo y Cristal",
      descripcion: "Terapia especializada para niños y adolescentes con alta sensibilidad espiritual. Ayuda a equilibrar sus dones.",
      categoria: "Niños y Adolescentes",
      duracionMinutos: 60,
      precio: 10.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-cyan-500 to-blue-500",
      arcangel: "Gabriel",
      beneficios: ["Equilibra sensibilidad", "Desarrolla dones", "Protege energéticamente"],
      modalidad: "Presencial",
      incluye: ["Evaluación de dones", "Técnicas de protección", "Guía para padres"]
    }
  ];
};

// Obtener categorías únicas
export const getCategoriasTerapias = () => {
  const terapias = getTerapias();
  const categorias = [...new Set(terapias.map(t => t.categoria))];
  return ['Todas', ...categorias];
};

// Obtener arcángeles únicos
export const getArcangelesTerapias = () => {
  const terapias = getTerapias();
  const arcangeles = [...new Set(terapias.map(t => t.arcangel))];
  return ['Todos', ...arcangeles];
};

// Obtener terapia por ID
export const getTerapiaById = (id) => {
  const terapias = getTerapias();
  return terapias.find(t => t.id === id);
};

// Filtrar terapias
export const filtrarTerapias = (filtros) => {
  let terapias = getTerapias();
  
  if (filtros.categoria && filtros.categoria !== 'Todas') {
    terapias = terapias.filter(t => t.categoria === filtros.categoria);
  }
  
  if (filtros.arcangel && filtros.arcangel !== 'Todos') {
    terapias = terapias.filter(t => t.arcangel === filtros.arcangel);
  }
  
  if (filtros.precio === 'gratuitas') {
    terapias = terapias.filter(t => !t.premium || t.precio === 0);
  } else if (filtros.precio === 'premium') {
    terapias = terapias.filter(t => t.premium && t.precio > 0);
  }
  
  if (filtros.modalidad && filtros.modalidad !== 'Todas') {
    terapias = terapias.filter(t => t.modalidad.includes(filtros.modalidad));
  }
  
  return terapias;
};

