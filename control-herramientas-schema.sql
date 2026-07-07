-- ============================================================
--  Control de Herramientas · E.P.E.T N°7
--  Ejecutar en: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Tablas

CREATE TABLE IF NOT EXISTS profesor (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS alumno (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL,
  curso   VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS herramienta (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS retiro (
  id              SERIAL PRIMARY KEY,
  fecha_retiro    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_devolucion TIMESTAMPTZ,
  id_profesor     INT REFERENCES profesor(id) ON DELETE SET NULL,
  id_herramienta  INT REFERENCES herramienta(id) ON DELETE SET NULL,
  id_alumno       INT REFERENCES alumno(id) ON DELETE SET NULL
);

-- 2. Deshabilitar RLS (herramienta de uso interno escolar)

ALTER TABLE profesor    DISABLE ROW LEVEL SECURITY;
ALTER TABLE alumno      DISABLE ROW LEVEL SECURITY;
ALTER TABLE herramienta DISABLE ROW LEVEL SECURITY;
ALTER TABLE retiro      DISABLE ROW LEVEL SECURITY;

-- 3. Permisos para el rol anónimo (API pública del proyecto)

GRANT ALL ON profesor, alumno, herramienta, retiro TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. Datos de ejemplo (opcional, borrar si no los necesitás)

INSERT INTO profesor (nombre) VALUES
  ('García, Carlos'),
  ('López, María');

INSERT INTO alumno (nombre, curso) VALUES
  ('Rodríguez, Juan', '3° A'),
  ('Pérez, Lucía',    '3° A'),
  ('Gomez, Tomas',    '2° B');

INSERT INTO herramienta (nombre) VALUES
  ('Destornillador Phillips N°2'),
  ('Pinza de corte'),
  ('Multímetro digital'),
  ('Cautín 30W'),
  ('Pelacables');
