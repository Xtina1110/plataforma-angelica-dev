import React from 'react';
import { FileText, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ModernPageLayout from './ModernPageLayout';

// Imagen temática para términos
const termsHeaderImage = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop';

const Terminos = () => {
  const { getCurrentTranslation } = useLanguage();
  const t = getCurrentTranslation();

  return (
    <ModernPageLayout
      title={t.termsPage?.title || 'Términos de Uso'}
      headerImage={termsHeaderImage}
      icon={FileText}
    >
      {/* Introducción */}
      <div className="text-center mb-8">
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          {t.termsPage?.description || 'Bienvenido a la Plataforma Angélica. Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones:'}
        </p>
      </div>

      {/* Términos */}
      <div className="space-y-4">
        {[
          {
            title: t.termsPage?.contentTitle || "Contenido Espiritual",
            content: t.termsPage?.point1 || 'El contenido ofrecido es con fines espirituales y de bienestar.',
            icon: Shield,
            color: "from-purple-500 to-purple-600"
          },
          {
            title: t.termsPage?.useTitle || "Uso Responsable", 
            content: t.termsPage?.point2 || 'No sustituye tratamientos médicos ni terapéuticos profesionales.',
            icon: FileText,
            color: "from-blue-500 to-blue-600"
          },
          {
            title: t.termsPage?.policiesTitle || "Políticas de Uso",
            content: t.termsPage?.point3 || 'El uso indebido del contenido puede conllevar a la suspensión de la cuenta.',
            icon: Shield,
            color: "from-red-500 to-red-600"
          },
          {
            title: t.termsPage?.privacyTitle || "Privacidad",
            content: t.termsPage?.point4 || 'Respetamos la privacidad de tus datos según nuestra política.',
            icon: Shield,
            color: "from-green-500 to-green-600"
          },
          {
            title: t.termsPage?.modificationsTitle || "Modificaciones",
            content: t.termsPage?.point5 || 'Nos reservamos el derecho a modificar estos términos en cualquier momento.',
            icon: FileText,
            color: "from-yellow-500 to-yellow-600"
          }
        ].map((term, index) => (
          <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${term.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                <term.icon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{term.title}</h3>
                <p className="text-gray-700 leading-relaxed">{term.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nota final */}
      <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {t.termsPage?.acceptance || 'Aceptación de Términos'}
        </h3>
        <p className="text-gray-600">
          {t.termsPage?.acceptanceText || 'Al utilizar nuestra plataforma, confirmas que has leído, entendido y aceptado estos términos de uso.'}
        </p>
      </div>
    </ModernPageLayout>
  );
};

export default Terminos;
