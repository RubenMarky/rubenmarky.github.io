-- ═══════════════════════════════════════════════════════════════
--  CONTROL DE HERRAMIENTAS · E.P.E.T N°7
--  Esquema COMPLETO de instalación (desde cero) · RLS habilitada
--  Incluye: herramienta (con categoría), alumno, profesor, retiro,
--           configuración, auditoría y perfil.
--
--  Ejecutar UNA sola vez en: Supabase → SQL Editor → New query →
--  pegar todo → Run. Es seguro re-ejecutarlo (usa IF NOT EXISTS,
--  ON CONFLICT y siembra de datos solo si las tablas están vacías).
-- ═══════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────
-- 1) HERRAMIENTA   (incluye la columna 'categoria')
-- ───────────────────────────────────────────────────────────────
create table if not exists public.herramienta (
  id        int generated always as identity primary key,
  nombre    varchar not null,
  categoria varchar                       -- rubro de la herramienta (opcional)
);

-- Migración: si la tabla ya existía sin la columna, la agrega sin tocar datos.
alter table public.herramienta add column if not exists categoria varchar;


-- ───────────────────────────────────────────────────────────────
-- 2) ALUMNO
-- ───────────────────────────────────────────────────────────────
create table if not exists public.alumno (
  id     int generated always as identity primary key,
  nombre varchar not null,
  curso  varchar
);


-- ───────────────────────────────────────────────────────────────
-- 3) PROFESOR
-- ───────────────────────────────────────────────────────────────
create table if not exists public.profesor (
  id     int generated always as identity primary key,
  nombre varchar not null
);


-- ───────────────────────────────────────────────────────────────
-- 4) RETIRO  (el préstamo: relaciona herramienta + alumno + profesor)
-- ───────────────────────────────────────────────────────────────
create table if not exists public.retiro (
  id               int generated always as identity primary key,
  fecha_retiro     timestamptz not null default now(),
  fecha_devolucion timestamptz,                          -- null = todavía no devuelto
  id_herramienta   int references public.herramienta(id) on delete cascade,
  id_alumno        int references public.alumno(id)      on delete cascade,
  id_profesor      int references public.profesor(id)    on delete set null
);

create index if not exists idx_retiro_devolucion  on public.retiro (fecha_devolucion);
create index if not exists idx_retiro_herramienta on public.retiro (id_herramienta);


-- ───────────────────────────────────────────────────────────────
-- 5) CONFIGURACION  (una sola fila, id = 1: branding y términos)
-- ───────────────────────────────────────────────────────────────
create table if not exists public.configuracion (
  id                 int primary key,
  nombre_institucion varchar not null default 'E.P.E.T N°7',
  tipo_control       varchar not null default 'Control de Herramientas',
  nombre_sector      varchar not null default 'Taller de Informática',
  termino_singular   varchar not null default 'herramienta',
  termino_plural     varchar not null default 'herramientas',
  actualizado        timestamptz default now()
);

-- Fila inicial (no se duplica si ya existe)
insert into public.configuracion (id) values (1)
  on conflict (id) do nothing;


-- ───────────────────────────────────────────────────────────────
-- 6) AUDITORIA  (registro de altas, bajas, ediciones, sesiones…)
-- ───────────────────────────────────────────────────────────────
create table if not exists public.auditoria (
  id            bigint generated always as identity primary key,
  fecha         timestamptz not null default now(),
  usuario_id    uuid,
  usuario_email varchar,
  accion        varchar not null,          -- ALTA, BAJA, EDICION, INGRESO, SALIDA, DEVOLUCION…
  entidad       varchar,                   -- herramienta, alumno, retiro, configuracion…
  entidad_id    varchar,
  detalle       text
);

create index if not exists idx_auditoria_fecha on public.auditoria (fecha desc);


-- ───────────────────────────────────────────────────────────────
-- 6.b) KEEP_ALIVE  (mantiene vivo el proyecto del plan gratuito)
-- ───────────────────────────────────────────────────────────────
-- Un programador externo (GitHub Action o cron-job.org) inserta un
-- registro cada pocos días. Esa escritura real reinicia el contador
-- de inactividad de Supabase (que pausa el proyecto tras 7 días).
-- El INSERT se hace con cuerpo {} : 'id' y 'ping' se completan solos.
create table if not exists public.keep_alive (
  id    bigint generated always as identity primary key,
  ping  timestamptz not null default now()
);


-- ───────────────────────────────────────────────────────────────
-- 7) PERFIL  (opcional)
-- ───────────────────────────────────────────────────────────────
-- La app lee el rol desde app_metadata.role (Authentication → Users),
-- NO de esta tabla. Queda disponible por si querés guardar el rol
-- también acá. Si no la necesitás, podés borrar este bloque.
create table if not exists public.perfil (
  id  uuid primary key references auth.users(id) on delete cascade,
  rol text not null default 'usuario'
);


-- ───────────────────────────────────────────────────────────────
-- 8) SEGURIDAD (RLS) — acceso solo para usuarios autenticados
-- ───────────────────────────────────────────────────────────────
-- El control de quién es admin lo hace la app según app_metadata.role.
-- Cualquier usuario logueado puede leer/escribir; nadie sin login.

alter table public.herramienta   enable row level security;
alter table public.alumno        enable row level security;
alter table public.profesor      enable row level security;
alter table public.retiro        enable row level security;
alter table public.configuracion enable row level security;
alter table public.auditoria     enable row level security;
alter table public.perfil        enable row level security;
alter table public.keep_alive    enable row level security;

-- Política general "acceso total para autenticados" en cada tabla.
do $$
declare t text;
begin
  foreach t in array array[
    'herramienta','alumno','profesor','retiro','configuracion','auditoria','perfil','keep_alive'
  ]
  loop
    execute format('drop policy if exists "%s_all" on public.%I;', t, t);
    execute format(
      'create policy "%s_all" on public.%I for all to authenticated using (true) with check (true);',
      t, t);
  end loop;
end $$;

-- Extra: permitir SOLO LECTURA anónima de la configuración, para que
-- el nombre de la institución y el título se muestren antes de iniciar
-- sesión (no expone datos sensibles). Comentá estas 2 líneas si no lo querés.
drop policy if exists "configuracion_anon_read" on public.configuracion;
create policy "configuracion_anon_read" on public.configuracion
  for select to anon using (true);

-- Keep-alive: el rol ANÓNIMO puede insertar y borrar SOLO en keep_alive
-- (es lo que usa el GitHub Action / cron externo con la clave anon).
-- No expone ningún dato real: la tabla solo guarda id + fecha de ping.
drop policy if exists "keep_alive_anon_insert" on public.keep_alive;
create policy "keep_alive_anon_insert" on public.keep_alive
  for insert to anon with check (true);

drop policy if exists "keep_alive_anon_delete" on public.keep_alive;
create policy "keep_alive_anon_delete" on public.keep_alive
  for delete to anon using (true);

-- Permisos de tabla (en proyectos Supabase suelen otorgarse solos, pero
-- desde 2026 conviene dejarlos explícitos para la Data API).
grant select                 on public.configuracion to anon;
grant select, insert, delete on public.keep_alive    to anon;


-- ───────────────────────────────────────────────────────────────
-- 9) DATOS DE EJEMPLO (opcional)
-- ───────────────────────────────────────────────────────────────
-- Se cargan SOLO si la tabla está vacía (seguro de re-ejecutar).
-- Para la carga completa de las 83 herramientas usá: seed_herramientas.sql

insert into public.profesor (nombre)
select v.nombre from (values
  ('García, Carlos'),
  ('López, María')
) as v(nombre)
where not exists (select 1 from public.profesor);

insert into public.alumno (nombre, curso)
select v.nombre, v.curso from (values
  ('Rodríguez, Juan', '3° A'),
  ('Pérez, Lucía',    '3° A'),
  ('Gomez, Tomas',    '2° B')
) as v(nombre, curso)
where not exists (select 1 from public.alumno);

insert into public.herramienta (nombre, categoria)
select v.nombre, v.categoria from (values
  ('Destornillador Phillips N°2', 'Herramientas de Mantenimiento'),
  ('Pinza de corte',              'Herramientas de Mantenimiento'),
  ('Multímetro digital',          'Herramientas de Mantenimiento'),
  ('Cautín 30W',                  'Herramientas de Mantenimiento'),
  ('Pelacables',                  'Herramientas de Mantenimiento')
) as v(nombre, categoria)
where not exists (select 1 from public.herramienta);


-- ═══════════════════════════════════════════════════════════════
--  NOTAS
-- ───────────────────────────────────────────────────────────────
--  • "keep-alive": en proyectos del plan gratuito de Supabase suele
--    usarse una tarea programada (pg_cron) para que el proyecto no se
--    pause por inactividad. Eso es de operación, no lo necesita la app
--    para funcionar, y depende de tu plan; por eso no se incluye acá.
--
--  • Si venías de la versión con RLS DESHABILITADA: este archivo la
--    HABILITA. A partir de ahora todo acceso a datos exige estar
--    logueado (que es justo lo que hace la app). El alta de usuarios
--    se hace desde la pestaña Usuarios o en Authentication → Users.
-- ═══════════════════════════════════════════════════════════════
