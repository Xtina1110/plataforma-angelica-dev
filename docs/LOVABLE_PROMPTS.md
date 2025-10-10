# Prompts para Lovable - Sistema Angélico

## Prompts de Desarrollo Rápido

### 1. Sistema de Videoconferencia
```
Implementa un sistema completo de videoconferencia para consultas angélicas en vivo que incluya:

- Componente VideoCallSystem con WebRTC para videollamadas HD
- OnlineConsultation como interfaz principal con notas de sesión
- VideoControls para manejar audio/video/pantalla compartida
- Integración con Supabase para almacenar sesiones
- Grabación automática y transcripción con IA
- Notificaciones en tiempo real durante la llamada
- Sistema de calidad de conexión y reconexión automática

Usa React hooks modernos y componentes UI de shadcn. Asegúrate de que sea responsive y accesible.
```

### 2. Sistema de Afiliados Completo
```
Crea un sistema de afiliados robusto para la plataforma angélica con:

- AffiliateSystemComplete para administración con métricas en tiempo real
- AffiliateDashboard para que afiliados vean sus ganancias y estadísticas
- AffiliateRegistration con formulario de aplicación y validación
- Generación automática de enlaces únicos de seguimiento
- Cálculo automático de comisiones (20% por defecto)
- Dashboard con gráficos de conversión y earnings
- Sistema de pagos automático mensual
- Notificaciones por email de nuevas comisiones

Integra con Stripe para pagos y Supabase para datos. Incluye analytics detallados.
```

### 3. Sistema de Recordatorios Multi-Canal
```
Desarrolla un sistema avanzado de recordatorios que soporte:

- ReminderSystemMultiChannel como interfaz principal
- Canales: Email, SMS, Push notifications, WhatsApp
- Tipos de recordatorios: Mensaje diario, consultas, meditación, limpieza energética
- Programación flexible (diario, semanal, personalizado)
- Plantillas personalizables para cada canal
- Historial completo de recordatorios enviados
- Analytics de engagement por canal
- A/B testing para optimizar mensajes

Usa react-hook-form para formularios y integra APIs de terceros para SMS y WhatsApp.
```

### 4. Visualizador AR de Cartas
```
Implementa un sistema de realidad aumentada para visualizar cartas angélicas:

- ARCardViewerWebXR usando WebXR y Three.js
- Modelos 3D interactivos de cartas con animaciones
- ARControls para manejar interacciones táctiles
- AREffects con partículas y efectos de luz celestial
- Detección de superficies para colocar cartas
- Compatibilidad con móviles y tablets
- Captura de screenshots en AR
- Compartir experiencias AR en redes sociales

Usa @react-three/fiber y @react-three/xr para la implementación WebXR.
```

### 5. IA para Interpretación Angélica
```
Crea un sistema de IA avanzado para interpretar cartas angélicas:

- AngelicAIInterpreter con integración OpenAI GPT-4
- Análisis contextual basado en preguntas del usuario
- Generación de interpretaciones personalizadas y profundas
- Historial de interpretaciones con búsqueda semántica
- Sistema de feedback para mejorar respuestas
- Diferentes estilos de interpretación (tradicional, moderno, místico)
- Integración con audio para lecturas narradas
- Exportación a PDF con diseño angélico

Incluye validación de respuestas y sistema de moderación de contenido.
```

### 6. Sistema de Pagos Avanzado
```
Desarrolla un sistema de pagos completo con:

- PaymentExtensionSystem para múltiples métodos de pago
- Integración con Stripe, PayPal, y criptomonedas
- Suscripciones recurrentes con diferentes planes
- Sistema de cupones y descuentos
- Facturación automática con PDFs personalizados
- Reembolsos y gestión de disputas
- Analytics de revenue con gráficos
- Notificaciones de pago por email y SMS

Incluye manejo de errores robusto y cumplimiento PCI DSS.
```

### 7. Dashboard de Analytics
```
Construye un dashboard completo de analytics con:

- AnalyticsDashboard con métricas en tiempo real
- Gráficos interactivos usando Recharts
- KPIs: usuarios activos, conversiones, revenue, engagement
- Segmentación por demografía, dispositivo, canal de adquisición
- Reportes automatizados por email
- Exportación de datos en múltiples formatos
- Comparación de periodos y tendencias
- Alertas automáticas para métricas críticas

Usa React Query para caché de datos y actualizaciones en tiempo real.
```

### 8. Sistema de Traducción en Vivo
```
Implementa traducción en tiempo real para sesiones multiidioma:

- RealTimeTranslation con detección automática de idioma
- Traducción de texto y voz durante videollamadas
- Soporte para 50+ idiomas con calidad profesional
- Subtítulos en tiempo real durante consultas
- Traducción de cartas angélicas y interpretaciones
- Interfaz adaptativa según idioma detectado
- Cache inteligente para mejorar velocidad
- Integración con Google Translate y DeepL

Incluye fallbacks y manejo de errores para conexiones lentas.
```

## Prompts de Integración

### Supabase Setup
```
Configura Supabase completamente para la plataforma angélica con:

- Tablas para usuarios, afiliados, pagos, sesiones, recordatorios
- Row Level Security (RLS) para protección de datos
- Funciones de base de datos para cálculos automáticos
- Triggers para notificaciones automáticas
- Políticas de backup y recuperación
- Índices optimizados para consultas rápidas
- Webhooks para integraciones externas

Incluye scripts de migración y datos de prueba.
```

### Deployment Completo
```
Prepara la aplicación para producción con:

- Configuración de Vercel/Netlify con variables de entorno
- CDN para assets estáticos y imágenes optimizadas
- SSL y seguridad headers
- Monitoreo con Sentry para errores
- Analytics con Google Analytics 4
- SEO optimization completo
- Performance monitoring
- Backup automático de datos críticos

Incluye scripts de CI/CD y testing automatizado.
```

## Tips para Usar con Lovable

1. **Sé específico**: Incluye nombres de componentes, librerías y funcionalidades exactas
2. **Menciona diseño**: Especifica que use componentes shadcn y sea responsive
3. **Incluye integraciones**: Siempre menciona Supabase, Stripe, etc.
4. **Pide código completo**: Especifica que incluya imports, exports y manejo de errores
5. **Solicita documentación**: Pide comentarios en el código para futuro mantenimiento

## Prompts de Debugging

### Para errores de conexión:
```
Ayúdame a debuggear problemas de conexión WebRTC. Revisa el código del VideoCallSystem y agrega logs detallados, manejo de errores robusto, y reconexión automática. Incluye indicadores visuales del estado de conexión.
```

### Para problemas de performance:
```
Optimiza el rendimiento de la aplicación angélica. Implementa lazy loading, code splitting, memoización con React.memo, y optimización de imágenes. Agrega monitoring de performance y métricas Core Web Vitals.
```