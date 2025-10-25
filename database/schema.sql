-- ============================================
-- PLATAFORMA ANGÉLICA - ESQUEMA DE BASE DE DATOS
-- ============================================
-- Fecha: Octubre 2024
-- Descripción: Esquema completo para todas las funcionalidades
-- ============================================

-- ============================================
-- 1. TABLA: card_readings (Lecturas de Cartas)
-- ============================================
CREATE TABLE IF NOT EXISTS card_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('3-cards', '6-cards', '9-cards')),
  cards JSONB NOT NULL,
  interpretation TEXT,
  environment VARCHAR(20) CHECK (environment IN ('temple', 'garden', 'cosmos', 'sanctuary')),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para card_readings
CREATE INDEX IF NOT EXISTS idx_card_readings_user_id ON card_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_card_readings_created_at ON card_readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_card_readings_mode ON card_readings(mode);

-- RLS para card_readings
ALTER TABLE card_readings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own card readings" ON card_readings;
CREATE POLICY "Users can view own card readings"
  ON card_readings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own card readings" ON card_readings;
CREATE POLICY "Users can insert own card readings"
  ON card_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own card readings" ON card_readings;
CREATE POLICY "Users can update own card readings"
  ON card_readings FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 2. TABLA: consultation_sessions (Sesiones de Consulta)
-- ============================================
CREATE TABLE IF NOT EXISTS consultation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  duration INTEGER DEFAULT 0, -- en minutos
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  recording_url TEXT,
  transcript TEXT,
  translation TEXT,
  pdf_url TEXT,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultation_sessions
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_user_id ON consultation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_consultant_id ON consultation_sessions(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_status ON consultation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_scheduled_at ON consultation_sessions(scheduled_at);

-- RLS para consultation_sessions
ALTER TABLE consultation_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own consultations" ON consultation_sessions;
CREATE POLICY "Users can view own consultations"
  ON consultation_sessions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = consultant_id);

DROP POLICY IF EXISTS "Users can insert own consultations" ON consultation_sessions;
CREATE POLICY "Users can insert own consultations"
  ON consultation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Consultants can update their consultations" ON consultation_sessions;
CREATE POLICY "Consultants can update their consultations"
  ON consultation_sessions FOR UPDATE
  USING (auth.uid() = consultant_id OR auth.uid() = user_id);

-- ============================================
-- 3. TABLA: courses (Cursos de Academia)
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category VARCHAR(100),
  level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  price DECIMAL(10,2) DEFAULT 0,
  duration INTEGER, -- en minutos
  thumbnail_url TEXT,
  video_url TEXT,
  is_published BOOLEAN DEFAULT false,
  student_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para courses
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

-- RLS para courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = true OR auth.uid() = instructor_id);

DROP POLICY IF EXISTS "Instructors can insert courses" ON courses;
CREATE POLICY "Instructors can insert courses"
  ON courses FOR INSERT
  WITH CHECK (auth.uid() = instructor_id);

DROP POLICY IF EXISTS "Instructors can update own courses" ON courses;
CREATE POLICY "Instructors can update own courses"
  ON courses FOR UPDATE
  USING (auth.uid() = instructor_id);

-- ============================================
-- 4. TABLA: lessons (Lecciones de Cursos)
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  video_url TEXT,
  duration INTEGER, -- en minutos
  is_free BOOLEAN DEFAULT false,
  content TEXT,
  resources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para lessons
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);

-- RLS para lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view lessons of published courses" ON lessons;
CREATE POLICY "Anyone can view lessons of published courses"
  ON lessons FOR SELECT
  USING (
    is_free = true OR 
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND (courses.is_published = true OR courses.instructor_id = auth.uid())
    )
  );

-- ============================================
-- 5. TABLA: enrollments (Inscripciones)
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_lessons JSONB DEFAULT '[]'::jsonb,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Índices para enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_progress ON enrollments(progress);

-- RLS para enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own enrollments" ON enrollments;
CREATE POLICY "Users can insert own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own enrollments" ON enrollments;
CREATE POLICY "Users can update own enrollments"
  ON enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. TABLA: chatbot_messages (Mensajes del Chatbot)
-- ============================================
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  angel VARCHAR(50) CHECK (angel IN ('angela', 'miguel', 'rafael', 'gabriel', 'uriel')),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para chatbot_messages
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_user_id ON chatbot_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_angel ON chatbot_messages(angel);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON chatbot_messages(created_at DESC);

-- RLS para chatbot_messages
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own chatbot messages" ON chatbot_messages;
CREATE POLICY "Users can view own chatbot messages"
  ON chatbot_messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own chatbot messages" ON chatbot_messages;
CREATE POLICY "Users can insert own chatbot messages"
  ON chatbot_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. TABLA: products (Productos de Tienda)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  images JSONB,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- RLS para products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- ============================================
-- 8. TABLA: orders (Pedidos)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_method VARCHAR(50),
  payment_id TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- RLS para orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 9. TABLA: blog_posts (Artículos de Blog)
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category VARCHAR(100),
  tags JSONB,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- RLS para blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can insert blog posts" ON blog_posts;
CREATE POLICY "Authors can insert blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update own blog posts" ON blog_posts;
CREATE POLICY "Authors can update own blog posts"
  ON blog_posts FOR UPDATE
  USING (auth.uid() = author_id);

-- ============================================
-- 10. ACTUALIZAR TABLA: usuarios (Agregar role)
-- ============================================
-- Verificar si la columna 'role' ya existe antes de agregarla
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'role'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN role VARCHAR(50) DEFAULT 'usuario';
  END IF;
END $$;

-- Agregar constraint para role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_role_check'
  ) THEN
    ALTER TABLE usuarios ADD CONSTRAINT usuarios_role_check 
    CHECK (role IN ('usuario', 'terapeuta', 'instructor', 'admin', 'support', 'affiliate', 'center'));
  END IF;
END $$;

-- Índice para role
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_card_readings_updated_at ON card_readings;
CREATE TRIGGER update_card_readings_updated_at
  BEFORE UPDATE ON card_readings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultation_sessions_updated_at ON consultation_sessions;
CREATE TRIGGER update_consultation_sessions_updated_at
  BEFORE UPDATE ON consultation_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments;
CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================
COMMENT ON TABLE card_readings IS 'Almacena las lecturas de cartas angelicales realizadas por los usuarios';
COMMENT ON TABLE consultation_sessions IS 'Almacena las sesiones de consulta online con video';
COMMENT ON TABLE courses IS 'Almacena los cursos de la Academia Angélica';
COMMENT ON TABLE lessons IS 'Almacena las lecciones de cada curso';
COMMENT ON TABLE enrollments IS 'Almacena las inscripciones de usuarios a cursos';
COMMENT ON TABLE chatbot_messages IS 'Almacena los mensajes del chatbot angelical';
COMMENT ON TABLE products IS 'Almacena los productos de la tienda angelical';
COMMENT ON TABLE orders IS 'Almacena los pedidos de productos';
COMMENT ON TABLE blog_posts IS 'Almacena los artículos del blog';

-- ============================================
-- FIN DEL ESQUEMA
-- ============================================

