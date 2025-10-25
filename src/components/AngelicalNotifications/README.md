# 🔔 Sistema de Notificaciones Angelicales

Sistema unificado de notificaciones con diseño consistente para toda la Plataforma Angélica.

## 📦 Instalación

### 1. Agregar el Provider en App.jsx

```javascript
import { NotificationProvider } from './components/AngelicalNotifications';

function App() {
  return (
    <NotificationProvider>
      {/* Tu aplicación */}
    </NotificationProvider>
  );
}
```

## 🎯 Uso

### Hook useNotifications

```javascript
import { useNotifications } from './components/AngelicalNotifications';

function MiComponente() {
  const { toast, alert, confirm } = useNotifications();

  // ... usar las notificaciones
}
```

---

## 📝 API

### 1. Toast (Notificaciones Temporales)

#### toast.success(message, options)
```javascript
toast.success('¡Producto agregado al carrito!');

toast.success('¡Guardado exitosamente!', {
  title: 'Éxito',
  duration: 5000,
  action: {
    label: 'Ver',
    onClick: () => navigate('/carrito')
  }
});
```

#### toast.error(message, options)
```javascript
toast.error('Error al procesar el pago');

toast.error('No se pudo conectar con el servidor', {
  title: 'Error de Conexión',
  duration: 6000
});
```

#### toast.warning(message, options)
```javascript
toast.warning('Tu sesión expirará en 5 minutos');
```

#### toast.info(message, options)
```javascript
toast.info('Nueva actualización disponible');
```

#### toast.angelical(message, options)
```javascript
toast.angelical('Los ángeles te envían su bendición ✨', {
  title: 'Mensaje Angelical',
  duration: 5000
});
```

---

### 2. Alert (Modales de Alerta)

#### alert.success(message, options)
```javascript
alert.success('Tu pedido ha sido confirmado', {
  title: '¡Pedido Confirmado!',
  confirmLabel: 'Ver Pedido',
  onConfirm: () => navigate('/pedidos')
});
```

#### alert.error(message, options)
```javascript
alert.error('No se pudo procesar tu solicitud', {
  title: 'Error',
  confirmLabel: 'Reintentar',
  onConfirm: () => retry()
});
```

#### alert.warning(message, options)
```javascript
alert.warning('Esta acción no se puede deshacer', {
  title: 'Advertencia'
});
```

#### alert.info(message, options)
```javascript
alert.info('Recuerda completar tu perfil para acceder a todas las funciones', {
  title: 'Información'
});
```

#### alert.angelical(message, options)
```javascript
alert.angelical('Has completado tu primera lectura angelical', {
  title: 'Bendición Angelical ✨',
  confirmLabel: 'Continuar'
});
```

---

### 3. Confirm (Confirmaciones)

```javascript
const handleDelete = async () => {
  const confirmed = await confirm(
    '¿Estás seguro de que deseas eliminar este elemento?',
    {
      title: 'Confirmar Eliminación',
      type: 'warning',
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar'
    }
  );

  if (confirmed) {
    // Usuario confirmó
    await deleteItem();
  } else {
    // Usuario canceló
    console.log('Cancelado');
  }
};
```

---

## 🎨 Tipos de Notificaciones

### success (Verde)
- Operaciones exitosas
- Guardado correcto
- Confirmaciones

### error (Rojo)
- Errores
- Fallos en operaciones
- Validaciones fallidas

### warning (Amarillo)
- Advertencias
- Confirmaciones importantes
- Acciones irreversibles

### info (Azul)
- Información general
- Tips
- Actualizaciones

### angelical (Morado/Rosa)
- Mensajes especiales de la plataforma
- Bendiciones angelicales
- Logros espirituales

---

## ⚙️ Opciones Disponibles

### Toast Options

```javascript
{
  title: 'Título',              // Título opcional
  message: 'Mensaje',           // Mensaje principal (requerido)
  type: 'success',              // success | error | warning | info | angelical
  duration: 4000,               // Duración en ms (0 = permanente)
  action: {                     // Botón de acción opcional
    label: 'Ver',
    onClick: () => {}
  }
}
```

### Alert/Modal Options

```javascript
{
  title: 'Título',              // Título opcional
  message: 'Mensaje',           // Mensaje principal (requerido)
  type: 'success',              // success | error | warning | info | angelical
  confirmLabel: 'Aceptar',      // Texto del botón confirmar
  cancelLabel: 'Cancelar',      // Texto del botón cancelar
  showCancel: true,             // Mostrar botón cancelar
  closeOnOverlay: true,         // Cerrar al click fuera
  onConfirm: () => {},          // Callback al confirmar
  onClose: () => {}             // Callback al cerrar
}
```

---

## 📚 Ejemplos Completos

### Ejemplo 1: Agregar al Carrito

```javascript
const handleAddToCart = async (product) => {
  try {
    await addToCart(product);
    
    toast.success(`${product.name} agregado al carrito`, {
      title: '¡Agregado!',
      action: {
        label: 'Ver Carrito',
        onClick: () => navigate('/carrito')
      }
    });
  } catch (error) {
    toast.error('No se pudo agregar el producto', {
      title: 'Error',
      duration: 5000
    });
  }
};
```

### Ejemplo 2: Eliminar con Confirmación

```javascript
const handleDelete = async (id) => {
  const confirmed = await confirm(
    '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
    {
      title: 'Confirmar Eliminación',
      type: 'warning',
      confirmLabel: 'Sí, Eliminar',
      cancelLabel: 'No, Cancelar'
    }
  );

  if (confirmed) {
    try {
      await deleteItem(id);
      toast.success('Elemento eliminado correctamente');
    } catch (error) {
      alert.error('No se pudo eliminar el elemento', {
        title: 'Error al Eliminar'
      });
    }
  }
};
```

### Ejemplo 3: Proceso de Pago

```javascript
const handleCheckout = async () => {
  try {
    const result = await processPayment();
    
    if (result.success) {
      alert.angelical(
        'Tu pedido ha sido procesado exitosamente. Los ángeles bendicen tu compra ✨',
        {
          title: '¡Pedido Confirmado!',
          confirmLabel: 'Ver Pedido',
          onConfirm: () => navigate(`/pedidos/${result.orderId}`)
        }
      );
    }
  } catch (error) {
    alert.error(
      'Hubo un problema al procesar tu pago. Por favor, intenta de nuevo.',
      {
        title: 'Error en el Pago',
        confirmLabel: 'Reintentar',
        onConfirm: () => handleCheckout()
      }
    );
  }
};
```

### Ejemplo 4: Mensaje Angelical

```javascript
const showAngelicalMessage = () => {
  toast.angelical(
    'Los arcángeles te envían su luz y protección en este momento',
    {
      title: 'Mensaje Angelical ✨',
      duration: 6000
    }
  );
};
```

### Ejemplo 5: Validación de Formulario

```javascript
const handleSubmit = async (formData) => {
  // Validar
  if (!formData.email) {
    toast.warning('Por favor ingresa tu email', {
      title: 'Campo Requerido'
    });
    return;
  }

  // Enviar
  try {
    await submitForm(formData);
    toast.success('Formulario enviado correctamente');
  } catch (error) {
    toast.error('Error al enviar el formulario');
  }
};
```

---

## 🎨 Personalización

### Colores por Tipo

- **success**: Verde → Emerald (from-green-500 to-emerald-500)
- **error**: Rojo → Rosa (from-red-500 to-pink-500)
- **warning**: Amarillo → Naranja (from-yellow-500 to-orange-500)
- **info**: Azul → Índigo (from-blue-500 to-indigo-500)
- **angelical**: Morado → Rosa → Morado (from-purple-500 via-pink-500 to-purple-500)

### Animaciones

- Entrada: Slide desde la derecha + Fade in + Scale up
- Salida: Slide hacia la derecha + Fade out + Scale down
- Hover: Scale up + Shadow increase
- Barra de progreso: Animación lineal

---

## 🔄 Migración desde alert() y console

### Antes (alert nativo)
```javascript
alert('Producto agregado');
alert('Error al guardar');
```

### Después (Sistema Angelical)
```javascript
toast.success('Producto agregado');
toast.error('Error al guardar');
```

### Antes (confirm nativo)
```javascript
if (confirm('¿Eliminar?')) {
  deleteItem();
}
```

### Después (Sistema Angelical)
```javascript
const confirmed = await confirm('¿Eliminar?');
if (confirmed) {
  deleteItem();
}
```

---

## 🚀 Ventajas

✅ **Diseño Consistente**: Todas las notificaciones tienen el mismo look angelical
✅ **Mejor UX**: Animaciones suaves y profesionales
✅ **No Bloqueante**: Toasts no interrumpen la navegación
✅ **Responsive**: Se adapta a todos los tamaños de pantalla
✅ **Accesible**: Colores con buen contraste
✅ **Flexible**: Múltiples opciones de personalización
✅ **Fácil de Usar**: API simple e intuitiva
✅ **Type-Safe**: Compatible con TypeScript

---

## 📱 Responsive

- **Desktop**: Toasts en top-right, modales centrados
- **Tablet**: Mismo comportamiento
- **Mobile**: Toasts en top-center, modales full-width con padding

---

## 🎯 Mejores Prácticas

1. **Usar toast para feedback rápido**
   ```javascript
   toast.success('Guardado');
   ```

2. **Usar alert para información importante**
   ```javascript
   alert.info('Tu sesión ha expirado');
   ```

3. **Usar confirm para acciones irreversibles**
   ```javascript
   const ok = await confirm('¿Eliminar permanentemente?');
   ```

4. **Usar tipo angelical para mensajes especiales**
   ```javascript
   toast.angelical('Bendición recibida ✨');
   ```

5. **Agregar acciones cuando sea útil**
   ```javascript
   toast.success('Guardado', {
     action: {
       label: 'Ver',
       onClick: () => navigate('/item')
     }
   });
   ```

---

## 🐛 Troubleshooting

### Las notificaciones no aparecen
- Verificar que `NotificationProvider` esté en App.jsx
- Verificar que el componente esté dentro del Provider

### Las animaciones no funcionan
- Verificar que Tailwind CSS esté configurado
- Verificar que las clases de animación estén disponibles

### El confirm no funciona
- Asegurarse de usar `await` con `confirm()`
- Verificar que la función sea `async`

---

**Desarrollado con 💜 para la Plataforma Angélica**

