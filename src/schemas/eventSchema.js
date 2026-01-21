/**
 * Genera Schema.org Event para páginas de eventos
 * https://schema.org/Event
 * 
 * @param {object} event - Datos del evento
 * @returns {object} JSON-LD schema
 */
export const generateEventSchema = (event) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    image: Array.isArray(event.images) ? event.images : [event.image],
    url: `https://www.plataformaangelica.com/eventos/${event.slug}`,
    startDate: event.startDate, // ISO 8601 format: 2025-02-15T19:00:00-05:00
    endDate: event.endDate,
    eventStatus: event.cancelled 
      ? 'https://schema.org/EventCancelled'
      : event.postponed
      ? 'https://schema.org/EventPostponed'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.mode === 'online'
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : event.mode === 'offline'
      ? 'https://schema.org/OfflineEventAttendanceMode'
      : 'https://schema.org/MixedEventAttendanceMode',
    location: event.mode === 'online' ? {
      '@type': 'VirtualLocation',
      url: event.virtualUrl || 'https://www.plataformaangelica.com/eventos/sala-virtual',
    } : {
      '@type': 'Place',
      name: event.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.street,
        addressLocality: event.location.city,
        addressRegion: event.location.state,
        postalCode: event.location.zip,
        addressCountry: event.location.country || 'MX',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Plataforma Angélica',
      url: 'https://www.plataformaangelica.com',
    },
    performer: event.performer ? {
      '@type': 'Person',
      name: event.performer.name,
      image: event.performer.image,
    } : undefined,
    offers: event.price !== undefined ? {
      '@type': 'Offer',
      url: `https://www.plataformaangelica.com/eventos/${event.slug}`,
      price: event.price,
      priceCurrency: 'USD',
      availability: event.soldOut 
        ? 'https://schema.org/SoldOut'
        : event.availableSeats > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/LimitedAvailability',
      validFrom: event.ticketSaleStart || new Date().toISOString(),
      validThrough: event.ticketSaleEnd || event.startDate,
      inventoryLevel: {
        '@type': 'QuantitativeValue',
        value: event.availableSeats,
      },
    } : {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: event.rating ? {
      '@type': 'AggregateRating',
      ratingValue: event.rating.average,
      reviewCount: event.rating.count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: event.reviews ? event.reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })) : undefined,
  };
};

// Ejemplo de uso:
/*
const eventData = {
  id: 'event-789',
  slug: 'meditacion-luna-llena-febrero',
  name: 'Meditación de Luna Llena - Febrero 2025',
  description: 'Únete a nuestra meditación guiada especial de luna llena para liberar energías y manifestar tus deseos',
  image: 'https://www.plataformaangelica.com/eventos/luna-llena.jpg',
  images: [
    'https://www.plataformaangelica.com/eventos/luna-llena-1.jpg',
    'https://www.plataformaangelica.com/eventos/luna-llena-2.jpg',
  ],
  startDate: '2025-02-15T19:00:00-05:00',
  endDate: '2025-02-15T21:00:00-05:00',
  mode: 'online', // 'online', 'offline', 'mixed'
  virtualUrl: 'https://zoom.us/j/123456789',
  performer: {
    name: 'María Angélica',
    image: 'https://www.plataformaangelica.com/instructores/maria.jpg',
  },
  price: 25.00,
  availableSeats: 50,
  soldOut: false,
  ticketSaleStart: '2025-01-20T00:00:00-05:00',
  ticketSaleEnd: '2025-02-15T18:00:00-05:00',
  rating: {
    average: 4.9,
    count: 87,
  },
  reviews: [
    {
      author: 'Carmen Ruiz',
      date: '2025-01-18',
      text: 'Experiencia transformadora, altamente recomendado',
      rating: 5,
    },
  ],
};

const schema = generateEventSchema(eventData);
*/
