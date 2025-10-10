-- Migración completa del sistema de usuarios y suscripciones
-- Plataforma Angélica

-- ============================================
-- 1. TABLA PROFILES (Información de usuarios)
-- ============================================

-- Añadir columnas faltantes a profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
-- Age will be calculated in application layer instead of generated column

-- Información de contacto
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+34';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'both'));

-- Dirección
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state_province TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'España';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'ES';

-- Preferencias
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'es';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Madrid';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_format TEXT DEFAULT 'DD/MM/YYYY';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS time_format TEXT DEFAULT '24h';

-- Información espiritual (opcional)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zodiac_sign TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spiritual_interests TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS therapy_preferences TEXT[];

-- Tipo de usuario y rol
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'usuario' CHECK (user_type IN ('usuario', 'terapeuta', 'centro', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'usuario';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_therapist BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP;

-- Suscripción
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'gratis' CHECK (subscription_plan IN ('gratis', 'premium', 'pro', 'enterprise'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'suspended'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly'));

-- Stripe
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Consentimientos
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS terms_accepted_date TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_accepted_date TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT FALSE;

-- Metadata
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB;

-- Registro
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS registration_step INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS registration_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS registration_completed_date TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified_date TIMESTAMP;

-- Timestamps
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- ============================================
-- 2. TABLA SUBSCRIPTIONS (Historial de suscripciones)
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Plan
  plan_id TEXT NOT NULL CHECK (plan_id IN ('gratis', 'premium', 'pro', 'enterprise')),
  plan_name TEXT NOT NULL,
  
  -- Stripe
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  
  -- Pricing
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'unpaid', 'expired')),
  
  -- Dates
  start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

-- ============================================
-- 3. TABLA PAYMENTS (Historial de pagos)
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Stripe
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  stripe_invoice_id TEXT,
  
  -- Payment details
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),
  
  -- Method
  payment_method TEXT,
  card_brand TEXT,
  card_last4 TEXT,
  
  -- Dates
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================
-- 4. TABLA THERAPIST_PROFILES (Perfiles de terapeutas)
-- ============================================

CREATE TABLE IF NOT EXISTS therapist_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Información profesional
  professional_title TEXT,
  specialties TEXT[],
  certifications TEXT[],
  years_experience INTEGER,
  languages TEXT[],
  
  -- Descripción
  bio_short TEXT,
  bio_long TEXT,
  approach TEXT,
  
  -- Disponibilidad
  available BOOLEAN DEFAULT TRUE,
  calendar_url TEXT,
  booking_url TEXT,
  
  -- Pricing
  hourly_rate DECIMAL(10, 2),
  session_duration INTEGER DEFAULT 60, -- minutos
  accepts_insurance BOOLEAN DEFAULT FALSE,
  
  -- Ratings
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  
  -- Verificación
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES profiles(id),
  
  -- Media
  profile_image TEXT,
  cover_image TEXT,
  video_intro TEXT,
  gallery JSONB,
  
  -- Social
  website TEXT,
  social_links JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para therapist_profiles
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_user_id ON therapist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_verified ON therapist_profiles(verified);
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_available ON therapist_profiles(available);

-- ============================================
-- 5. TABLA ORGANIZATION_PROFILES (Perfiles de organizaciones)
-- ============================================

CREATE TABLE IF NOT EXISTS organization_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Información de la organización
  organization_name TEXT NOT NULL,
  organization_type TEXT,
  tax_id TEXT,
  
  -- Contacto
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Dirección
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  
  -- Equipo
  team_size INTEGER DEFAULT 1,
  therapists_count INTEGER DEFAULT 0,
  max_therapists INTEGER DEFAULT 10,
  
  -- Branding
  logo_url TEXT,
  brand_color TEXT,
  custom_domain TEXT,
  
  -- Verificación
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para organization_profiles
CREATE INDEX IF NOT EXISTS idx_organization_profiles_user_id ON organization_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_profiles_verified ON organization_profiles(verified);

-- ============================================
-- 6. TABLA REGISTRATION_PROGRESS (Progreso de registro)
-- ============================================

CREATE TABLE IF NOT EXISTS registration_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  
  -- Progreso
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 6,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  
  -- Datos por paso (JSON)
  step_1_data JSONB, -- Información básica
  step_2_data JSONB, -- Seguridad
  step_3_data JSONB, -- Preferencias
  step_4_data JSONB, -- Tipo de usuario
  step_5_data JSONB, -- Suscripción
  step_6_data JSONB, -- Confirmación
  
  -- Metadata
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours',
  completed_at TIMESTAMP
);

-- Índices para registration_progress
CREATE INDEX IF NOT EXISTS idx_registration_progress_email ON registration_progress(email);
CREATE INDEX IF NOT EXISTS idx_registration_progress_current_step ON registration_progress(current_step);
CREATE INDEX IF NOT EXISTS idx_registration_progress_expires_at ON registration_progress(expires_at);

-- ============================================
-- 7. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_therapist_profiles_updated_at ON therapist_profiles;
CREATE TRIGGER update_therapist_profiles_updated_at
  BEFORE UPDATE ON therapist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organization_profiles_updated_at ON organization_profiles;
CREATE TRIGGER update_organization_profiles_updated_at
  BEFORE UPDATE ON organization_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_registration_progress_updated_at ON registration_progress;
CREATE TRIGGER update_registration_progress_updated_at
  BEFORE UPDATE ON registration_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas para payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas para therapist_profiles
DROP POLICY IF EXISTS "Anyone can view verified therapists" ON therapist_profiles;
CREATE POLICY "Anyone can view verified therapists"
  ON therapist_profiles FOR SELECT
  USING (verified = TRUE);

DROP POLICY IF EXISTS "Therapists can update own profile" ON therapist_profiles;
CREATE POLICY "Therapists can update own profile"
  ON therapist_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para organization_profiles
DROP POLICY IF EXISTS "Organizations can view own profile" ON organization_profiles;
CREATE POLICY "Organizations can view own profile"
  ON organization_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Organizations can update own profile" ON organization_profiles;
CREATE POLICY "Organizations can update own profile"
  ON organization_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para registration_progress
DROP POLICY IF EXISTS "Anyone can insert registration progress" ON registration_progress;
CREATE POLICY "Anyone can insert registration progress"
  ON registration_progress FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Anyone can update own registration progress" ON registration_progress;
CREATE POLICY "Anyone can update own registration progress"
  ON registration_progress FOR UPDATE
  USING (TRUE);

-- ============================================
-- 9. ÍNDICES ADICIONALES PARA PERFORMANCE
-- ============================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);

-- ============================================
-- 10. DATOS INICIALES (OPCIONAL)
-- ============================================

-- Insertar plan gratis por defecto para usuarios existentes
UPDATE profiles 
SET subscription_plan = 'gratis',
    subscription_status = 'active',
    subscription_start_date = NOW()
WHERE subscription_plan IS NULL;

-- ============================================
-- COMPLETADO
-- ============================================

-- Verificar que todo se creó correctamente
SELECT 'Migration completed successfully!' AS status;

