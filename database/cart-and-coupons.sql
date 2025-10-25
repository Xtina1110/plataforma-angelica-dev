-- ============================================
-- SISTEMA DE CARRITO Y CUPONES
-- ============================================
-- Tablas y funciones para gestión de cupones y stock
-- ============================================

-- ============================================
-- 1. TABLA: coupons (Cupones de Descuento)
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para coupons
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_expires_at ON coupons(expires_at);

-- RLS para coupons (solo lectura para usuarios)
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- ============================================
-- 2. FUNCIÓN: decrease_product_stock
-- ============================================
-- Disminuye el stock de un producto de forma segura
CREATE OR REPLACE FUNCTION decrease_product_stock(
  product_id UUID,
  quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Obtener stock actual con lock
  SELECT stock INTO current_stock
  FROM products
  WHERE id = product_id
  FOR UPDATE;

  -- Verificar que hay suficiente stock
  IF current_stock IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  IF current_stock < quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', current_stock, quantity;
  END IF;

  -- Actualizar stock
  UPDATE products
  SET stock = stock - quantity,
      updated_at = NOW()
  WHERE id = product_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. FUNCIÓN: increase_product_stock
-- ============================================
-- Aumenta el stock de un producto (para devoluciones/cancelaciones)
CREATE OR REPLACE FUNCTION increase_product_stock(
  product_id UUID,
  quantity INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE products
  SET stock = stock + quantity,
      updated_at = NOW()
  WHERE id = product_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. FUNCIÓN: increment_coupon_usage
-- ============================================
-- Incrementa el contador de usos de un cupón
CREATE OR REPLACE FUNCTION increment_coupon_usage(
  coupon_code VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_coupon_id UUID;
  v_max_uses INTEGER;
  v_current_uses INTEGER;
BEGIN
  -- Obtener información del cupón con lock
  SELECT id, max_uses, current_uses
  INTO v_coupon_id, v_max_uses, v_current_uses
  FROM coupons
  WHERE code = coupon_code
  FOR UPDATE;

  IF v_coupon_id IS NULL THEN
    RAISE EXCEPTION 'Coupon not found';
  END IF;

  -- Verificar límite de usos
  IF v_max_uses IS NOT NULL AND v_current_uses >= v_max_uses THEN
    RAISE EXCEPTION 'Coupon usage limit reached';
  END IF;

  -- Incrementar contador
  UPDATE coupons
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = v_coupon_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. TABLA: wishlists (Listas de Deseos)
-- ============================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Índices para wishlists
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);

-- RLS para wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlists;
CREATE POLICY "Users can view own wishlist"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert to own wishlist" ON wishlists;
CREATE POLICY "Users can insert to own wishlist"
  ON wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from own wishlist" ON wishlists;
CREATE POLICY "Users can delete from own wishlist"
  ON wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. ACTUALIZAR TABLA: orders
-- ============================================
-- Agregar campos adicionales si no existen
DO $$ 
BEGIN
  -- Agregar campo subtotal
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2);
  END IF;

  -- Agregar campo discount
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'discount'
  ) THEN
    ALTER TABLE orders ADD COLUMN discount DECIMAL(10,2) DEFAULT 0;
  END IF;

  -- Agregar campo shipping
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'shipping'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping DECIMAL(10,2) DEFAULT 0;
  END IF;

  -- Agregar campo tax
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tax'
  ) THEN
    ALTER TABLE orders ADD COLUMN tax DECIMAL(10,2) DEFAULT 0;
  END IF;

  -- Agregar campo coupon_code
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'coupon_code'
  ) THEN
    ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(50);
  END IF;

  -- Agregar campo tracking_number
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'tracking_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(100);
  END IF;

  -- Agregar campo notes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'notes'
  ) THEN
    ALTER TABLE orders ADD COLUMN notes TEXT;
  END IF;
END $$;

-- ============================================
-- 7. INSERTAR CUPONES DE EJEMPLO
-- ============================================
INSERT INTO coupons (code, type, value, min_purchase, max_uses, is_active, expires_at) VALUES
  ('BIENVENIDO10', 'percentage', 10, 0, 100, true, NOW() + INTERVAL '30 days'),
  ('ANGEL20', 'percentage', 20, 50, 50, true, NOW() + INTERVAL '60 days'),
  ('DESCUENTO5', 'fixed', 5, 0, NULL, true, NULL),
  ('PRIMERACOMPRA', 'percentage', 15, 30, 200, true, NOW() + INTERVAL '90 days'),
  ('VERANO2024', 'percentage', 25, 100, 100, true, NOW() + INTERVAL '120 days')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 8. TRIGGER: update_coupons_updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. VISTA: active_coupons
-- ============================================
-- Vista para obtener cupones activos fácilmente
CREATE OR REPLACE VIEW active_coupons AS
SELECT 
  code,
  type,
  value,
  min_purchase,
  max_uses,
  current_uses,
  CASE 
    WHEN max_uses IS NOT NULL THEN max_uses - current_uses
    ELSE NULL
  END as remaining_uses,
  expires_at
FROM coupons
WHERE is_active = true
  AND (expires_at IS NULL OR expires_at > NOW())
  AND (max_uses IS NULL OR current_uses < max_uses);

-- ============================================
-- 10. FUNCIÓN: get_product_availability
-- ============================================
-- Obtiene información de disponibilidad de un producto
CREATE OR REPLACE FUNCTION get_product_availability(product_id UUID)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  stock INTEGER,
  is_available BOOLEAN,
  low_stock_warning BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.stock,
    p.stock > 0 as is_available,
    p.stock <= 5 AND p.stock > 0 as low_stock_warning
  FROM products p
  WHERE p.id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE coupons IS 'Cupones de descuento para la tienda';
COMMENT ON TABLE wishlists IS 'Listas de deseos de usuarios';
COMMENT ON FUNCTION decrease_product_stock IS 'Disminuye el stock de un producto de forma segura';
COMMENT ON FUNCTION increase_product_stock IS 'Aumenta el stock de un producto';
COMMENT ON FUNCTION increment_coupon_usage IS 'Incrementa el contador de usos de un cupón';
COMMENT ON FUNCTION get_product_availability IS 'Obtiene información de disponibilidad de un producto';

-- ============================================
-- FIN DEL ESQUEMA DE CARRITO Y CUPONES
-- ============================================

