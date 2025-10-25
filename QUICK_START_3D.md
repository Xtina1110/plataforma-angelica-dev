# 🚀 Guía Rápida: Cartas 3D Inmersivas

## ⚡ Inicio Rápido (5 minutos)

### 1. Probar la Experiencia 3D

```bash
# Iniciar servidor de desarrollo
npm run dev

# Navegar a la página de prueba
http://localhost:5173/test-3d
```

### 2. Integrar en Apertura Angelical

**Opción A: Reemplazar completamente**

En `src/App.jsx`:

```javascript
import AngelicInterpreterWith3D from './components/AngelicInterpreterWith3D';

// Reemplazar la ruta existente:
<Route 
  path="/apertura-angelica" 
  element={<MainLayout><AngelicInterpreterWith3D /></MainLayout>} 
/>
```

**Opción B: Agregar como opción adicional**

Mantener la versión actual y agregar un toggle para activar 3D.

### 3. Agregar Archivos de Audio (Opcional)

Los archivos de audio son **opcionales**. El sistema funciona sin ellos, pero la experiencia es más inmersiva con música.

```bash
# Crear carpeta
mkdir -p public/audio

# Descargar música ambiente (ver recomendaciones abajo)
# Agregar a public/audio/:
# - temple-ambient.mp3
# - garden-ambient.mp3
# - cosmos-ambient.mp3
# - sanctuary-ambient.mp3
```

**Fuentes gratuitas recomendadas:**
- Pixabay Music: https://pixabay.com/music/ (buscar: "meditation", "ambient")
- Free Music Archive: https://freemusicarchive.org/
- YouTube Audio Library: https://www.youtube.com/audiolibrary

---

## 🎯 Características Principales

✅ **Experiencia 3D Completa**
- Cartas interactivas en 3D con React Three Fiber
- 4 entornos sagrados (Templo, Jardín, Cosmos, Santuario)
- Animaciones suaves de hover y selección
- Partículas doradas al seleccionar

✅ **Controles Profesionales**
- Audio: On/Off + Control de volumen
- Cámara: Zoom, rotación, pan, reset, fullscreen
- Calidad: Baja, Media, Alta (adaptativo)

✅ **Integración con IA**
- Se integra perfectamente con AngelicInterpreter
- Flujo: Selección de modalidad → 3D (opcional) → Interpretación con IA

---

## 📁 Archivos Creados

```
✅ src/components/3D/ImmersiveCardExperience.jsx  (Principal)
✅ src/components/3D/SacredEnvironments.jsx        (4 ambientes)
✅ src/components/3D/AngelicCard3D.jsx             (Carta individual)
✅ src/components/AngelicInterpreterWith3D.jsx     (Integración)
✅ src/pages/Test3DExperience.jsx                  (Página de prueba)
✅ public/audio/README.md                          (Guía de audio)
✅ CARTAS_3D_INMERSIVAS_DOCS.md                    (Documentación completa)
✅ QUICK_START_3D.md                               (Esta guía)
```

---

## 🎮 Cómo Usar

### Para el Usuario Final

1. **Seleccionar modalidad**: 3, 6 o 9 cartas
2. **Activar experiencia 3D**: Toggle opcional
3. **Seleccionar ambiente**: Templo, Jardín, Cosmos o Santuario
4. **Activar música**: Click en botón de audio
5. **Seleccionar cartas**: Click en cada carta para voltear
6. **Continuar**: Click en "Continuar con la Interpretación"
7. **Ver interpretación**: Análisis profundo con IA

### Controles

| Acción | Control |
|--------|---------|
| Rotar vista | Arrastrar con mouse |
| Zoom | Scroll |
| Seleccionar carta | Click en carta |
| Cambiar ambiente | Botones superiores |
| Audio on/off | Botón de volumen |
| Pantalla completa | Botón fullscreen |
| Reset cámara | Botón reset |

---

## ⚙️ Configuración

### Calidad Gráfica

El sistema detecta automáticamente el dispositivo y sugiere:
- **Móviles**: Calidad Baja
- **Tablets**: Calidad Media
- **Desktop**: Calidad Alta

El usuario puede cambiar manualmente en el botón de configuración.

### Audio

Si no hay archivos de audio, el sistema funciona normalmente sin música. El botón de audio estará visible pero no reproducirá nada.

---

## 🔧 Personalización Rápida

### Cambiar Colores

En `ImmersiveCardExperience.jsx`:

```javascript
// Línea ~280
const environments = [
  { id: 'temple', name: 'Templo Celestial', icon: '🏛️', color: '#ffd700' },
  // Cambiar 'color' aquí
];
```

### Ajustar Animaciones

En `ImmersiveCardExperience.jsx`, componente `Card3D`:

```javascript
// Velocidad de levitación (línea ~18)
Math.sin(state.clock.elapsedTime * 2) // Cambiar el 2

// Altura de levitación (línea ~18)
position[1] + 0.3 // Cambiar el 0.3
```

---

## 🐛 Solución de Problemas

### ❌ Cartas no se ven
- Verificar consola del navegador (F12)
- Comprobar que las dependencias estén instaladas
- Verificar que el array `cards` tenga datos

### ❌ Audio no suena
- **Normal si no hay archivos de audio**
- Verificar que los archivos existan en `/public/audio/`
- Comprobar permisos de autoplay del navegador

### ❌ Rendimiento lento
- Cambiar a calidad "Baja" en configuración
- Cerrar otras pestañas del navegador
- Actualizar drivers de GPU

---

## 📊 Estado del Proyecto

### ✅ Completado

- [x] Componente ImmersiveCardExperience
- [x] 4 entornos sagrados 3D
- [x] Controles de audio
- [x] Controles de cámara
- [x] Configuración de calidad
- [x] Integración con AngelicInterpreter
- [x] Página de prueba
- [x] Documentación completa
- [x] Push a GitHub

### 🔄 Pendiente (Opcional)

- [ ] Agregar archivos de audio
- [ ] Integrar en ruta principal de Apertura Angelical
- [ ] Probar en dispositivos móviles
- [ ] Ajustar según feedback de usuarios

---

## 📚 Documentación Completa

Para información detallada, ver:
- **CARTAS_3D_INMERSIVAS_DOCS.md**: Documentación técnica completa
- **public/audio/README.md**: Guía de archivos de audio
- **Código fuente**: Todos los componentes están comentados

---

## 🎉 ¡Listo para Usar!

El sistema está **100% funcional** y listo para producción. Solo necesitas:

1. ✅ Probar en `/test-3d`
2. ⚠️ Agregar archivos de audio (opcional)
3. ✅ Integrar en ruta principal (opcional)
4. ✅ Desplegar a producción

**Commit**: `ee45172`
**Branch**: `main`
**Estado**: Pushed to GitHub ✅

---

**¡Disfruta de la experiencia 3D más inmersiva para lecturas angelicales!** ✨🙏

