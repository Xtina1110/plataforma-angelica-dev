import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Search, Calendar, Lock, Eye, Database, Globe, UserCheck, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AuthPageLayout from './AuthPageLayout';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';

const PoliticaPrivacidad = () => {
  const { getCurrentTranslation } = useLanguage();
  const t = getCurrentTranslation();
  const [expandedSections, setExpandedSections] = useState([0]);
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
      title: "1. Información que Recopilamos",
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      content: `En Plataforma Angélica recopilamos diferentes tipos de información para brindarte la mejor experiencia espiritual personalizada:

**Información de Registro:**
- Nombre completo y apellidos
- Dirección de correo electrónico
- Fecha de nacimiento (para cálculos astrológicos)
- Número de teléfono (opcional)
- País y zona horaria
- Preferencias de idioma

**Información de Perfil:**
- Foto de perfil (opcional)
- Biografía o descripción personal
- Intereses espirituales y preferencias
- Historial de consultas y servicios utilizados
- Nivel espiritual y puntos de luz acumulados

**Información de Pago:**
- Datos de tarjeta de crédito/débito (procesados de forma segura por Stripe)
- Historial de transacciones
- Información de facturación
- Dirección postal (si es necesaria para facturación)

**Información de Uso:**
- Páginas visitadas y tiempo de permanencia
- Servicios utilizados y frecuencia
- Interacciones con terapeutas
- Preferencias de contenido
- Dispositivo y navegador utilizado
- Dirección IP y ubicación geográfica aproximada

**Información de Sesiones:**
- Notas de sesiones (con tu consentimiento)
- Grabaciones de videollamadas (solo si lo autorizas explícitamente)
- Mensajes intercambiados con terapeutas
- Feedback y valoraciones

**Cookies y Tecnologías Similares:**
- Cookies de sesión y preferencias
- Cookies de análisis (Google Analytics)
- Cookies de publicidad (si aplica)
- Local storage para mejorar la experiencia

Toda esta información se recopila con tu consentimiento explícito y solo se utiliza para los fines descritos en esta política.`
    },
    {
      title: "2. Cómo Usamos tu Información",
      icon: Database,
      color: "from-purple-500 to-purple-600",
      content: `Utilizamos la información recopilada para múltiples propósitos legítimos que mejoran tu experiencia en nuestra plataforma:

**Provisión de Servicios:**
- Crear y gestionar tu cuenta de usuario
- Procesar reservas y pagos
- Facilitar sesiones con terapeutas
- Proporcionar contenido personalizado
- Enviar notificaciones sobre tus reservas y servicios
- Gestionar suscripciones y membresías

**Personalización:**
- Recomendar terapeutas y servicios según tus intereses
- Adaptar el contenido a tus preferencias espirituales
- Calcular tu nivel espiritual y progreso
- Sugerir cursos y talleres relevantes
- Crear tu carta astral personalizada

**Comunicación:**
- Enviar confirmaciones de reservas y recordatorios
- Notificar sobre cambios en servicios o políticas
- Responder a tus consultas y solicitudes de soporte
- Enviar newsletters con contenido espiritual (si te has suscrito)
- Informar sobre nuevos servicios y promociones

**Mejora del Servicio:**
- Analizar patrones de uso para mejorar la plataforma
- Identificar y solucionar problemas técnicos
- Realizar estudios de satisfacción del usuario
- Desarrollar nuevas funcionalidades
- Optimizar la experiencia de usuario

**Seguridad y Prevención de Fraude:**
- Detectar y prevenir actividades fraudulentas
- Proteger contra accesos no autorizados
- Verificar identidades cuando sea necesario
- Cumplir con obligaciones legales y regulatorias

**Marketing y Análisis:**
- Entender cómo los usuarios interactúan con la plataforma
- Medir la efectividad de campañas de marketing
- Realizar análisis estadísticos agregados
- Mejorar nuestras estrategias de comunicación

Siempre puedes optar por no recibir comunicaciones de marketing actualizando tus preferencias en tu cuenta.`
    },
    {
      title: "3. Cookies y Tecnologías de Seguimiento",
      icon: Globe,
      color: "from-green-500 to-green-600",
      content: `Utilizamos cookies y tecnologías similares para mejorar tu experiencia en Plataforma Angélica:

**¿Qué son las Cookies?**
Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a recordar tus preferencias y a entender cómo usas nuestra plataforma.

**Tipos de Cookies que Utilizamos:**

**1. Cookies Esenciales (Necesarias):**
- Gestión de sesiones de usuario
- Autenticación y seguridad
- Preferencias de idioma
- Carrito de compra
- Estas cookies son necesarias para el funcionamiento del sitio y no se pueden desactivar

**2. Cookies de Funcionalidad:**
- Recordar tus preferencias de visualización
- Guardar tu progreso en cursos
- Mantener configuraciones personalizadas
- Recordar terapeutas favoritos

**3. Cookies de Rendimiento y Análisis:**
- Google Analytics para entender el uso del sitio
- Métricas de rendimiento de páginas
- Análisis de flujos de usuario
- Identificación de errores y problemas técnicos

**4. Cookies de Marketing y Publicidad:**
- Personalización de anuncios (si aplica)
- Seguimiento de conversiones
- Retargeting (si aplica)
- Análisis de campañas

**Otras Tecnologías:**
- **Local Storage:** Para guardar preferencias y datos de sesión
- **Session Storage:** Para información temporal durante tu visita
- **Web Beacons:** Para análisis de emails y notificaciones
- **Píxeles de seguimiento:** Para medir efectividad de campañas

**Control de Cookies:**
Puedes controlar y gestionar las cookies de varias formas:
- A través de la configuración de tu navegador
- Mediante nuestro panel de preferencias de cookies
- Rechazando cookies no esenciales en tu primera visita
- Borrando cookies existentes en cualquier momento

**Consecuencias de Desactivar Cookies:**
Si desactivas las cookies, algunas funcionalidades del sitio pueden no estar disponibles o funcionar correctamente. Las cookies esenciales no se pueden desactivar sin afectar el funcionamiento del sitio.

**Cookies de Terceros:**
Algunos de nuestros socios (como Google Analytics, Stripe) pueden establecer sus propias cookies. No tenemos control sobre estas cookies de terceros. Te recomendamos revisar las políticas de privacidad de estos servicios.`
    },
    {
      title: "4. Compartir Información con Terceros",
      icon: UserCheck,
      color: "from-yellow-500 to-amber-600",
      content: `Tu privacidad es nuestra prioridad. Solo compartimos tu información en circunstancias específicas y limitadas:

**Terapeutas y Profesionales:**
Compartimos información relevante con los terapeutas que has reservado para que puedan preparar y personalizar tu sesión:
- Nombre y datos de contacto
- Fecha de nacimiento (para lecturas astrológicas)
- Historial de sesiones previas (si aplica)
- Notas y preferencias relevantes
- Los terapeutas están obligados contractualmente a mantener la confidencialidad

**Proveedores de Servicios:**
Trabajamos con proveedores de confianza que nos ayudan a operar la plataforma:
- **Stripe:** Procesamiento de pagos
- **Supabase:** Alojamiento de base de datos y autenticación
- **Vercel:** Hosting de la aplicación web
- **Google Analytics:** Análisis de uso
- **SendGrid/Mailgun:** Envío de emails transaccionales
- Todos nuestros proveedores están obligados contractualmente a proteger tu información

**Cumplimiento Legal:**
Podemos divulgar tu información si es requerido por ley o en respuesta a:
- Órdenes judiciales o citaciones
- Solicitudes de autoridades gubernamentales
- Investigaciones de fraude o seguridad
- Protección de nuestros derechos legales
- Prevención de daños a personas o propiedad

**Transacciones Comerciales:**
En caso de fusión, adquisición o venta de activos, tu información puede ser transferida. Te notificaremos antes de que tu información sea transferida y esté sujeta a una política de privacidad diferente.

**Con tu Consentimiento:**
Podemos compartir tu información con terceros cuando nos des tu consentimiento explícito para hacerlo.

**Información Agregada y Anónima:**
Podemos compartir información estadística agregada y anónima que no te identifique personalmente con socios, investigadores o el público en general.

**NO Vendemos tu Información:**
Nunca vendemos, alquilamos o comercializamos tu información personal a terceros para sus propios fines de marketing.

**Transferencias Internacionales:**
Algunos de nuestros proveedores pueden estar ubicados fuera del Espacio Económico Europeo (EEE). Nos aseguramos de que existan salvaguardas adecuadas para proteger tu información, como cláusulas contractuales estándar aprobadas por la Comisión Europea.`
    },
    {
      title: "5. Seguridad de tus Datos",
      icon: Lock,
      color: "from-red-500 to-red-600",
      content: `Implementamos medidas de seguridad robustas para proteger tu información personal:

**Medidas Técnicas:**

**Encriptación:**
- Todas las conexiones utilizan HTTPS/TLS para encriptar datos en tránsito
- Datos sensibles encriptados en reposo en la base de datos
- Contraseñas hasheadas con algoritmos seguros (bcrypt)
- Tokens de sesión encriptados y con expiración

**Infraestructura Segura:**
- Hosting en servidores seguros (Vercel, Supabase)
- Firewalls y sistemas de detección de intrusiones
- Monitorización continua de seguridad
- Copias de seguridad automáticas y encriptadas
- Aislamiento de datos entre usuarios

**Autenticación:**
- Autenticación de dos factores (2FA) disponible
- Políticas de contraseñas seguras
- Sesiones con tiempo de expiración
- Detección de inicios de sesión sospechosos
- Bloqueo automático tras intentos fallidos

**Medidas Organizativas:**

**Acceso Limitado:**
- Solo personal autorizado tiene acceso a datos personales
- Principio de mínimo privilegio
- Auditorías regulares de acceso
- Acuerdos de confidencialidad con empleados y contratistas

**Formación:**
- Capacitación regular en seguridad y privacidad
- Concienciación sobre phishing y amenazas
- Procedimientos de respuesta a incidentes
- Cultura de seguridad en toda la organización

**Políticas y Procedimientos:**
- Política de seguridad de la información documentada
- Procedimientos de gestión de incidentes
- Plan de continuidad de negocio
- Revisiones periódicas de seguridad

**Procesamiento de Pagos:**
- No almacenamos datos completos de tarjetas de crédito
- Procesamiento PCI-DSS compliant a través de Stripe
- Tokenización de información de pago
- Verificación 3D Secure para transacciones

**Tus Responsabilidades:**
Para mantener tu cuenta segura, te recomendamos:
- Usar contraseñas únicas y complejas
- No compartir tus credenciales con nadie
- Cerrar sesión en dispositivos compartidos
- Mantener tu software actualizado
- Reportar actividad sospechosa inmediatamente

**Limitaciones:**
Aunque implementamos medidas de seguridad sólidas, ningún sistema es 100% seguro. No podemos garantizar la seguridad absoluta de tu información. Te notificaremos sin demora indebida en caso de una brecha de seguridad que afecte tus datos personales.

**Retención de Datos:**
Conservamos tu información solo durante el tiempo necesario para cumplir con los fines descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.`
    },
    {
      title: "6. Retención de Datos",
      icon: Database,
      color: "from-indigo-500 to-indigo-600",
      content: `Conservamos tu información personal solo durante el tiempo necesario para los fines establecidos en esta política:

**Datos de Cuenta Activa:**
Mientras tu cuenta esté activa, conservamos tu información para:
- Proporcionar servicios continuos
- Mantener tu historial de sesiones
- Gestionar suscripciones activas
- Cumplir con obligaciones contractuales

**Después de Cancelar tu Cuenta:**
Cuando cancelas tu cuenta, seguimos diferentes procedimientos según el tipo de información:

**Eliminación Inmediata:**
- Acceso a la plataforma desactivado inmediatamente
- Información visible públicamente eliminada
- Tokens de sesión invalidados

**Retención Temporal (30-90 días):**
- Datos de perfil básicos (por si cambias de opinión)
- Preferencias y configuraciones
- Historial de uso reciente
- Después de este período, se eliminan permanentemente

**Retención Legal (hasta 7 años):**
Algunos datos deben conservarse por obligaciones legales:
- Información de facturación y transacciones
- Registros de consentimientos
- Comunicaciones relacionadas con disputas
- Datos necesarios para cumplir con leyes fiscales y contables

**Datos Anonimizados (indefinidamente):**
Podemos conservar información agregada y anonimizada que no te identifique personalmente para:
- Análisis estadísticos
- Investigación y desarrollo
- Mejora de servicios

**Grabaciones de Sesiones:**
- Grabaciones con tu consentimiento: Conservadas según tu preferencia (máximo 1 año)
- Puedes solicitar eliminación en cualquier momento
- Eliminación automática al cancelar la cuenta

**Copias de Seguridad:**
- Las copias de seguridad pueden contener tus datos durante hasta 90 días adicionales
- Estas copias están encriptadas y no son accesibles para uso operativo
- Se eliminan automáticamente según el ciclo de retención

**Solicitud de Eliminación:**
Puedes solicitar la eliminación de tus datos en cualquier momento:
- A través de la configuración de tu cuenta
- Contactando a privacy@plataformaangelica.com
- Procesamos solicitudes en un plazo de 30 días
- Te confirmaremos cuando la eliminación esté completa

**Excepciones a la Eliminación:**
Podemos conservar ciertos datos si es necesario para:
- Cumplir con obligaciones legales
- Resolver disputas pendientes
- Hacer cumplir nuestros acuerdos
- Prevenir fraude y abusos
- Proteger derechos legítimos

**Portabilidad de Datos:**
Antes de eliminar tu cuenta, puedes solicitar una copia de tus datos en formato legible por máquina (JSON/CSV).`
    },
    {
      title: "7. Tus Derechos (GDPR/LOPD)",
      icon: Shield,
      color: "from-pink-500 to-rose-600",
      content: `Bajo el Reglamento General de Protección de Datos (GDPR) y la Ley Orgánica de Protección de Datos (LOPD), tienes los siguientes derechos:

**1. Derecho de Acceso:**
Tienes derecho a obtener confirmación sobre si estamos tratando tus datos personales y, en tal caso, acceder a ellos.
- Puedes solicitar una copia de todos tus datos personales
- Información sobre cómo usamos tus datos
- Con quién los compartimos
- Cuánto tiempo los conservamos

**2. Derecho de Rectificación:**
Puedes solicitar la corrección de datos personales inexactos o incompletos.
- Actualiza tu información directamente en tu perfil
- Contacta con soporte para correcciones que no puedas hacer tú mismo
- Procesamos solicitudes en un plazo de 30 días

**3. Derecho de Supresión ("Derecho al Olvido"):**
Puedes solicitar la eliminación de tus datos personales cuando:
- Ya no sean necesarios para los fines para los que fueron recogidos
- Retires tu consentimiento
- Te opongas al tratamiento
- Los datos hayan sido tratados ilícitamente
- Deban eliminarse para cumplir una obligación legal

**4. Derecho a la Limitación del Tratamiento:**
Puedes solicitar que limitemos el uso de tus datos cuando:
- Impugnes la exactitud de los datos
- El tratamiento sea ilícito pero no quieras que se eliminen
- Ya no necesitemos los datos pero tú los necesites para reclamaciones
- Te hayas opuesto al tratamiento mientras verificamos motivos legítimos

**5. Derecho a la Portabilidad de Datos:**
Tienes derecho a:
- Recibir tus datos en un formato estructurado y legible por máquina
- Transmitir esos datos a otro responsable sin impedimentos
- Que transmitamos directamente los datos a otro responsable cuando sea técnicamente posible

**6. Derecho de Oposición:**
Puedes oponerte en cualquier momento al tratamiento de tus datos personales:
- Por motivos relacionados con tu situación particular
- Para fines de marketing directo (incluyendo perfilado)
- Para investigación científica o histórica
- Para fines estadísticos

**7. Derecho a no ser Objeto de Decisiones Automatizadas:**
Tienes derecho a no ser objeto de una decisión basada únicamente en el tratamiento automatizado, incluido el perfilado, que produzca efectos jurídicos o te afecte significativamente.

**Cómo Ejercer tus Derechos:**

**Método 1: A través de tu Cuenta**
- Accede a Configuración > Privacidad y Datos
- Muchos derechos pueden ejercerse directamente desde allí

**Método 2: Email al DPO**
Envía un email a privacy@plataformaangelica.com con:
- Asunto: "Ejercicio de Derecho [especifica el derecho]"
- Tu nombre completo y email registrado
- Descripción clara de tu solicitud
- Copia de tu DNI/NIE (para verificación de identidad)

**Método 3: Correo Postal**
Plataforma Angélica - DPO
[Dirección completa]
Madrid, España

**Plazos de Respuesta:**
- Confirmaremos la recepción de tu solicitud en 48 horas
- Responderemos a tu solicitud en un plazo máximo de 30 días
- Si necesitamos más tiempo, te informaremos y explicaremos el motivo

**Sin Coste:**
El ejercicio de estos derechos es gratuito. Solo podemos cobrar una tasa razonable si las solicitudes son manifiestamente infundadas o excesivas.

**Derecho a Presentar una Reclamación:**
Si consideras que el tratamiento de tus datos personales infringe la normativa, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD):
- Web: www.aepd.es
- Teléfono: 901 100 099 / 912 663 517
- Dirección: C/ Jorge Juan, 6, 28001 Madrid`
    },
    {
      title: "8. Transferencias Internacionales de Datos",
      icon: Globe,
      color: "from-cyan-500 to-cyan-600",
      content: `Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del Espacio Económico Europeo (EEE). Te explicamos cómo protegemos tus datos en estas transferencias:

**Proveedores Fuera del EEE:**

**Estados Unidos:**
- **Stripe:** Procesamiento de pagos (certificado PCI-DSS)
- **Vercel:** Hosting de aplicación web
- **Google Analytics:** Análisis de uso

**Medidas de Protección:**
Para transferencias a países fuera del EEE, implementamos las siguientes salvaguardas:

**1. Cláusulas Contractuales Estándar (SCC):**
Utilizamos las cláusulas contractuales estándar aprobadas por la Comisión Europea, que obligan a los proveedores a:
- Proteger tus datos con el mismo nivel que en la UE
- Permitir auditorías de cumplimiento
- Notificar cualquier solicitud de acceso gubernamental
- Implementar medidas de seguridad adecuadas

**2. Certificaciones y Marcos de Privacidad:**
Trabajamos con proveedores que cumplen con:
- Privacy Shield (cuando aplique)
- ISO 27001 (Seguridad de la Información)
- SOC 2 Type II (Controles de seguridad)
- GDPR compliance

**3. Evaluación de Impacto:**
Realizamos evaluaciones de impacto de transferencias para:
- Identificar riesgos para tus datos
- Implementar medidas adicionales si es necesario
- Documentar las salvaguardas aplicadas
- Revisar periódicamente las transferencias

**Medidas Técnicas Adicionales:**
Para proteger datos transferidos fuera del EEE:
- Encriptación en tránsito y en reposo
- Pseudonimización cuando sea posible
- Minimización de datos transferidos
- Controles de acceso estrictos
- Monitorización de accesos

**Tus Derechos:**
En relación con transferencias internacionales, tienes derecho a:
- Obtener información sobre las transferencias realizadas
- Solicitar una copia de las salvaguardas implementadas
- Oponerte a transferencias específicas
- Presentar una reclamación ante la autoridad de protección de datos

**Países con Decisión de Adecuación:**
Cuando transferimos datos a países con una decisión de adecuación de la Comisión Europea, no se requieren salvaguardas adicionales. Actualmente incluyen:
- Andorra
- Argentina
- Canadá (organizaciones comerciales)
- Islas Feroe
- Guernsey
- Israel
- Isla de Man
- Japón
- Jersey
- Nueva Zelanda
- Suiza
- Reino Unido
- Uruguay

**Cambios en Proveedores:**
Si cambiamos de proveedores o añadimos nuevos que impliquen transferencias internacionales:
- Evaluaremos el impacto en la privacidad
- Implementaremos salvaguardas adecuadas
- Actualizaremos esta política
- Te notificaremos si es un cambio significativo

**Solicitar Información:**
Puedes solicitar información detallada sobre:
- Qué datos se transfieren fuera del EEE
- A qué países y proveedores
- Qué salvaguardas específicas se aplican
- Copias de las cláusulas contractuales

Contacta con nuestro DPO en privacy@plataformaangelica.com para más información.`
    },
    {
      title: "9. Privacidad de Menores",
      icon: UserCheck,
      color: "from-teal-500 to-teal-600",
      content: `La protección de la privacidad de los menores es especialmente importante para nosotros:

**Edad Mínima:**
Plataforma Angélica está diseñada para usuarios mayores de 18 años. No recopilamos intencionalmente información personal de menores de 18 años sin el consentimiento de sus padres o tutores legales.

**Uso por Menores (14-17 años):**
Los menores entre 14 y 17 años pueden usar nuestros servicios solo con:
- Consentimiento explícito de sus padres o tutores legales
- Supervisión de un adulto durante las sesiones
- Aprobación del terapeuta para servicios específicos

**Proceso de Verificación:**
Cuando un menor desea registrarse:
1. Se requiere proporcionar información de contacto del padre/tutor
2. Enviamos un email de verificación al padre/tutor
3. El padre/tutor debe confirmar y autorizar el registro
4. Se documenta el consentimiento en nuestros registros

**Información Recopilada de Menores:**
Si un menor utiliza nuestros servicios con consentimiento parental, recopilamos:
- Información básica de perfil (nombre, edad)
- Información de contacto del padre/tutor
- Historial de servicios utilizados
- Información necesaria para proporcionar los servicios

**Derechos de los Padres/Tutores:**
Los padres o tutores legales tienen derecho a:
- Revisar la información personal de sus hijos
- Solicitar la eliminación de dicha información
- Revocar el consentimiento en cualquier momento
- Oponerse al procesamiento de datos de sus hijos
- Acceder al historial de actividad

**Servicios Restringidos para Menores:**
Algunos servicios pueden no estar disponibles para menores:
- Consultas sobre temas sensibles (relaciones, sexualidad)
- Servicios de pago sin supervisión parental
- Foros o chats públicos
- Contenido clasificado para adultos

**Protección Especial:**
Para menores, implementamos medidas adicionales:
- Monitorización de contenido apropiado para la edad
- Restricciones en comunicaciones con otros usuarios
- Filtros de contenido sensible
- Revisión manual de ciertas actividades

**Detección de Menores sin Consentimiento:**
Si descubrimos que hemos recopilado información de un menor sin el consentimiento parental adecuado:
- Eliminaremos inmediatamente dicha información
- Suspenderemos la cuenta
- Contactaremos con los padres/tutores si es posible
- Documentaremos el incidente

**Educación y Concienciación:**
Proporcionamos recursos educativos para:
- Padres sobre cómo supervisar el uso de la plataforma
- Menores sobre privacidad y seguridad en línea
- Terapeutas sobre trabajar con menores de forma segura

**Notificación a Padres:**
Los padres/tutores recibirán notificaciones sobre:
- Actividad significativa en la cuenta del menor
- Cambios en la política de privacidad
- Nuevos servicios utilizados
- Cualquier incidente de seguridad

**Contacto para Padres/Tutores:**
Si eres padre o tutor y tienes preguntas sobre la privacidad de tu hijo:
- Email: parents@plataformaangelica.com
- Teléfono: [Número de contacto]
- Horario: Lunes a Viernes, 9:00-18:00 CET

**Cumplimiento Legal:**
Cumplimos con:
- GDPR (requisitos especiales para menores)
- LOPD (protección de datos de menores)
- COPPA (Children's Online Privacy Protection Act) cuando aplique
- Legislación nacional sobre protección de menores`
    },
    {
      title: "10. Cambios en la Política de Privacidad",
      icon: FileText,
      color: "from-orange-500 to-orange-600",
      content: `Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas o por otros motivos operativos, legales o regulatorios.

**Tipos de Cambios:**

**Cambios Menores:**
- Correcciones tipográficas o gramaticales
- Aclaraciones de políticas existentes
- Actualizaciones de información de contacto
- Mejoras en la estructura o formato

**Cambios Significativos:**
- Nuevos tipos de datos recopilados
- Nuevos usos de información existente
- Cambios en proveedores de servicios
- Modificaciones en derechos de usuarios
- Cambios en períodos de retención

**Notificación de Cambios:**

**Para Cambios Menores:**
- Actualización de la fecha de "Última actualización"
- Publicación en la plataforma
- Aviso en el área de usuario

**Para Cambios Significativos:**
- Email a todos los usuarios registrados (con 30 días de antelación)
- Notificación destacada al iniciar sesión
- Popup informativo en la plataforma
- Opción de revisar cambios antes de aceptar

**Tu Respuesta a los Cambios:**

**Aceptación Implícita:**
Si continúas usando nuestros servicios después de que los cambios entren en vigor, se considerará que aceptas la política actualizada.

**Rechazo de Cambios:**
Si no estás de acuerdo con los cambios significativos:
- Puedes cancelar tu cuenta antes de que entren en vigor
- Contactarnos para discutir tus preocupaciones
- Ejercer tus derechos de protección de datos
- Solicitar la eliminación de tus datos

**Historial de Versiones:**
Mantenemos un registro de versiones anteriores de esta política:
- Disponible bajo solicitud
- Incluye fecha de vigencia de cada versión
- Resumen de cambios principales
- Accesible en privacy@plataformaangelica.com

**Revisión Regular:**
Te recomendamos:
- Revisar esta política periódicamente
- Verificar la fecha de última actualización
- Leer las notificaciones que enviamos
- Contactarnos si tienes dudas

**Fecha de Última Actualización:**
Esta Política de Privacidad fue actualizada por última vez el **11 de octubre de 2025**.

**Versión Anterior:**
La versión anterior estuvo vigente desde el 1 de enero de 2025 hasta el 10 de octubre de 2025.

**Próxima Revisión Programada:**
Revisamos esta política al menos una vez al año. La próxima revisión está programada para octubre de 2026.

**Cambios Legales:**
Si cambios en la legislación requieren modificaciones urgentes:
- Actualizaremos la política inmediatamente
- Notificaremos a los usuarios lo antes posible
- Explicaremos los requisitos legales que motivan el cambio

**Feedback sobre la Política:**
Valoramos tu opinión sobre nuestra política de privacidad:
- Envía sugerencias a privacy@plataformaangelica.com
- Reporta cualquier ambigüedad o confusión
- Pregunta sobre cualquier aspecto que no entiendas

**Compromiso de Transparencia:**
Nos comprometemos a:
- Ser transparentes sobre cómo usamos tus datos
- Notificar cambios de forma clara y oportuna
- Facilitar el ejercicio de tus derechos
- Mantener esta política actualizada y accesible`
    },
    {
      title: "11. Contacto y Data Protection Officer (DPO)",
      icon: AlertCircle,
      color: "from-gray-700 to-gray-800",
      content: `Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el tratamiento de tus datos personales, puedes contactarnos:

**Data Protection Officer (DPO):**
Hemos designado un Delegado de Protección de Datos (DPO) responsable de supervisar nuestras prácticas de privacidad y protección de datos.

**Información de Contacto del DPO:**
- **Email:** privacy@plataformaangelica.com
- **Email alternativo:** dpo@plataformaangelica.com
- **Teléfono:** [Número de contacto]
- **Horario:** Lunes a Viernes, 9:00-18:00 CET

**Dirección Postal:**
Data Protection Officer
Plataforma Angélica
Juan Carlos Ávila - El Angeólogo
[Dirección completa]
Madrid, España

**Otros Canales de Contacto:**

**Para Consultas Generales:**
- **Email:** contacto@plataformaangelica.com
- **WhatsApp:** [Número de WhatsApp]
- **Formulario web:** www.plataformaangelica.com/contacto

**Para Soporte Técnico:**
- **Email:** soporte@plataformaangelica.com
- **Sistema de tickets:** Disponible en tu panel de usuario

**Para Consultas Legales:**
- **Email:** legal@plataformaangelica.com

**Redes Sociales Oficiales:**
- **Instagram:** @elangeologo
- **Facebook:** El Angeólogo
- **YouTube:** @JuanCarlosAvilaElangeologo
- **X (Twitter):** [Próximamente]

**Qué Puedes Consultar con el DPO:**
- Ejercicio de tus derechos de protección de datos
- Preguntas sobre cómo usamos tu información
- Inquietudes sobre la seguridad de tus datos
- Solicitudes de acceso, rectificación o eliminación
- Quejas sobre el tratamiento de tus datos
- Información sobre transferencias internacionales
- Consultas sobre cookies y tecnologías de seguimiento

**Tiempo de Respuesta:**
- **Confirmación de recepción:** 48 horas
- **Respuesta completa:** Máximo 30 días
- **Solicitudes complejas:** Hasta 60 días (te informaremos si necesitamos más tiempo)

**Información a Incluir en tu Consulta:**
Para ayudarnos a procesar tu solicitud más rápidamente, por favor incluye:
- Tu nombre completo
- Email registrado en la plataforma
- Descripción clara de tu consulta o solicitud
- Documentación de identificación (para verificación)
- Cualquier información relevante adicional

**Proceso de Verificación:**
Para proteger tu privacidad, verificaremos tu identidad antes de procesar solicitudes relacionadas con tus datos personales. Podemos solicitar:
- Copia de tu DNI/NIE o pasaporte
- Confirmación de datos de cuenta
- Respuesta a preguntas de seguridad

**Escalación:**
Si no estás satisfecho con nuestra respuesta:
1. Solicita una revisión por parte de nuestro equipo senior
2. Contacta con nuestro DPO directamente
3. Presenta una reclamación ante la AEPD (ver sección 7)

**Autoridad de Control:**
Tienes derecho a presentar una reclamación ante la autoridad de protección de datos:

**Agencia Española de Protección de Datos (AEPD):**
- **Web:** www.aepd.es
- **Sede electrónica:** sedeagpd.gob.es
- **Teléfono:** 901 100 099 / 912 663 517
- **Dirección:** C/ Jorge Juan, 6, 28001 Madrid, España

**Compromiso:**
Nos comprometemos a:
- Responder a todas las consultas de forma oportuna
- Tratar tus datos con respeto y confidencialidad
- Facilitar el ejercicio de tus derechos
- Mejorar continuamente nuestras prácticas de privacidad
- Mantener la transparencia en todo momento

Gracias por confiar en Plataforma Angélica. Tu privacidad es nuestra prioridad. 🛡️✨`
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
        title="Política de Privacidad"
        icon={Shield}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-6">
          {/* Fecha de última actualización */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-blue-50 py-2 px-4 rounded-lg border border-blue-200">
            <Calendar size={16} />
            <span className="font-medium">Última actualización: 11 de octubre de 2025</span>
          </div>

          {/* Introducción */}
          <div className="text-center">
            <p className="text-gray-700 text-base leading-relaxed">
              En Plataforma Angélica valoramos profundamente tu privacidad y nos comprometemos a 
              proteger tu información personal. Esta política explica cómo recopilamos, usamos y 
              protegemos tus datos de acuerdo con el GDPR y la LOPD.
            </p>
          </div>

          {/* Barra de búsqueda y controles */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en política..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-xl transition-all text-sm"
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
              const IconComponent = section.icon;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                        <IconComponent size={20} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 text-left">
                        {section.title}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={24} className="text-blue-600 flex-shrink-0" />
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
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <p className="text-gray-800 font-medium text-sm">
              Tu privacidad es sagrada para nosotros. Nos comprometemos a proteger tu información 
              personal con los más altos estándares de seguridad. 🛡️✨
            </p>
          </div>

          {/* Links relacionados */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="/terminos"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
            >
              Ver Términos de Uso →
            </a>
            <a
              href="/contacto"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
            >
              ¿Preguntas? Contáctanos →
            </a>
          </div>
        </div>
      </AuthPageLayout>
    </>
  );
};

export default PoliticaPrivacidad;

