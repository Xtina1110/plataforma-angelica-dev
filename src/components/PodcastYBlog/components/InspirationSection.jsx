import React from 'react';
import { Sparkles } from 'lucide-react';

const InspirationSection = () => (
  <div className="inspiration-section" style={{ maxWidth: '900px', margin: '4rem auto 0' }}>
    <h3 className="inspiration-title">
      <Sparkles size={24} />
      Inspiración Angelical
    </h3>
    <p className="inspiration-text">
      "Cada artículo es una semilla de luz plantada en tu conciencia. 
      Permite que estas palabras florezcan en tu corazón y te guíen 
      hacia la transformación espiritual que tu alma busca."
    </p>
  </div>
);

export default InspirationSection;