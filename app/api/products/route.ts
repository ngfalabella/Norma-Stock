import { NextResponse } from 'next/server';
import { supabase } from '@/db/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? '').trim();
    const unit = String(body.unit ?? '').trim();
    const category = String(body.category ?? 'materia_prima');
    const minThreshold = Number(body.min_threshold);
    const initialStock = Number(body.initial_stock ?? 0);

    if (!name || !unit || !['materia_prima', 'packaging', 'otro'].includes(category) ||
        !Number.isFinite(minThreshold) || minThreshold < 0 ||
        !Number.isFinite(initialStock) || initialStock < 0) {
      return NextResponse.json({ error: 'Revisá el nombre, la unidad y las cantidades.' }, { status: 400 });
    }

    const { data: product, error } = await supabase.rpc('create_product_with_stock', {
      p_name: name,
      p_unit: unit,
      p_category: category,
      p_min_threshold: minThreshold,
      p_initial_stock: initialStock,
      p_sku: String(body.sku ?? '').trim() || null,
      p_notes: String(body.notes ?? '').trim() || null,
    });

    if (error) {
      const message = error.code === '23505'
        ? `Ya existe un producto activo llamado “${name}”. Podés editar el existente o usar otro nombre.`
        : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }
}
