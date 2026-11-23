-- Kartooti: permisos para que el admin guarde eventos y puntos de interés
-- en las tablas que ya existen (eventos y puntos_interes).
-- Ejecutar en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.
-- No crea ni borra tablas, ni toca los datos.
--
-- Todos pueden LEER (la página es pública).
-- Solo un admin puede crear, editar o borrar: el rol se toma de la tabla
-- "Kartooti registros" (columna rol = 'admin'), igual que el login del panel.

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

-- ---------- puntos_interes ----------
alter table public.puntos_interes enable row level security;

grant select on table public.puntos_interes to anon, authenticated;
grant insert, update, delete on table public.puntos_interes to authenticated;

drop policy if exists "Todos pueden leer puntos_interes" on public.puntos_interes;
create policy "Todos pueden leer puntos_interes"
on public.puntos_interes for select
to anon, authenticated
using (true);

drop policy if exists "Solo admin crea puntos_interes" on public.puntos_interes;
create policy "Solo admin crea puntos_interes"
on public.puntos_interes for insert
to authenticated
with check ((select public.es_admin()));

drop policy if exists "Solo admin edita puntos_interes" on public.puntos_interes;
create policy "Solo admin edita puntos_interes"
on public.puntos_interes for update
to authenticated
using ((select public.es_admin()))
with check ((select public.es_admin()));

drop policy if exists "Solo admin borra puntos_interes" on public.puntos_interes;
create policy "Solo admin borra puntos_interes"
on public.puntos_interes for delete
to authenticated
using ((select public.es_admin()));
