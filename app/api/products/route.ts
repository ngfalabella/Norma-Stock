import { NextResponse } from 'next/server';
import { supabase } from '@/db/supabase'; // Asegurate de importar desde donde creaste el cliente

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, unit, min_threshold } = body;

  const { error } = await supabase
    .from('products')
    .insert([{ name, unit, min_threshold, current_stock: 0 }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}