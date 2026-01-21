import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Gestiona meta tags dinámicos para SEO
 * 
 * @param {string} title - Título de la página (se agregará " | Plataforma Angélica")
 * @param {string} description - Meta description (150-160 caracteres recomendado)
 * @param {string} image - URL de la imagen para Open Graph (1200x630px recomendado)
 * @param {string} url - URL canónica de la página
 * @param {string} type - Tipo de contenido Open Graph (website, article, product, etc.)
 * @param {object} schema - Objeto JSON-LD para structured data
 * @param {string} keywords - Keywords separadas por comas (opcional)
 * @param {string} author - Autor del contenido (opcional)
 * @param {string} publishedTime - Fecha de publicación ISO 8601 (opcional)
 * @param {string} modifiedTime - Fecha de modificación ISO 8601 (opcional)
 */
const SEO = ({
  title,
  description,
  image = 'https://www.plataformaangelica.com/og-default.jpg',
  url,
  type = 'website',
  schema = null,
  keywords = '',
  author = 'Plataforma Angélica',
  publishedTime = '',
  modifiedTime = '',
}) => {
  const siteTitle = 'Plataforma Angélica';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Meta Tags Básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="es_ES" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Spanish" />
    </Helmet>
  );
};

export default SEO;
