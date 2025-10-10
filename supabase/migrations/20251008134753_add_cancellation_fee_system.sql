/*
  # Sistema de Fee de Cancelación

  1. Modificaciones
    - Agregar columna `cancellation_fee` a tabla `bookings`
    - Agregar columna `cancellation_fee_percentage` a tabla `services`
    - Agregar función para calcular fee de cancelación según tiempo

  2. Lógica de Fee
    - Cancelación con más de 24 horas: Sin cargo
    - Cancelación entre 12-24 horas: 50% del precio
    - Cancelación con menos de 12 horas: 100% del precio
*/

-- Agregar columna de fee de cancelación a servicios (porcentaje por defecto)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'cancellation_fee_percentage'
  ) THEN
    ALTER TABLE services ADD COLUMN cancellation_fee_percentage decimal(5,2) DEFAULT 50.00;
  END IF;
END $$;

-- Agregar columnas de fee a bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cancellation_fee'
  ) THEN
    ALTER TABLE bookings ADD COLUMN cancellation_fee decimal(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cancelled_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN cancelled_at timestamptz;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cancellation_reason'
  ) THEN
    ALTER TABLE bookings ADD COLUMN cancellation_reason text;
  END IF;
END $$;

-- Función para calcular el fee de cancelación
CREATE OR REPLACE FUNCTION calculate_cancellation_fee(
  p_booking_id uuid,
  p_cancellation_time timestamptz DEFAULT NOW()
)
RETURNS TABLE (
  fee_amount decimal,
  fee_percentage decimal,
  hours_until_booking decimal,
  can_cancel_free boolean
) AS $$
DECLARE
  v_booking_date date;
  v_start_time time;
  v_total_price decimal;
  v_booking_datetime timestamptz;
  v_hours_diff decimal;
  v_fee_percentage decimal;
  v_fee_amount decimal;
BEGIN
  -- Obtener información de la reserva
  SELECT 
    b.booking_date,
    b.start_time,
    b.total_price
  INTO 
    v_booking_date,
    v_start_time,
    v_total_price
  FROM bookings b
  WHERE b.id = p_booking_id;
  
  -- Calcular fecha y hora completa de la reserva
  v_booking_datetime := (v_booking_date::text || ' ' || v_start_time::text)::timestamptz;
  
  -- Calcular horas hasta la reserva
  v_hours_diff := EXTRACT(EPOCH FROM (v_booking_datetime - p_cancellation_time)) / 3600;
  
  -- Determinar porcentaje de fee según tiempo
  IF v_hours_diff > 24 THEN
    -- Más de 24 horas: sin cargo
    v_fee_percentage := 0;
    v_fee_amount := 0;
  ELSIF v_hours_diff > 12 THEN
    -- Entre 12 y 24 horas: 50% del precio
    v_fee_percentage := 50;
    v_fee_amount := v_total_price * 0.5;
  ELSE
    -- Menos de 12 horas: 100% del precio
    v_fee_percentage := 100;
    v_fee_amount := v_total_price;
  END IF;
  
  -- Retornar resultados
  RETURN QUERY SELECT 
    v_fee_amount::decimal,
    v_fee_percentage::decimal,
    v_hours_diff::decimal,
    (v_hours_diff > 24)::boolean;
END;
$$ LANGUAGE plpgsql;

-- Función para cancelar reserva con cálculo de fee
CREATE OR REPLACE FUNCTION cancel_booking_with_fee(
  p_booking_id uuid,
  p_cancellation_reason text DEFAULT NULL
)
RETURNS TABLE (
  success boolean,
  fee_charged decimal,
  message text
) AS $$
DECLARE
  v_fee_info RECORD;
  v_booking_status text;
BEGIN
  -- Verificar estado de la reserva
  SELECT status INTO v_booking_status
  FROM bookings
  WHERE id = p_booking_id;
  
  IF v_booking_status IS NULL THEN
    RETURN QUERY SELECT false, 0::decimal, 'Reserva no encontrada'::text;
    RETURN;
  END IF;
  
  IF v_booking_status NOT IN ('pending', 'confirmed') THEN
    RETURN QUERY SELECT false, 0::decimal, 'La reserva no puede ser cancelada'::text;
    RETURN;
  END IF;
  
  -- Calcular fee
  SELECT * INTO v_fee_info
  FROM calculate_cancellation_fee(p_booking_id);
  
  -- Actualizar reserva
  UPDATE bookings
  SET 
    status = 'cancelled',
    cancellation_fee = v_fee_info.fee_amount,
    cancelled_at = NOW(),
    cancellation_reason = p_cancellation_reason
  WHERE id = p_booking_id;
  
  -- Retornar resultado
  IF v_fee_info.fee_amount > 0 THEN
    RETURN QUERY SELECT 
      true,
      v_fee_info.fee_amount,
      format('Cancelación procesada. Fee aplicado: $%s (%s%%)', 
        v_fee_info.fee_amount::text, 
        v_fee_info.fee_percentage::text
      );
  ELSE
    RETURN QUERY SELECT 
      true,
      0::decimal,
      'Cancelación procesada sin cargo'::text;
  END IF;
END;
$$ LANGUAGE plpgsql;
