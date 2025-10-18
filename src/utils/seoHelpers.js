/**
 * SEO Helpers for Plataforma Angélica Blog
 * Utilities for generating SEO-friendly metadata
 */

/**
 * Generate meta tags for blog articles
 * @param {Object} articulo - Article object
 * @returns {Object} Meta tags object
 */
export const generateArticleMetaTags = (articulo) => {
  if (!articulo) return {};

  return {
    title: `${articulo.titulo} | Blog Angélica`,
    description: articulo.resumen || articulo.titulo,
    keywords: articulo.tags?.join(', ') || '',
    author: articulo.autor || 'Angélica Luz',
    publishedTime: articulo.fecha,
    modifiedTime: articulo.fechaModificacion || articulo.fecha,
    
    // Open Graph
    ogTitle: articulo.titulo,
    ogDescription: articulo.resumen,
    ogImage: articulo.imagen,
    ogType: 'article',
    ogUrl: `https://plataforma-angelica.com/blog/${articulo.id}`,
    
    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: articulo.titulo,
    twitterDescription: articulo.resumen,
    twitterImage: articulo.imagen,
    
    // Article specific
    articleSection: articulo.categoria,
    articleTag: articulo.tags?.join(', '),
    articleAuthor: articulo.autor,
  };
};

/**
 * Generate JSON-LD structured data for article
 * @param {Object} articulo - Article object
 * @returns {string} JSON-LD string
 */
export const generateArticleStructuredData = (articulo) => {
  if (!articulo) return '';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: articulo.titulo,
    description: articulo.resumen,
    image: articulo.imagen,
    datePublished: articulo.fecha,
    dateModified: articulo.fechaModificacion || articulo.fecha,
    author: {
      '@type': 'Person',
      name: articulo.autor || 'Angélica Luz',
      url: 'https://plataforma-angelica.com/sobre-nosotros'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Plataforma Angélica',
      logo: {
        '@type': 'ImageObject',
        url: 'https://plataforma-angelica.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://plataforma-angelica.com/blog/${articulo.id}`
    },
    keywords: articulo.tags?.join(', '),
    articleSection: articulo.categoria,
    wordCount: articulo.contenido?.split(' ').length || 0,
    commentCount: articulo.comentarios || 0,
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: articulo.likes || 0
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ShareAction',
        userInteractionCount: articulo.compartidos || 0
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: articulo.comentarios || 0
      }
    ]
  };

  return JSON.stringify(structuredData);
};

/**
 * Generate canonical URL for article
 * @param {string} articuloId - Article ID
 * @returns {string} Canonical URL
 */
export const generateCanonicalUrl = (articuloId) => {
  return `https://plataforma-angelica.com/blog/${articuloId}`;
};

/**
 * Generate breadcrumb structured data
 * @param {Object} articulo - Article object
 * @returns {string} JSON-LD string
 */
export const generateBreadcrumbData = (articulo) => {
  if (!articulo) return '';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://plataforma-angelica.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://plataforma-angelica.com/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: articulo.categoria,
        item: `https://plataforma-angelica.com/blog/categoria/${articulo.categoria.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: articulo.titulo,
        item: `https://plataforma-angelica.com/blog/${articulo.id}`
      }
    ]
  };

  return JSON.stringify(breadcrumb);
};

/**
 * Calculate estimated reading time
 * @param {string} content - Article content
 * @param {number} wordsPerMinute - Reading speed (default: 200)
 * @returns {string} Reading time string
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return '1 min';
  
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min`;
};

/**
 * Generate slug from title
 * @param {string} title - Article title
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove duplicate hyphens
};

/**
 * Extract excerpt from content
 * @param {string} content - Full content
 * @param {number} maxLength - Maximum length (default: 160)
 * @returns {string} Excerpt
 */
export const extractExcerpt = (content, maxLength = 160) => {
  if (!content) return '';
  
  const text = content.replace(/\*\*/g, '').replace(/\n/g, ' ').trim();
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @param {string} locale - Locale (default: 'es-ES')
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, locale = 'es-ES') => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Generate social share URLs
 * @param {Object} articulo - Article object
 * @returns {Object} Share URLs
 */
export const generateShareUrls = (articulo) => {
  const url = encodeURIComponent(`https://plataforma-angelica.com/blog/${articulo.id}`);
  const text = encodeURIComponent(articulo.titulo);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    email: `mailto:?subject=${text}&body=${url}`
  };
};

export default {
  generateArticleMetaTags,
  generateArticleStructuredData,
  generateCanonicalUrl,
  generateBreadcrumbData,
  calculateReadingTime,
  generateSlug,
  extractExcerpt,
  formatDate,
  generateShareUrls
};

