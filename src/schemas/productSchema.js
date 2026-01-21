/**
 * Genera Schema.org Product para páginas de productos
 * https://schema.org/Product
 * 
 * @param {object} product - Datos del producto
 * @returns {object} JSON-LD schema
 */
export const generateProductSchema = (product) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: Array.isArray(product.images) ? product.images : [product.image],
    url: `https://www.plataformaangelica.com/tienda/productos/${product.slug}`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Plataforma Angélica',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.plataformaangelica.com/tienda/productos/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: product.priceValidUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Plataforma Angélica',
        url: 'https://www.plataformaangelica.com',
      },
      shippingDetails: product.shipping ? {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: product.shipping.cost,
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: product.shipping.countries || ['US', 'MX', 'ES'],
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: product.shipping.minDays || 5,
            maxValue: product.shipping.maxDays || 10,
            unitCode: 'DAY',
          },
        },
      } : undefined,
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.average,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: product.reviews ? product.reviews.map(review => ({
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
    category: product.category,
    material: product.material,
    color: product.color,
    weight: product.weight ? {
      '@type': 'QuantitativeValue',
      value: product.weight.value,
      unitCode: product.weight.unit || 'GRM',
    } : undefined,
  };
};

// Ejemplo de uso:
/*
const productData = {
  id: 'prod-456',
  slug: 'cristal-cuarzo-rosa',
  sku: 'CQR-001',
  name: 'Cristal de Cuarzo Rosa',
  description: 'Cristal natural de cuarzo rosa para amor y sanación emocional',
  image: 'https://www.plataformaangelica.com/productos/cuarzo-rosa.jpg',
  images: [
    'https://www.plataformaangelica.com/productos/cuarzo-rosa-1.jpg',
    'https://www.plataformaangelica.com/productos/cuarzo-rosa-2.jpg',
  ],
  brand: 'Cristales Angelicales',
  price: 29.99,
  priceValidUntil: '2025-12-31',
  inStock: true,
  category: 'Cristales',
  material: 'Cuarzo Rosa Natural',
  color: 'Rosa',
  weight: {
    value: 50,
    unit: 'GRM',
  },
  shipping: {
    cost: 5.99,
    countries: ['US', 'MX', 'ES'],
    minDays: 5,
    maxDays: 10,
  },
  rating: {
    average: 4.9,
    count: 234,
  },
  reviews: [
    {
      author: 'Laura Martínez',
      date: '2025-01-10',
      text: 'Hermoso cristal, llegó muy bien empaquetado',
      rating: 5,
    },
  ],
};

const schema = generateProductSchema(productData);
*/
