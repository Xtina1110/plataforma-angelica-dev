import { cartasAngelicas } from '../../data/cartasAngelicas';

/**
 * Mapeo de cartas a arcángeles basado en sus características
 * Este mapeo se basa en el elemento, color y significado de cada carta
 */
const CARD_TO_ARCHANGEL_MAP = {
  // Miguel - Protección, Fuerza, Valentía (Azul)
  'Ángeles de la Guarda': 'Miguel',
  'Ángeles de la Protección': 'Miguel',
  'Ángeles de la Valentía': 'Miguel',
  'Ángeles de la Fuerza': 'Miguel',
  
  // Rafael - Sanación, Salud (Verde)
  'Ángeles de la Sanación': 'Rafael',
  'Ángeles de la Salud': 'Rafael',
  'Ángeles de la Tranquilidad': 'Rafael',
  
  // Gabriel - Comunicación, Claridad (Blanco)
  'Ángeles de la Comunicación': 'Gabriel',
  'Ángeles de la Claridad': 'Gabriel',
  'Ángeles de la Verdad': 'Gabriel',
  
  // Uriel - Sabiduría, Iluminación (Dorado)
  'Ángeles de la Abundancia': 'Uriel',
  'Ángeles de la Sabiduría': 'Uriel',
  'Ángeles de la Iluminación': 'Uriel',
  
  // Chamuel - Amor, Relaciones (Rosa)
  'Ángeles del Amor': 'Chamuel',
  'Ángeles de la Familia': 'Chamuel',
  'Ángeles de las Relaciones': 'Chamuel',
  'Ángeles de la Aceptación': 'Chamuel',
  
  // Jophiel - Belleza, Creatividad (Amarillo)
  'Ángeles de la Creatividad': 'Jophiel',
  'Ángeles de la Belleza': 'Jophiel',
  'Ángeles de la Alegría': 'Jophiel',
  
  // Zadkiel - Transformación, Perdón (Púrpura)
  'Ángeles de la Transformación': 'Zadkiel',
  'Ángeles del Perdón': 'Zadkiel',
  'Ángeles de la Liberación': 'Zadkiel'
};

/**
 * Colores de los arcángeles para efectos visuales
 */
export const ARCANGEL_COLORS = {
  'Miguel': '#4169E1', // Azul real
  'Rafael': '#00FF00', // Verde esmeralda
  'Gabriel': '#FFFFFF', // Blanco puro
  'Uriel': '#FFD700', // Dorado
  'Chamuel': '#FF69B4', // Rosa
  'Jophiel': '#FFFF00', // Amarillo dorado
  'Zadkiel': '#9370DB', // Púrpura
};

/**
 * Obtiene el arcángel asociado a una carta
 */
export function getArcangelForCard(cardName) {
  return CARD_TO_ARCHANGEL_MAP[cardName] || 'Uriel'; // Default a Uriel
}

/**
 * Obtiene el color del arcángel de una carta
 */
export function getArcangelColor(cardName) {
  const arcangel = getArcangelForCard(cardName);
  return ARCANGEL_COLORS[arcangel] || '#9370DB';
}

/**
 * Obtiene todas las cartas angelicales con información de arcángel
 */
export function getAllCardsWithArchangels() {
  return cartasAngelicas.map(carta => ({
    ...carta,
    arcangel: getArcangelForCard(carta.nombre),
    arcangelColor: getArcangelColor(carta.nombre)
  }));
}

/**
 * Obtiene una carta por ID
 */
export function getCardById(id) {
  const carta = cartasAngelicas.find(c => c.id === id);
  if (!carta) return null;
  
  return {
    ...carta,
    arcangel: getArcangelForCard(carta.nombre),
    arcangelColor: getArcangelColor(carta.nombre)
  };
}

/**
 * Baraja las cartas y selecciona N cartas aleatorias
 */
export function drawRandomCards(count) {
  const allCards = getAllCardsWithArchangels();
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Obtiene cartas para un tipo de tirada específico
 */
export function getCardsForReading(tipoTirada) {
  const cardCounts = {
    3: 3,
    6: 6,
    9: 9
  };
  
  const count = cardCounts[tipoTirada] || 3;
  return drawRandomCards(count);
}

/**
 * Formatea la información de la carta para la interpretación con IA
 */
export function formatCardForAI(carta) {
  return {
    nombre: carta.nombre,
    arcangel: carta.arcangel,
    significadoGeneral: carta.significado,
    elemento: carta.elemento,
    chakra: carta.cristal, // Usamos el cristal como referencia de chakra
    mensaje: carta.mensaje,
    afirmacion: carta.afirmacion
  };
}

/**
 * Obtiene la imagen de reverso de las cartas
 */
export function getCardBackImage() {
  // Puedes crear una imagen personalizada de reverso
  // Por ahora, usamos un placeholder
  return '/lovable-uploads/reverso-carta-angelical.png';
}

/**
 * Valida si una carta tiene toda la información necesaria
 */
export function validateCard(carta) {
  const requiredFields = ['id', 'nombre', 'imagen', 'significado', 'mensaje'];
  return requiredFields.every(field => carta[field]);
}

/**
 * Obtiene estadísticas de las cartas
 */
export function getCardStats() {
  const cards = getAllCardsWithArchangels();
  
  const arcangelCount = {};
  cards.forEach(card => {
    arcangelCount[card.arcangel] = (arcangelCount[card.arcangel] || 0) + 1;
  });
  
  return {
    totalCards: cards.length,
    arcangelDistribution: arcangelCount,
    validCards: cards.filter(validateCard).length
  };
}

