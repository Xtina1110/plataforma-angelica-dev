import React from 'react';
import { Shield, Lock, Eye, Database, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ModernPageLayout from './ModernPageLayout';

// Imagen temática para privacidad
const privacyHeaderImage = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop';

const PoliticaPrivacidad = () => {
  const { getCurrentTranslation } = useLanguage();
  const t = getCurrentTranslation();

  return (
    <ModernPageLayout
      title={t.privacyPage?.title || 'Política de Privacidad'}
      headerImage={privacyHeaderImage}
      icon={Shield}
    >
      {/* Introducción */}
      <div className="text-center mb-8">
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          {t.privacyPage?.description || 'En Plataforma Angélica valoramos profundamente tu privacidad y nos comprometemos a proteger tu información personal. Esta política explica cómo recopilamos, usamos y protegemos tus datos:'}
        </p>
      </div>

      {/* Políticas de privacidad */}
      <div className="space-y-4">
        {[
          {
            title: t.privacyPage?.dataTitle || "Uso de Datos Personales",
            content: t.privacyPage?.point1 || 'Los datos que proporcionas (nombre, email, preferencias) se usan únicamente para brindarte una experiencia espiritual personalizada.',
            icon: Eye,
            color: "from-blue-500 to-blue-600"
          },
          {
            title: t.privacyPage?.protectionTitle || "Protección de Información", 
            content: t.privacyPage?.point2 || 'No compartimos tus datos con terceros sin tu consentimiento expreso.',
            icon: Lock,
            color: "from-green-500 to-green-600"
          },
          {
            title: t.privacyPage?.infrastructureTitle || "Infraestructura Segura",
            content: t.privacyPage?.point3 || 'Utilizamos Supabase como backend seguro para el almacenamiento y autenticación de usuarios.',
            icon: Database,
            color: "from-purple-500 to-purple-600"
          },
          {
            title: t.privacyPage?.rightsTitle || "Derechos del Usuario",
            content: t.privacyPage?.point4 || 'Puedes solicitar en cualquier momento la eliminación o modificación de tu información.',
            icon: Shield,
            color: "from-yellow-500 to-yellow-600"
          },
          {
            title: t.privacyPage?.updatesTitle || "Actualizaciones",
            content: t.privacyPage?.point5 || 'Esta política puede actualizarse para adaptarse a nuevas normativas o mejoras del servicio.',
            icon: FileText,
            color: "from-red-500 to-red-600"
          }
        ].map((policy, index) => (
          <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${policy.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                <policy.icon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{policy.title}</h3>
                <p className="text-gray-700 leading-relaxed">{policy.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compromiso final */}
      <div className="mt-8 text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {t.privacyPage?.commitment || 'Nuestro Compromiso'}
        </h3>
        <p className="text-gray-600">
          {t.privacyPage?.commitmentText || 'Tu privacidad es fundamental para nosotros. Nos comprometemos a mantener la confidencialidad y seguridad de tu información personal en todo momento.'}
        </p>
      </div>
    </ModernPageLayout>
  );
};

export default PoliticaPrivacidad;
