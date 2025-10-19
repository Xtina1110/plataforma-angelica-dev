// Canalizaciones Angelicales - Sistema completo con marketplace
// 9 canalizaciones premium ($7.99) + 5 canalizaciones gratuitas

const canalizaciones = [
  // ==========================================
  // CANALIZACIONES PREMIUM ($7.99)
  // Duración: 25-30 minutos
  // ==========================================
  
  {
    id: 'arcangel-miguel',
    titulo: 'Arcángel Miguel: Espada Azul de Protección',
    arcangel: 'Arcángel Miguel',
    categoria: 'Protección',
    descripcion: 'Canalización profunda para activar tu fuerza interior, protección energética y claridad de propósito. Conecta con la energía del Arcángel Miguel, Príncipe de la Luz Azul.',
    descripcionCorta: 'Activa tu fuerza interior y protección energética con el Arcángel Miguel.',
    proposito: 'Ideal para momentos de miedo, confusión, energías densas, ataques psíquicos o sensación de pérdida de rumbo.',
    
    // Metadatos
    duracion: '25-30 minutos',
    duracionMinutos: 27,
    frecuenciaSonora: '444 Hz o 432 Hz',
    colorVibracional: 'azul zafiro y plata',
    cristalRecomendado: 'lapislázuli o amatista',
    
    // Música sugerida
    musicaSugerida: {
      frecuencia: '444 Hz (protección celestial) + pads 432 Hz',
      instrumentos: 'cuencos cristalinos, arpas, campanas de metal fino',
      duracionTrack: '25 minutos',
      finalizacion: 'viento suave y campanillas x3'
    },
    
    // Imagen
    imagen: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop',
    color: 'from-blue-500 to-cyan-600',
    
    // Premium y precio
    premium: true,
    precio: 7.99,
    comprado: false, // Por defecto no comprado
    
    // Contenido completo (mantener el existente)
    contenido: {
      // ... contenido completo existente
    },
    
    decretoFinal: '"Yo soy la fuerza y la protección de la Luz Azul. Ningún miedo me domina, ninguna oscuridad me toca. Camino con la espada de la verdad y el manto de la paz."',
    afirmacionDiaria: '"Estoy protegido, guiado y fortalecido por el Arcángel Miguel."',
    
    tags: ['protección', 'fuerza', 'claridad', 'Miguel', 'espada azul', 'liberación'],
    fechaCreacion: '2024-10-19',
    popularidad: 98,
    rating: 5.0,
    reproducciones: 0,
    tipo: 'completa' // Nueva propiedad
  },
  
  // ... (Las otras 8 canalizaciones premium con la misma estructura)
  // Por brevedad, solo muestro la estructura. En el archivo real incluiré todas.
];

// Funciones helper
export const getCanalizaciones = () => canalizaciones;

export const getCanalizacionById = (id) => {
  return canalizaciones.find(c => c.id === id);
};

export const getCanalizacionesByCategoria = (categoria) => {
  return canalizaciones.filter(c => c.categoria === categoria);
};

export const getCanalizacionesByArcangel = (arcangel) => {
  return canalizaciones.filter(c => c.arcangel === arcangel);
};

export const getCanalizacionesGratuitas = () => {
  return canalizaciones.filter(c => !c.premium || c.precio === 0);
};

export const getCanalizacionesPremium = () => {
  return canalizaciones.filter(c => c.premium && c.precio > 0);
};

export const getCanalizacionesCompradas = () => {
  return canalizaciones.filter(c => c.comprado);
};

export const getCanalizacionesDisponibles = () => {
  return canalizaciones.filter(c => !c.premium || c.comprado);
};

export default canalizaciones;

