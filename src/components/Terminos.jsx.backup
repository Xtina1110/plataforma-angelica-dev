import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Search, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AuthPageLayout from './AuthPageLayout';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';

// Imagen temática para términos
const termsHeaderImage = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop';

const Terminos = () => {
  const { getCurrentTranslation } = useLanguage();
  const t = getCurrentTranslation();
  const [expandedSections, setExpandedSections] = useState([0]); // Primera sección expandida por defecto
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (index) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const expandAll = () => {
    setExpandedSections(sections.map((_, index) => index));
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  const sections = [
    {
      title: "1. Aceptación de Términos",
      icon: "✅",
      color: "from-purple-500 to-purple-600",
      content: `Al acceder y utilizar la Plataforma Angélica, aceptas estar legalmente vinculado por estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.

Estos términos constituyen un acuerdo legal entre tú (el "Usuario") y Plataforma Angélica (el "Servicio"). Al crear una cuenta, realizar una reserva o utilizar cualquiera de nuestros servicios, confirmas que has leído, entendido y aceptado estos términos en su totalidad.

La aceptación de estos términos también implica tu consentimiento para recibir comunicaciones electrónicas relacionadas con tu cuenta y los servicios contratados.`
    },
    {
      title: "2. Descripción de Servicios",
      icon: "🌟",
      color: "from-blue-500 to-blue-600",
      content: `Plataforma Angélica ofrece una variedad de servicios espirituales y de bienestar, incluyendo pero no limitándose a:

**Servicios Principales:**
- Consultas de tarot y astrología con terapeutas certificados
- Sesiones de sonoterapia y meditación guiada
- Canalizaciones angélicas personalizadas
- Terapias de limpieza energética y reiki
- Cursos y talleres de desarrollo espiritual
- Eventos en vivo y retiros espirituales
- Tienda de productos espirituales y herramientas de sanación

**Modalidades de Servicio:**
- Sesiones en línea a través de videollamada segura
- Consultas presenciales (según disponibilidad)
- Contenido grabado y bajo demanda
- Membresías con acceso a contenido exclusivo

Todos nuestros servicios tienen fines espirituales, de crecimiento personal y bienestar emocional. No sustituyen tratamientos médicos, psicológicos o terapéuticos profesionales.`
    },
    {
      title: "3. Cuentas de Usuario y Responsabilidades",
      icon: "👤",
      color: "from-green-500 to-green-600",
      content: `**Creación de Cuenta:**
Para utilizar nuestros servicios, debes crear una cuenta proporcionando información veraz, actual y completa. Eres responsable de mantener la confidencialidad de tus credenciales de acceso.

**Responsabilidades del Usuario:**
- Proporcionar información precisa y actualizada
- Mantener la seguridad de tu contraseña
- Notificar inmediatamente cualquier uso no autorizado de tu cuenta
- No compartir tu cuenta con terceros
- Cumplir con todas las leyes aplicables al usar nuestros servicios
- Tratar con respeto a terapeutas y otros usuarios

**Restricciones:**
- Debes ser mayor de 18 años o tener consentimiento parental
- No puedes usar el servicio para fines ilegales o no autorizados
- No puedes intentar acceder a áreas restringidas del sistema
- No puedes copiar, distribuir o modificar nuestro contenido sin autorización

**Suspensión de Cuenta:**
Nos reservamos el derecho de suspender o cancelar tu cuenta si violas estos términos, sin previo aviso y sin reembolso.`
    },
    {
      title: "4. Contenido y Propiedad Intelectual",
      icon: "©️",
      color: "from-yellow-500 to-amber-600",
      content: `**Propiedad del Contenido:**
Todo el contenido disponible en Plataforma Angélica, incluyendo textos, gráficos, logos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de Plataforma Angélica o de sus proveedores de contenido y está protegido por leyes de propiedad intelectual.

**Licencia de Uso:**
Te otorgamos una licencia limitada, no exclusiva, intransferible y revocable para acceder y usar nuestros servicios para tu uso personal y no comercial.

**Contenido Generado por Usuarios:**
Al publicar comentarios, reseñas o cualquier otro contenido en nuestra plataforma, nos otorgas una licencia mundial, libre de regalías, perpetua e irrevocable para usar, reproducir, modificar y distribuir dicho contenido.

**Restricciones:**
- No puedes reproducir, duplicar, copiar, vender o explotar ninguna parte del servicio sin nuestro permiso expreso
- No puedes grabar, distribuir o compartir sesiones privadas sin consentimiento
- El contenido de cursos y talleres es solo para uso personal

**Marcas Registradas:**
"Plataforma Angélica", "El Angeólogo" y todos los logos relacionados son marcas registradas. No puedes usar estas marcas sin autorización previa por escrito.`
    },
    {
      title: "5. Pagos y Suscripciones",
      icon: "💳",
      color: "from-pink-500 to-rose-600",
      content: `**Precios:**
Todos los precios están expresados en Euros (EUR) e incluyen los impuestos aplicables según la legislación vigente. Nos reservamos el derecho de modificar nuestros precios en cualquier momento, pero los cambios no afectarán a servicios ya contratados.

**Métodos de Pago:**
Aceptamos pagos a través de tarjetas de crédito/débito, PayPal y otros métodos de pago electrónico procesados de forma segura a través de Stripe.

**Suscripciones:**
- **Plan Gratuito:** Acceso básico a contenido limitado
- **Plan Premium:** Acceso a contenido exclusivo y descuentos en servicios
- **Plan Pro:** Acceso completo, sesiones mensuales incluidas y prioridad en reservas
- **Plan Enterprise:** Soluciones personalizadas para centros y organizaciones

Las suscripciones se renuevan automáticamente al final de cada período de facturación (mensual o anual) a menos que las canceles antes de la fecha de renovación.

**Facturación:**
Recibirás una factura electrónica por cada transacción realizada. Las facturas estarán disponibles en tu área de usuario.

**Impuestos:**
Eres responsable de pagar todos los impuestos aplicables en tu jurisdicción. Los precios mostrados pueden no incluir impuestos locales adicionales.`
    },
    {
      title: "6. Cancelaciones y Reembolsos",
      icon: "🔄",
      color: "from-red-500 to-red-600",
      content: `**Política de Cancelación de Sesiones:**
- Cancelaciones con más de 24 horas de anticipación: Reembolso completo o reprogramación sin cargo
- Cancelaciones con menos de 24 horas: Sin reembolso, pero puedes reprogramar con un cargo del 50%
- No presentarse a la sesión: Sin reembolso ni opción de reprogramación

**Cancelación de Suscripciones:**
Puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. La cancelación será efectiva al final del período de facturación actual. No se realizan reembolsos prorrateados por períodos no utilizados.

**Reembolsos:**
Las solicitudes de reembolso deben realizarse dentro de los 7 días posteriores a la compra para productos digitales no descargados o servicios no utilizados. Una vez que hayas accedido al contenido o asistido a una sesión, no se realizarán reembolsos.

**Excepciones:**
Nos reservamos el derecho de emitir reembolsos a nuestra discreción en casos excepcionales, como problemas técnicos atribuibles a nuestra plataforma o circunstancias extraordinarias.

**Proceso de Reembolso:**
Los reembolsos aprobados se procesarán dentro de 5-10 días hábiles y se acreditarán al método de pago original.`
    },
    {
      title: "7. Limitación de Responsabilidad",
      icon: "⚖️",
      color: "from-indigo-500 to-indigo-600",
      content: `**Naturaleza de los Servicios:**
Los servicios ofrecidos en Plataforma Angélica tienen fines espirituales, de orientación y crecimiento personal. No constituyen asesoramiento médico, psicológico, legal o financiero profesional.

**Descargo de Responsabilidad:**
- No garantizamos resultados específicos de ninguna sesión o servicio
- No somos responsables de decisiones tomadas basándose en nuestros servicios
- Las lecturas de tarot y astrología son para fines de entretenimiento y orientación espiritual
- Las terapias energéticas complementan pero no reemplazan tratamientos médicos

**Limitación de Daños:**
En ningún caso Plataforma Angélica, sus directores, empleados o terapeutas serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de beneficios, datos o uso, derivados del uso o imposibilidad de uso de nuestros servicios.

**Responsabilidad del Terapeuta:**
Cada terapeuta es un profesional independiente responsable de sus propias sesiones y consejos. Plataforma Angélica actúa como intermediario facilitando la conexión entre usuarios y terapeutas.

**Disponibilidad del Servicio:**
No garantizamos que el servicio estará disponible de forma ininterrumpida o libre de errores. Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento.

**Recomendación Importante:**
Si experimentas problemas de salud física o mental, te recomendamos encarecidamente que consultes con profesionales médicos o psicológicos certificados.`
    },
    {
      title: "8. Privacidad y Protección de Datos",
      icon: "🔒",
      color: "from-purple-500 to-violet-600",
      content: `**Compromiso con la Privacidad:**
Valoramos profundamente tu privacidad y nos comprometemos a proteger tu información personal de acuerdo con nuestra Política de Privacidad y el Reglamento General de Protección de Datos (GDPR) y la Ley Orgánica de Protección de Datos (LOPD).

**Información que Recopilamos:**
- Datos de registro (nombre, email, fecha de nacimiento)
- Información de pago (procesada de forma segura por Stripe)
- Datos de uso y preferencias
- Grabaciones de sesiones (solo con tu consentimiento explícito)

**Uso de la Información:**
Utilizamos tu información únicamente para:
- Proporcionar y mejorar nuestros servicios
- Procesar pagos y gestionar suscripciones
- Comunicarnos contigo sobre tu cuenta y servicios
- Personalizar tu experiencia espiritual
- Cumplir con obligaciones legales

**Seguridad:**
Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración, divulgación o destrucción.

**Tus Derechos:**
Tienes derecho a acceder, rectificar, eliminar, limitar el procesamiento, portabilidad de datos y oposición al tratamiento de tus datos personales. Para ejercer estos derechos, contacta con nuestro DPO en privacy@plataformaangelica.com.

**Cookies:**
Utilizamos cookies para mejorar tu experiencia. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.

Para más información, consulta nuestra Política de Privacidad completa.`
    },
    {
      title: "9. Modificaciones de los Términos",
      icon: "📝",
      color: "from-cyan-500 to-cyan-600",
      content: `**Derecho a Modificar:**
Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.

**Notificación de Cambios:**
Te notificaremos sobre cambios significativos en los términos a través de:
- Email a la dirección registrada en tu cuenta
- Aviso destacado en la plataforma
- Notificación al iniciar sesión

**Aceptación de Cambios:**
Tu uso continuado de la plataforma después de la publicación de cambios constituye tu aceptación de los términos modificados. Si no estás de acuerdo con los cambios, debes dejar de usar nuestros servicios y cancelar tu cuenta.

**Historial de Versiones:**
Mantenemos un registro de versiones anteriores de estos términos. Puedes solicitar acceso al historial contactando con nuestro equipo de soporte.

**Fecha de Última Actualización:**
Estos términos fueron actualizados por última vez el 11 de octubre de 2025.

**Revisión Regular:**
Te recomendamos revisar periódicamente estos términos para estar informado de cualquier cambio.`
    },
    {
      title: "10. Ley Aplicable y Jurisdicción",
      icon: "⚖️",
      color: "from-gray-700 to-gray-800",
      content: `**Legislación Aplicable:**
Estos Términos de Uso se regirán e interpretarán de acuerdo con las leyes de España, sin dar efecto a ningún principio de conflictos de leyes.

**Jurisdicción:**
Cualquier disputa relacionada con estos términos o el uso de nuestros servicios estará sujeta a la jurisdicción exclusiva de los tribunales de Madrid, España.

**Resolución de Disputas:**
Antes de iniciar cualquier acción legal, las partes acuerdan intentar resolver cualquier disputa mediante negociación de buena fe. Si la disputa no se resuelve en un plazo de 30 días, cualquiera de las partes puede iniciar procedimientos legales.

**Mediación:**
Ambas partes acuerdan considerar la mediación como método alternativo de resolución de disputas antes de recurrir a procedimientos judiciales.

**Renuncia:**
La falta de ejercicio o aplicación de cualquier derecho o disposición de estos términos no constituirá una renuncia a dicho derecho o disposición.

**Divisibilidad:**
Si alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones restantes continuarán en pleno vigor y efecto.

**Acuerdo Completo:**
Estos términos, junto con nuestra Política de Privacidad, constituyen el acuerdo completo entre tú y Plataforma Angélica con respecto al uso de nuestros servicios.`
    },
    {
      title: "11. Contacto y Soporte Legal",
      icon: "📧",
      color: "from-teal-500 to-teal-600",
      content: `**Preguntas sobre estos Términos:**
Si tienes preguntas, comentarios o inquietudes sobre estos Términos de Uso, puedes contactarnos a través de:

**Email Legal:**
legal@plataformaangelica.com

**Email General:**
contacto@plataformaangelica.com

**Dirección Postal:**
Plataforma Angélica
Juan Carlos Ávila - El Angeólogo
[Dirección completa]
Madrid, España

**Horario de Atención:**
Lunes a Viernes: 9:00 - 18:00 (CET)
Tiempo de respuesta estimado: 24-48 horas hábiles

**Soporte Técnico:**
Para problemas técnicos o de cuenta, utiliza nuestro sistema de tickets en la plataforma o contacta a soporte@plataformaangelica.com

**Redes Sociales:**
También puedes contactarnos a través de nuestras redes sociales oficiales:
- Instagram: @elangeologo
- Facebook: El Angeólogo
- YouTube: @JuanCarlosAvilaElangeologo

**Protección de Datos:**
Para consultas relacionadas con privacidad y protección de datos:
privacy@plataformaangelica.com

Agradecemos tu confianza en Plataforma Angélica. Estamos comprometidos con tu crecimiento espiritual y bienestar.`
    }
  ];

  const filteredSections = sections.filter(section =>
    searchTerm === '' || 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Botones de idioma y audio */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-3">
        <LanguageSelector inline variant="loading" />
        <AudioButton variant="loading" />
      </div>

      <AuthPageLayout
        title="Términos de Uso"
        headerImage={termsHeaderImage}
        icon={FileText}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-6">
          {/* Fecha de última actualización */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-purple-50 py-2 px-4 rounded-lg border border-purple-200">
            <Calendar size={16} />
            <span className="font-medium">Última actualización: 11 de octubre de 2025</span>
          </div>

          {/* Introducción */}
          <div className="text-center">
            <p className="text-gray-700 text-base leading-relaxed">
              Bienvenido a la Plataforma Angélica. Al acceder y utilizar nuestro sitio web, 
              aceptas cumplir con los siguientes términos y condiciones. Por favor, léelos 
              cuidadosamente antes de usar nuestros servicios.
            </p>
          </div>

          {/* Barra de búsqueda y controles */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en términos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-xl transition-all text-sm"
              >
                Expandir todo
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all text-sm"
              >
                Contraer todo
              </button>
            </div>
          </div>

          {/* Secciones acordeón */}
          <div className="space-y-3">
            {filteredSections.map((section, index) => {
              const isExpanded = expandedSections.includes(index);
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-all"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h3 className="text-lg font-bold text-gray-900 text-left">
                        {section.title}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={24} className="text-purple-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={24} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2">
                      <div className="prose prose-sm max-w-none">
                        {section.content.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-gray-700 leading-relaxed mb-3 whitespace-pre-line">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mensaje final */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <p className="text-gray-800 font-medium text-sm">
              Al utilizar Plataforma Angélica, confirmas que has leído, entendido y aceptado 
              estos Términos de Uso en su totalidad. 🌟
            </p>
          </div>

          {/* Links relacionados */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="/politica"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
            >
              Ver Política de Privacidad →
            </a>
            <a
              href="/contacto"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
            >
              ¿Preguntas? Contáctanos →
            </a>
          </div>
        </div>
      </AuthPageLayout>
    </>
  );
};

export default Terminos;

