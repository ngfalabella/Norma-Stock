export type Product = {
  id: number;
  name: string;
  unit: string;
  current_stock: number;
  min_threshold: number;
  category: string;
  sku: string | null;
  notes: string | null;
};

export type StockMovement = {
  id: number;
  product_id: number;
  product_name: string;
  unit: string;
  type: 'in' | 'out';
  quantity: number;
  notes: string | null;
  stock_before: number | null;
  stock_after: number | null;
  created_at: string;
};

export const PRODUCT_CATEGORIES: Record<string, string> = {
  materia_prima: 'Materia prima',
  packaging: 'Packaging',
  otro: 'Otro',
};

export const PRODUCT_UNITS: Record<string, string> = {
  kg: 'Kilogramos (kg)',
  g: 'Gramos (g)',
  l: 'Litros (l)',
  ml: 'Mililitros (ml)',
  unidades: 'Unidades',
  paquetes: 'Paquetes',
  cajas: 'Cajas',
};
