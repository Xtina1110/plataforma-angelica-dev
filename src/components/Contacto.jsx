import React from 'react';
import { Mail, Phone, Instagram, Facebook, MessageCircle, Youtube, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ModernPageLayout from './ModernPageLayout';

// Imagen temática para contacto
const contactHeaderImage = 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&h=400&fit=crop';

const Contacto = () => {
  const { getCurrentTranslation } = useLanguage();
  const t = getCurrentTranslation();

  return (
    <ModernPageLayout
      title={t.contactPage?.title || 'Contacto'}
      headerImage={contactHeaderImage}
      icon={MessageCircle}
    >
      {/* Descripción principal */}
      <div className="text-center mb-8">
        <p className="text-gray-900 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
          {t.contactPage?.description || 'Estamos aquí para ayudarte. Contáctanos a través de cualquiera de estos medios:'}
        </p>
      </div>

      {/* Métodos de contacto */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Email */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Mail size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-800 font-medium">
                contacto@plataformaangelica.com
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Phone size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">WhatsApp</h3>
              <p className="text-gray-800 font-medium">
                {t.contactPage?.whatsapp?.replace('WhatsApp: ', '') || '+123 456 789'}
              </p>
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Instagram size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Instagram</h3>
              <a 
                href="https://www.instagram.com/elangeologo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-800 font-medium hover:text-pink-600 transition-colors"
              >
                @elangeologo
              </a>
            </div>
          </div>
        </div>

        {/* Facebook */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Facebook size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Facebook</h3>
              <a 
                href="https://www.facebook.com/elangeologo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-800 font-medium hover:text-blue-600 transition-colors"
              >
                El Angeólogo
              </a>
            </div>
          </div>
        </div>

        {/* YouTube */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Youtube size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">YouTube</h3>
              <a 
                href="https://www.youtube.com/@JuanCarlosAvilaElangeologo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-800 font-medium hover:text-red-600 transition-colors"
              >
                @JuanCarlosAvilaElangeologo
              </a>
            </div>
          </div>
        </div>

        {/* X (Twitter) */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <X size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">X (Twitter)</h3>
              <p className="text-gray-800 font-medium">
                Próximamente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de agradecimiento */}
      <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {t.contactPage?.thanks || '¡Gracias por comunicarte con nosotros!'}
        </h3>
        <p className="text-gray-800 font-medium">
          {t.contactPage?.responseMessage || 'Te responderemos lo antes posible para ayudarte en tu camino espiritual 🌟'}
        </p>
      </div>
    </ModernPageLayout>
  );
};

export default Contacto;
