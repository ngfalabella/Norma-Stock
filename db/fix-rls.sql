-- Reparación de permisos RLS para Norma Stock.
-- Ejecutar en Supabase > SQL Editor con el botón Run.

begin;

alter table public.products enable row level security;
alter table public.stock_movements enable row level security;

drop policy if exists "Authenticated users manage products" on public.products;
create policy "Authenticated users manage products"
on public.products
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users manage movements" on public.stock_movements;
create policy "Authenticated users manage movements"
on public.stock_movements
for all
to authenticated
using (true)
with check (true);

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.products to authenticated;
grant select, insert, update, delete on table public.stock_movements to authenticated;
grant usage, select on all sequences in schema public to authenticated;

revoke all on function public.record_stock_movement(bigint, text, numeric, text)
from public, anon;
grant execute on function public.record_stock_movement(bigint, text, numeric, text)
to authenticated;

revoke all on function public.create_product_with_stock(text, text, text, numeric, numeric, text, text)
from public, anon;
grant execute on function public.create_product_with_stock(text, text, text, numeric, numeric, text, text)
to authenticated;

commit;

notify pgrst, 'reload schema';

-- El resultado debe mostrar dos filas, una para cada tabla.
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('products', 'stock_movements')
order by tablename, policyname;
