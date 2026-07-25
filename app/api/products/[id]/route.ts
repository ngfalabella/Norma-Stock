import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/db/supabase';

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Context) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 });
  const { id } = await params;
  const { data, error } = await supabase
    .from('products').select('*').eq('id', id).eq('is_active', true).single();

  if (error) return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: Context) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const name = String(body.name ?? '').trim();
  const unit = String(body.unit ?? '').trim();
  const category = String(body.category ?? 'materia_prima');
  const minThreshold = Number(body.min_threshold);

  if (!name || !unit || !['materia_prima', 'packaging', 'otro'].includes(category) ||
      !Number.isFinite(minThreshold) || minThreshold < 0) {
    return NextResponse.json({ error: 'Los datos del producto no son válidos.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      name,
      unit,
      category,
      min_threshold: minThreshold,
      sku: String(body.sku ?? '').trim() || null,
      notes: String(body.notes ?? '').trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id).eq('is_active', true).select().single();

  if (error) {
    const message = error.code === '23505'
      ? `Ya existe otro producto activo llamado “${name}”.`
      : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: Context) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 });
  const { id } = await params;
  const { error } = await supabase
    .from('products')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
