import React, { useState } from 'react';
import { Mail, Phone, Instagram, Facebook, MessageCircle, Youtube, X, Send, CheckCircle, AlertCircle, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import AuthPageLayout from './AuthPageLayout';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';

const Contacto = () => {
  const { getCurrentTranslation } = useLanguage();
  const t = getCurrentTranslation();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    try {
      // Validación básica
      if (!formData.nombre || !formData.email || !formData.mensaje) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor introduce un email válido');
      }

      // Insertar en Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            nombre: formData.nombre,
            email: formData.email,
            asunto: formData.asunto || 'Consulta general',
            mensaje: formData.mensaje,
            fecha: new Date().toISOString(),
            estado: 'pendiente'
          }
        ]);

      if (error) throw error;

      // Éxito
      setFormStatus({ loading: false, success: true, error: null });
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });

      // Resetear mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setFormStatus({ loading: false, success: false, error: null });
      }, 5000);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: error.message || 'Error al enviar el mensaje. Por favor intenta de nuevo.' 
      });
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contacto@plataformaangelica.com',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      link: 'mailto:contacto@plataformaangelica.com'
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '+123 456 789',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      link: 'https://wa.me/123456789?text=Hola%2C%20me%20gustaría%20obtener%20más%20información%20sobre%20Plataforma%20Angélica'
    },
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@elangeologo',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      link: 'https://www.instagram.com/elangeologo/'
    },
    {
      icon: Facebook,
      title: 'Facebook',
      value: 'El Angeólogo',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      link: 'https://www.facebook.com/elangeologo'
    },
    {
      icon: Youtube,
      title: 'YouTube',
      value: '@JuanCarlosAvilaElangeologo',
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      link: 'https://www.youtube.com/@JuanCarlosAvilaElangeologo'
    },
    {
      icon: X,
      title: 'X (Twitter)',
      value: 'Próximamente',
      color: 'from-gray-800 to-black',
      bgColor: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      link: null
    }
  ];

  const faqs = [
    {
      question: '¿Cuánto tiempo tardan en responder?',
      answer: 'Respondemos a todas las consultas en un plazo de 24-48 horas hábiles.'
    },
    {
      question: '¿Puedo agendar una consulta directamente?',
      answer: 'Sí, puedes agendar directamente desde la plataforma una vez registrado.'
    },
    {
      question: '¿Ofrecen consultas gratuitas?',
      answer: 'Ofrecemos una primera consulta de orientación de 15 minutos sin costo.'
    },
    {
      question: '¿Tienen servicio de atención telefónica?',
      answer: 'Actualmente atendemos principalmente por WhatsApp y email para mejor seguimiento.'
    }
  ];

  return (
    <>
      {/* Botones de idioma y audio */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-3">
        <LanguageSelector inline variant="loading" />
        <AudioButton variant="loading" />
      </div>

      <AuthPageLayout
        title="Contacto"
        icon={MessageCircle}
        maxWidth="max-w-6xl"
      >
        <div className="space-y-8">
          {/* Descripción principal */}
          <div className="text-center">
            <p className="text-gray-700 text-base leading-relaxed">
              Estamos aquí para ayudarte en tu camino espiritual. Contáctanos a través de 
              cualquiera de estos medios y te responderemos lo antes posible.
            </p>
          </div>

          {/* Información de horarios */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} className="text-purple-600" />
              <span><strong>Horario:</strong> Lun-Vie 9:00-18:00 CET</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} className="text-purple-600" />
              <span><strong>Ubicación:</strong> Madrid, España</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario de contacto */}
            <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Send size={24} className="text-purple-600" />
                Envíanos un Mensaje
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Asunto */}
                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto
                  </label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                {/* Mensajes de estado */}
                {formStatus.success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">¡Mensaje enviado con éxito! Te responderemos pronto.</span>
                  </div>
                )}

                {formStatus.error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{formStatus.error}</span>
                  </div>
                )}

                {/* Botón enviar */}
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {formStatus.loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Mensaje
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Campos obligatorios
                </p>
              </form>
            </div>

            {/* Métodos de contacto */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Otros Medios de Contacto
              </h3>
              
              <div className="grid gap-3">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.link || '#'}
                      target={method.link ? '_blank' : undefined}
                      rel={method.link ? 'noopener noreferrer' : undefined}
                      className={`bg-gradient-to-br ${method.bgColor} p-4 rounded-xl border ${method.borderColor} hover:shadow-lg transition-all duration-300 group ${!method.link ? 'pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                          <IconComponent size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-900">{method.title}</h4>
                          <p className="text-sm text-gray-700 font-medium">{method.value}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* FAQ rápido */}
              <div className="mt-6 bg-purple-50 rounded-xl p-5 border border-purple-200">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Preguntas Frecuentes</h4>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <p className="text-sm font-semibold text-purple-900">{faq.question}</p>
                      <p className="text-sm text-gray-700 mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de agradecimiento */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              ¡Gracias por comunicarte con nosotros!
            </h3>
            <p className="text-gray-800 font-medium">
              Te responderemos lo antes posible para ayudarte en tu camino espiritual 🌟
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Tiempo estimado de respuesta: 24-48 horas hábiles
            </p>
          </div>

          {/* Links relacionados */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="/terminos"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
            >
              Ver Términos de Uso →
            </a>
            <a
              href="/politica"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
            >
              Ver Política de Privacidad →
            </a>
          </div>
        </div>
      </AuthPageLayout>
    </>
  );
};

export default Contacto;

