/*
  # Servicios de Consulta Online - Duraciones Actualizadas

  1. Cambios
    - Agregar servicios de consulta online con duraciones de 1 a 2 horas
    - Intervalos de 15 minutos (60, 75, 90, 105, 120 minutos)
    - Precios escalonados según duración

  2. Servicios
    - Consulta Online 1 hora - $80 USD
    - Consulta Online 1.25 horas - $95 USD
    - Consulta Online 1.5 horas - $110 USD
    - Consulta Online 1.75 horas - $125 USD
    - Consulta Online 2 horas - $140 USD
*/

-- Insertar servicios de consulta online con diferentes duraciones
INSERT INTO services (name, description, category, duration, price, is_active) VALUES
  (
    'Consulta Online 1 hora',
    'Sesión básica de Apertura Angelical Online con videoconferencia HD',
    'apertura_angelical',
    60,
    80.00,
    true
  ),
  (
    'Consulta Online 1.25 horas',
    'Sesión intermedia de Apertura Angelical Online con análisis detallado',
    'apertura_angelical',
    75,
    95.00,
    true
  ),
  (
    'Consulta Online 1.5 horas',
    'Sesión completa recomendada para lectura profunda y significativa',
    'apertura_angelical',
    90,
    110.00,
    true
  ),
  (
    'Consulta Online 1.75 horas',
    'Sesión extendida con tiempo para preguntas y reflexión personal',
    'apertura_angelical',
    105,
    125.00,
    true
  ),
  (
    'Consulta Online 2 horas',
    'Sesión completa con máxima transformación espiritual y análisis profundo',
    'apertura_angelical',
    120,
    140.00,
    true
  )
ON CONFLICT DO NOTHING;
