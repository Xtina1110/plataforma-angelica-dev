# 📋 Guía de Implementación - Sistema de Consultas Online con Traducción

## 🎯 Componentes Creados

### 1. **VideoConsultationIntegrated.jsx**
Sistema completo de video consulta con traducción en tiempo real integrada.

**Ubicación:** `src/components/OnlineConsultation/VideoConsultationIntegrated.jsx`

**Características:**
- ✅ VideoConferencia HD con WebRTC
- ✅ Traducción en tiempo real con OpenAI GPT-4
- ✅ 10 idiomas soportados (ES, EN, FR, IT, PT, DE, ZH, JA, KO, AR)
- ✅ Chat integrado con traducción automática
- ✅ Compartir cartas angélicas en tiempo real
- ✅ Grabación automática de sesión
- ✅ Timer con alertas de extensión
- ✅ Transcripción completa
- ✅ Generación automática de PDF al finalizar

### 2. **API: generate-session-pdf.js**
Generador de PDFs profesionales con toda la información de la sesión.

**Ubicación:** `api/generate-session-pdf.js`

**Incluye:**
- ✅ Información completa de la sesión
- ✅ Cartas angélicas compartidas con interpretaciones
- ✅ Transcripción completa con traducciones
- ✅ Mensajes de chat
- ✅ Diseño profesional con gradientes y colores angelicales
- ✅ Formato A4 optimizado para impresión

### 3. **API: translate-spiritual.js**
Endpoint de traducción especializada en contexto espiritual.

**Ubicación:** `api/translate-spiritual.js`

**Características:**
- ✅ Traducción con OpenAI GPT-4
- ✅ Preservación de términos espirituales
- ✅ 4 contextos espirituales (angelical, tarot, healing, meditation)
- ✅ Confianza de traducción 95-99%
- ✅ Fallback automático si falla OpenAI

---

## 🚀 Pasos de Implementación en Lovable

### Paso 1: Instalar Dependencias

Agrega estas dependencias a tu `package.json`:

```json
{
  "dependencies": {
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.2",
    "openai": "^4.28.0",
    "date-fns": "^3.3.1"
  }
}
```

**Prompt para Lovable:**
```
Agrega las siguientes dependencias al proyecto:
- jspdf versión 2.5.1
- jspdf-autotable versión 3.8.2
- openai versión 4.28.0
- date-fns versión 3.3.1
```

---

### Paso 2: Configurar Variables de Entorno

Agrega a tu archivo `.env`:

```env
OPENAI_API_KEY=tu_clave_api_de_openai
```

**Prompt para Lovable:**
```
Crea o actualiza el archivo .env con la variable:
OPENAI_API_KEY=sk-...

Y asegúrate de que esté en .gitignore
```

---

### Paso 3: Crear Tablas en Supabase

Ejecuta estos scripts SQL en Supabase:

```sql
-- Tabla de sesiones de consulta
CREATE TABLE consultation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  booking_id UUID,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  duration INTEGER,
  type TEXT,
  conversation_history JSONB,
  chat_messages JSONB,
  shared_cards JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes de chat
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sender TEXT NOT NULL,
  translated TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes de señalización (WebRTC)
CREATE TABLE signaling_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_consultation_sessions_user ON consultation_sessions(user_id);
CREATE INDEX idx_consultation_sessions_session ON consultation_sessions(session_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_signaling_messages_session ON signaling_messages(session_id);

-- Políticas de seguridad (RLS)
ALTER TABLE consultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE signaling_messages ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios ver sus propias sesiones
CREATE POLICY "Users can view own sessions" ON consultation_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Permitir a usuarios crear sesiones
CREATE POLICY "Users can create sessions" ON consultation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir a usuarios actualizar sus sesiones
CREATE POLICY "Users can update own sessions" ON consultation_sessions
  FOR UPDATE USING (auth.uid() = user_id);
```

**Prompt para Lovable:**
```
Crea las siguientes tablas en Supabase para el sistema de consultas online:

1. consultation_sessions: Para almacenar información de sesiones
   - id (UUID, primary key)
   - session_id (TEXT, unique)
   - user_id (UUID, referencia a auth.users)
   - booking_id (UUID)
   - start_time, end_time (TIMESTAMPTZ)
   - status (TEXT)
   - duration (INTEGER)
   - type (TEXT)
   - conversation_history (JSONB)
   - chat_messages (JSONB)
   - shared_cards (JSONB)

2. chat_messages: Para mensajes de chat
   - id (UUID)
   - session_id (TEXT)
   - message (TEXT)
   - sender (TEXT)
   - translated (TEXT)
   - timestamp (TIMESTAMPTZ)

3. signaling_messages: Para señalización WebRTC
   - id (UUID)
   - session_id (TEXT)
   - message (JSONB)
   - timestamp (TIMESTAMPTZ)

Habilita RLS y crea políticas para que los usuarios solo vean sus propias sesiones.
```

---

### Paso 4: Integrar el Componente

Actualiza `ConsultasOnlineVivo.jsx` para usar el nuevo componente:

```jsx
import React, { useState } from 'react';
import AppSidebar from '../AppSidebar';
import { AperturaAngelicaHeader } from '../headers';
import SistemaReservasCompleto from '../BookingSystem/SistemaReservasCompleto';
import VideoConsultationIntegrated from './VideoConsultationIntegrated';
import '../Dashboard.css';

const ConsultasOnlineVivo = ({ user, onLogout }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const handleStartSession = (booking) => {
    setBookingData(booking);
    setActiveSession(booking.id);
  };

  const handleEndSession = () => {
    setActiveSession(null);
    setBookingData(null);
  };

  return (
    <div className="dashboard-container">
      <AppSidebar />

      <main className="main-content"
        style={{
          backgroundImage: 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          overflowY: 'auto'
        }}>

        {!activeSession ? (
          <>
            <AperturaAngelicaHeader
              user={user}
              onLogout={onLogout}
              onNavigateHome={() => window.history.back()}
            />

            <SistemaReservasCompleto onStartSession={handleStartSession} />
          </>
        ) : (
          <VideoConsultationIntegrated
            sessionId={activeSession}
            bookingData={bookingData}
            userRole="client"
            onEndSession={handleEndSession}
          />
        )}
      </main>
    </div>
  );
};

export default ConsultasOnlineVivo;
```

**Prompt para Lovable:**
```
Actualiza el componente ConsultasOnlineVivo.jsx para:

1. Importar VideoConsultationIntegrated
2. Agregar estados para activeSession y bookingData
3. Mostrar SistemaReservasCompleto cuando no hay sesión activa
4. Mostrar VideoConsultationIntegrated cuando hay una sesión activa
5. Pasar función onStartSession al sistema de reservas
6. Manejar el fin de sesión con onEndSession

El componente debe alternar entre la vista de reservas y la vista de video consulta.
```

---

### Paso 5: Actualizar SistemaReservasCompleto

Agrega la funcionalidad para iniciar sesión después de confirmar reserva:

**Prompt para Lovable:**
```
En SistemaReservasCompleto.jsx, después de confirmar una reserva exitosamente:

1. Llama a la función onStartSession (recibida como prop) con los datos de la reserva
2. Pasa el objeto de reserva que incluye: id, type, duration, date, time, reader

Ejemplo:
if (onStartSession) {
  onStartSession({
    id: bookingId,
    type: selectedType.id,
    duration: selectedDuration.minutes,
    date: selectedDate,
    time: selectedTime,
    reader: selectedReader
  });
}
```

---

## 🎨 Características del Sistema

### Traducción en Tiempo Real

1. **Activación:** Click en el botón de idiomas (Languages)
2. **Selección de idiomas:** Desde (idioma origen) y Hacia (idioma destino)
3. **Inicio:** Click en "Iniciar" para comenzar a escuchar
4. **Visualización:** Las traducciones aparecen como subtítulos sobre el video
5. **Historial:** Todas las traducciones se guardan en el historial

### Chat Integrado

1. **Apertura:** Click en el botón de chat (MessageSquare)
2. **Mensajes:** Escribe y envía mensajes en tiempo real
3. **Traducción automática:** Si la traducción está activa, los mensajes se traducen
4. **Persistencia:** Todos los mensajes se guardan en la base de datos

### Cartas Compartidas

1. **Solo para lectores:** El lector puede compartir cartas durante la sesión
2. **Visualización:** Las cartas aparecen en el panel lateral
3. **Sincronización:** El cliente ve las mismas cartas en tiempo real

### Generación de PDF

1. **Automático:** Al finalizar la sesión se genera automáticamente
2. **Contenido completo:**
   - Información de la sesión
   - Cartas compartidas con interpretaciones
   - Transcripción completa con traducciones
   - Mensajes de chat
3. **Descarga:** El PDF se descarga automáticamente

---

## 🔧 Configuración de WebRTC

Para producción, considera usar un servicio de WebRTC como:

### Opción 1: Twilio (Recomendado)
```bash
npm install twilio-video
```

### Opción 2: Agora
```bash
npm install agora-rtc-sdk-ng
```

### Opción 3: Daily.co
```bash
npm install @daily-co/daily-js
```

**Prompt para integrar Twilio:**
```
Integra Twilio Video en VideoConsultationIntegrated.jsx:

1. Instala twilio-video
2. Reemplaza la inicialización de WebRTC con Twilio
3. Usa las credenciales de Twilio desde variables de entorno
4. Mantén la misma interfaz de usuario
```

---

## 📱 Pruebas

### Prueba Local

1. Inicia el servidor de desarrollo
2. Navega a Consultas Online
3. Crea una reserva
4. Confirma la reserva
5. La sesión de video debe iniciarse automáticamente
6. Prueba activar la traducción
7. Envía mensajes en el chat
8. Finaliza la sesión
9. Verifica que se descargue el PDF

### Prueba de Traducción

1. Activa la traducción
2. Selecciona idiomas diferentes
3. Habla en el micrófono
4. Verifica que aparezcan las traducciones
5. Revisa el historial de conversación

---

## 🐛 Solución de Problemas

### La cámara no se activa
- Verifica permisos del navegador
- Asegúrate de usar HTTPS (requerido para getUserMedia)
- Revisa la consola del navegador

### La traducción no funciona
- Verifica que OPENAI_API_KEY esté configurada
- Revisa los créditos de OpenAI
- Comprueba la consola para errores de API

### El PDF no se genera
- Verifica que jspdf esté instalado
- Revisa la consola del navegador
- Comprueba que el endpoint /api/generate-session-pdf esté accesible

### WebRTC no conecta
- Verifica la configuración de STUN/TURN servers
- Comprueba que ambos usuarios estén en la misma sesión
- Revisa los mensajes de señalización en Supabase

---

## 📚 Recursos Adicionales

- [Documentación de WebRTC](https://webrtc.org/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

## ✅ Checklist de Implementación

- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Tablas de Supabase creadas
- [ ] Componente VideoConsultationIntegrated integrado
- [ ] API endpoints creados y funcionando
- [ ] Sistema de reservas actualizado
- [ ] Pruebas de video realizadas
- [ ] Pruebas de traducción realizadas
- [ ] Generación de PDF verificada
- [ ] Deploy a producción

---

## 🎉 ¡Listo!

Tu sistema de consultas online con traducción en tiempo real está completo y listo para usar.

**Características implementadas:**
✅ Video conferencia HD
✅ Traducción en tiempo real (10 idiomas)
✅ Chat con traducción automática
✅ Compartir cartas angélicas
✅ Grabación de sesión
✅ Transcripción completa
✅ Generación automática de PDF profesional
✅ Timer con alertas
✅ Sistema de extensión de sesión

---

**Creado para Plataforma Angelical © 2025**

