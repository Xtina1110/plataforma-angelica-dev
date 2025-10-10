# 🧪 Testing Checklist Completo - Plataforma Angélica

## 📋 Guía de Testing QA

**Objetivo:** Asegurar que todas las funcionalidades del sistema de login y registro funcionan correctamente.

**Tiempo estimado:** 30 minutos  
**Última actualización:** $(date)

---

## 🎯 Áreas de Testing

1. [Registro Multi-Paso](#1-registro-multi-paso)
2. [Login y Autenticación](#2-login-y-autenticación)
3. [Email Verification](#3-email-verification)
4. [Suscripciones](#4-suscripciones)
5. [Responsive Design](#5-responsive-design)
6. [Accesibilidad](#6-accesibilidad)
7. [Performance](#7-performance)
8. [Seguridad](#8-seguridad)

---

## 1. Registro Multi-Paso

### Paso 1: Información Básica

#### ✅ Validaciones de Campos

- [ ] **Nombre**
  - [ ] Campo requerido muestra error si está vacío
  - [ ] Acepta letras y espacios
  - [ ] Rechaza números y símbolos
  - [ ] Mínimo 2 caracteres

- [ ] **Apellidos**
  - [ ] Campo requerido muestra error si está vacío
  - [ ] Acepta letras y espacios
  - [ ] Rechaza números y símbolos
  - [ ] Mínimo 2 caracteres

- [ ] **Email**
  - [ ] Campo requerido muestra error si está vacío
  - [ ] Valida formato correcto (usuario@dominio.com)
  - [ ] Rechaza formatos inválidos
  - [ ] Muestra error si email ya existe
  - [ ] Validación en tiempo real funciona

- [ ] **Fecha de Nacimiento**
  - [ ] Campo requerido muestra error si está vacío
  - [ ] Selector de fecha funciona
  - [ ] Valida edad mínima (+18 años)
  - [ ] Rechaza fechas futuras
  - [ ] Muestra error claro si es menor de edad

- [ ] **Teléfono** (opcional)
  - [ ] Selector de código de país funciona
  - [ ] Acepta formato internacional
  - [ ] Valida número correcto

#### ✅ Navegación

- [ ] Botón "Siguiente" deshabilitado si hay errores
- [ ] Botón "Siguiente" habilitado cuando todo es válido
- [ ] Transición suave al Paso 2
- [ ] Datos se guardan en localStorage
- [ ] Progress bar actualiza correctamente

---

### Paso 2: Seguridad

#### ✅ Contraseña

- [ ] **Campo Contraseña**
  - [ ] Campo requerido muestra error si está vacío
  - [ ] Botón de mostrar/ocultar funciona
  - [ ] Mínimo 8 caracteres
  - [ ] Requiere al menos una mayúscula
  - [ ] Requiere al menos un número
  - [ ] Requiere al menos un símbolo

- [ ] **Indicador de Fortaleza**
  - [ ] Muestra "Débil" con contraseña simple
  - [ ] Muestra "Media" con requisitos básicos
  - [ ] Muestra "Fuerte" con buenos requisitos
  - [ ] Muestra "Muy Fuerte" con todos los requisitos
  - [ ] Colores cambian correctamente (rojo → amarillo → verde)
  - [ ] Barra de progreso se anima

- [ ] **Confirmar Contraseña**
  - [ ] Campo requerido muestra error si está vacío
  - [ ] Valida que coincida con contraseña
  - [ ] Muestra error si no coincide
  - [ ] Validación en tiempo real

#### ✅ Navegación

- [ ] Botón "Atrás" vuelve al Paso 1
- [ ] Datos del Paso 1 se mantienen
- [ ] Botón "Siguiente" funciona correctamente
- [ ] Progress bar actualiza

---

### Paso 3: Preferencias

#### ✅ Campos

- [ ] **Idioma Preferido**
  - [ ] Selector muestra 6 idiomas
  - [ ] Español seleccionado por defecto
  - [ ] Cambio de idioma funciona

- [ ] **País**
  - [ ] Selector muestra 195 países
  - [ ] España seleccionada por defecto
  - [ ] Búsqueda de país funciona
  - [ ] Scroll en lista funciona

- [ ] **Zona Horaria**
  - [ ] Auto-detecta zona horaria correcta
  - [ ] Permite cambiar manualmente
  - [ ] Muestra formato correcto

- [ ] **Método de Contacto**
  - [ ] Radio buttons funcionan
  - [ ] Email seleccionado por defecto
  - [ ] Cambio de opción funciona

#### ✅ Navegación

- [ ] Botón "Atrás" funciona
- [ ] Botón "Siguiente" funciona
- [ ] Datos se mantienen
- [ ] Progress bar actualiza

---

### Paso 4: Tipo de Usuario

#### ✅ Selección de Tipo

- [ ] **4 Cards visibles:**
  - [ ] Usuario
  - [ ] Terapeuta
  - [ ] Centro
  - [ ] Empresa

- [ ] **Interacción:**
  - [ ] Click en card la selecciona
  - [ ] Card seleccionada muestra borde destacado
  - [ ] Solo una card puede estar seleccionada
  - [ ] Descripción de cada tipo es clara

- [ ] **Información:**
  - [ ] Iconos correctos para cada tipo
  - [ ] Beneficios listados claramente
  - [ ] Texto legible

#### ✅ Navegación

- [ ] Botón "Atrás" funciona
- [ ] Botón "Siguiente" deshabilitado sin selección
- [ ] Botón "Siguiente" habilitado con selección
- [ ] Progress bar actualiza

---

### Paso 5: Suscripción

#### ✅ Planes Mostrados

- [ ] **4 Planes visibles:**
  - [ ] Gratis (€0/mes)
  - [ ] Premium (€19.99/mes)
  - [ ] Pro (€49.99/mes)
  - [ ] Enterprise (€199.99/mes)

- [ ] **Información de cada plan:**
  - [ ] Precio claro
  - [ ] Características listadas
  - [ ] Botón de selección visible
  - [ ] Plan recomendado destacado

- [ ] **Selección:**
  - [ ] Click selecciona plan
  - [ ] Plan seleccionado muestra check
  - [ ] Solo un plan puede estar seleccionado

- [ ] **Ciclo de Facturación:**
  - [ ] Toggle Mensual/Anual funciona
  - [ ] Precios actualizan correctamente
  - [ ] Descuento anual se muestra

#### ✅ Navegación

- [ ] Botón "Atrás" funciona
- [ ] Botón "Siguiente" funciona
- [ ] Progress bar actualiza

---

### Paso 6: Confirmación

#### ✅ Resumen

- [ ] **Información Personal:**
  - [ ] Nombre completo correcto
  - [ ] Email correcto
  - [ ] Fecha de nacimiento correcta
  - [ ] Teléfono correcto (si aplica)

- [ ] **Preferencias:**
  - [ ] Idioma correcto
  - [ ] País correcto
  - [ ] Zona horaria correcta

- [ ] **Tipo de Usuario:**
  - [ ] Tipo seleccionado correcto

- [ ] **Suscripción:**
  - [ ] Plan seleccionado correcto
  - [ ] Precio correcto

#### ✅ Términos y Condiciones

- [ ] Checkbox de términos funciona
- [ ] Link a términos abre correctamente
- [ ] Checkbox de privacidad funciona
- [ ] Link a privacidad abre correctamente
- [ ] Checkbox de newsletter funciona (opcional)

#### ✅ Registro Final

- [ ] Botón "Completar Registro" deshabilitado sin aceptar términos
- [ ] Botón "Completar Registro" habilitado con términos aceptados
- [ ] Click muestra loading state
- [ ] Registro se procesa correctamente
- [ ] Redirect a página de éxito

---

## 2. Login y Autenticación

### Login con Email/Contraseña

- [ ] **Campos:**
  - [ ] Email valida formato
  - [ ] Contraseña tiene botón mostrar/ocultar
  - [ ] Ambos campos requeridos

- [ ] **Validación:**
  - [ ] Error si email no existe
  - [ ] Error si contraseña incorrecta
  - [ ] Mensajes de error claros

- [ ] **Funcionalidad:**
  - [ ] Checkbox "Recordarme" funciona
  - [ ] Link "¿Olvidaste tu contraseña?" funciona
  - [ ] Login exitoso redirect a dashboard
  - [ ] Session persiste después de refresh

### Login Social (después de OAuth)

- [ ] **Google:**
  - [ ] Botón visible
  - [ ] Click abre popup de Google
  - [ ] Login exitoso funciona
  - [ ] Datos de usuario se guardan

- [ ] **Facebook:**
  - [ ] Botón visible
  - [ ] Click abre popup de Facebook
  - [ ] Login exitoso funciona
  - [ ] Datos de usuario se guardan

- [ ] **Apple:**
  - [ ] Botón visible
  - [ ] Click abre popup de Apple
  - [ ] Login exitoso funciona
  - [ ] Datos de usuario se guardan

### Diseño Visual

- [ ] Fondo de San Miguel Arcángel visible
- [ ] Partículas angelicales animadas
- [ ] Sin scroll vertical
- [ ] Footer visible en viewport
- [ ] Modo oscuro funciona
- [ ] Toggle de tema funciona

---

## 3. Email Verification

### Email Enviado

- [ ] Email llega a bandeja de entrada
- [ ] Email no está en spam
- [ ] Diseño del email se ve bien
- [ ] Logo y branding correctos
- [ ] Botón "Verificar Email" visible
- [ ] Texto claro y legible

### Verificación

- [ ] Click en botón abre página de verificación
- [ ] Página muestra loading mientras verifica
- [ ] Verificación exitosa muestra mensaje de éxito
- [ ] Animación de confetti se muestra
- [ ] Countdown para redirect funciona
- [ ] Redirect a login funciona

### Reenvío de Email

- [ ] Botón "Reenviar Email" visible
- [ ] Click envía nuevo email
- [ ] Loading state se muestra
- [ ] Confirmación de envío se muestra
- [ ] Nuevo email llega correctamente

---

## 4. Suscripciones

### Plan Gratis

- [ ] Registro con plan gratis funciona
- [ ] No requiere pago
- [ ] Usuario puede acceder a funcionalidades gratuitas
- [ ] Estado de suscripción correcto en BD

### Planes de Pago (después de Stripe)

- [ ] **Página de Pago:**
  - [ ] Muestra plan seleccionado
  - [ ] Muestra precio correcto
  - [ ] Formulario de tarjeta funciona
  - [ ] Validación de tarjeta funciona

- [ ] **Procesamiento:**
  - [ ] Loading state se muestra
  - [ ] Pago se procesa correctamente
  - [ ] Confirmación de pago se muestra
  - [ ] Suscripción se activa en BD

---

## 5. Responsive Design

### Mobile (375px - 767px)

- [ ] **Login:**
  - [ ] Layout se adapta
  - [ ] Botones accesibles
  - [ ] Sin scroll horizontal
  - [ ] Texto legible
  - [ ] Formulario usable

- [ ] **Registro:**
  - [ ] Todos los pasos funcionan
  - [ ] Progress bar visible
  - [ ] Campos usables
  - [ ] Botones accesibles
  - [ ] Sin scroll horizontal

### Tablet (768px - 1023px)

- [ ] Layout se adapta correctamente
- [ ] Espaciado apropiado
- [ ] Elementos bien distribuidos
- [ ] Touch targets adecuados

### Desktop (1024px+)

- [ ] Layout óptimo
- [ ] Uso eficiente del espacio
- [ ] Elementos bien proporcionados
- [ ] Hover states funcionan

---

## 6. Accesibilidad

### Navegación con Teclado

- [ ] Tab navega entre campos correctamente
- [ ] Orden de tabulación lógico
- [ ] Focus visible en elementos
- [ ] Enter envía formularios
- [ ] Escape cierra modales

### Screen Readers

- [ ] Labels correctos en campos
- [ ] ARIA labels presentes
- [ ] Errores anunciados
- [ ] Estados anunciados
- [ ] Navegación clara

### Contraste

- [ ] Texto legible en modo claro
- [ ] Texto legible en modo oscuro
- [ ] Contraste cumple WCAG AA
- [ ] Botones destacados
- [ ] Links identificables

---

## 7. Performance

### Tiempos de Carga

- [ ] Página de login carga < 2s
- [ ] Página de registro carga < 2s
- [ ] Transiciones suaves < 300ms
- [ ] Imágenes optimizadas
- [ ] Sin lag en animaciones

### Optimizaciones

- [ ] Lazy loading funciona
- [ ] Código minificado
- [ ] Assets comprimidos
- [ ] Cache funciona
- [ ] Sin memory leaks

---

## 8. Seguridad

### Validaciones

- [ ] SQL injection protegido
- [ ] XSS protegido
- [ ] CSRF tokens presentes
- [ ] Inputs sanitizados
- [ ] Errores no revelan info sensible

### Autenticación

- [ ] Contraseñas hasheadas
- [ ] Tokens seguros
- [ ] Sessions expiradas correctamente
- [ ] Logout limpia session
- [ ] No hay credenciales en código

---

## 📊 Resumen de Testing

### Checklist Rápido

```
[ ] Registro Paso 1 - Información Básica
[ ] Registro Paso 2 - Seguridad
[ ] Registro Paso 3 - Preferencias
[ ] Registro Paso 4 - Tipo de Usuario
[ ] Registro Paso 5 - Suscripción
[ ] Registro Paso 6 - Confirmación
[ ] Login Email/Contraseña
[ ] Login Social (Google, Facebook, Apple)
[ ] Email Verification
[ ] Suscripciones
[ ] Responsive Mobile
[ ] Responsive Tablet
[ ] Responsive Desktop
[ ] Accesibilidad
[ ] Performance
[ ] Seguridad
```

---

## 🐛 Reporte de Bugs

### Template de Bug

```markdown
**Título:** [Descripción breve]

**Severidad:** [Crítico / Alto / Medio / Bajo]

**Pasos para reproducir:**
1. 
2. 
3. 

**Resultado esperado:**


**Resultado actual:**


**Screenshots:**


**Entorno:**
- Browser:
- OS:
- Viewport:
```

---

## ✅ Criterios de Aceptación

Para considerar el testing completo, se debe cumplir:

- ✅ **100% de funcionalidades críticas** funcionando
- ✅ **95%+ de funcionalidades secundarias** funcionando
- ✅ **0 bugs críticos**
- ✅ **< 3 bugs de severidad alta**
- ✅ **Responsive en 3 tamaños** (mobile, tablet, desktop)
- ✅ **Accesibilidad WCAG AA** cumplida
- ✅ **Performance score > 90** en Lighthouse

---

## 📝 Notas de Testing

### Browsers a Probar

- [ ] Chrome (últimas 2 versiones)
- [ ] Firefox (últimas 2 versiones)
- [ ] Safari (últimas 2 versiones)
- [ ] Edge (últimas 2 versiones)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Dispositivos Recomendados

- [ ] iPhone 12/13/14
- [ ] Samsung Galaxy S21/S22
- [ ] iPad Pro
- [ ] MacBook Pro
- [ ] Windows Laptop

---

## 🎉 Resultado Esperado

Después del testing completo, deberías tener:

- ✅ Sistema de registro funcionando al 100%
- ✅ Login funcionando en todos los métodos
- ✅ Email verification operativo
- ✅ Responsive en todos los dispositivos
- ✅ Accesible para todos los usuarios
- ✅ Performance óptimo
- ✅ Seguro y confiable

---

**Tiempo estimado:** 30 minutos  
**Última actualización:** $(date)  
**Responsable:** QA Team

**Creado con 💜 para Plataforma Angélica**

