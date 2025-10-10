# ✅ Checklist de Deployment - Mejoras del Login

## 📋 Pre-Deployment

### 1. Verificar Archivos Subidos a GitHub ✅
- [x] SocialLogin.jsx
- [x] OnboardingTour.jsx
- [x] DashboardRedirect.jsx
- [x] LazyImage.jsx
- [x] LoginOptimized.jsx
- [x] performanceUtils.js
- [x] Login.jsx (actualizado)
- [x] AuthPageLayout.jsx (actualizado)
- [x] App.jsx (actualizado)

**Status**: ✅ Commit `23e1d6c` subido a `feature/unified-headers`

---

## 🗄️ Base de Datos (CRÍTICO)

### 2. Ejecutar Migración SQL en Supabase

**Pasos:**
1. Ir a Supabase Dashboard
2. Navegar a SQL Editor
3. Ejecutar el script: `database/migrations/001_add_onboarding_field.sql`

**Script a ejecutar:**
```sql
-- Add onboarding_completed column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_completed);
```

**Verificación:**
```sql
-- Verificar que el campo existe
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name = 'onboarding_completed';
```

- [ ] Migración ejecutada
- [ ] Campo verificado
- [ ] Índice creado

---

## 🔐 Configuración OAuth (CRÍTICO)

### 3. Configurar Google OAuth

**En Google Cloud Console:**
1. Ir a https://console.cloud.google.com/
2. Seleccionar proyecto o crear uno nuevo
3. Habilitar Google+ API
4. Ir a "Credenciales" → "Crear credenciales" → "ID de cliente OAuth 2.0"
5. Tipo de aplicación: Aplicación web
6. Añadir URIs autorizadas de JavaScript:
   - `https://tu-dominio.vercel.app`
   - `https://[tu-proyecto].supabase.co`
7. Añadir URIs de redireccionamiento autorizados:
   - `https://[tu-proyecto].supabase.co/auth/v1/callback`
8. Copiar Client ID y Client Secret

**En Supabase Dashboard:**
1. Ir a Authentication → Providers
2. Buscar "Google"
3. Habilitar
4. Pegar Client ID
5. Pegar Client Secret
6. Guardar

- [ ] Google Cloud Console configurado
- [ ] Client ID y Secret obtenidos
- [ ] Supabase configurado
- [ ] Probado en dev

### 4. Configurar Facebook OAuth

**En Facebook Developers:**
1. Ir a https://developers.facebook.com/
2. Crear app o seleccionar existente
3. Añadir producto "Facebook Login"
4. Configurar:
   - Valid OAuth Redirect URIs: `https://[tu-proyecto].supabase.co/auth/v1/callback`
5. Copiar App ID y App Secret

**En Supabase Dashboard:**
1. Ir a Authentication → Providers
2. Buscar "Facebook"
3. Habilitar
4. Pegar App ID
5. Pegar App Secret
6. Guardar

- [ ] Facebook Developers configurado
- [ ] App ID y Secret obtenidos
- [ ] Supabase configurado
- [ ] Probado en dev

---

## 🚀 Deployment en Vercel

### 5. Verificar Configuración de Vercel

**Opción A: Vercel despliega automáticamente desde feature/unified-headers**
- [ ] Verificar en Vercel Dashboard que está conectado a la rama correcta
- [ ] El push debería haber disparado un deploy automático
- [ ] Verificar logs de build en Vercel

**Opción B: Merge a rama principal**
Si Vercel despliega desde `main` o `master`:

```bash
# Crear rama main si no existe
git checkout -b main
git push origin main

# O hacer merge
git checkout main
git merge feature/unified-headers
git push origin main
```

- [ ] Rama de deployment verificada
- [ ] Build exitoso en Vercel
- [ ] Deploy completado

---

## 🧪 Testing Post-Deployment

### 6. Pruebas Funcionales

**Login Básico:**
- [ ] Página de login carga sin errores
- [ ] No hay scrollbar visible
- [ ] Validación de email funciona en tiempo real
- [ ] Indicador de fortaleza de contraseña aparece
- [ ] Login con email/password funciona

**Social Login:**
- [ ] Botón "Continuar con Google" visible
- [ ] Botón "Continuar con Facebook" visible
- [ ] Click en Google abre popup de OAuth
- [ ] Click en Facebook abre popup de OAuth
- [ ] Login con Google completa exitosamente
- [ ] Login con Facebook completa exitosamente

**Onboarding:**
- [ ] Usuario nuevo ve el tour automáticamente
- [ ] Tour tiene 5 pasos
- [ ] Navegación entre pasos funciona
- [ ] Botón "Saltar tour" funciona
- [ ] Botón "¡Comenzar!" redirige a dashboard
- [ ] Usuario existente NO ve el tour
- [ ] Estado se guarda en localStorage
- [ ] Estado se guarda en base de datos

**Performance:**
- [ ] Imágenes cargan con lazy loading
- [ ] No hay errores en consola
- [ ] Tiempo de carga < 2 segundos
- [ ] Lighthouse Score > 90

---

## 🐛 Troubleshooting

### Errores Comunes

**Error: "profiles table does not have column onboarding_completed"**
- Solución: Ejecutar migración SQL (Paso 2)

**Error: "OAuth provider not configured"**
- Solución: Completar configuración OAuth (Pasos 3 y 4)

**Error: "Cannot read property 'onboarding_completed' of null"**
- Solución: Verificar que la tabla profiles existe y tiene datos

**Error: Build failed en Vercel**
- Verificar logs de Vercel
- Verificar que todas las dependencias están en package.json
- Verificar que no hay errores de sintaxis

---

## 📊 Monitoreo Post-Launch

### 7. Métricas a Observar (Primeras 24h)

**En Vercel:**
- [ ] Tráfico y requests
- [ ] Errores 500/404
- [ ] Tiempo de respuesta

**En Supabase:**
- [ ] Logs de autenticación
- [ ] Errores de OAuth
- [ ] Queries a tabla profiles

**En Google Analytics / Mixpanel:**
- [ ] Tasa de conversión de login
- [ ] Uso de login social vs email
- [ ] Tasa de completación de onboarding
- [ ] Tiempo promedio en onboarding

**En Sentry / LogRocket (si está configurado):**
- [ ] Errores de JavaScript
- [ ] Errores de red
- [ ] Performance issues

---

## 📝 Rollback Plan

Si algo sale mal:

```bash
# Revertir commit
git revert 23e1d6c

# O volver a commit anterior
git reset --hard 040b563

# Push forzado (CUIDADO)
git push origin feature/unified-headers --force
```

**En Supabase:**
```sql
-- Revertir migración (si es necesario)
ALTER TABLE profiles DROP COLUMN IF EXISTS onboarding_completed;
DROP INDEX IF EXISTS idx_profiles_onboarding;
```

---

## ✅ Sign-Off

### Deployment Completado

- [ ] Todos los checks de Pre-Deployment ✅
- [ ] Base de datos migrada ✅
- [ ] OAuth configurado ✅
- [ ] Deploy exitoso en Vercel ✅
- [ ] Testing completado ✅
- [ ] Monitoreo activo ✅

**Deployed by:** _________________  
**Date:** _________________  
**Time:** _________________  
**Vercel URL:** _________________  

---

## 📞 Contactos de Emergencia

**Si encuentras problemas:**
1. Revisar logs de Vercel
2. Revisar logs de Supabase
3. Revisar consola del navegador
4. Consultar documentación: `MEJORAS_LOGIN_COMPLETO.md`

---

**Versión**: 1.0.0  
**Última actualización**: 2025-10-10

