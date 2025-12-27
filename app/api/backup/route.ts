import { NextResponse } from 'next/server';
import db from '@/db';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  // 1. Obtener estado completo
  const products = db.prepare('SELECT * FROM products').all();
  const movements = db.prepare('SELECT * FROM stock_movements').all();
  
  const backupData = JSON.stringify({ products, movements, date: new Date().toISOString() }, null, 2);
  const fileName = `backup_${Date.now()}.json`;

  // 2. Subir a Supabase
  const { error: uploadError } = await supabase.storage
    .from('backups')
    .upload(fileName, backupData, { contentType: 'application/json' });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  // 3. Rotación (Mantener solo los últimos 10)
  const { data: list } = await supabase.storage.from('backups').list();
  
  if (list && list.length > 10) {
    // Ordenar por nombre (que incluye timestamp) descendente
    const sorted = list.sort((a, b) => b.name.localeCompare(a.name));
    const toDelete = sorted.slice(10).map(x => x.name);
    
    if (toDelete.length > 0) {
      await supabase.storage.from('backups').remove(toDelete);
    }
  }

  return NextResponse.json({ success: true, file: fileName });
}