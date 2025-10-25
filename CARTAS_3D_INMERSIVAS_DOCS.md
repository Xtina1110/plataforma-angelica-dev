# 📚 Documentación Completa: Sistema de Cartas 3D Inmersivas

## 🎯 Descripción General

Sistema completo de experiencia inmersiva 3D para la lectura de cartas angelicales, que combina visualización 3D interactiva con entornos sagrados, controles de audio, cámara y configuración de calidad gráfica.

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
src/
├── components/
│   ├── 3D/
│   │   ├── AngelicCard3D.jsx          # Componente de carta 3D individual (legacy)
│   │   ├── SacredEnvironments.jsx     # 4 entornos sagrados 3D
│   │   └── ImmersiveCardExperience.jsx # Experiencia integrada completa ⭐
│   ├── AngelicInterpreter.jsx         # Intérprete de cartas con IA
│   └── AngelicInterpreterWith3D.jsx   # Integración 3D + Intérprete ⭐
├── pages/
│   └── Test3DExperience.jsx           # Página de prueba
└── public/
    └── audio/
        ├── temple-ambient.mp3         # Música ambiente del templo
        ├── garden-ambient.mp3         # Música ambiente del jardín
        ├── cosmos-ambient.mp3         # Música ambiente del cosmos
        └── sanctuary-ambient.mp3      # Música ambiente del santuario
```

---

## 🎨 Componentes Detallados

### 1. ImmersiveCardExperience.jsx

**Componente principal** que integra toda la experiencia 3D.

#### Props

```javascript
{
  cards: Array,           // Array de cartas a mostrar
  onCardSelect: Function, // Callback cuando se selecciona una carta
  selectedCards: Array,   // Índices de cartas seleccionadas
  onComplete: Function    // Callback cuando se completa la selección
}
```

#### Características

✅ **Visualización 3D de Cartas**
- Cartas interactivas con React Three Fiber
- Animaciones de hover (levitación, escala, brillo)
- Efecto de volteo 3D al seleccionar
- Partículas doradas al seleccionar
- Aura de luz según arcángel

✅ **4 Entornos Sagrados**
- 🏛️ Templo Celestial (dorado, majestuoso)
- 🌸 Jardín Angelical (verde, natural)
- 🌌 Cosmos Estelar (púrpura, espacial)
- ✨ Santuario de Luz (blanco, luminoso)

✅ **Controles de Audio**
- Toggle de música on/off
- Control de volumen con slider
- Música adaptativa por ambiente
- Transición suave entre ambientes

✅ **Controles de Cámara**
- Zoom (scroll del mouse)
- Rotación (arrastrar)
- Pan (arrastrar con botón derecho)
- Reset de cámara a posición inicial
- Modo pantalla completa

✅ **Configuración de Calidad**
- **Baja**: Menos efectos, mejor rendimiento
- **Media**: Balance entre calidad y rendimiento
- **Alta**: Máximos efectos visuales

#### Ejemplo de Uso

```javascript
import ImmersiveCardExperience from './components/3D/ImmersiveCardExperience';

function MyComponent() {
  const cards = [
    { id: 1, name: 'Miguel', archangel: 'Miguel', meaning: 'Protección' },
    { id: 2, name: 'Gabriel', archangel: 'Gabriel', meaning: 'Comunicación' },
    { id: 3, name: 'Rafael', archangel: 'Rafael', meaning: 'Sanación' }
  ];

  const handleCardSelect = (card, index) => {
    console.log('Carta seleccionada:', card);
  };

  const handleComplete = () => {
    console.log('Todas las cartas seleccionadas');
  };

  return (
    <ImmersiveCardExperience
      cards={cards}
      onCardSelect={handleCardSelect}
      selectedCards={[0, 1, 2]}
      onComplete={handleComplete}
    />
  );
}
```

---

### 2. SacredEnvironments.jsx

Componente que renderiza los 4 entornos sagrados 3D.

#### Entornos Disponibles

##### 🏛️ Templo Celestial (`temple`)
- Piso dorado metálico
- 8 columnas blancas con capiteles dorados
- Cúpula celestial semi-transparente
- Partículas doradas flotantes
- Iluminación cálida y majestuosa

##### 🌸 Jardín Angelical (`garden`)
- Piso de hierba verde
- 12 árboles distribuidos en círculo
- 30 flores brillantes de colores
- Mariposas (partículas)
- Cielo diurno con sol
- Iluminación natural

##### 🌌 Cosmos Estelar (`cosmos`)
- 10,000 estrellas de fondo
- 5 nebulosas de colores
- 3 planetas orbitando
- Partículas cósmicas
- Iluminación espacial oscura

##### ✨ Santuario de Luz (`sanctuary`)
- Piso luminoso blanco
- 12 rayos de luz rotatorios
- 8 esferas de luz flotantes
- 500 partículas de luz
- Iluminación brillante y pura

#### Ejemplo de Uso

```javascript
import SacredEnvironments from './components/3D/SacredEnvironments';

<Canvas>
  <SacredEnvironments environment="temple" />
</Canvas>
```

---

### 3. AngelicInterpreterWith3D.jsx

Componente de integración que combina la experiencia 3D con el intérprete de IA.

#### Flujo de Usuario

1. **Selección de Modalidad**
   - 3 Cartas (Pasado, Presente, Futuro)
   - 6 Cartas (Cruz Angelical)
   - 9 Cartas (Mandala Completo)
   - Toggle para activar/desactivar experiencia 3D

2. **Experiencia 3D** (opcional)
   - Selección interactiva de cartas en 3D
   - Ambientes sagrados
   - Controles de audio y cámara

3. **Interpretación con IA**
   - Análisis profundo de cada carta
   - Mensaje del arcángel
   - Consejos prácticos
   - Exportar a PDF

#### Ejemplo de Uso

```javascript
import AngelicInterpreterWith3D from './components/AngelicInterpreterWith3D';

function App() {
  return <AngelicInterpreterWith3D />;
}
```

---

## 🎮 Controles de Usuario

### Controles de Cámara

| Acción | Control |
|--------|---------|
| Rotar vista | Click izquierdo + arrastrar |
| Zoom in/out | Scroll del mouse |
| Pan (mover) | Click derecho + arrastrar |
| Reset cámara | Botón "Reset" 🔄 |
| Pantalla completa | Botón "Fullscreen" ⛶ |

### Controles de Audio

| Acción | Control |
|--------|---------|
| Activar/Silenciar | Botón 🔊/🔇 |
| Ajustar volumen | Slider de volumen |
| Cambiar ambiente | Selector de ambientes |

### Selección de Cartas

| Acción | Control |
|--------|---------|
| Seleccionar carta | Click en la carta |
| Ver carta seleccionada | Brillo y partículas doradas |
| Completar selección | Botón "Continuar" (aparece al terminar) |

---

## 🎨 Posiciones de Cartas

### 3 Cartas (Pasado, Presente, Futuro)

```
    [1]     [2]     [3]
  Pasado  Presente Futuro
```

Posiciones 3D:
```javascript
[
  [-2.5, 0, 0],  // Izquierda
  [0, 0, 0],     // Centro
  [2.5, 0, 0]    // Derecha
]
```

### 6 Cartas (Cruz Angelical)

```
        [1]
         ↑
    [2] [3] [4]
         ↓
        [5]
        [6]
```

Posiciones 3D:
```javascript
[
  [0, 2, 0],      // Arriba
  [-2, 0, 0],     // Izquierda
  [0, 0, 0],      // Centro
  [2, 0, 0],      // Derecha
  [0, -2, 0],     // Abajo
  [0, 0, -1]      // Fondo
]
```

### 9 Cartas (Mandala Completo)

```
  [1]  [2]  [3]
  [4]  [5]  [6]
  [7]  [8]  [9]
```

Posiciones 3D:
```javascript
[
  [-3, 2, 0], [0, 2, 0], [3, 2, 0],
  [-3, 0, 0], [0, 0, 0], [3, 0, 0],
  [-3, -2, 0], [0, -2, 0], [3, -2, 0]
]
```

---

## 🎨 Colores de Arcángeles

```javascript
const archangelColors = {
  'Miguel': '#ff0000',    // Rojo (Protección)
  'Gabriel': '#0066ff',   // Azul (Comunicación)
  'Rafael': '#00ff00',    // Verde (Sanación)
  'Uriel': '#ffaa00',     // Naranja (Sabiduría)
  'Chamuel': '#ff69b4',   // Rosa (Amor)
  'Jophiel': '#ffff00',   // Amarillo (Belleza)
  'Zadkiel': '#9400d3'    // Púrpura (Transformación)
};
```

---

## ⚙️ Configuración de Calidad

### Baja (Low)
- Sombras: Desactivadas
- Partículas: 5 por carta
- Shadow Map: 512x512
- Ideal para: Dispositivos móviles, PCs antiguos

### Media (Medium) - **Recomendado**
- Sombras: Activadas
- Partículas: 15 por carta
- Shadow Map: 1024x1024
- Ideal para: Mayoría de dispositivos

### Alta (High)
- Sombras: Activadas
- Partículas: 30 por carta
- Shadow Map: 2048x2048
- Ideal para: PCs de alto rendimiento

---

## 🎵 Sistema de Audio

### Archivos de Audio Requeridos

Los siguientes archivos deben estar en `/public/audio/`:

1. **temple-ambient.mp3** (Templo Celestial)
   - Estilo: Coros angelicales, campanas
   - Duración: 3-5 min (loop)
   - Mood: Sagrado, majestuoso

2. **garden-ambient.mp3** (Jardín Angelical)
   - Estilo: Naturaleza, pájaros, agua
   - Duración: 3-5 min (loop)
   - Mood: Paz, serenidad

3. **cosmos-ambient.mp3** (Cosmos Estelar)
   - Estilo: Ambient espacial, sintetizadores
   - Duración: 3-5 min (loop)
   - Mood: Expansivo, misterioso

4. **sanctuary-ambient.mp3** (Santuario de Luz)
   - Estilo: Cuencos cantores, tonos puros
   - Duración: 3-5 min (loop)
   - Mood: Luz, claridad

### Fuentes de Audio Gratuitas

- **Pixabay Music**: https://pixabay.com/music/
- **Free Music Archive**: https://freemusicarchive.org/
- **YouTube Audio Library**: https://www.youtube.com/audiolibrary

Ver `/public/audio/README.md` para más detalles.

---

## 🚀 Instalación y Configuración

### 1. Dependencias

Ya están instaladas en el proyecto:

```json
{
  "@react-three/fiber": "^8.18.0",
  "@react-three/drei": "^9.122.0",
  "three": "^0.158.0",
  "lucide-react": "^0.263.0"
}
```

### 2. Agregar Archivos de Audio

```bash
# Crear carpeta de audio
mkdir -p public/audio

# Agregar archivos de música (descarga manual)
# - temple-ambient.mp3
# - garden-ambient.mp3
# - cosmos-ambient.mp3
# - sanctuary-ambient.mp3
```

### 3. Configurar Rutas

En `App.jsx`:

```javascript
import Test3DExperience from './pages/Test3DExperience';

// En Routes:
<Route path="/test-3d" element={<Test3DExperience />} />
```

### 4. Probar

```bash
npm run dev
# Navegar a: http://localhost:5173/test-3d
```

---

## 🧪 Testing

### Página de Prueba

Acceder a: `http://localhost:5173/test-3d`

### Checklist de Pruebas

- [ ] Las cartas se renderizan correctamente en 3D
- [ ] El hover funciona (levitación, escala)
- [ ] El click selecciona y voltea la carta
- [ ] Las partículas aparecen al seleccionar
- [ ] Los 4 ambientes se pueden cambiar
- [ ] El audio se activa/desactiva correctamente
- [ ] El volumen se ajusta correctamente
- [ ] La cámara se puede rotar, hacer zoom y pan
- [ ] El reset de cámara funciona
- [ ] El modo pantalla completa funciona
- [ ] La configuración de calidad cambia los efectos
- [ ] El botón "Continuar" aparece al completar
- [ ] La barra de progreso se actualiza

---

## 🎯 Integración con Apertura Angelical

### Opción 1: Reemplazar TiradaAngelical

```javascript
// En App.jsx
import AngelicInterpreterWith3D from './components/AngelicInterpreterWith3D';

<Route 
  path="/apertura-angelica" 
  element={<MainLayout><AngelicInterpreterWith3D /></MainLayout>} 
/>
```

### Opción 2: Agregar como Opción

```javascript
// En TiradaAngelical.jsx
import { useState } from 'react';
import AngelicInterpreterWith3D from './AngelicInterpreterWith3D';

function TiradaAngelical() {
  const [use3D, setUse3D] = useState(false);

  if (use3D) {
    return <AngelicInterpreterWith3D />;
  }

  // Versión tradicional...
}
```

---

## 🔧 Personalización

### Cambiar Colores de Ambiente

En `ImmersiveCardExperience.jsx`:

```javascript
const environments = [
  { 
    id: 'temple', 
    name: 'Templo Celestial', 
    icon: '🏛️', 
    color: '#ffd700' // Cambiar aquí
  },
  // ...
];
```

### Agregar Nuevo Ambiente

1. **Crear componente en SacredEnvironments.jsx**:

```javascript
export const MyNewEnvironment = () => {
  return (
    <group>
      {/* Tu ambiente personalizado */}
    </group>
  );
};
```

2. **Agregar al selector**:

```javascript
const SacredEnvironments = ({ environment }) => {
  switch (environment) {
    case 'mynew':
      return <MyNewEnvironment />;
    // ...
  }
};
```

3. **Agregar música**:

```javascript
const environmentMusic = {
  mynew: '/audio/mynew-ambient.mp3',
  // ...
};
```

4. **Agregar a la UI**:

```javascript
const environments = [
  { id: 'mynew', name: 'Mi Nuevo Ambiente', icon: '🎨', color: '#00ff00' },
  // ...
];
```

### Ajustar Animaciones

En `Card3D` component:

```javascript
// Velocidad de levitación
Math.sin(state.clock.elapsedTime * 2) // Cambiar el 2

// Altura de levitación
position[1] + 0.3 // Cambiar el 0.3

// Velocidad de escala
meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1); // Cambiar el 0.1
```

---

## 📊 Rendimiento

### Optimizaciones Implementadas

✅ **Suspense para carga diferida**
```javascript
<Suspense fallback={null}>
  <SacredEnvironments environment={environment} />
</Suspense>
```

✅ **Configuración de calidad adaptativa**
- Ajusta partículas según calidad
- Desactiva sombras en calidad baja
- Reduce resolución de shadow maps

✅ **useFrame optimizado**
- Solo actualiza lo necesario
- Usa lerp para transiciones suaves
- Evita cálculos innecesarios

### Recomendaciones

- **Móviles**: Usar calidad "Baja"
- **Tablets**: Usar calidad "Media"
- **Desktop**: Usar calidad "Alta"

---

## 🐛 Troubleshooting

### Problema: Cartas no se ven

**Solución**:
- Verificar que las dependencias estén instaladas
- Comprobar consola del navegador
- Verificar que `cards` array tenga datos

### Problema: Audio no suena

**Solución**:
- Verificar que los archivos de audio existan en `/public/audio/`
- Comprobar que el navegador permita autoplay
- Verificar volumen del sistema

### Problema: Rendimiento lento

**Solución**:
- Cambiar a calidad "Baja"
- Desactivar partículas
- Cerrar otras pestañas del navegador
- Actualizar drivers de GPU

### Problema: Pantalla completa no funciona

**Solución**:
- Verificar permisos del navegador
- Probar con F11 (fullscreen del navegador)
- Verificar que el navegador soporte Fullscreen API

---

## 🎓 Próximas Mejoras

### Corto Plazo
- [ ] Agregar sonidos al seleccionar cartas
- [ ] Implementar barajado 3D animado
- [ ] Agregar más entornos (Catedral, Bosque Encantado)
- [ ] Optimizar para móviles

### Mediano Plazo
- [ ] Integrar con ElevenLabs para narración
- [ ] Música adaptativa según arcángel
- [ ] Modo VR/AR
- [ ] Multijugador (sesiones en vivo)

### Largo Plazo
- [ ] Cartas 3D personalizadas (texturas reales)
- [ ] Efectos de física realistas
- [ ] Animaciones de barajado con manos etéreas
- [ ] Integración con blockchain (NFTs)

---

## 📝 Notas Técnicas

### React Three Fiber

- Usa `useFrame` para animaciones
- Usa `useRef` para referencias a objetos 3D
- Usa `drei` para helpers (OrbitControls, Stars, etc.)

### Three.js

- Coordenadas: X (horizontal), Y (vertical), Z (profundidad)
- Rotación en radianes (Math.PI = 180°)
- Colores en hexadecimal (#ffffff)

### Performance

- Evitar crear objetos en `useFrame`
- Usar `useMemo` para geometrías complejas
- Limitar número de luces y sombras

---

## 📞 Soporte

Para preguntas o problemas:
- Revisar esta documentación
- Consultar código fuente comentado
- Verificar consola del navegador
- Probar en página de test: `/test-3d`

---

## 🎉 Conclusión

El sistema de Cartas 3D Inmersivas proporciona una experiencia única y profesional para la lectura de cartas angelicales, combinando tecnología 3D de vanguardia con diseño espiritual y controles intuitivos.

**¡Disfruta creando experiencias angelicales inmersivas!** ✨🙏

---

**Última actualización**: Octubre 2024
**Versión**: 1.0.0
**Autor**: Plataforma Angélica Team

