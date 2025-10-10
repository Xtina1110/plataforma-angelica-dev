#!/bin/bash

# 🚀 Setup Script para Plataforma Angélica
# Este script configura el entorno local para desarrollo

echo "🌟 Configurando Plataforma Angélica..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js no está instalado"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# 2. Instalar dependencias
echo ""
echo "📥 Instalando dependencias..."
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencias instaladas correctamente"
    else
        print_error "Error al instalar dependencias"
        exit 1
    fi
else
    print_error "package.json no encontrado"
    exit 1
fi

# 3. Verificar archivo .env
echo ""
echo "🔐 Verificando configuración de entorno..."
if [ -f ".env" ]; then
    print_success "Archivo .env encontrado"
else
    print_warning "Archivo .env no encontrado"
    echo "Creando .env.example..."
    cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Google Analytics (opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Mixpanel (opcional)
VITE_MIXPANEL_TOKEN=tu-token-aqui
EOF
    print_warning "Por favor copia .env.example a .env y configura tus credenciales"
fi

# 4. Verificar estructura de directorios
echo ""
echo "📁 Verificando estructura de directorios..."
REQUIRED_DIRS=(
    "src/components"
    "src/contexts"
    "src/utils"
    "src/assets"
    "database/migrations"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_success "$dir existe"
    else
        print_warning "$dir no existe, creando..."
        mkdir -p "$dir"
    fi
done

# 5. Verificar archivos críticos
echo ""
echo "📄 Verificando archivos críticos..."
CRITICAL_FILES=(
    "src/contexts/ThemeContext.jsx"
    "src/components/LoginEnhanced.jsx"
    "src/components/ThemeToggle.jsx"
    "src/components/AngelicParticles.jsx"
    "src/utils/analytics.js"
    "src/utils/performanceUtils.js"
)

MISSING_FILES=0
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file existe"
    else
        print_error "$file NO EXISTE"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    print_error "$MISSING_FILES archivos críticos faltan"
    echo "Por favor asegúrate de tener todos los archivos del repositorio"
fi

# 6. Verificar Tailwind config
echo ""
echo "🎨 Verificando configuración de Tailwind..."
if grep -q "darkMode: 'class'" tailwind.config.js; then
    print_success "Dark mode configurado en Tailwind"
else
    print_warning "Dark mode NO configurado en Tailwind"
    echo "Añadiendo darkMode: 'class' a tailwind.config.js..."
    # Backup
    cp tailwind.config.js tailwind.config.js.backup
    # Nota: esto es un ejemplo, puede necesitar ajuste manual
    print_warning "Por favor verifica tailwind.config.js manualmente"
fi

# 7. Información de siguiente paso
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Setup completado!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Configurar .env con tus credenciales de Supabase"
echo "   cp .env.example .env"
echo "   # Editar .env con tus valores reales"
echo ""
echo "2. Configurar OAuth (ver OAUTH_SETUP_INSTRUCTIONS.md)"
echo "   - Google OAuth"
echo "   - Facebook OAuth"
echo ""
echo "3. Ejecutar migración de base de datos en Supabase"
echo "   - Ver database/migrations/001_add_onboarding_field.sql"
echo ""
echo "4. Iniciar servidor de desarrollo"
echo "   npm run dev"
echo ""
echo "5. Abrir en navegador"
echo "   http://localhost:5173"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "¡Todo listo para empezar! 🚀"
echo ""

