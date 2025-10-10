# 📊 Guía de Configuración de Analytics - Plataforma Angélica

## 🎯 Objetivo

Configurar Google Analytics 4 y Mixpanel para trackear el comportamiento de usuarios y optimizar la conversión.

---

## 📈 Google Analytics 4 (GA4)

### Paso 1: Crear Cuenta y Propiedad

1. **Ir a Google Analytics**
   ```
   https://analytics.google.com
   ```

2. **Crear cuenta** (si no tienes)
   - Click en "Empezar a medir"
   - Nombre de cuenta: "Plataforma Angélica"
   - Configurar opciones de compartición de datos

3. **Crear propiedad**
   - Nombre de propiedad: "Plataforma Angélica - Web"
   - Zona horaria: Europe/Madrid
   - Moneda: EUR (€)

4. **Configurar detalles del negocio**
   - Categoría: Health & Fitness
   - Tamaño: Pequeña empresa
   - Objetivos: Generar clientes potenciales, Aumentar ventas online

### Paso 2: Configurar Flujo de Datos

1. **Seleccionar plataforma: Web**

2. **Configurar flujo de datos web:**
   - URL del sitio web: `https://plataforma-angelica-dev.vercel.app`
   - Nombre del flujo: "Producción Web"

3. **Habilitar medición mejorada:**
   - ✅ Vistas de página
   - ✅ Desplazamientos
   - ✅ Clics salientes
   - ✅ Búsqueda en el sitio
   - ✅ Interacción con videos
   - ✅ Descargas de archivos

### Paso 3: Obtener Measurement ID

1. En "Flujos de datos" verás tu **Measurement ID**
   ```
   Formato: G-XXXXXXXXXX
   ```

2. **Copiar este ID**

### Paso 4: Añadir a la Aplicación

1. **Crear/editar archivo `.env` en la raíz del proyecto:**
   ```env
   REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **El código ya está implementado** en `src/utils/analytics.js`
   - No necesitas añadir nada más
   - Se inicializará automáticamente

### Paso 5: Configurar Eventos Personalizados

Los siguientes eventos ya están implementados y se trackearán automáticamente:

#### Autenticación
- `login` - Usuario inicia sesión
- `sign_up` - Usuario se registra
- `logout` - Usuario cierra sesión

#### Registro
- `begin_registration` - Inicia registro
- `registration_step_completed` - Completa un paso
- `registration_completed` - Completa registro

#### Suscripción
- `view_subscription_plans` - Ve planes
- `select_plan` - Selecciona un plan
- `begin_checkout` - Inicia pago
- `purchase` - Completa pago

#### Onboarding
- `onboarding_started` - Inicia onboarding
- `onboarding_step_completed` - Completa paso
- `onboarding_completed` - Completa onboarding

#### Errores
- `error_occurred` - Ocurre un error

### Paso 6: Configurar Conversiones

1. **Ir a Admin → Eventos**

2. **Marcar como conversiones:**
   - ✅ `sign_up`
   - ✅ `registration_completed`
   - ✅ `purchase`
   - ✅ `onboarding_completed`

3. **Crear audiencias:**
   - Usuarios registrados
   - Usuarios con suscripción
   - Usuarios que completaron onboarding

---

## 🎨 Mixpanel

### Paso 1: Crear Cuenta y Proyecto

1. **Ir a Mixpanel**
   ```
   https://mixpanel.com
   ```

2. **Registrarse** (si no tienes cuenta)
   - Email
   - Contraseña
   - Verificar email

3. **Crear proyecto**
   - Nombre: "Plataforma Angélica"
   - Zona horaria: Europe/Madrid
   - Moneda: EUR

### Paso 2: Obtener Project Token

1. **Ir a Settings → Project Settings**

2. **Copiar "Project Token"**
   ```
   Formato: string de 32 caracteres
   ```

### Paso 3: Añadir a la Aplicación

1. **Añadir al archivo `.env`:**
   ```env
   REACT_APP_MIXPANEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **El código ya está implementado** en `src/utils/analytics.js`

### Paso 4: Configurar Propiedades de Usuario

Las siguientes propiedades se trackean automáticamente:

```javascript
{
  $email: user.email,
  $name: user.full_name,
  user_type: user.user_type,
  subscription_plan: user.subscription_plan,
  registration_date: user.created_at,
  email_verified: user.email_verified,
  onboarding_completed: user.onboarding_completed
}
```

### Paso 5: Crear Funnels

1. **Ir a Funnels → Create Funnel**

2. **Funnel de Registro:**
   ```
   1. begin_registration
   2. registration_step_completed (step = 1)
   3. registration_step_completed (step = 6)
   4. registration_completed
   5. email_verified
   ```

3. **Funnel de Suscripción:**
   ```
   1. view_subscription_plans
   2. select_plan
   3. begin_checkout
   4. purchase
   ```

4. **Funnel de Onboarding:**
   ```
   1. onboarding_started
   2. onboarding_step_completed (step = 1)
   3. onboarding_step_completed (step = 5)
   4. onboarding_completed
   ```

### Paso 6: Configurar Retention

1. **Ir a Retention → Create Report**

2. **Configurar:**
   - Evento inicial: `sign_up`
   - Evento de retorno: Cualquier evento
   - Período: Semanal
   - Duración: 12 semanas

---

## 🔧 Configuración del Código

### Archivo `.env` Completo

```env
# Supabase (ya configurado)
REACT_APP_SUPABASE_URL=https://kolciyzkuvcwzegsomww.supabase.co
REACT_APP_SUPABASE_ANON_KEY=xxx

# Stripe (pendiente)
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_xxx
REACT_APP_STRIPE_SECRET_KEY=sk_live_xxx

# Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_MIXPANEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Verificar Implementación

El archivo `src/utils/analytics.js` ya incluye:

```javascript
// Inicialización automática
export const initializeAnalytics = () => {
  // Google Analytics
  if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
    // Inicializar GA4
  }
  
  // Mixpanel
  if (process.env.REACT_APP_MIXPANEL_TOKEN) {
    // Inicializar Mixpanel
  }
};

// Tracking de eventos
export const trackEvent = (eventName, properties) => {
  // Track en GA4
  // Track en Mixpanel
};

// Identificar usuario
export const identifyUser = (userId, properties) => {
  // Identificar en Mixpanel
  // Set user properties en GA4
};
```

### Uso en Componentes

Ya implementado en:
- `LoginEnhanced.jsx`
- `RegistroMultiStep.jsx`
- `Step5Subscription.jsx`
- `OnboardingTour.jsx`

Ejemplo:
```javascript
import { trackEvent } from '../utils/analytics';

// Al hacer login
trackEvent('login', {
  method: 'email',
  timestamp: new Date().toISOString()
});

// Al completar registro
trackEvent('registration_completed', {
  user_type: formData.userType,
  subscription_plan: formData.subscriptionPlan
});
```

---

## 📊 Eventos Trackeados

### Tabla Completa

| Evento | Descripción | Propiedades |
|--------|-------------|-------------|
| `login` | Usuario inicia sesión | method, timestamp |
| `sign_up` | Usuario se registra | user_type, plan, timestamp |
| `logout` | Usuario cierra sesión | timestamp |
| `begin_registration` | Inicia registro | timestamp |
| `registration_step_completed` | Completa paso | step, step_name |
| `registration_completed` | Completa registro | user_type, plan, duration |
| `view_subscription_plans` | Ve planes | timestamp |
| `select_plan` | Selecciona plan | plan_name, price, billing_cycle |
| `begin_checkout` | Inicia pago | plan, amount |
| `purchase` | Completa pago | plan, amount, currency, payment_method |
| `onboarding_started` | Inicia onboarding | timestamp |
| `onboarding_step_completed` | Completa paso | step, step_name |
| `onboarding_completed` | Completa onboarding | duration, steps_completed |
| `error_occurred` | Ocurre error | error_message, error_type, component |

---

## 🎯 Métricas Clave a Monitorear

### Registro
- **Tasa de conversión de registro:** % de visitantes que completan registro
- **Abandono por paso:** % que abandona en cada paso
- **Tiempo promedio de registro:** Tiempo total del proceso
- **Plan más popular:** Qué plan eligen más usuarios

### Suscripción
- **Tasa de conversión a pago:** % que pasa de gratis a pago
- **Revenue por usuario (ARPU):** Ingreso promedio por usuario
- **Lifetime Value (LTV):** Valor total del cliente
- **Churn rate:** % de cancelaciones

### Engagement
- **DAU/MAU:** Usuarios activos diarios/mensuales
- **Sesiones por usuario:** Frecuencia de uso
- **Tiempo en plataforma:** Duración de sesiones
- **Features más usadas:** Qué funcionalidades usan más

### Onboarding
- **Tasa de completación:** % que completa onboarding
- **Tiempo de onboarding:** Duración promedio
- **Retención D1/D7/D30:** Retención a 1, 7 y 30 días

---

## 🧪 Testing

### Verificar que Analytics Funciona

1. **Abrir DevTools** (F12)

2. **Ir a Console**

3. **Buscar logs:**
   ```
   [Analytics] Event tracked: login
   [Analytics] User identified: user_123
   ```

4. **Verificar en GA4:**
   - Ir a Reports → Realtime
   - Hacer una acción en la web
   - Ver si aparece en tiempo real

5. **Verificar en Mixpanel:**
   - Ir a Events → Live View
   - Hacer una acción en la web
   - Ver si aparece en tiempo real

---

## 🔐 Privacidad y GDPR

### Configuración Recomendada

1. **Anonimizar IPs** (GA4)
   - Ya habilitado por defecto en GA4

2. **Opt-out de usuarios**
   - Implementar banner de cookies
   - Permitir desactivar tracking

3. **Datos sensibles**
   - NO trackear: contraseñas, datos de pago
   - Sí trackear: eventos, acciones, métricas agregadas

4. **Retención de datos**
   - GA4: 14 meses (configurable)
   - Mixpanel: Sin límite (configurable)

---

## 📈 Dashboards Recomendados

### Google Analytics 4

1. **Overview Dashboard**
   - Usuarios activos
   - Nuevos usuarios
   - Sesiones
   - Tasa de rebote
   - Conversiones

2. **Acquisition Dashboard**
   - Fuentes de tráfico
   - Campañas
   - Canales
   - Landing pages

3. **Engagement Dashboard**
   - Páginas más vistas
   - Eventos principales
   - Tiempo en página
   - Flujo de usuarios

4. **Monetization Dashboard**
   - Revenue
   - Transacciones
   - ARPU
   - LTV

### Mixpanel

1. **Product Analytics**
   - Feature usage
   - User journeys
   - Funnels
   - Retention cohorts

2. **Growth Dashboard**
   - New signups
   - Activation rate
   - Retention curves
   - Churn analysis

---

## ✅ Checklist de Implementación

```
[ ] 1. Crear cuenta Google Analytics
[ ] 2. Crear propiedad GA4
[ ] 3. Obtener Measurement ID
[ ] 4. Añadir GA_MEASUREMENT_ID a .env
[ ] 5. Crear cuenta Mixpanel
[ ] 6. Crear proyecto Mixpanel
[ ] 7. Obtener Project Token
[ ] 8. Añadir MIXPANEL_TOKEN a .env
[ ] 9. Reiniciar aplicación
[ ] 10. Hacer test de eventos
[ ] 11. Verificar en GA4 Realtime
[ ] 12. Verificar en Mixpanel Live View
[ ] 13. Configurar conversiones en GA4
[ ] 14. Crear funnels en Mixpanel
[ ] 15. Configurar dashboards
```

---

## 🎉 Resultado

Con analytics configurado tendrás:

- ✅ Visibilidad completa del comportamiento de usuarios
- ✅ Métricas de conversión en tiempo real
- ✅ Identificación de puntos de fricción
- ✅ Datos para optimizar la experiencia
- ✅ ROI medible de mejoras

---

## 📚 Recursos

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Mixpanel Documentation](https://docs.mixpanel.com)
- [Analytics Best Practices](https://www.optimizely.com/optimization-glossary/analytics/)

---

**Tiempo estimado:** 20 minutos  
**Dificultad:** Fácil  
**Impacto:** Alto

**Creado con 💜 para Plataforma Angélica**

