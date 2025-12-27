import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificación de seguridad
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '🛑 ERROR CRÍTICO: Faltan las variables de entorno de Supabase.\n' +
    'Asegúrate de tener el archivo .env.local en la raíz del proyecto con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);