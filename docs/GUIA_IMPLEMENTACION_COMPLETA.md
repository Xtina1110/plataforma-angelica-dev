# Guía de Implementación Completa - Apertura Angelical Clase Mundial
## Plan Detallado para Continuar el Desarrollo

---

## 📊 PROGRESO ACTUAL

### ✅ COMPLETADO (Mejora #1 de 19)

**1. Sistema de Contexto (Context API)** - 100% ✅
- Archivo: `src/contexts/AperturaAngelicalContext.jsx`
- 400+ líneas de código
- Provider y Hook personalizados
- Estado global completo
- Integración con Supabase
- Funciones CRUD para historial, favoritos, estadísticas

**Schema de Base de Datos** - 100% ✅
- Archivo: `supabase/migrations/create_apertura_angelical_tables.sql`
- 4 tablas creadas:
  - `historial_tiradas`
  - `tiradas_favoritas`
  - `estadisticas_usuario`
  - `configuracion_apertura`
- Índices, triggers, RLS policies

**Integración Parcial en TiradaAngelical** - 30% ⚠️
- Context importado
- Estado migrado parcialmente
- Falta: Guardar automático, botones UI, historial visible

---

## 🚀 PRÓXIMOS PASOS - ORDEN DE IMPLEMENTACIÓN

### **PASO 1: Completar Integración del Context** ⏱️ 2-3 horas

#### **A. Envolver TiradaAngelical con Provider en Dashboard.jsx**

**Ubicación:** `src/components/Dashboard.jsx` línea ~1132

**Cambio necesario:**
```javascript
// ANTES:
{vistaActual === 'tirada-angelical' && (
  <TiradaAngelical
    onVolver={handleVolverInicio}
    user={user}
    onLogout={handleLogout}
  />
)}

// DESPUÉS:
import { AperturaAngelicalProvider } from '../contexts/AperturaAngelicalContext';

{vistaActual === 'tirada-angelical' && (
  <AperturaAngelicalProvider user={user}>
    <TiradaAngelical
      onVolver={handleVolverInicio}
      user={user}
      onLogout={handleLogout}
    />
  </AperturaAngelicalProvider>
)}
```

#### **B. Agregar Guardado Automático en TiradaAngelical.jsx**

**Ubicación:** Después de generar interpretaciones completas

**Código a agregar:**
```javascript
// En la función que completa la tirada (después de todas las interpretaciones)
const completarTirada = async () => {
  const tiradaCompleta = {
    tipo: tipoSeleccionado,
    tema: temaSeleccionado,
    cartas: cartasSeleccionadas,
    interpretaciones: interpretaciones
  };
  
  // Guardar en historial automáticamente
  const tiradaGuardada = await guardarTirada(tiradaCompleta);
  
  // Actualizar tirada actual en contexto
  updateAperturaState({ tiradaActual: tiradaGuardada });
  
  // Mostrar mensaje de éxito
  toast({
    title: '✨ Tirada completada',
    description: 'Tu tirada ha sido guardada en el historial',
  });
  
  setPaso('resumenFinal');
};
```

#### **C. Agregar Botones de Historial y Favoritos**

**Ubicación:** En el header de Apertura Angelical

**Código a agregar en `AperturaAngelicaHeader.jsx`:**
```javascript
import { History, BookmarkPlus } from 'lucide-react';

// Dentro del header, agregar botones:
<div className="header-actions">
  <button 
    onClick={() => setMostrarHistorial(true)}
    className="btn-historial"
    title="Ver historial de tiradas"
  >
    <History className="w-5 h-5" />
    <span>Historial</span>
    {aperturaState.historialTiradas.length > 0 && (
      <span className="badge">{aperturaState.historialTiradas.length}</span>
    )}
  </button>
  
  <button 
    onClick={() => setMostrarFavoritos(true)}
    className="btn-favoritos"
    title="Ver tiradas favoritas"
  >
    <BookmarkPlus className="w-5 h-5" />
    <span>Favoritos</span>
    {aperturaState.tiradasFavoritas.length > 0 && (
      <span className="badge">{aperturaState.tiradasFavoritas.length}</span>
    )}
  </button>
</div>
```

#### **D. Crear Componente de Historial**

**Nuevo archivo:** `src/components/HistorialTiradas.jsx`

```javascript
import React, { useState } from 'react';
import { useAperturaAngelical } from '../contexts/AperturaAngelicalContext';
import { Search, Filter, Calendar, Star, Trash2, Eye } from 'lucide-react';

const HistorialTiradas = ({ onClose, onVerTirada }) => {
  const { aperturaState, buscarEnHistorial } = useAperturaAngelical();
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({});
  
  const tiradas = buscarEnHistorial(busqueda, filtros);
  
  return (
    <div className="historial-modal">
      <div className="historial-header">
        <h2>📜 Historial de Tiradas</h2>
        <button onClick={onClose}>✕</button>
      </div>
      
      <div className="historial-filtros">
        <div className="search-box">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por tema, tipo o carta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <select 
          onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
          className="filter-select"
        >
          <option value="">Todos los tipos</option>
          <option value="3 Cartas">3 Cartas</option>
          <option value="6 Cartas">6 Cartas</option>
          <option value="9 Cartas">9 Cartas</option>
        </select>
      </div>
      
      <div className="historial-lista">
        {tiradas.length === 0 ? (
          <div className="empty-state">
            <p>No hay tiradas en el historial</p>
          </div>
        ) : (
          tiradas.map(tirada => (
            <div key={tirada.id} className="tirada-item">
              <div className="tirada-info">
                <h3>{tirada.tema}</h3>
                <p className="tirada-meta">
                  {tirada.tipo_tirada} • {new Date(tirada.fecha).toLocaleDateString()}
                </p>
                <div className="tirada-cartas-preview">
                  {tirada.cartas.slice(0, 3).map((carta, i) => (
                    <span key={i} className="carta-nombre">{carta.nombre}</span>
                  ))}
                  {tirada.cartas.length > 3 && <span>+{tirada.cartas.length - 3}</span>}
                </div>
              </div>
              
              <div className="tirada-acciones">
                <button 
                  onClick={() => onVerTirada(tirada)}
                  className="btn-ver"
                  title="Ver tirada completa"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => agregarFavorito(tirada)}
                  className="btn-favorito"
                  title="Agregar a favoritos"
                >
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="historial-stats">
        <p>Total de tiradas: {aperturaState.estadisticas.totalTiradas}</p>
        <p>Racha actual: {aperturaState.estadisticas.racha} días 🔥</p>
      </div>
    </div>
  );
};

export default HistorialTiradas;
```

#### **E. Crear Componente de Favoritos**

**Nuevo archivo:** `src/components/FavoritosTiradas.jsx`

```javascript
import React, { useState } from 'react';
import { useAperturaAngelical } from '../contexts/AperturaAngelicalContext';
import { Star, Trash2, Eye, Edit2, Save } from 'lucide-react';

const FavoritosTiradas = ({ onClose, onVerTirada }) => {
  const { aperturaState, quitarFavorito, actualizarNotasFavorito } = useAperturaAngelical();
  const [editandoNotas, setEditandoNotas] = useState(null);
  const [notasTemp, setNotasTemp] = useState('');
  
  const guardarNotas = async (favoritoId) => {
    await actualizarNotasFavorito(favoritoId, notasTemp);
    setEditandoNotas(null);
  };
  
  return (
    <div className="favoritos-modal">
      <div className="favoritos-header">
        <h2>⭐ Tiradas Favoritas</h2>
        <button onClick={onClose}>✕</button>
      </div>
      
      <div className="favoritos-lista">
        {aperturaState.tiradasFavoritas.length === 0 ? (
          <div className="empty-state">
            <Star className="w-12 h-12 opacity-20" />
            <p>No tienes tiradas favoritas aún</p>
            <p className="text-sm">Marca tus tiradas especiales como favoritas</p>
          </div>
        ) : (
          aperturaState.tiradasFavoritas.map(favorito => (
            <div key={favorito.id} className="favorito-item">
              <div className="favorito-info">
                <h3>{favorito.tema}</h3>
                <p className="favorito-meta">
                  {favorito.tipo_tirada} • {new Date(favorito.fecha_agregado).toLocaleDateString()}
                </p>
                
                <div className="favorito-notas">
                  {editandoNotas === favorito.id ? (
                    <div className="notas-editor">
                      <textarea
                        value={notasTemp}
                        onChange={(e) => setNotasTemp(e.target.value)}
                        placeholder="Agrega tus notas personales..."
                        rows={3}
                      />
                      <div className="notas-acciones">
                        <button onClick={() => guardarNotas(favorito.id)}>
                          <Save className="w-4 h-4" /> Guardar
                        </button>
                        <button onClick={() => setEditandoNotas(null)}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="notas-display">
                      <p>{favorito.notas || 'Sin notas'}</p>
                      <button 
                        onClick={() => {
                          setEditandoNotas(favorito.id);
                          setNotasTemp(favorito.notas || '');
                        }}
                        className="btn-editar-notas"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="favorito-acciones">
                <button 
                  onClick={() => onVerTirada(favorito)}
                  className="btn-ver"
                  title="Ver tirada completa"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => quitarFavorito(favorito.id)}
                  className="btn-eliminar"
                  title="Quitar de favoritos"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritosTiradas;
```

---

### **PASO 2: Ejecutar Migración SQL en Supabase** ⏱️ 30 minutos

#### **Instrucciones:**

1. **Ir a Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Seleccionar proyecto: plataforma-angelica

2. **Ir a SQL Editor:**
   - Menú lateral → SQL Editor
   - Click en "New query"

3. **Copiar y ejecutar el SQL:**
   - Abrir archivo: `supabase/migrations/create_apertura_angelical_tables.sql`
   - Copiar TODO el contenido
   - Pegar en el editor SQL
   - Click en "Run"

4. **Verificar creación:**
   - Ir a Table Editor
   - Deberías ver 4 nuevas tablas:
     - historial_tiradas
     - tiradas_favoritas
     - estadisticas_usuario
     - configuracion_apertura

5. **Verificar políticas RLS:**
   - Click en cada tabla
   - Tab "Policies"
   - Deberías ver 4 políticas por tabla (SELECT, INSERT, UPDATE, DELETE)

---

### **PASO 3: Implementar Mejora #2 - Videollamadas** ⏱️ 8-10 horas

#### **A. Elegir Plataforma de Videollamadas**

**RECOMENDACIÓN: Jitsi Meet** (Open source, gratis, fácil)

**Alternativas:**
- Daily.co (más profesional, $99/mes)
- Zoom SDK (más complejo, $40/mes)

#### **B. Instalar Dependencias**

```bash
npm install react-jitsi
```

#### **C. Crear Componente de Videollamada**

**Nuevo archivo:** `src/components/VideoConsulta/VideoConsultaJitsi.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { Jitsi } from 'react-jitsi';
import { supabase } from '../../integrations/supabase/client';

const VideoConsultaJitsi = ({ consulta, user, onFinalizar }) => {
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [consultaIniciada, setConsultaIniciada] = useState(false);
  
  useEffect(() => {
    // Calcular tiempo hasta inicio de consulta
    const interval = setInterval(() => {
      const ahora = new Date();
      const inicio = new Date(consulta.fecha_hora);
      const diff = inicio - ahora;
      setTiempoRestante(diff);
      
      // Permitir entrar 5 minutos antes
      if (diff <= 5 * 60 * 1000 && diff > 0) {
        setConsultaIniciada(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [consulta]);
  
  const handleJitsiAPI = (JitsiMeetAPI) => {
    // Eventos de Jitsi
    JitsiMeetAPI.on('videoConferenceJoined', () => {
      console.log('Usuario unido a la consulta');
      // Registrar inicio en Supabase
      supabase.from('consultas_log').insert({
        consulta_id: consulta.id,
        usuario_id: user.id,
        evento: 'joined',
        timestamp: new Date().toISOString()
      });
    });
    
    JitsiMeetAPI.on('videoConferenceLeft', () => {
      console.log('Usuario salió de la consulta');
      onFinalizar();
    });
  };
  
  if (!consultaIniciada) {
    return (
      <div className="sala-espera">
        <h2>Tu consulta angelical comienza en:</h2>
        <div className="countdown">
          {tiempoRestante > 0 ? formatTiempo(tiempoRestante) : 'Puedes entrar ahora'}
        </div>
        
        <div className="preparacion">
          <h3>Mientras esperas:</h3>
          <ul>
            <li>✅ Verifica tu conexión de internet</li>
            <li>✅ Asegúrate de tener cámara y micrófono funcionando</li>
            <li>✅ Encuentra un lugar tranquilo y privado</li>
            <li>✅ Ten papel y lápiz para tomar notas</li>
            <li>✅ Prepara tus preguntas para el angelólogo</li>
          </ul>
        </div>
        
        <button 
          disabled={tiempoRestante > 5 * 60 * 1000}
          onClick={() => setConsultaIniciada(true)}
          className="btn-entrar-consulta"
        >
          {tiempoRestante > 5 * 60 * 1000 
            ? 'Espera un momento...' 
            : 'Entrar a la consulta'}
        </button>
      </div>
    );
  }
  
  return (
    <div className="video-consulta-container">
      <Jitsi
        roomName={`consulta-${consulta.id}`}
        displayName={user.nombre || user.email}
        config={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false
        }}
        interfaceConfig={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#1a1a2e',
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop',
            'fullscreen', 'fodeviceselection', 'hangup', 'chat',
            'recording', 'settings', 'raisehand', 'videoquality',
            'filmstrip', 'stats', 'shortcuts', 'tileview'
          ]
        }}
        onAPILoad={handleJitsiAPI}
        containerStyle={{ width: '100%', height: '100vh' }}
      />
    </div>
  );
};

const formatTiempo = (ms) => {
  const horas = Math.floor(ms / (1000 * 60 * 60));
  const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((ms % (1000 * 60)) / 1000);
  
  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
};

export default VideoConsultaJitsi;
```

#### **D. Integrar en OnlineConsultationSystem**

**Ubicación:** `src/components/OnlineConsultation/OnlineConsultationSystem.jsx`

**Agregar nuevo paso:**
```javascript
import VideoConsultaJitsi from '../VideoConsulta/VideoConsultaJitsi';

// En el componente, agregar estado:
const [consultaActiva, setConsultaActiva] = useState(null);

// Agregar paso de videollamada:
if (consultaActiva) {
  return (
    <VideoConsultaJitsi
      consulta={consultaActiva}
      user={user}
      onFinalizar={() => {
        setConsultaActiva(null);
        setStep('feedback');
      }}
    />
  );
}

// En la confirmación, agregar botón para iniciar:
<button onClick={() => setConsultaActiva(booking)}>
  Ir a la videollamada
</button>
```

#### **E. Implementar Sistema de Pagos con Stripe**

**Instalar Stripe:**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Nuevo archivo:** `src/components/PagoConsulta/PagoStripe.jsx`

```javascript
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../../integrations/supabase/client';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const FormularioPago = ({ consulta, onPagoExitoso }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setProcesando(true);
    setError(null);
    
    try {
      // Crear Payment Intent en tu backend
      const { data: paymentIntent } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          consulta_id: consulta.id,
          monto: consulta.precio * 100, // Convertir a centavos
          moneda: 'eur'
        }
      });
      
      // Confirmar pago con Stripe
      const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: consulta.usuario_nombre,
              email: consulta.usuario_email
            }
          }
        }
      );
      
      if (stripeError) {
        setError(stripeError.message);
        setProcesando(false);
        return;
      }
      
      // Registrar pago en Supabase
      await supabase.from('pagos_consultas').insert({
        consulta_id: consulta.id,
        usuario_id: consulta.usuario_id,
        monto: consulta.precio,
        moneda: 'eur',
        stripe_payment_intent_id: confirmedPayment.id,
        estado: 'completado',
        fecha_pago: new Date().toISOString()
      });
      
      // Actualizar estado de consulta
      await supabase.from('consultas').update({
        estado: 'pagada'
      }).eq('id', consulta.id);
      
      onPagoExitoso(confirmedPayment);
    } catch (err) {
      setError('Error procesando el pago. Intenta de nuevo.');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="formulario-pago">
      <h3>Pago Seguro</h3>
      <p className="precio-consulta">Total: €{consulta.precio}</p>
      
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && <div className="error-mensaje">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || procesando}
        className="btn-pagar"
      >
        {procesando ? 'Procesando...' : `Pagar €${consulta.precio}`}
      </button>
      
      <p className="pago-seguro-texto">
        🔒 Pago seguro procesado por Stripe
      </p>
    </form>
  );
};

const PagoConsulta = ({ consulta, onPagoExitoso }) => {
  return (
    <Elements stripe={stripePromise}>
      <FormularioPago consulta={consulta} onPagoExitoso={onPagoExitoso} />
    </Elements>
  );
};

export default PagoConsulta;
```

**Crear Edge Function en Supabase:**

1. Ir a Supabase Dashboard → Edge Functions
2. Crear nueva función: `create-payment-intent`
3. Código:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  try {
    const { consulta_id, monto, moneda } = await req.json()
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: monto,
      currency: moneda,
      metadata: {
        consulta_id: consulta_id
      }
    })
    
    return new Response(
      JSON.stringify({ client_secret: paymentIntent.client_secret }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

4. Agregar secret `STRIPE_SECRET_KEY` en Supabase Settings → Edge Functions

---

### **PASO 4: Implementar Mejora #3 - Cartas 3D** ⏱️ 6-8 horas

#### **A. Instalar Dependencias**

```bash
npm install three @react-three/fiber @react-three/drei
```

#### **B. Crear Componente Carta3D**

**Nuevo archivo:** `src/components/Carta3D/Carta3D.jsx`

```javascript
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

const CartaMesh = ({ imagen, revelada, onClick, rotacionInicial = [0, 0, 0] }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Cargar texturas
  const textureFrontal = useTexture(imagen);
  const texturaReverso = useTexture('/cartas/reverso-angelical.png');
  
  // Animación de rotación en hover
  useFrame((state) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.rotation.y += 0.01;
      }
      
      // Efecto de flotación suave
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  // Animación de volteo al revelar
  useFrame(() => {
    if (meshRef.current && revelada) {
      const targetRotation = Math.PI; // 180 grados
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.05
      );
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      rotation={rotacionInicial}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2, 3, 0.05]} />
      <meshStandardMaterial 
        map={revelada ? textureFrontal : texturaReverso}
        metalness={0.3}
        roughness={0.4}
      />
      
      {/* Brillo angelical en hover */}
      {hovered && (
        <pointLight
          position={[0, 0, 1]}
          intensity={0.5}
          color="#FFD700"
          distance={3}
        />
      )}
    </mesh>
  );
};

const Carta3D = ({ carta, revelada, onClick, width = 400, height = 600 }) => {
  return (
    <div style={{ width, height, cursor: 'pointer' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* Carta 3D */}
        <CartaMesh
          imagen={carta.imagen}
          revelada={revelada}
          onClick={onClick}
        />
        
        {/* Controles de órbita (opcional) */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        {/* Fondo estrellado */}
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial color="#0a0a1a" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Carta3D;
```

#### **C. Crear Selector de Modo 2D/3D**

**En TiradaAngelical.jsx, agregar:**

```javascript
import Carta3D from './Carta3D/Carta3D';
import { useAperturaAngelical } from '../contexts/AperturaAngelicalContext';

// En el componente:
const { aperturaState, updateConfiguracion } = useAperturaAngelical();
const modo3D = aperturaState.visualizacion.tipoCartas === '3D';

// Botón para cambiar modo:
<button 
  onClick={() => updateConfiguracion('visualizacion', { 
    tipoCartas: modo3D ? '2D' : '3D' 
  })}
  className="btn-toggle-3d"
>
  {modo3D ? '2D' : '3D'} Cartas
</button>

// Al renderizar cartas:
{modo3D ? (
  <Carta3D
    carta={carta}
    revelada={revelada}
    onClick={() => seleccionarCarta(carta)}
  />
) : (
  <div className="carta-2d">
    <img src={carta.imagen} alt={carta.nombre} />
  </div>
)}
```

---

### **PASO 5: Implementar Mejora #4 - Ambientes Sagrados** ⏱️ 4-6 horas

#### **A. Preparar Assets de Video**

**Necesitas 5 videos de fondo (loop):**
1. `cielo-angelical.mp4` - Nubes doradas, luz divina
2. `bosque-sagrado.mp4` - Naturaleza, paz
3. `oceano-cosmico.mp4` - Agua, flujo
4. `templo-fuego.mp4` - Llamas, transformación
5. `galaxia-estelar.mp4` - Estrellas, cosmos

**Ubicación:** `/public/ambientes/`

**Fuentes recomendadas:**
- Pexels.com (gratis)
- Pixabay.com (gratis)
- Envato Elements (pago, alta calidad)

#### **B. Crear Componente AmbienteSagrado**

**Nuevo archivo:** `src/components/AmbienteSagrado/AmbienteSagrado.jsx`

```javascript
import React, { useEffect, useState } from 'react';
import { useAperturaAngelical } from '../../contexts/AperturaAngelicalContext';
import './AmbienteSagrado.css';

const ambientesConfig = {
  cielo: {
    nombre: 'Cielo Angelical',
    video: '/ambientes/cielo-angelical.mp4',
    musica: '/musica/cielo-armonico.mp3',
    particulas: 'luz-dorada',
    color: '#FFD700',
    descripcion: 'Nubes doradas y luz divina'
  },
  bosque: {
    nombre: 'Bosque Sagrado',
    video: '/ambientes/bosque-sagrado.mp4',
    musica: '/musica/naturaleza-paz.mp3',
    particulas: 'hojas-flotantes',
    color: '#228B22',
    descripcion: 'Naturaleza y paz interior'
  },
  oceano: {
    nombre: 'Océano Cósmico',
    video: '/ambientes/oceano-cosmico.mp4',
    musica: '/musica/agua-flujo.mp3',
    particulas: 'burbujas',
    color: '#4169E1',
    descripcion: 'Flujo y emociones'
  },
  templo: {
    nombre: 'Templo de Fuego',
    video: '/ambientes/templo-fuego.mp4',
    musica: '/musica/fuego-transformacion.mp3',
    particulas: 'chispas',
    color: '#FF4500',
    descripcion: 'Transformación y purificación'
  },
  galaxia: {
    nombre: 'Galaxia Estelar',
    video: '/ambientes/galaxia-estelar.mp4',
    musica: '/musica/cosmos-infinito.mp3',
    particulas: 'estrellas',
    color: '#9370DB',
    descripcion: 'Cosmos y propósito'
  }
};

const AmbienteSagrado = ({ children }) => {
  const { aperturaState, updateConfiguracion } = useAperturaAngelical();
  const ambiente = aperturaState.ambiente.tipo;
  const config = ambientesConfig[ambiente];
  
  const [audioElement, setAudioElement] = useState(null);
  
  useEffect(() => {
    // Cargar y reproducir música del ambiente
    if (aperturaState.audio.musica && config.musica) {
      const audio = new Audio(config.musica);
      audio.loop = true;
      audio.volume = aperturaState.audio.volumenMusica;
      audio.play();
      setAudioElement(audio);
      
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [ambiente, aperturaState.audio.musica]);
  
  return (
    <div className="ambiente-container">
      {/* Video de fondo */}
      <video
        className="ambiente-video"
        autoPlay
        loop
        muted
        playsInline
        src={config.video}
      />
      
      {/* Overlay con gradiente */}
      <div 
        className="ambiente-overlay"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${config.color}15 100%)`
        }}
      />
      
      {/* Sistema de partículas */}
      {aperturaState.ambiente.particulas && (
        <ParticleSystem type={config.particulas} color={config.color} />
      )}
      
      {/* Contenido de la aplicación */}
      <div className="ambiente-content">
        {children}
      </div>
      
      {/* Selector de ambiente */}
      <div className="ambiente-selector">
        <button 
          onClick={() => setMostrarSelector(!mostrarSelector)}
          className="btn-cambiar-ambiente"
          title="Cambiar ambiente sagrado"
        >
          🌟 {config.nombre}
        </button>
        
        {mostrarSelector && (
          <div className="ambiente-opciones">
            {Object.entries(ambientesConfig).map(([key, amb]) => (
              <button
                key={key}
                onClick={() => {
                  updateConfiguracion('ambiente', { tipo: key });
                  setMostrarSelector(false);
                }}
                className={`opcion-ambiente ${ambiente === key ? 'activo' : ''}`}
                style={{ borderColor: amb.color }}
              >
                <div className="opcion-preview">
                  <video src={amb.video} muted />
                </div>
                <span>{amb.nombre}</span>
                <p>{amb.descripcion}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de sistema de partículas
const ParticleSystem = ({ type, color }) => {
  const particulas = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 10}s`
  }));
  
  return (
    <div className="particle-system">
      {particulas.map(p => (
        <div
          key={p.id}
          className={`particle particle-${type}`}
          style={{
            left: p.left,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            backgroundColor: color
          }}
        />
      ))}
    </div>
  );
};

export default AmbienteSagrado;
```

**CSS:** `src/components/AmbienteSagrado/AmbienteSagrado.css`

```css
.ambiente-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.ambiente-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

.ambiente-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.ambiente-content {
  position: relative;
  z-index: 1;
}

.particle-system {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  opacity: 0;
  animation: float-up linear infinite;
}

.particle-luz-dorada {
  box-shadow: 0 0 10px currentColor;
}

.particle-hojas-flotantes {
  width: 8px;
  height: 12px;
  border-radius: 50% 0;
  transform: rotate(45deg);
}

.particle-burbujas {
  width: 6px;
  height: 6px;
  border: 1px solid currentColor;
  background: transparent;
}

.particle-chispas {
  width: 2px;
  height: 8px;
  border-radius: 50%;
}

.particle-estrellas {
  width: 3px;
  height: 3px;
  box-shadow: 0 0 5px currentColor;
}

@keyframes float-up {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.ambiente-selector {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}

.btn-cambiar-ambiente {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.btn-cambiar-ambiente:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
}

.ambiente-opciones {
  position: absolute;
  bottom: 60px;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  min-width: 400px;
}

.opcion-ambiente {
  background: white;
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.opcion-ambiente:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.opcion-ambiente.activo {
  border-color: currentColor;
  box-shadow: 0 0 20px currentColor;
}

.opcion-preview {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
}

.opcion-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.opcion-ambiente span {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}

.opcion-ambiente p {
  font-size: 11px;
  color: #666;
  margin: 0;
}
```

#### **C. Envolver TiradaAngelical con AmbienteSagrado**

**En Dashboard.jsx:**

```javascript
import AmbienteSagrado from './AmbienteSagrado/AmbienteSagrado';

{vistaActual === 'tirada-angelical' && (
  <AperturaAngelicalProvider user={user}>
    <AmbienteSagrado>
      <TiradaAngelical
        onVolver={handleVolverInicio}
        user={user}
        onLogout={handleLogout}
      />
    </AmbienteSagrado>
  </AperturaAngelicalProvider>
)}
```

---

## 📚 RECURSOS ADICIONALES

### **Documentación de Referencia:**
- React Context API: https://react.dev/reference/react/useContext
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- Three.js: https://threejs.org/docs/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Jitsi Meet: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-sdk
- Stripe: https://stripe.com/docs/payments/accept-a-payment

### **Assets Necesarios:**
- Videos de ambientes (5x, ~30s cada uno, loop)
- Música de ambientes (5x, ~3min cada una, loop)
- Imagen de reverso de carta angelical
- Modelos 3D de cartas (opcional, para AR)

### **Variables de Entorno (.env):**
```
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_JITSI_DOMAIN=meet.jit.si
REACT_APP_OPENAI_API_KEY=sk-...
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de cada paso, verifica:

**PASO 1:**
- [ ] Provider envuelve TiradaAngelical
- [ ] Tiradas se guardan automáticamente
- [ ] Botones de historial y favoritos visibles
- [ ] Modal de historial funciona
- [ ] Modal de favoritos funciona
- [ ] Búsqueda en historial funciona
- [ ] Agregar/quitar favoritos funciona
- [ ] Notas en favoritos funcionan

**PASO 2:**
- [ ] Tablas creadas en Supabase
- [ ] Políticas RLS activas
- [ ] Puedes insertar datos manualmente
- [ ] Puedes consultar datos desde la app

**PASO 3:**
- [ ] Jitsi instalado
- [ ] Componente de videollamada renderiza
- [ ] Sala de espera funciona
- [ ] Countdown funciona
- [ ] Videollamada se inicia correctamente
- [ ] Stripe instalado
- [ ] Formulario de pago renderiza
- [ ] Pago de prueba funciona
- [ ] Edge function responde
- [ ] Consulta se marca como pagada

**PASO 4:**
- [ ] Three.js instalado
- [ ] Carta 3D renderiza
- [ ] Rotación en hover funciona
- [ ] Animación de volteo funciona
- [ ] Selector 2D/3D funciona
- [ ] Cambio entre modos funciona

**PASO 5:**
- [ ] Videos de ambientes cargados
- [ ] Video de fondo reproduce
- [ ] Música reproduce
- [ ] Partículas se muestran
- [ ] Selector de ambiente funciona
- [ ] Cambio de ambiente funciona
- [ ] Configuración se guarda

---

## 🎯 PRÓXIMAS MEJORAS (Después de completar los 5 pasos)

**Mejora #6: Narración con Voz IA** (OpenAI TTS)
**Mejora #7: Música Adaptativa**
**Mejora #8: Sistema de Recordatorios**
**Mejora #9: Búsqueda y Filtros Avanzados**
**Mejora #10: Compartir Mejorado**
**Mejora #11: Gamificación (Logros, Rachas)**
**Mejora #12: IA Contextual Avanzada**
**Mejora #13: Modo Meditación**
**Mejora #14: Comunidad (Círculos de Luz)**
**Mejora #15: Realidad Aumentada**

Cada una con guía detallada similar a esta.

---

## 💡 CONSEJOS FINALES

1. **Trabaja en orden** - No saltes pasos
2. **Testea cada cambio** - Verifica antes de continuar
3. **Haz commits frecuentes** - Cada funcionalidad completada
4. **Documenta problemas** - Anota errores para resolverlos
5. **Pide ayuda si necesitas** - No te quedes atascado

**¡Éxito con la implementación! 🚀✨**

