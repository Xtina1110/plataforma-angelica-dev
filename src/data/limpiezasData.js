// Catálogo de Limpiezas Energéticas Angelicales
// Servicios de purificación espiritual y limpieza de espacios

export const getLimpiezas = () => {
  return [
    // ===== LIMPIEZAS PERSONALES =====
    {
      id: 1,
      titulo: "Limpieza Áurica Completa",
      descripcion: "Purificación profunda de tu campo áurico. Elimina energías densas, bloqueos y adherencias energéticas acumuladas.",
      categoria: "Limpieza Personal",
      duracionMinutos: 60,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-violet-500 to-purple-500",
      arcangel: "Miguel",
      beneficios: ["Purifica aura", "Elimina energías densas", "Restaura brillo energético"],
      modalidad: "Presencial/Online",
      incluye: ["Diagnóstico áurico", "Limpieza con llama violeta", "Sellado de protección"]
    },
    {
      id: 2,
      titulo: "Limpieza de Chakras",
      descripcion: "Purificación profunda de los 7 chakras principales. Elimina bloqueos, energías estancadas y restaura el flujo vital.",
      categoria: "Limpieza Personal",
      duracionMinutos: 75,
      precio: 9.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-rainbow-500 to-purple-500",
      arcangel: "Metatrón",
      beneficios: ["Limpia chakras", "Desbloquea energía", "Equilibra sistema energético"],
      modalidad: "Presencial",
      incluye: ["Limpieza chakra por chakra", "Activación con cristales", "Equilibrio energético"]
    },
    {
      id: 3,
      titulo: "Limpieza de Cordones Energéticos",
      descripcion: "Corta y limpia cordones energéticos tóxicos que te conectan con personas, situaciones o lugares que drenan tu energía.",
      categoria: "Limpieza Personal",
      duracionMinutos: 60,
      precio: 10.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-500",
      arcangel: "Miguel",
      beneficios: ["Corta cordones tóxicos", "Libera dependencias", "Recupera energía vital"],
      modalidad: "Presencial/Online",
      incluye: ["Identificación de cordones", "Corte con espada de Miguel", "Sanación de heridas"]
    },
    {
      id: 4,
      titulo: "Limpieza de Memoria Celular",
      descripcion: "Purificación de memorias traumáticas almacenadas en las células del cuerpo. Libera dolor ancestral y patrones heredados.",
      categoria: "Limpieza Personal",
      duracionMinutos: 90,
      precio: 14.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-500",
      arcangel: "Rafael",
      beneficios: ["Limpia memoria celular", "Libera traumas", "Sana linaje familiar"],
      modalidad: "Presencial",
      incluye: ["Escaneo celular", "Liberación de memorias", "Reprogramación celular"]
    },
    {
      id: 5,
      titulo: "Limpieza de Implantes Energéticos",
      descripcion: "Remoción de implantes energéticos, chips etéricos y dispositivos de control que limitan tu libertad espiritual.",
      categoria: "Limpieza Personal",
      duracionMinutos: 120,
      precio: 17.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-indigo-500 to-purple-500",
      arcangel: "Miguel",
      beneficios: ["Remueve implantes", "Libera control externo", "Restaura soberanía"],
      modalidad: "Presencial",
      incluye: ["Escaneo de implantes", "Extracción energética", "Sanación de tejido etérico"]
    },

    // ===== LIMPIEZAS DE ESPACIOS =====
    {
      id: 6,
      titulo: "Limpieza de Hogar",
      descripcion: "Purificación completa de tu hogar. Elimina energías negativas, entidades y memorias de eventos pasados.",
      categoria: "Limpieza de Espacios",
      duracionMinutos: 90,
      precio: 0,
      premium: false,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      color: "from-amber-500 to-orange-500",
      arcangel: "Miguel",
      beneficios: ["Purifica hogar", "Elimina energías negativas", "Crea ambiente sagrado"],
      modalidad: "Presencial",
      incluye: ["Limpieza con sahumerio", "Sellado de espacios", "Bendición angelical"]
    },
    {
      id: 7,
      titulo: "Limpieza de Negocio o Empresa",
      descripcion: "Purificación energética de tu lugar de trabajo. Atrae prosperidad, armonía y éxito empresarial.",
      categoria: "Limpieza de Espacios",
      duracionMinutos: 120,
      precio: 24.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-yellow-500 to-amber-500",
      arcangel: "Uriel",
      beneficios: ["Purifica negocio", "Atrae prosperidad", "Armoniza equipo"],
      modalidad: "Presencial",
      incluye: ["Limpieza de oficinas", "Activación de abundancia", "Protección empresarial"]
    },
    {
      id: 8,
      titulo: "Limpieza de Terrenos y Propiedades",
      descripcion: "Purificación de terrenos, casas en venta o propiedades con historia energética pesada. Libera memorias del lugar.",
      categoria: "Limpieza de Espacios",
      duracionMinutos: 180,
      precio: 34.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-green-500 to-teal-500",
      arcangel: "Miguel",
      beneficios: ["Limpia terreno", "Libera memorias", "Prepara para nuevo ciclo"],
      modalidad: "Presencial",
      incluye: ["Limpieza de perímetro", "Liberación de entidades", "Consagración del espacio"]
    },
    {
      id: 9,
      titulo: "Limpieza de Habitación de Enfermo",
      descripcion: "Purificación especializada para habitaciones de personas enfermas. Transforma energía de enfermedad en sanación.",
      categoria: "Limpieza de Espacios",
      duracionMinutos: 60,
      precio: 12.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-emerald-500 to-green-500",
      arcangel: "Rafael",
      beneficios: ["Purifica ambiente", "Transforma energía", "Acelera recuperación"],
      modalidad: "Presencial",
      incluye: ["Limpieza profunda", "Infusión de luz sanadora", "Protección del espacio"]
    },

    // ===== LIMPIEZAS ESPECIALIZADAS =====
    {
      id: 10,
      titulo: "Limpieza de Objetos y Joyas",
      descripcion: "Purificación de objetos personales, joyas, cristales y amuletos. Elimina energías anteriores y programa con intención.",
      categoria: "Limpieza Especializada",
      duracionMinutos: 30,
      precio: 5.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: "from-pink-500 to-rose-500",
      arcangel: "Metatrón",
      beneficios: ["Limpia objetos", "Elimina energías anteriores", "Programa con intención"],
      modalidad: "Presencial",
      incluye: ["Limpieza energética", "Programación", "Consagración"]
    },
    {
      id: 11,
      titulo: "Limpieza de Vehículos",
      descripcion: "Purificación energética de automóviles, motos o vehículos. Protección en viajes y eliminación de energías de accidentes.",
      categoria: "Limpieza Especializada",
      duracionMinutos: 45,
      precio: 8.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-blue-500 to-indigo-500",
      arcangel: "Miguel",
      beneficios: ["Protege en viajes", "Limpia energías", "Previene accidentes"],
      modalidad: "Presencial",
      incluye: ["Limpieza interior y exterior", "Sellado de protección", "Bendición del vehículo"]
    },
    {
      id: 12,
      titulo: "Limpieza Post-Separación o Divorcio",
      descripcion: "Purificación profunda después de una separación. Limpia energías compartidas, libera vínculos y prepara para nuevo comienzo.",
      categoria: "Limpieza Especializada",
      duracionMinutos: 90,
      precio: 15.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      color: "from-violet-500 to-purple-500",
      arcangel: "Chamuel",
      beneficios: ["Libera vínculos", "Limpia energías compartidas", "Prepara nuevo ciclo"],
      modalidad: "Presencial/Online",
      incluye: ["Corte de cordones", "Limpieza de hogar", "Ritual de cierre"]
    },

    // ===== LIMPIEZAS KÁRMICAS =====
    {
      id: 13,
      titulo: "Limpieza de Karma Familiar",
      descripcion: "Purificación de patrones kármicos heredados de tu linaje familiar. Libera cargas ancestrales y sana el árbol genealógico.",
      categoria: "Limpieza Kármica",
      duracionMinutos: 120,
      precio: 19.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      color: "from-purple-500 to-indigo-500",
      arcangel: "Metatrón",
      beneficios: ["Limpia karma familiar", "Libera ancestros", "Sana linaje"],
      modalidad: "Presencial",
      incluye: ["Lectura akáshica", "Liberación transgeneracional", "Sanación del árbol"]
    },
    {
      id: 14,
      titulo: "Limpieza de Votos y Contratos del Alma",
      descripcion: "Liberación de votos de vidas pasadas, contratos del alma y compromisos que ya no sirven a tu evolución.",
      categoria: "Limpieza Kármica",
      duracionMinutos: 90,
      precio: 16.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-indigo-500 to-blue-500",
      arcangel: "Metatrón",
      beneficios: ["Libera votos", "Cancela contratos", "Restaura libertad del alma"],
      modalidad: "Presencial/Online",
      incluye: ["Identificación de votos", "Cancelación de contratos", "Liberación del alma"]
    },
    {
      id: 15,
      titulo: "Limpieza de Maldiciones y Hechizos",
      descripcion: "Remoción de maldiciones, hechizos, mal de ojo y trabajos de magia negra. Protección y restauración de tu luz.",
      categoria: "Limpieza Kármica",
      duracionMinutos: 150,
      precio: 29.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=300&fit=crop",
      color: "from-purple-600 to-violet-600",
      arcangel: "Miguel",
      beneficios: ["Remueve maldiciones", "Elimina hechizos", "Restaura protección"],
      modalidad: "Presencial",
      incluye: ["Diagnóstico espiritual", "Remoción de trabajos", "Escudo de protección permanente"]
    },

    // ===== LIMPIEZAS GRUPALES =====
    {
      id: 16,
      titulo: "Limpieza Familiar Grupal",
      descripcion: "Sesión de limpieza para toda la familia. Armoniza relaciones, libera conflictos y crea ambiente de amor.",
      categoria: "Limpieza Grupal",
      duracionMinutos: 120,
      precio: 39.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      color: "from-orange-500 to-pink-500",
      arcangel: "Jofiel",
      beneficios: ["Armoniza familia", "Libera conflictos", "Crea unión"],
      modalidad: "Presencial",
      incluye: ["Limpieza individual", "Sanación de vínculos", "Bendición familiar"]
    },
    {
      id: 17,
      titulo: "Limpieza de Equipos de Trabajo",
      descripcion: "Purificación energética para equipos de trabajo. Mejora comunicación, elimina conflictos y potencia colaboración.",
      categoria: "Limpieza Grupal",
      duracionMinutos: 90,
      precio: 49.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-500",
      arcangel: "Uriel",
      beneficios: ["Armoniza equipo", "Mejora comunicación", "Potencia resultados"],
      modalidad: "Presencial",
      incluye: ["Limpieza grupal", "Armonización energética", "Activación de sinergia"]
    },

    // ===== LIMPIEZAS DE EMERGENCIA =====
    {
      id: 18,
      titulo: "Limpieza de Emergencia 24/7",
      descripcion: "Servicio de limpieza urgente para situaciones críticas: ataques psíquicos, crisis espirituales o emergencias energéticas.",
      categoria: "Emergencia",
      duracionMinutos: 60,
      precio: 24.99,
      premium: true,
      comprado: false,
      imagen: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      color: "from-red-500 to-orange-500",
      arcangel: "Miguel",
      beneficios: ["Atención inmediata", "Estabilización energética", "Protección urgente"],
      modalidad: "Online",
      incluye: ["Respuesta inmediata", "Limpieza de emergencia", "Seguimiento 24h"]
    }
  ];
};

// Obtener categorías únicas
export const getCategoriasLimpiezas = () => {
  const limpiezas = getLimpiezas();
  const categorias = [...new Set(limpiezas.map(l => l.categoria))];
  return ['Todas', ...categorias];
};

// Obtener arcángeles únicos
export const getArcangelesLimpiezas = () => {
  const limpiezas = getLimpiezas();
  const arcangeles = [...new Set(limpiezas.map(l => l.arcangel))];
  return ['Todos', ...arcangeles];
};

// Obtener limpieza por ID
export const getLimpiezaById = (id) => {
  const limpiezas = getLimpiezas();
  return limpiezas.find(l => l.id === id);
};

// Filtrar limpiezas
export const filtrarLimpiezas = (filtros) => {
  let limpiezas = getLimpiezas();
  
  if (filtros.categoria && filtros.categoria !== 'Todas') {
    limpiezas = limpiezas.filter(l => l.categoria === filtros.categoria);
  }
  
  if (filtros.arcangel && filtros.arcangel !== 'Todos') {
    limpiezas = limpiezas.filter(l => l.arcangel === filtros.arcangel);
  }
  
  if (filtros.precio === 'gratuitas') {
    limpiezas = limpiezas.filter(l => !l.premium || l.precio === 0);
  } else if (filtros.precio === 'premium') {
    limpiezas = limpiezas.filter(l => l.premium && l.precio > 0);
  }
  
  if (filtros.modalidad && filtros.modalidad !== 'Todas') {
    limpiezas = limpiezas.filter(l => l.modalidad.includes(filtros.modalidad));
  }
  
  return limpiezas;
};

