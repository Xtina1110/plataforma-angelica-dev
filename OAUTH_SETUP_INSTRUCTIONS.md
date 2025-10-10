# 🔐 Instrucciones de Configuración OAuth

## ⚠️ IMPORTANTE: Configuración Manual Requerida

Los siguientes pasos **DEBEN completarse manualmente** en las consolas de Google, Facebook y Supabase para que el Social Login funcione.

---

## 1. Configurar Google OAuth (10 minutos)

### Paso 1: Google Cloud Console

1. **Ir a Google Cloud Console**
   - URL: https://console.cloud.google.com/

2. **Crear o Seleccionar Proyecto**
   - Click en el selector de proyectos (arriba)
   - "Nuevo Proyecto" o seleccionar existente
   - Nombre sugerido: "Plataforma Angelica"

3. **Habilitar Google+ API**
   - Menú → APIs y servicios → Biblioteca
   - Buscar "Google+ API"
   - Click "Habilitar"

4. **Crear Credenciales OAuth 2.0**
   - Menú → APIs y servicios → Credenciales
   - Click "Crear credenciales" → "ID de cliente de OAuth 2.0"
   
5. **Configurar Pantalla de Consentimiento** (si es primera vez)
   - Tipo de usuario: Externo
   - Nombre de la aplicación: "Plataforma Angélica"
   - Correo de asistencia: tu-email@dominio.com
   - Logo: (opcional) subir logo de la plataforma
   - Dominios autorizados: tu-dominio.com
   - Guardar y continuar

6. **Configurar ID de Cliente OAuth**
   - Tipo de aplicación: **Aplicación web**
   - Nombre: "Plataforma Angelica Web"
   
   **Orígenes de JavaScript autorizados:**
   ```
   https://plataforma-angelica-dev.vercel.app
   https://tu-dominio-personalizado.com (si tienes)
   http://localhost:5173 (para desarrollo local)
   ```
   
   **URIs de redireccionamiento autorizados:**
   ```
   https://[TU-PROYECTO-ID].supabase.co/auth/v1/callback
   ```
   
   ⚠️ **IMPORTANTE:** Reemplaza `[TU-PROYECTO-ID]` con tu ID real de Supabase
   
   Para encontrar tu ID de Supabase:
   - Ve a tu proyecto en Supabase
   - Settings → API
   - Copia la URL del proyecto (ej: `https://abcdefgh.supabase.co`)
   - El ID es la parte antes de `.supabase.co`

7. **Copiar Credenciales**
   - Se mostrarán tu **Client ID** y **Client Secret**
   - ⚠️ **GUÁRDALOS EN UN LUGAR SEGURO**
   - Ejemplo:
     ```
     Client ID: 123456789-abc123def456.apps.googleusercontent.com
     Client Secret: GOCSPX-abc123def456ghi789
     ```

---

## 2. Configurar Facebook OAuth (10 minutos)

### Paso 1: Facebook Developers

1. **Ir a Facebook Developers**
   - URL: https://developers.facebook.com/

2. **Crear o Seleccionar App**
   - Click "Mis Apps" → "Crear app"
   - Tipo: "Consumidor"
   - Nombre: "Plataforma Angélica"
   - Email de contacto: tu-email@dominio.com
   - Click "Crear app"

3. **Añadir Producto Facebook Login**
   - En el panel de la app
   - Click "Añadir producto"
   - Buscar "Facebook Login"
   - Click "Configurar"

4. **Configurar Facebook Login**
   - Seleccionar plataforma: **Web**
   - URL del sitio: `https://plataforma-angelica-dev.vercel.app`
   - Guardar

5. **Configurar URIs de Redirección**
   - Menú lateral → Facebook Login → Configuración
   
   **URIs de redireccionamiento de OAuth válidos:**
   ```
   https://[TU-PROYECTO-ID].supabase.co/auth/v1/callback
   ```
   
   ⚠️ **IMPORTANTE:** Reemplaza `[TU-PROYECTO-ID]` con tu ID real de Supabase

6. **Configurar Dominios de la App**
   - Configuración → Básica
   
   **Dominios de la app:**
   ```
   plataforma-angelica-dev.vercel.app
   tu-dominio-personalizado.com (si tienes)
   ```

7. **Copiar Credenciales**
   - Configuración → Básica
   - **ID de la app** (App ID)
   - **Clave secreta de la app** (App Secret) - Click "Mostrar"
   - ⚠️ **GUÁRDALOS EN UN LUGAR SEGURO**
   - Ejemplo:
     ```
     App ID: 1234567890123456
     App Secret: abc123def456ghi789jkl012mno345pq
     ```

8. **Activar App en Producción**
   - Configuración → Básica
   - Estado de la app: Cambiar a "En producción"
   - Confirmar

---

## 3. Configurar Supabase (5 minutos)

### Paso 1: Configurar Google en Supabase

1. **Ir a Supabase Dashboard**
   - URL: https://app.supabase.com/
   - Seleccionar tu proyecto

2. **Navegar a Authentication**
   - Menú lateral → Authentication → Providers

3. **Configurar Google Provider**
   - Buscar "Google" en la lista
   - Click para expandir
   - Toggle "Enable Sign in with Google" → **ON**
   
   **Configuración:**
   ```
   Client ID (for OAuth):
   [PEGAR TU GOOGLE CLIENT ID AQUÍ]
   
   Client Secret (for OAuth):
   [PEGAR TU GOOGLE CLIENT SECRET AQUÍ]
   ```
   
   **Redirect URL:** (ya está configurada automáticamente)
   ```
   https://[tu-proyecto].supabase.co/auth/v1/callback
   ```
   
   - Click "Save"

### Paso 2: Configurar Facebook en Supabase

1. **En la misma página de Providers**
   - Buscar "Facebook" en la lista
   - Click para expandir
   - Toggle "Enable Sign in with Facebook" → **ON**
   
   **Configuración:**
   ```
   Facebook client ID:
   [PEGAR TU FACEBOOK APP ID AQUÍ]
   
   Facebook secret:
   [PEGAR TU FACEBOOK APP SECRET AQUÍ]
   ```
   
   **Redirect URL:** (ya está configurada automáticamente)
   ```
   https://[tu-proyecto].supabase.co/auth/v1/callback
   ```
   
   - Click "Save"

---

## 4. Ejecutar Migración de Base de Datos (2 minutos)

### En Supabase SQL Editor

1. **Ir a SQL Editor**
   - Menú lateral → SQL Editor
   - Click "New query"

2. **Copiar y Ejecutar este SQL:**

```sql
-- Añadir campo onboarding_completed a tabla profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'onboarding_completed'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE 'Column onboarding_completed added to profiles table';
    ELSE
        RAISE NOTICE 'Column onboarding_completed already exists';
    END IF;
END $$;

-- Crear índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_completed);

-- Verificar que se creó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name = 'onboarding_completed';
```

3. **Click "Run" o presionar Ctrl+Enter**

4. **Verificar Resultado**
   - Deberías ver un mensaje de éxito
   - Y una fila mostrando el campo `onboarding_completed`

---

## 5. (Opcional) Configurar Google Analytics

### En index.html

1. **Abrir** `/home/ubuntu/plataforma-angelica/index.html`

2. **Añadir antes de `</head>`:**

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
  window.GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
</script>
```

⚠️ **Reemplaza `G-XXXXXXXXXX`** con tu ID real de Google Analytics

**Para obtener tu ID:**
1. Ir a https://analytics.google.com/
2. Admin → Propiedad → Flujos de datos
3. Seleccionar tu flujo web
4. Copiar "ID de medición" (empieza con G-)

---

## 6. (Opcional) Configurar Mixpanel

### En index.html

1. **Añadir antes de `</head>`:**

```html
<!-- Mixpanel -->
<script src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"></script>
<script>
  mixpanel.init('TU_PROJECT_TOKEN_AQUI');
</script>
```

⚠️ **Reemplaza `TU_PROJECT_TOKEN_AQUI`** con tu token real de Mixpanel

**Para obtener tu token:**
1. Ir a https://mixpanel.com/
2. Settings → Project Settings
3. Copiar "Project Token"

---

## ✅ Verificación Final

### Checklist de Configuración

- [ ] Google OAuth configurado en Google Cloud Console
- [ ] Facebook OAuth configurado en Facebook Developers
- [ ] Google provider habilitado en Supabase
- [ ] Facebook provider habilitado en Supabase
- [ ] Migración SQL ejecutada exitosamente
- [ ] Campo `onboarding_completed` existe en tabla `profiles`
- [ ] (Opcional) Google Analytics configurado
- [ ] (Opcional) Mixpanel configurado

### Probar la Configuración

1. **Ir a tu sitio desplegado**
   - URL: https://plataforma-angelica-dev.vercel.app/login

2. **Probar Login con Google**
   - Click en "Continuar con Google"
   - Debería abrir popup de Google
   - Seleccionar cuenta
   - Debería redirigir a dashboard

3. **Probar Login con Facebook**
   - Click en "Continuar con Facebook"
   - Debería abrir popup de Facebook
   - Iniciar sesión
   - Debería redirigir a dashboard

4. **Verificar Onboarding**
   - Crear cuenta nueva
   - Debería aparecer tour de 5 pasos
   - Navegar o saltar
   - Debería guardar estado

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Causa:** URI de redirección no coincide
**Solución:** 
- Verificar que la URI en Google/Facebook sea exactamente:
  `https://[tu-proyecto].supabase.co/auth/v1/callback`
- Sin espacios, sin barra final

### Error: "Invalid OAuth client"
**Causa:** Credenciales incorrectas
**Solución:**
- Verificar Client ID y Secret copiados correctamente
- Sin espacios al inicio o final
- Regenerar credenciales si es necesario

### Error: "App not in production mode"
**Causa:** App de Facebook en modo desarrollo
**Solución:**
- Facebook Developers → Configuración → Estado
- Cambiar a "En producción"

### Error: "profiles table not found"
**Causa:** Tabla profiles no existe
**Solución:**
```sql
-- Crear tabla profiles si no existe
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs de Supabase (Authentication → Logs)
2. Revisar consola del navegador (F12)
3. Verificar que todas las URLs coincidan exactamente
4. Consultar documentación oficial:
   - Google: https://developers.google.com/identity/protocols/oauth2
   - Facebook: https://developers.facebook.com/docs/facebook-login
   - Supabase: https://supabase.com/docs/guides/auth/social-login

---

**Última actualización:** 2025-10-10  
**Versión:** 1.0.0

