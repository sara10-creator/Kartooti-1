-- Kartooti: datos que edita el administrador (eventos, comidas y puntos de interés)
-- Ejecutar en Supabase → SQL Editor. Se puede ejecutar más de una vez.
--
-- Todos pueden LEER estas tablas (la página es pública).
-- Solo un admin puede crear, editar o borrar: el rol se toma de la tabla
-- "Kartooti registros" (columna rol = 'admin'), igual que el login del panel,
-- o de profiles.role = 'admin' como respaldo.

create or replace function public.es_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  resultado boolean := false;
begin
  if auth.uid() is null then
    return false;
  end if;

  if to_regclass('public."Kartooti registros"') is not null then
    execute 'select exists (select 1 from public."Kartooti registros" r
             where r.user_id::text = $1 and lower(trim(r.rol::text)) = ''admin'')'
      into resultado using auth.uid()::text;
    if resultado then
      return true;
    end if;
  end if;

  if to_regclass('public.profiles') is not null then
    execute 'select exists (select 1 from public.profiles p
             where p.id = $1 and lower(trim(p.role)) = ''admin'')'
      into resultado using auth.uid();
  end if;

  return coalesce(resultado, false);
end;
$$;

revoke all on function public.es_admin() from public;
grant execute on function public.es_admin() to anon, authenticated;


-- ---------- eventos ----------
create table if not exists public.eventos (
  id integer primary key,
  titulo text not null,
  categoria text,
  estado text,
  fecha date,
  dia text,
  mes text,
  fecha_texto text,
  hora text,
  lugar text,
  color text,
  descripcion text,
  medio text,
  actualizado_en timestamptz not null default now(),
  actualizado_por text
);

alter table public.eventos enable row level security;

grant select on table public.eventos to anon, authenticated;
grant insert, update, delete on table public.eventos to authenticated;

drop policy if exists "Todos pueden leer eventos" on public.eventos;
create policy "Todos pueden leer eventos"
on public.eventos for select
to anon, authenticated
using (true);

drop policy if exists "Solo admin crea eventos" on public.eventos;
create policy "Solo admin crea eventos"
on public.eventos for insert
to authenticated
with check ((select public.es_admin()));

drop policy if exists "Solo admin edita eventos" on public.eventos;
create policy "Solo admin edita eventos"
on public.eventos for update
to authenticated
using ((select public.es_admin()))
with check ((select public.es_admin()));

drop policy if exists "Solo admin borra eventos" on public.eventos;
create policy "Solo admin borra eventos"
on public.eventos for delete
to authenticated
using ((select public.es_admin()));

-- Datos iniciales (los mismos de data/eventos.json)
insert into public.eventos (id, titulo, categoria, estado, fecha, dia, mes, fecha_texto, hora, lugar, color, descripcion, medio) values
  (1, 'Congreso internacional', 'Académico', 'Publicado', '2026-08-25', '25', 'AGO', '25, 26 y 27 de agosto', '10:00 AM - 12:00 M', 'Aula máxima', 'primario', '', null),
  (2, 'Conferencia animar', 'Cultural', 'Publicado', '2026-05-19', '19', 'MAY', 'Contigo desde el primer semestre de septiembre', '1:00 PM', 'Aula especial XVII', 'verde', '', null),
  (3, 'Festival barranquilla', 'Cultural', 'Publicado', '2026-05-19', '19', 'MAY', '25 de agosto', '3:00 PM', 'Plaza Cervantes', 'amarillo', '', null),
  (4, 'Vitrina científica', 'Académico', 'Borrador', '2026-09-19', '19', 'SEP', '19 de septiembre', '9:00 AM - 5:00 PM', 'Auditorio mayor', 'primario', 'Muestra de proyectos científicos de estudiantes y docentes.', null),
  (5, 'Torneo de fútbol', 'Deportivo', 'Pendiente', '2026-09-15', '15', 'SEP', '15 de septiembre', '7:00 AM - 6:00 PM', 'Cancha norte', 'verde', '', null)
on conflict (id) do nothing;


-- ---------- comidas ----------
create table if not exists public.comidas (
  id integer primary key,
  nombre text not null,
  icono text,
  horario text,
  menu text,
  menu_texto text,
  edificio text,
  piso text,
  medio text,
  actualizado_en timestamptz not null default now(),
  actualizado_por text
);

alter table public.comidas enable row level security;

grant select on table public.comidas to anon, authenticated;
grant insert, update, delete on table public.comidas to authenticated;

drop policy if exists "Todos pueden leer comidas" on public.comidas;
create policy "Todos pueden leer comidas"
on public.comidas for select
to anon, authenticated
using (true);

drop policy if exists "Solo admin crea comidas" on public.comidas;
create policy "Solo admin crea comidas"
on public.comidas for insert
to authenticated
with check ((select public.es_admin()));

drop policy if exists "Solo admin edita comidas" on public.comidas;
create policy "Solo admin edita comidas"
on public.comidas for update
to authenticated
using ((select public.es_admin()))
with check ((select public.es_admin()));

drop policy if exists "Solo admin borra comidas" on public.comidas;
create policy "Solo admin borra comidas"
on public.comidas for delete
to authenticated
using ((select public.es_admin()));

-- Datos iniciales (los mismos de data/comidas.json)
insert into public.comidas (id, nombre, icono, horario, menu, menu_texto, edificio, piso, medio) values
  (1, 'Café leyenda', '☕', '7:00 AM - 7:00 PM', 'menu-cafe-leyenda.jpg', 'Este establecimiento no cuenta con un menú. Acércate al mismo para ver su oferta. Precio promedio: 5k - 10k.', 'Exterior', '1', null),
  (2, 'Hamburguesa', '🍔', '1:00 PM - 8:00 PM', 'menu-hamburguesa.jpg', null, 'Zona de comidas', '1', null),
  (3, 'Taco más', '🌮', '12 M - 8:00 PM', 'menu-no-disponible.jpg', null, 'Zona de comidas', '1', null),
  (5, 'Pizzagram', '🍕', '1:00 PM - 7:00 PM', 'menu-pizzagram.jpg', null, 'Zona de comidas', '1', null),
  (6, 'Restaurante', '🍴', '7:00 AM - 7:00 PM', 'menu-restaurante.jpg', null, 'Bloque central', '1', null),
  (7, 'Carrito de café', '☕', '6:00 AM - 7:00 PM', 'menu-carrito-cafe.jpg', 'Este establecimiento no cuenta con un menú. Acércate al mismo para ver su oferta. Precio promedio: 4k - 8k.', 'Entrada principal', '1', null)
on conflict (id) do nothing;


-- ---------- puntos ----------
create table if not exists public.puntos (
  id integer primary key,
  nombre text not null,
  tipo text,
  edificio text,
  piso text,
  estado text,
  descripcion text,
  medio text,
  actualizado_en timestamptz not null default now(),
  actualizado_por text
);

alter table public.puntos enable row level security;

grant select on table public.puntos to anon, authenticated;
grant insert, update, delete on table public.puntos to authenticated;

drop policy if exists "Todos pueden leer puntos" on public.puntos;
create policy "Todos pueden leer puntos"
on public.puntos for select
to anon, authenticated
using (true);

drop policy if exists "Solo admin crea puntos" on public.puntos;
create policy "Solo admin crea puntos"
on public.puntos for insert
to authenticated
with check ((select public.es_admin()));

drop policy if exists "Solo admin edita puntos" on public.puntos;
create policy "Solo admin edita puntos"
on public.puntos for update
to authenticated
using ((select public.es_admin()))
with check ((select public.es_admin()));

drop policy if exists "Solo admin borra puntos" on public.puntos;
create policy "Solo admin borra puntos"
on public.puntos for delete
to authenticated
using ((select public.es_admin()));

-- Datos iniciales (los mismos de data/puntos.json)
insert into public.puntos (id, nombre, tipo, edificio, piso, estado, descripcion, medio) values
  (1, 'Lab. física mecánica', 'Laboratorio', 'Sótanos', '0', 'Activo', '', null),
  (2, 'Aula máxima', 'Auditorio', 'Exterior', '1', 'Activo', '', null),
  (3, 'C110', 'Salón', 'Bloque C', '1', 'Inactivo', '', null),
  (4, 'Café leyenda', 'Cafetería', 'Exterior', '1', 'Activo', '', null),
  (5, 'Salón E510', 'Salón', 'Bloque E', '5', 'Pendiente', '', null)
on conflict (id) do nothing;
