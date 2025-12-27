import { NextResponse } from 'next/server';
import { supabase } from '@/db/supabase';

export async function GET() {
  // Traemos los movimientos e incluimos el nombre del producto relacionado
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*, products(name, unit)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Aplanamos la estructura para que el frontend no se rompa (Supabase devuelve { products: {name: ...} })
  const formattedData = data.map((m: any) => ({
    ...m,
    product_name: m.products?.name,
    unit: m.products?.unit
  }));

  return NextResponse.json(formattedData);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { product_id, type, quantity, notes } = body;
    const qty = Number(quantity);

    // 1. Obtener Stock Actual (Consultamos el producto)
    const { data: product, error: prodError } = await supabase
      .from('products')
      .select('current_stock')
      .eq('id', product_id)
      .single();

    if (prodError || !product) throw new Error('Producto no encontrado');
    const currentStock = Number(product.current_stock);

    // 2. Lógica de Ajuste (SET)
    if (type === 'set') {
      const difference = qty - currentStock;
      if (difference === 0) return NextResponse.json({ success: true });
      if (difference > 0) {
        type = 'in';
        quantity = difference;
        notes = `🔎 Ajuste: Faltaba cargar ${quantity}`;
      } else {
        type = 'out';
        quantity = Math.abs(difference);
        notes = `🔎 Ajuste: Sobraba en sistema`;
      }
    } 
    // 3. Validación de Salida
    else if (type === 'out') {
      if (qty > currentStock) {
        return NextResponse.json({ error: `No tenes tanto Stock salame. Fijate bien que Hay ${currentStock}.` }, { status: 400 });
      }
    }

    // 4. Insertar Movimiento
    const { error: moveError } = await supabase
      .from('stock_movements')
      .insert([{ product_id, type, quantity: Number(quantity), notes }]);

    if (moveError) throw moveError;

    // 5. Actualizar Stock en Producto (Calculamos el nuevo total)
    let newStock = currentStock;
    if (type === 'in') newStock += Number(quantity);
    else newStock -= Number(quantity);

    const { error: updateError } = await supabase
      .from('products')
      .update({ current_stock: newStock })
      .eq('id', product_id);

    if (updateError) throw updateError;
    
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}