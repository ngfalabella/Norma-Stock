import { NextResponse } from 'next/server';
import { supabase } from '@/db/supabase';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Supabase tiene "ON DELETE CASCADE", así que si borras el producto, 
  // se borran sus movimientos automáticamente.
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}