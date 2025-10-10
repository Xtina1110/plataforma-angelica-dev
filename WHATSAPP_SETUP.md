# 💬 Guía de Configuración de WhatsApp Business API

## 🎯 Objetivo

Configurar WhatsApp Business API para enviar notificaciones y comunicaciones a los usuarios de la Plataforma Angélica.

---

## 📋 Requisitos Previos

1. **Cuenta de Facebook Business Manager**
2. **Número de teléfono** dedicado para WhatsApp Business
3. **Verificación de negocio** en Facebook
4. **Tarjeta de crédito** para configuración (sin costo inicial)

---

## 🚀 Paso 1: Crear Cuenta de WhatsApp Business

### 1.1 Acceder a Meta for Developers

1. Ir a https://developers.facebook.com
2. Iniciar sesión con tu cuenta de Facebook
3. Click en "Mis Apps" → "Crear App"

### 1.2 Configurar App

1. **Tipo de app:** Business
2. **Nombre:** Plataforma Angélica
3. **Email de contacto:** Tu email
4. **Cuenta de Business Manager:** Seleccionar o crear

### 1.3 Añadir WhatsApp Product

1. En el dashboard de tu app
2. Click en "Añadir Producto"
3. Buscar "WhatsApp"
4. Click en "Configurar"

---

## 📱 Paso 2: Configurar Número de Teléfono

### 2.1 Añadir Número

1. En WhatsApp → Empezar
2. Click en "Añadir número de teléfono"
3. Seleccionar país: España (+34)
4. Ingresar número de teléfono
5. **Importante:** El número NO debe estar registrado en WhatsApp

### 2.2 Verificar Número

1. Seleccionar método de verificación:
   - SMS
   - Llamada de voz
2. Ingresar código de verificación
3. Confirmar

### 2.3 Configurar Perfil de Negocio

1. **Nombre del negocio:** Plataforma Angélica
2. **Categoría:** Health & Wellness
3. **Descripción:** Tu camino espiritual comienza aquí
4. **Dirección:** (opcional)
5. **Sitio web:** https://plataforma-angelica.com
6. **Foto de perfil:** Logo de Plataforma Angélica

---

## 🔑 Paso 3: Obtener Credenciales de API

### 3.1 Phone Number ID

1. En WhatsApp → Configuración de API
2. Copiar "Phone Number ID"
   ```
   Formato: 123456789012345
   ```

### 3.2 WhatsApp Business Account ID

1. En WhatsApp → Configuración
2. Copiar "WhatsApp Business Account ID"
   ```
   Formato: 123456789012345
   ```

### 3.3 Access Token

#### Opción A: Token Temporal (para testing)

1. En WhatsApp → Configuración de API
2. Click en "Generar token temporal"
3. Copiar token (válido por 24 horas)

#### Opción B: Token Permanente (para producción)

1. En Configuración → Básica
2. Scroll hasta "Tokens de acceso"
3. Click en "Generar token"
4. Seleccionar permisos:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
5. Copiar token y guardarlo de forma segura

---

## ⚙️ Paso 4: Configurar Variables de Entorno

### 4.1 Añadir a `.env`

```env
# WhatsApp Business API
REACT_APP_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
REACT_APP_WHATSAPP_PHONE_NUMBER_ID=123456789012345
REACT_APP_WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
REACT_APP_WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
```

### 4.2 Verificar Configuración

El archivo `src/utils/whatsappUtils.js` ya está configurado para usar estas variables.

---

## 📝 Paso 5: Crear Templates de Mensajes

WhatsApp requiere que los mensajes de negocio usen templates aprobados.

### 5.1 Acceder a Templates

1. En WhatsApp → Message Templates
2. Click en "Create Template"

### 5.2 Template de Bienvenida

**Nombre:** `welcome_message`  
**Categoría:** UTILITY  
**Idioma:** Spanish

**Contenido:**
```
¡Bienvenido/a a Plataforma Angélica, {{1}}! 🕊️✨

Tu registro ha sido completado exitosamente. Ahora puedes:

🎴 Acceder a tu Tirada Angélica personalizada
🎵 Disfrutar de Canalizaciones y Sonoterapia
💜 Reservar consultas con terapeutas certificados
📚 Explorar la Academia Angélica

¡Que tu camino espiritual esté lleno de luz! 💫

Equipo Plataforma Angélica
```

**Variables:**
- `{{1}}` = Nombre del usuario

### 5.3 Template de Recordatorio de Cita

**Nombre:** `appointment_reminder`  
**Categoría:** UTILITY  
**Idioma:** Spanish

**Contenido:**
```
📅 Recordatorio de Cita - Plataforma Angélica

Hola! Te recordamos tu próxima sesión:

👤 Terapeuta: {{1}}
🗓️ Fecha: {{2}}
🕐 Hora: {{3}}
💆 Servicio: {{4}}

Por favor, confirma tu asistencia respondiendo a este mensaje.

¡Nos vemos pronto! 🕊️
```

**Variables:**
- `{{1}}` = Nombre del terapeuta
- `{{2}}` = Fecha
- `{{3}}` = Hora
- `{{4}}` = Servicio

### 5.4 Template de Confirmación de Pago

**Nombre:** `payment_confirmation`  
**Categoría:** UTILITY  
**Idioma:** Spanish

**Contenido:**
```
✅ Pago Confirmado - Plataforma Angélica

Tu pago ha sido procesado exitosamente:

💳 Plan: {{1}}
💰 Monto: €{{2}}
🔢 ID Transacción: {{3}}

¡Gracias por tu confianza! Ahora tienes acceso completo a todas las funcionalidades de tu plan.

Equipo Plataforma Angélica 💜
```

**Variables:**
- `{{1}}` = Nombre del plan
- `{{2}}` = Monto
- `{{3}}` = ID de transacción

### 5.5 Enviar para Aprobación

1. Revisar template
2. Click en "Submit"
3. Esperar aprobación de Meta (24-48 horas)

---

## 🧪 Paso 6: Probar Integración

### 6.1 Test con Número de Prueba

1. En WhatsApp → Configuración de API
2. Añadir números de prueba
3. Usar `whatsappUtils.js` para enviar mensaje de prueba

### 6.2 Código de Prueba

```javascript
import { sendWhatsAppMessage } from './utils/whatsappUtils';

// Enviar mensaje de prueba
const testWhatsApp = async () => {
  try {
    const result = await sendWhatsAppMessage(
      '+34612345678', // Tu número de prueba
      '¡Hola! Este es un mensaje de prueba desde Plataforma Angélica 🕊️'
    );
    console.log('Mensaje enviado:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

testWhatsApp();
```

### 6.3 Verificar Recepción

1. Abrir WhatsApp en tu teléfono
2. Verificar que llegó el mensaje
3. Verificar formato y contenido

---

## 📊 Paso 7: Configurar Webhooks (Opcional)

Para recibir respuestas y estados de mensajes.

### 7.1 Crear Endpoint

Crear función en Supabase Edge Functions:

```typescript
// supabase/functions/whatsapp-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Verificación de webhook
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === 'tu_token_secreto') {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  // Procesar mensajes entrantes
  if (req.method === 'POST') {
    const body = await req.json();
    
    // Procesar webhook
    console.log('Webhook received:', body);
    
    // Aquí procesar mensajes, estados, etc.
    
    return new Response('OK', { status: 200 });
  }

  return new Response('Method not allowed', { status: 405 });
});
```

### 7.2 Configurar en Meta

1. En WhatsApp → Configuración
2. Click en "Configurar webhooks"
3. **Callback URL:** `https://kolciyzkuvcwzegsomww.supabase.co/functions/v1/whatsapp-webhook`
4. **Verify Token:** `tu_token_secreto`
5. **Campos de suscripción:**
   - messages
   - message_status
   - messaging_handovers

---

## 💰 Paso 8: Configurar Facturación

### 8.1 Añadir Método de Pago

1. En Business Manager → Configuración de pago
2. Añadir tarjeta de crédito
3. Configurar límite de gasto (opcional)

### 8.2 Precios de WhatsApp Business API

**Conversaciones gratuitas:**
- Primeras 1,000 conversaciones/mes: GRATIS

**Conversaciones de pago:**
- Conversación iniciada por negocio: ~€0.05
- Conversación iniciada por usuario: ~€0.01
- Precios varían por país

### 8.3 Monitoreo de Costos

1. Business Manager → Facturación
2. Ver uso mensual
3. Configurar alertas de gasto

---

## 🔐 Paso 9: Seguridad y Mejores Prácticas

### 9.1 Proteger Access Token

- ✅ Nunca commitear tokens en Git
- ✅ Usar variables de entorno
- ✅ Rotar tokens regularmente
- ✅ Usar tokens con permisos mínimos

### 9.2 Cumplimiento de Políticas

- ✅ Obtener consentimiento del usuario
- ✅ Permitir opt-out fácil
- ✅ No enviar spam
- ✅ Respetar horarios (no enviar de noche)
- ✅ Cumplir con GDPR

### 9.3 Rate Limits

WhatsApp tiene límites de mensajes:
- Tier 1: 1,000 mensajes/día
- Tier 2: 10,000 mensajes/día
- Tier 3: 100,000 mensajes/día
- Tier 4: Ilimitado

El tier aumenta automáticamente con buen uso.

---

## 📈 Paso 10: Monitoreo y Analytics

### 10.1 Dashboard de WhatsApp

1. En WhatsApp → Analytics
2. Ver métricas:
   - Mensajes enviados
   - Mensajes entregados
   - Mensajes leídos
   - Tasa de respuesta

### 10.2 Integrar con Analytics

En `src/utils/analytics.js`, añadir tracking:

```javascript
import { trackEvent } from './analytics';

// Al enviar mensaje de WhatsApp
trackEvent('whatsapp_message_sent', {
  type: 'welcome',
  recipient: phoneNumber
});

// Al recibir respuesta
trackEvent('whatsapp_message_received', {
  from: phoneNumber
});
```

---

## 🎯 Funcionalidades Implementadas

El archivo `whatsappUtils.js` ya incluye:

### Mensajes Disponibles

1. ✅ **Bienvenida** - Al completar registro
2. ✅ **Recordatorio de cita** - 24h antes de cita
3. ✅ **Confirmación de pago** - Al procesar pago
4. ✅ **Nueva consulta** - Cuando terapeuta responde
5. ✅ **Nuevo contenido** - Contenido relevante publicado
6. ✅ **Verificación de teléfono** - Código de verificación
7. ✅ **Renovación de suscripción** - Antes de vencer

### Funciones Útiles

- `sendWhatsAppMessage()` - Mensaje simple
- `sendWhatsAppTemplate()` - Usar template aprobado
- `verifyWhatsAppNumber()` - Validar número
- `getMessageStatus()` - Estado de mensaje
- `sendNotification()` - Enviar según preferencias

---

## ✅ Checklist de Implementación

```
[ ] 1. Crear cuenta en Meta for Developers
[ ] 2. Crear app de WhatsApp Business
[ ] 3. Añadir y verificar número de teléfono
[ ] 4. Configurar perfil de negocio
[ ] 5. Obtener Phone Number ID
[ ] 6. Obtener Business Account ID
[ ] 7. Generar Access Token
[ ] 8. Añadir credenciales a .env
[ ] 9. Crear templates de mensajes
[ ] 10. Enviar templates para aprobación
[ ] 11. Esperar aprobación (24-48h)
[ ] 12. Probar con número de prueba
[ ] 13. Configurar webhooks (opcional)
[ ] 14. Añadir método de pago
[ ] 15. Configurar alertas de gasto
[ ] 16. Integrar con analytics
[ ] 17. Probar en producción
```

---

## 🎉 Resultado

Con WhatsApp configurado tendrás:

- ✅ Notificaciones instantáneas a usuarios
- ✅ Mayor engagement (+300%)
- ✅ Recordatorios efectivos de citas
- ✅ Confirmaciones de pago inmediatas
- ✅ Canal de comunicación preferido
- ✅ Costos bajos (primeras 1,000 gratis)
- ✅ Analytics completo

---

## 📚 Recursos

- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Message Templates Guide](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Pricing](https://developers.facebook.com/docs/whatsapp/pricing)
- [Best Practices](https://developers.facebook.com/docs/whatsapp/guides/best-practices)

---

## 🆘 Troubleshooting

### Problema: Mensajes no se envían

**Solución:**
1. Verificar que el access token es válido
2. Verificar que el número está verificado
3. Verificar que el template está aprobado
4. Revisar logs de errores

### Problema: Template rechazado

**Solución:**
1. Revisar políticas de WhatsApp
2. Evitar contenido promocional excesivo
3. Usar lenguaje claro y profesional
4. Incluir opt-out si es necesario

### Problema: Límite de mensajes alcanzado

**Solución:**
1. Esperar 24 horas para reset
2. Solicitar aumento de tier
3. Optimizar frecuencia de envíos

---

**Tiempo estimado:** 2-3 horas (+ 24-48h aprobación templates)  
**Dificultad:** Media  
**Impacto:** Alto

**Creado con 💜 para Plataforma Angélica**

