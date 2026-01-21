/**
 * Genera Schema.org Article para páginas de blog
 * https://schema.org/Article
 * 
 * @param {object} article - Datos del artículo
 * @returns {object} JSON-LD schema
 */
export const generateArticleSchema = (article) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: Array.isArray(article.images) ? article.images : [article.image],
    url: `https://www.plataformaangelica.com/blog/${article.slug}`,
    datePublished: article.publishedDate, // ISO 8601: 2025-01-20T10:00:00-05:00
    dateModified: article.modifiedDate || article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url || `https://www.plataformaangelica.com/autores/${article.author.slug}`,
      image: article.author.image,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Plataforma Angélica',
      url: 'https://www.plataformaangelica.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.plataformaangelica.com/logo.png',
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.plataformaangelica.com/blog/${article.slug}`,
    },
    articleSection: article.category,
    keywords: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags,
    wordCount: article.wordCount,
    inLanguage: 'es',
    aggregateRating: article.rating ? {
      '@type': 'AggregateRating',
      ratingValue: article.rating.average,
      reviewCount: article.rating.count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  };
};

/**
 * Genera Schema.org BlogPosting (alternativa más específica para blogs)
 * https://schema.org/BlogPosting
 */
export const generateBlogPostingSchema = (article) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: Array.isArray(article.images) ? article.images : [article.image],
    url: `https://www.plataformaangelica.com/blog/${article.slug}`,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url || `https://www.plataformaangelica.com/autores/${article.author.slug}`,
      image: article.author.image,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Plataforma Angélica',
      url: 'https://www.plataformaangelica.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.plataformaangelica.com/logo.png',
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.plataformaangelica.com/blog/${article.slug}`,
    },
    articleSection: article.category,
    keywords: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags,
    wordCount: article.wordCount,
    inLanguage: 'es',
    commentCount: article.commentCount || 0,
  };
};

// Ejemplo de uso:
/*
const articleData = {
  id: 'article-101',
  slug: 'como-conectar-con-tus-angeles-guardianes',
  title: 'Cómo Conectar con tus Ángeles Guardianes: Guía Completa',
  description: 'Descubre las técnicas más efectivas para establecer una conexión profunda con tus ángeles guardianes y recibir su guía divina',
  image: 'https://www.plataformaangelica.com/blog/angeles-guardianes.jpg',
  images: [
    'https://www.plataformaangelica.com/blog/angeles-guardianes-1.jpg',
    'https://www.plataformaangelica.com/blog/angeles-guardianes-2.jpg',
  ],
  publishedDate: '2025-01-20T10:00:00-05:00',
  modifiedDate: '2025-01-21T15:30:00-05:00',
  author: {
    name: 'María Angélica',
    slug: 'maria-angelica',
    image: 'https://www.plataformaangelica.com/autores/maria.jpg',
  },
  category: 'Espiritualidad',
  tags: ['ángeles', 'conexión espiritual', 'guía angelical', 'meditación'],
  wordCount: 1500,
  commentCount: 23,
  rating: {
    average: 4.8,
    count: 45,
  },
};

const schema = generateArticleSchema(articleData);
// o
const blogSchema = generateBlogPostingSchema(articleData);
*/
