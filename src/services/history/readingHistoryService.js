/**
 * Servicio de Historial de Tiradas
 * 
 * Gestiona el almacenamiento y recuperación del historial de tiradas
 * del usuario, con análisis de patrones y evolución espiritual
 */

import { supabase } from '../supabase';

/**
 * Guarda una tirada en el historial
 */
export async function saveReading(userId, readingData) {
  try {
    const { data, error } = await supabase
      .from('angel_readings')
      .insert([
        {
          user_id: userId,
          reading_type: readingData.tipoTirada, // 3, 6, 9
          cards: readingData.cartas.map(c => c.id),
          card_names: readingData.cartas.map(c => c.nombre),
          archangels: readingData.cartas.map(c => c.arcangel),
          interpretations: readingData.interpretaciones,
          summary: readingData.resumen,
          theme: readingData.tema,
          environment: readingData.ambiente,
          created_at: new Date().toISOString(),
          metadata: {
            hasAudio: readingData.hasAudio || false,
            hasPDF: readingData.hasPDF || false,
            duration: readingData.duration || 0
          }
        }
      ])
      .select();

    if (error) throw error;

    console.log('Reading saved successfully:', data[0].id);
    return data[0];
  } catch (error) {
    console.error('Error saving reading:', error);
    throw error;
  }
}

/**
 * Obtiene el historial de tiradas del usuario
 */
export async function getUserReadings(userId, limit = 50, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('angel_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching user readings:', error);
    throw error;
  }
}

/**
 * Obtiene una tirada específica por ID
 */
export async function getReadingById(readingId) {
  try {
    const { data, error } = await supabase
      .from('angel_readings')
      .select('*')
      .eq('id', readingId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching reading:', error);
    throw error;
  }
}

/**
 * Analiza patrones en el historial de tiradas
 */
export async function analyzeReadingPatterns(userId) {
  try {
    const readings = await getUserReadings(userId, 100);

    if (readings.length === 0) {
      return {
        totalReadings: 0,
        message: 'Aún no tienes tiradas para analizar'
      };
    }

    // Análisis de arcángeles recurrentes
    const archangelCount = {};
    const cardCount = {};
    const themeCount = {};

    readings.forEach(reading => {
      // Contar arcángeles
      reading.archangels.forEach(arcangel => {
        archangelCount[arcangel] = (archangelCount[arcangel] || 0) + 1;
      });

      // Contar cartas
      reading.card_names.forEach(cardName => {
        cardCount[cardName] = (cardCount[cardName] || 0) + 1;
      });

      // Contar temas
      if (reading.theme) {
        themeCount[reading.theme] = (themeCount[reading.theme] || 0) + 1;
      }
    });

    // Ordenar por frecuencia
    const topArchangels = Object.entries(archangelCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count, percentage: (count / readings.length * 100).toFixed(1) }));

    const topCards = Object.entries(cardCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, percentage: (count / (readings.length * 3) * 100).toFixed(1) }));

    const topThemes = Object.entries(themeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count, percentage: (count / readings.length * 100).toFixed(1) }));

    // Análisis temporal
    const readingsByMonth = {};
    readings.forEach(reading => {
      const month = new Date(reading.created_at).toISOString().slice(0, 7);
      readingsByMonth[month] = (readingsByMonth[month] || 0) + 1;
    });

    // Racha actual
    const today = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    const sortedReadings = [...readings].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    sortedReadings.forEach((reading, index) => {
      const readingDate = new Date(reading.created_at);
      readingDate.setHours(0, 0, 0, 0);

      if (index === 0) {
        const diffDays = Math.floor((today - readingDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0 || diffDays === 1) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else {
        const prevDate = new Date(sortedReadings[index - 1].created_at);
        prevDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((prevDate - readingDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
          if (index === currentStreak) {
            currentStreak = tempStreak;
          }
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
        }
      }

      lastDate = readingDate;
    });

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return {
      totalReadings: readings.length,
      readingsByType: {
        3: readings.filter(r => r.reading_type === 3).length,
        6: readings.filter(r => r.reading_type === 6).length,
        9: readings.filter(r => r.reading_type === 9).length
      },
      topArchangels,
      topCards,
      topThemes,
      readingsByMonth,
      streaks: {
        current: currentStreak,
        longest: longestStreak
      },
      firstReading: readings[readings.length - 1].created_at,
      lastReading: readings[0].created_at,
      averageReadingsPerMonth: (readings.length / Object.keys(readingsByMonth).length).toFixed(1)
    };
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    throw error;
  }
}

/**
 * Genera insights personalizados basados en patrones
 */
export async function generatePatternInsights(userId) {
  try {
    const patterns = await analyzeReadingPatterns(userId);

    if (patterns.totalReadings === 0) {
      return {
        insights: [],
        recommendations: ['Realiza tu primera tirada angelical para comenzar tu viaje espiritual']
      };
    }

    const insights = [];
    const recommendations = [];

    // Insight sobre arcángel dominante
    if (patterns.topArchangels.length > 0) {
      const topArcangel = patterns.topArchangels[0];
      insights.push({
        type: 'archangel',
        title: `${topArcangel.name} es tu guía principal`,
        description: `${topArcangel.name} ha aparecido en el ${topArcangel.percentage}% de tus tiradas. Este arcángel está trabajando intensamente contigo en este momento de tu vida.`,
        icon: '👼',
        color: getArcangelColor(topArcangel.name)
      });

      recommendations.push(`Profundiza tu conexión con ${topArcangel.name} mediante meditaciones específicas`);
    }

    // Insight sobre racha
    if (patterns.streaks.current >= 3) {
      insights.push({
        type: 'streak',
        title: `¡Racha de ${patterns.streaks.current} días!`,
        description: 'Tu constancia en la práctica angelical está fortaleciendo tu conexión espiritual.',
        icon: '🔥',
        color: '#FF6B35'
      });
    } else if (patterns.streaks.current === 0) {
      recommendations.push('Establece una práctica diaria de tiradas para fortalecer tu conexión angelical');
    }

    // Insight sobre carta recurrente
    if (patterns.topCards.length > 0) {
      const topCard = patterns.topCards[0];
      if (topCard.count >= 3) {
        insights.push({
          type: 'card',
          title: `"${topCard.name}" aparece frecuentemente`,
          description: `Esta carta ha salido ${topCard.count} veces. Los ángeles insisten en este mensaje para ti.`,
          icon: '🃏',
          color: '#9370DB'
        });

        recommendations.push(`Medita profundamente sobre el mensaje de "${topCard.name}"`);
      }
    }

    // Insight sobre evolución
    const monthsActive = Object.keys(patterns.readingsByMonth).length;
    if (monthsActive >= 3) {
      insights.push({
        type: 'evolution',
        title: `${monthsActive} meses de crecimiento espiritual`,
        description: `Has realizado ${patterns.totalReadings} tiradas en ${monthsActive} meses. Tu compromiso con el camino angelical es admirable.`,
        icon: '🌱',
        color: '#4CAF50'
      });
    }

    // Recomendaciones generales
    if (patterns.totalReadings < 10) {
      recommendations.push('Explora diferentes tipos de tiradas para obtener perspectivas más profundas');
    }

    if (!patterns.topThemes || patterns.topThemes.length === 0) {
      recommendations.push('Define un tema o intención antes de cada tirada para mayor claridad');
    }

    return {
      insights,
      recommendations,
      patterns
    };
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}

/**
 * Helper para obtener color del arcángel
 */
function getArcangelColor(arcangel) {
  const colors = {
    'Miguel': '#4169E1',
    'Rafael': '#00FF00',
    'Gabriel': '#FFFFFF',
    'Uriel': '#FFD700',
    'Chamuel': '#FF69B4',
    'Jophiel': '#FFFF00',
    'Zadkiel': '#9370DB'
  };
  return colors[arcangel] || '#9370DB';
}

/**
 * Compara dos tiradas para ver evolución
 */
export async function compareReadings(readingId1, readingId2) {
  try {
    const reading1 = await getReadingById(readingId1);
    const reading2 = await getReadingById(readingId2);

    const comparison = {
      timeDifference: Math.floor(
        (new Date(reading2.created_at) - new Date(reading1.created_at)) / (1000 * 60 * 60 * 24)
      ),
      commonArchangels: reading1.archangels.filter(a => 
        reading2.archangels.includes(a)
      ),
      commonCards: reading1.card_names.filter(c => 
        reading2.card_names.includes(c)
      ),
      themeEvolution: {
        from: reading1.theme,
        to: reading2.theme
      }
    };

    return comparison;
  } catch (error) {
    console.error('Error comparing readings:', error);
    throw error;
  }
}

