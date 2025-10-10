# 📋 GUÍA DE MIGRACIÓN DE HEADERS

## ✅ COMPLETADO

1. ✅ **ThematicHeader.jsx creado** - Componente unificado con 12 apps configuradas
2. ✅ **Backup creado** - Todos los headers originales en `backup/headers-original/`

---

## 🎯 CAMBIOS NECESARIOS

### **ARCHIVOS A ELIMINAR:**

```bash
# Eliminar Header.jsx (no se usa)
rm src/components/Header.jsx

# Eliminar todos los headers individuales (después de migrar)
rm -rf src/components/headers/
```

---

## 📝 ARCHIVOS A MODIFICAR

### **1. Dashboard.jsx**

**Ubicación:** `src/pages/Dashboard.jsx` o `src/components/Dashboard.jsx`

**Cambiar:**
```javascript
// ANTES
import DashboardHeader from '../components/DashboardHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**Y en el JSX:**
```javascript
// ANTES
<DashboardHeader 
  user={user}
  cartCount={cartCount}
  onCartClick={handleCartClick}
  onProfileClick={handleProfileClick}
  onLogout={handleLogout}
  audioActive={audioActive}
  onToggleAudio={handleToggleAudio}
/>

// DESPUÉS
<ThematicHeader 
  appType="dashboard"
  user={user}
  cartCount={cartCount}
  onCartClick={handleCartClick}
  onProfileClick={handleProfileClick}
  onLogout={handleLogout}
  audioActive={audioActive}
  onToggleAudio={handleToggleAudio}
/>
```

---

### **2. Apertura Angelical**

**Archivo:** `src/pages/AperturaAngelical.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import AperturaAngelicaHeader from '../components/headers/AperturaAngelicaHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<AperturaAngelicaHeader {...props} />

// DESPUÉS
<ThematicHeader appType="apertura" {...props} />
```

---

### **3. Sonoterapia**

**Archivo:** `src/pages/Sonoterapia.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import SonoterapiaHeader from '../components/headers/SonoterapiaHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<SonoterapiaHeader {...props} />

// DESPUÉS
<ThematicHeader appType="sonoterapia" {...props} />
```

---

### **4. Terapias y Limpiezas**

**Archivo:** `src/pages/Terapias.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import TerapiasHeader from '../components/headers/TerapiasHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<TerapiasHeader {...props} />

// DESPUÉS
<ThematicHeader appType="terapias" {...props} />
```

---

### **5. Academia Angelical**

**Archivo:** `src/pages/Academia.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import AcademiaHeader from '../components/headers/AcademiaHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<AcademiaHeader {...props} />

// DESPUÉS
<ThematicHeader appType="academia" {...props} />
```

---

### **6. Mensajes Angelicos**

**Archivo:** `src/pages/Mensajes.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import MensajeHeader from '../components/headers/MensajeHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<MensajeHeader {...props} />

// DESPUÉS
<ThematicHeader appType="mensajes" {...props} />
```

---

### **7. Tienda Angelical**

**Archivo:** `src/pages/Tienda.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import TiendaHeader from '../components/headers/TiendaHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<TiendaHeader {...props} />

// DESPUÉS
<ThematicHeader appType="tienda" {...props} />
```

---

### **8. Eventos Angelicos**

**Archivo:** `src/pages/Eventos.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import EventosHeader from '../components/headers/EventosHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<EventosHeader {...props} />

// DESPUÉS
<ThematicHeader appType="eventos" {...props} />
```

---

### **9. Blog Angelical**

**Archivo:** `src/pages/Blog.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import BlogHeader from '../components/headers/BlogHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<BlogHeader {...props} />

// DESPUÉS
<ThematicHeader appType="blog" {...props} />
```

---

### **10. Podcast (si existe)**

**Archivo:** `src/pages/Podcast.jsx` o similar

**Cambiar:**
```javascript
// ANTES
import PodcastHeader from '../components/headers/PodcastHeader';

// DESPUÉS
import ThematicHeader from '../components/ThematicHeader';
```

**JSX:**
```javascript
// ANTES
<PodcastHeader {...props} />

// DESPUÉS
<ThematicHeader appType="podcast" {...props} />
```

---

### **11. Sistema de Reservas (NUEVO)**

**Archivo:** `src/pages/Reservas.jsx` o `src/components/SistemaReservas.jsx`

**Agregar:**
```javascript
import ThematicHeader from '../components/ThematicHeader';

// En el JSX:
<ThematicHeader 
  appType="reservas"
  user={user}
  cartCount={cartCount}
  onCartClick={handleCartClick}
  onProfileClick={handleProfileClick}
  onLogout={handleLogout}
  onNavigateHome={() => navigate('/dashboard')}
  audioActive={audioActive}
  onToggleAudio={handleToggleAudio}
/>
```

---

### **12. Consulta en Vivo (NUEVO)**

**Archivo:** `src/pages/ConsultaEnVivo.jsx` o similar

**Agregar:**
```javascript
import ThematicHeader from '../components/ThematicHeader';

// En el JSX:
<ThematicHeader 
  appType="consulta"
  user={user}
  cartCount={cartCount}
  onCartClick={handleCartClick}
  onProfileClick={handleProfileClick}
  onLogout={handleLogout}
  onNavigateHome={() => navigate('/dashboard')}
  audioActive={audioActive}
  onToggleAudio={handleToggleAudio}
/>
```

---

## 🔍 CÓMO ENCONTRAR LOS ARCHIVOS

```bash
# Buscar todos los archivos que importan headers
grep -r "import.*Header" src/pages/ src/components/

# Buscar archivos específicos
find src -name "*Dashboard*"
find src -name "*Apertura*"
find src -name "*Sonoterapia*"
# etc...
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de hacer todos los cambios:

- [ ] ThematicHeader.jsx existe en src/components/
- [ ] Todos los archivos de páginas importan ThematicHeader
- [ ] Todos usan appType correcto
- [ ] Header.jsx eliminado
- [ ] Carpeta headers/ eliminada
- [ ] DashboardHeader.jsx eliminado
- [ ] No hay errores de compilación
- [ ] Todos los headers se ven correctos
- [ ] Dashboard muestra saludo personalizado
- [ ] Otras apps muestran título fijo
- [ ] Colores correctos por app
- [ ] Stats, navegación y botones funcionan

---

## 🚀 COMANDO RÁPIDO PARA CURSOR AI

Si usas Cursor AI, puedes darle este prompt:

```
Migrar todos los headers a ThematicHeader:

1. Reemplazar todos los imports de headers individuales por:
   import ThematicHeader from '../components/ThematicHeader';

2. Reemplazar todos los usos de headers por:
   <ThematicHeader appType="[nombre-app]" {...props} />

3. Apps y sus appType:
   - Dashboard → "dashboard"
   - Apertura Angelical → "apertura"
   - Sonoterapia → "sonoterapia"
   - Terapias → "terapias"
   - Academia → "academia"
   - Mensajes → "mensajes"
   - Tienda → "tienda"
   - Eventos → "eventos"
   - Blog → "blog"
   - Podcast → "podcast"
   - Reservas → "reservas"
   - Consulta → "consulta"

4. Eliminar:
   - src/components/Header.jsx
   - src/components/DashboardHeader.jsx
   - src/components/headers/* (toda la carpeta)

5. Mantener todos los props: user, cartCount, onCartClick, onProfileClick, onLogout, onNavigateHome, audioActive, onToggleAudio
```

---

## 📊 RESULTADO ESPERADO

**Antes:**
- 11 archivos de headers
- ~2,900 líneas de código
- Inconsistencias

**Después:**
- 1 archivo (ThematicHeader.jsx)
- ~350 líneas de código
- 100% consistente
- Fácil mantenimiento

---

## 🆘 SI HAY PROBLEMAS

1. **Error de import:** Verifica la ruta relativa (`../components/ThematicHeader`)
2. **Props faltantes:** Asegúrate de pasar todos los props necesarios
3. **Color incorrecto:** Verifica que el appType sea correcto
4. **Saludo no aparece:** Solo Dashboard debe usar saludo personalizado

---

**¡Listo para migrar! 🚀**

