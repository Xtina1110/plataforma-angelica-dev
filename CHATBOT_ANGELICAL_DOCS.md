# 🤖 Chatbot Angelical - Documentación Completa

## 📋 Descripción General

El Chatbot Angelical es un asistente de IA avanzado que proporciona orientación espiritual personalizada 24/7 a los usuarios de la Plataforma Angélica. Utiliza OpenAI GPT-4 con prompts especializados para mantener conversaciones significativas y contextualmente apropiadas sobre espiritualidad.

---

## ✨ Características Principales

### 1. **5 Personalidades Angelicales**

Cada ángel tiene su propia personalidad, especialización y estilo de comunicación:

| Ángel | Rol | Especialización | Color |
|-------|-----|-----------------|-------|
| 👼 Ángela | Guía Espiritual General | Orientación general, crecimiento personal | Púrpura |
| ⚔️ Arcángel Miguel | Protección y Fortaleza | Coraje, superación de miedos, protección | Azul |
| 💚 Arcángel Rafael | Sanación y Bienestar | Sanación física, emocional y espiritual | Verde |
| 📯 Arcángel Gabriel | Comunicación y Creatividad | Expresión, creatividad, nuevos comienzos | Naranja |
| 💡 Arcángel Uriel | Sabiduría e Iluminación | Toma de decisiones, claridad, conocimiento | Amarillo |

### 2. **Capacidades de IA Avanzadas**

- ✅ **Contexto Espiritual**: Mantiene el contexto de conversaciones anteriores
- ✅ **Function Calling**: Puede ejecutar acciones (agendar, recomendar, etc.)
- ✅ **Multimodal**: Texto y voz (con integración opcional de ElevenLabs)
- ✅ **Multi-idioma**: Soporte para 10+ idiomas
- ✅ **Personalización**: Adapta respuestas al nivel espiritual del usuario

### 3. **Acciones Inteligentes**

El chatbot puede sugerir y ejecutar acciones:

- 📚 **Recomendar Cursos**: Basado en necesidades del usuario
- 📅 **Agendar Consultas**: Ayuda a reservar sesiones
- ✨ **Sugerir Terapias**: Recomienda limpiezas y sanaciones
- 🔮 **Lecturas de Cartas**: Ofrece interpretaciones angelicales
- 🧘 **Guiar Meditaciones**: Proporciona prácticas espirituales

### 4. **Interfaz Intuitiva**

- **Botón Flotante**: Acceso rápido desde cualquier página
- **Chat Integrado**: En sección de Mensaje Diario
- **Selector de Ángeles**: Cambia entre personalidades fácilmente
- **Sugerencias Rápidas**: Preguntas frecuentes predefinidas
- **Reconocimiento de Voz**: Habla con el ángel
- **Síntesis de Voz**: Escucha las respuestas

---

## 🏗️ Arquitectura Técnica

### Componentes

```
src/components/
├── AngelicChatbot.jsx          # Componente principal del chat
├── FloatingChatButton.jsx      # Botón flotante para acceso rápido
└── MensajeDelDiaEnhanced.jsx   # Integración en Mensaje Diario

api/
└── angelic-chat.js             # API endpoint para OpenAI
```

### Flujo de Datos

```
Usuario → AngelicChatbot → API (/api/angelic-chat) → OpenAI GPT-4 → Respuesta → Usuario
                                                    ↓
                                            Function Calling
                                                    ↓
                                        Acciones (agendar, recomendar)
```

---

## 🚀 Implementación

### Paso 1: Configurar Variables de Entorno

```bash
# .env
OPENAI_API_KEY=sk-...                    # Requerido
ELEVENLABS_API_KEY=...                   # Opcional (para voz)
```

### Paso 2: Instalar Dependencias

```bash
npm install openai
# o
pnpm add openai
```

### Paso 3: Configurar en Lovable

1. **Agregar archivos al proyecto**:
   - Copia `AngelicChatbot.jsx` a `src/components/`
   - Copia `FloatingChatButton.jsx` a `src/components/`
   - Copia `MensajeDelDiaEnhanced.jsx` a `src/components/`
   - Copia `angelic-chat.js` a `api/`

2. **Actualizar Dashboard.jsx**:
```javascript
import FloatingChatButton from './FloatingChatButton';
import MensajeDelDiaEnhanced from './MensajeDelDiaEnhanced';

// En el return del Dashboard, antes del cierre:
<FloatingChatButton user={user} />

// En la sección 'mensaje':
<MensajeDelDiaEnhanced user={user} onLogout={onLogout} />
```

3. **Configurar variables de entorno en Lovable**:
   - Ve a Settings → Environment Variables
   - Agrega `OPENAI_API_KEY`

### Paso 4: Desplegar

```bash
git add .
git commit -m "feat: Add Angelic Chatbot with AI"
git push origin main
```

---

## 💬 Uso del Chatbot

### Desde Mensaje Diario

1. Ve a **Mensaje Diario** desde el sidebar
2. Click en tab **"Chat Angelical"**
3. Selecciona el ángel que desees consultar
4. Escribe tu pregunta o usa sugerencias rápidas

### Desde Botón Flotante

1. El botón aparece en la esquina inferior derecha
2. Click para abrir el chat
3. Conversa con el ángel predeterminado (Ángela)
4. Cambia de ángel usando el selector

### Preguntas de Ejemplo

```
✨ "¿Qué mensaje tienen los ángeles para mí hoy?"
📚 "¿Qué curso me recomiendas para mi crecimiento espiritual?"
🔮 "Interpreta una carta angelical para mi situación actual"
🧘 "Guíame en una meditación para encontrar paz interior"
📅 "Quiero agendar una consulta, ¿cómo puedo hacerlo?"
💫 "¿Cómo puedo conectar mejor con mi ángel guardián?"
```

---

## 🎨 Personalización

### Modificar Personalidades

Edita `api/angelic-chat.js`:

```javascript
const angelPersonalities = {
  angela: {
    name: 'Ángela',
    systemPrompt: `Tu prompt personalizado aquí...`
  }
};
```

### Agregar Nuevos Ángeles

1. Agrega el ángel en `AngelicChatbot.jsx`:
```javascript
const angels = [
  // ... ángeles existentes
  {
    id: 'nuevo_angel',
    name: 'Nuevo Ángel',
    role: 'Su rol',
    color: 'indigo',
    icon: '🌟',
    description: 'Descripción',
    personality: 'Personalidad'
  }
];
```

2. Agrega la personalidad en `api/angelic-chat.js`

### Modificar Acciones

Edita el array `functions` en `api/angelic-chat.js`:

```javascript
const functions = [
  {
    name: 'nueva_accion',
    description: 'Descripción de la acción',
    parameters: {
      // ... parámetros
    }
  }
];
```

---

## 🔧 Configuración Avanzada

### Integrar Voz con ElevenLabs

1. Obtén API key de ElevenLabs
2. Agrega a variables de entorno:
```bash
ELEVENLABS_API_KEY=...
```

3. Implementa la función `generateSpeech` en `api/angelic-chat.js`:
```javascript
async function generateSpeech(text, angel) {
  const voiceIds = {
    angela: 'voice_id_1',
    miguel: 'voice_id_2',
    // ...
  };

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceIds[angel]}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2'
      })
    }
  );

  const audioBlob = await response.blob();
  // Subir a S3 o servir directamente
  return { audioUrl: '...' };
}
```

### Guardar Historial en Base de Datos

1. Crea tabla en Supabase:
```sql
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  angel VARCHAR(50),
  message TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. Guarda mensajes en `api/angelic-chat.js`:
```javascript
// Después de generar respuesta
await supabase
  .from('chat_history')
  .insert({
    user_id: userId,
    angel: angel,
    message: message,
    response: aiMessage.content
  });
```

### Análisis y Métricas

Trackea uso del chatbot:

```javascript
// En api/angelic-chat.js
await supabase
  .from('chatbot_analytics')
  .insert({
    user_id: userId,
    angel: angel,
    session_duration: duration,
    messages_count: messageCount,
    actions_triggered: actions.length
  });
```

---

## 📊 Métricas y KPIs

### Métricas Clave

- **Engagement Rate**: % de usuarios que usan el chatbot
- **Session Duration**: Duración promedio de conversaciones
- **Messages per Session**: Mensajes por conversación
- **Action Conversion**: % de acciones completadas
- **User Satisfaction**: Rating de respuestas

### Dashboard de Métricas

Crea un dashboard para monitorear:

```javascript
// Consultas útiles
const metrics = {
  totalSessions: await getTotalSessions(),
  avgDuration: await getAvgSessionDuration(),
  topAngels: await getMostUsedAngels(),
  topActions: await getMostTriggeredActions(),
  userSatisfaction: await getAvgRating()
};
```

---

## 🎯 Mejores Prácticas

### Para Usuarios

1. **Sé específico**: Preguntas claras obtienen mejores respuestas
2. **Usa contexto**: Menciona tu situación actual
3. **Explora ángeles**: Cada uno tiene su especialidad
4. **Sigue acciones**: Completa las recomendaciones sugeridas

### Para Desarrolladores

1. **Monitorea costos**: OpenAI GPT-4 puede ser costoso
2. **Implementa rate limiting**: Evita abuso
3. **Cachea respuestas**: Para preguntas frecuentes
4. **Logs detallados**: Para debugging y mejoras
5. **A/B testing**: Prueba diferentes prompts

---

## 💰 Costos Estimados

### OpenAI GPT-4

- **Input**: $0.03 / 1K tokens
- **Output**: $0.06 / 1K tokens
- **Promedio por mensaje**: ~$0.01-0.03
- **1000 mensajes/día**: ~$10-30/día

### ElevenLabs (Opcional)

- **Free tier**: 10,000 caracteres/mes
- **Starter**: $5/mes (30,000 caracteres)
- **Creator**: $22/mes (100,000 caracteres)

### Total Estimado

- **100 usuarios activos/día**: $50-100/mes
- **500 usuarios activos/día**: $200-400/mes
- **1000 usuarios activos/día**: $400-800/mes

---

## 🔒 Seguridad y Privacidad

### Medidas Implementadas

1. **API Key Protection**: Keys en variables de entorno
2. **Rate Limiting**: Límite de mensajes por usuario
3. **Content Filtering**: Filtro de contenido inapropiado
4. **Data Encryption**: Conversaciones encriptadas
5. **User Consent**: Términos de uso claros

### Recomendaciones

- No almacenar información sensible
- Implementar GDPR compliance
- Permitir eliminación de historial
- Auditorías de seguridad regulares

---

## 🐛 Troubleshooting

### Problema: Chatbot no responde

**Solución**:
1. Verifica que `OPENAI_API_KEY` esté configurada
2. Revisa logs de la API en `/api/angelic-chat`
3. Verifica límites de rate de OpenAI

### Problema: Respuestas genéricas

**Solución**:
1. Mejora los system prompts
2. Aumenta el contexto (más mensajes de historial)
3. Ajusta `temperature` en la API call

### Problema: Acciones no funcionan

**Solución**:
1. Verifica que las rutas existan
2. Revisa el function calling en OpenAI
3. Debug el handler de acciones

---

## 🚀 Roadmap Futuro

### Corto Plazo (1-2 meses)

- [ ] Integración con WhatsApp
- [ ] Respuestas con imágenes
- [ ] Análisis de sentimientos
- [ ] Recomendaciones personalizadas mejoradas

### Medio Plazo (3-6 meses)

- [ ] Modo de voz completo (conversación por voz)
- [ ] Integración con calendario para recordatorios
- [ ] Chatbot proactivo (envía mensajes)
- [ ] Análisis predictivo de necesidades

### Largo Plazo (6-12 meses)

- [ ] Avatar 3D del ángel
- [ ] Realidad aumentada
- [ ] Multi-agente (varios ángeles conversando)
- [ ] Fine-tuning de modelo propio

---

## 📚 Recursos Adicionales

### Documentación

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [ElevenLabs API](https://docs.elevenlabs.io/)

### Comunidad

- Discord de la Plataforma Angélica
- Foro de desarrolladores
- GitHub Issues

---

## 🎉 Conclusión

El Chatbot Angelical es una herramienta poderosa que transforma la experiencia del usuario en la Plataforma Angélica. Con IA avanzada y personalidades únicas, proporciona orientación espiritual auténtica y personalizada 24/7.

**¡Que los ángeles guíen tu camino!** ✨🙏💜

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Autor**: Equipo Plataforma Angélica

