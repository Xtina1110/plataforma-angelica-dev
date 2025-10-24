# 🚀 Guía Rápida para Lovable - Sistema de Consultas Online

## 📋 Prompts Listos para Copiar y Pegar

### 1️⃣ Instalar Dependencias

```
Instala las siguientes dependencias en el proyecto:

npm install jspdf@2.5.1 jspdf-autotable@3.8.2 openai@4.28.0 date-fns@3.3.1

Estas librerías son necesarias para:
- jspdf y jspdf-autotable: Generación de PDFs profesionales
- openai: Traducción espiritual con GPT-4
- date-fns: Manejo de fechas y timestamps
```

---

### 2️⃣ Configurar Variable de Entorno

```
Agrega la siguiente variable de entorno al proyecto:

OPENAI_API_KEY=sk-tu_clave_aqui

Esta clave es necesaria para la traducción en tiempo real con GPT-4.
Obtén tu clave en: https://platform.openai.com/api-keys

Asegúrate de que esta variable esté en el archivo .env y que .env esté en .gitignore
```

---

### 3️⃣ Crear Componente VideoConsultationIntegrated

```
Crea un nuevo archivo en:
src/components/OnlineConsultation/VideoConsultationIntegrated.jsx

[Copia aquí el contenido completo del archivo VideoConsultationIntegrated.jsx]

Este componente incluye:
- Video conferencia HD con WebRTC
- Traducción en tiempo real integrada (10 idiomas)
- Chat con traducción automática
- Compartir cartas angélicas
- Grabación automática
- Timer con alertas
- Generación de PDF al finalizar
```

---

### 4️⃣ Crear API de Generación de PDFs

```
Crea un nuevo archivo en:
api/generate-session-pdf.js

[Copia aquí el contenido completo del archivo generate-session-pdf.js]

Este endpoint genera PDFs profesionales con:
- Información completa de la sesión
- Cartas angélicas compartidas
- Transcripción con traducciones
- Mensajes de chat
- Diseño profesional angelical
```

---

### 5️⃣ Crear API de Traducción Espiritual

```
Crea un nuevo archivo en:
api/translate-spiritual.js

[Copia aquí el contenido completo del archivo translate-spiritual.js]

Este endpoint proporciona:
- Traducción con OpenAI GPT-4
- Preservación de términos espirituales
- 4 contextos espirituales (angelical, tarot, healing, meditation)
- 10 idiomas soportados
- Fallback automático si falla OpenAI
```

---

### 6️⃣ Crear Tablas en Supabase

```
Ejecuta el siguiente script SQL en Supabase SQL Editor:

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

-- Tabla de mensajes de señalización WebRTC
CREATE TABLE signaling_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_consultation_sessions_user ON consultation_sessions(user_id);
CREATE INDEX idx_consultation_sessions_session ON consultation_sessions(session_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_signaling_messages_session ON signaling_messages(session_id);

-- Habilitar Row Level Security
ALTER TABLE consultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE signaling_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own sessions" ON consultation_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions" ON consultation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON consultation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM consultation_sessions 
      WHERE consultation_sessions.session_id = chat_messages.session_id 
      AND consultation_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat messages" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM consultation_sessions 
      WHERE consultation_sessions.session_id = chat_messages.session_id 
      AND consultation_sessions.user_id = auth.uid()
    )
  );
```

---

### 7️⃣ Actualizar ConsultasOnlineVivo.jsx

```
Actualiza el archivo src/components/OnlineConsultation/ConsultasOnlineVivo.jsx:

Reemplaza todo el contenido con:

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

Este cambio permite:
- Mostrar el sistema de reservas cuando no hay sesión activa
- Iniciar automáticamente la video consulta al confirmar una reserva
- Volver al sistema de reservas al finalizar la sesión
```

---

### 8️⃣ Actualizar SistemaReservasCompleto.jsx

```
En el archivo src/components/BookingSystem/SistemaReservasCompleto.jsx:

Busca la función handleConfirmBooking y agrega al final (después de guardar en Supabase):

// Iniciar sesión de video automáticamente
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

También agrega onStartSession como prop en la definición del componente:

const SistemaReservasCompleto = ({ onStartSession }) => {

Esto hará que después de confirmar una reserva, se inicie automáticamente la sesión de video.
```

---

## ✅ Checklist de Implementación

Marca cada paso a medida que lo completes:

- [ ] ✅ Dependencias instaladas
- [ ] ✅ Variable OPENAI_API_KEY configurada
- [ ] ✅ VideoConsultationIntegrated.jsx creado
- [ ] ✅ generate-session-pdf.js creado
- [ ] ✅ translate-spiritual.js creado
- [ ] ✅ Tablas de Supabase creadas
- [ ] ✅ ConsultasOnlineVivo.jsx actualizado
- [ ] ✅ SistemaReservasCompleto.jsx actualizado
- [ ] ✅ Prueba de video realizada
- [ ] ✅ Prueba de traducción realizada
- [ ] ✅ Prueba de PDF realizada

---

## 🧪 Pruebas

### Prueba 1: Crear Reserva
1. Navega a Consultas Online
2. Selecciona tipo de consulta
3. Selecciona duración (60, 75, 90, 105, o 120 min)
4. Selecciona fecha y hora
5. Selecciona lector
6. Confirma reserva
7. ✅ Debe iniciar automáticamente la sesión de video

### Prueba 2: Video Conferencia
1. Permite acceso a cámara y micrófono
2. ✅ Debe verse tu video local
3. ✅ Debe verse el área del video remoto
4. Prueba desactivar/activar cámara
5. Prueba silenciar/activar micrófono
6. ✅ Los controles deben funcionar correctamente

### Prueba 3: Traducción
1. Click en botón de idiomas (Languages)
2. Selecciona idioma origen (ej: Español)
3. Selecciona idioma destino (ej: English)
4. Click en "Iniciar"
5. Habla en el micrófono
6. ✅ Deben aparecer subtítulos traducidos sobre el video
7. ✅ El historial debe mostrar las traducciones

### Prueba 4: Chat
1. Click en botón de chat (MessageSquare)
2. Escribe un mensaje
3. Click en "Enviar"
4. ✅ El mensaje debe aparecer en el chat
5. Si la traducción está activa, debe mostrarse la traducción

### Prueba 5: Finalizar y PDF
1. Click en botón rojo de finalizar (PhoneOff)
2. ✅ La sesión debe terminar
3. ✅ Debe descargarse automáticamente un PDF
4. Abre el PDF
5. ✅ Debe contener toda la información de la sesión

---

## 🐛 Solución Rápida de Problemas

### Error: "Cannot access camera"
**Solución:** Asegúrate de estar usando HTTPS (no HTTP). WebRTC requiere conexión segura.

### Error: "OpenAI API key not found"
**Solución:** Verifica que OPENAI_API_KEY esté en el archivo .env y que el servidor esté reiniciado.

### Error: "Table does not exist"
**Solución:** Ejecuta los scripts SQL en Supabase para crear las tablas.

### Error: "PDF generation failed"
**Solución:** Verifica que jspdf y jspdf-autotable estén instalados correctamente.

---

## 📞 Siguiente Paso

Una vez completada la implementación, tendrás un sistema completo de consultas online con:

✅ Video conferencia HD
✅ Traducción en tiempo real (10 idiomas)
✅ Chat integrado con traducción
✅ Compartir cartas angélicas
✅ Grabación automática
✅ Timer con alertas
✅ Generación automática de PDF

**¡Tu plataforma angelical estará lista para ofrecer consultas profesionales en múltiples idiomas!**

---

**Creado para Plataforma Angelical © 2025**

