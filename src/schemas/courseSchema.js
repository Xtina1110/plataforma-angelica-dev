/**
 * Genera Schema.org Course para páginas de cursos
 * https://schema.org/Course
 * 
 * @param {object} course - Datos del curso
 * @returns {object} JSON-LD schema
 */
export const generateCourseSchema = (course) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'Plataforma Angélica',
      url: 'https://www.plataformaangelica.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.plataformaangelica.com/logo.png',
      },
    },
    instructor: course.instructor ? {
      '@type': 'Person',
      name: course.instructor.name,
      image: course.instructor.image,
      description: course.instructor.bio,
    } : undefined,
    image: course.image,
    url: `https://www.plataformaangelica.com/academia/cursos/${course.slug}`,
    courseCode: course.id,
    educationalLevel: course.level || 'Beginner',
    inLanguage: 'es',
    availableLanguage: ['es'],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: course.duration || 'PT10H', // ISO 8601 duration
    },
    offers: course.price ? {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://www.plataformaangelica.com/academia/cursos/${course.slug}`,
      validFrom: new Date().toISOString(),
    } : undefined,
    aggregateRating: course.rating ? {
      '@type': 'AggregateRating',
      ratingValue: course.rating.average,
      reviewCount: course.rating.count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: course.reviews ? course.reviews.map(review => ({
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
const courseData = {
  id: 'curso-123',
  slug: 'tarot-angelical-basico',
  name: 'Tarot Angelical Básico',
  description: 'Aprende a leer el tarot angelical y conectar con tus ángeles guardianes',
  image: 'https://www.plataformaangelica.com/cursos/tarot-angelical.jpg',
  instructor: {
    name: 'María Angélica',
    image: 'https://www.plataformaangelica.com/instructores/maria.jpg',
    bio: 'Experta en tarot angelical con 15 años de experiencia',
  },
  level: 'Beginner',
  duration: 'PT10H', // 10 horas
  price: 99.00,
  rating: {
    average: 4.8,
    count: 127,
  },
  reviews: [
    {
      author: 'Ana López',
      date: '2025-01-15',
      text: 'Excelente curso, muy completo',
      rating: 5,
    },
  ],
};

const schema = generateCourseSchema(courseData);
*/
