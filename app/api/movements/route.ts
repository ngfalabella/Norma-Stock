import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/db/supabase';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 });
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*, products(name, unit)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json((data ?? []).map((movement) => {
    const product = Array.isArray(movement.products) ? movement.products[0] : movement.products;
    return { ...movement, product_name: product?.name ?? 'Producto eliminado', unit: product?.unit ?? '' };
  }));
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 });
    const body = await req.json();
    const productId = Number(body.product_id);
    const quantity = Number(body.quantity);
    const type = String(body.type);

    if (!Number.isInteger(productId) || !['in', 'out', 'set'].includes(type) ||
        !Number.isFinite(quantity) || quantity < 0) {
      return NextResponse.json({ error: 'Revisá el producto, el tipo y la cantidad.' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('record_stock_movement', {
      p_product_id: productId,
      p_type: type,
      p_quantity: quantity,
      p_notes: String(body.notes ?? '').trim() || null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, movement: data });
  } catch (error: unknown) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Error inesperado.',
    }, { status: 500 });
  }
}
