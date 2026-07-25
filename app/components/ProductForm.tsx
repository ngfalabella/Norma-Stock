'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { PRODUCT_CATEGORIES, PRODUCT_UNITS, Product } from '@/app/types';

type Props = {
  product?: Product;
  onSave: (values: Record<string, string>) => Promise<void>;
};

export default function ProductForm({ product, onSave }: Props) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    category: product?.category ?? 'materia_prima',
    unit: product?.unit ?? 'kg',
    min_threshold: String(product?.min_threshold ?? ''),
    initial_stock: '0',
    sku: product?.sku ?? '',
    notes: product?.notes ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el producto.');
      setSubmitting(false);
    }
  };

  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <form onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}
      <div className="form-grid">
        <div className="field-span-2">
          <label htmlFor="product-name">Nombre *</label>
          <input id="product-name" required autoFocus value={form.name} onChange={(e) => update('name', e.target.value)}
            placeholder="Ej. Harina 0000" />
        </div>
        <div>
          <label htmlFor="product-category">Tipo *</label>
          <select id="product-category" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {Object.entries(PRODUCT_CATEGORIES).map(([value, label]) =>
              <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="product-unit">Unidad *</label>
          <select id="product-unit" value={form.unit} onChange={(e) => update('unit', e.target.value)}>
            {Object.entries(PRODUCT_UNITS).map(([value, label]) =>
              <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="product-minimum">Stock mínimo *</label>
          <input id="product-minimum" required type="number" min="0" step="0.001" inputMode="decimal" value={form.min_threshold}
            onChange={(e) => update('min_threshold', e.target.value)} placeholder="Ej. 2" />
        </div>
        {!product && (
          <div>
            <label htmlFor="product-initial">Stock inicial</label>
            <input id="product-initial" type="number" min="0" step="0.001" inputMode="decimal" value={form.initial_stock}
              onChange={(e) => update('initial_stock', e.target.value)} />
            <small>Se registrará como primer ingreso.</small>
          </div>
        )}
        <div>
          <label htmlFor="product-sku">Código interno</label>
          <input id="product-sku" value={form.sku} onChange={(e) => update('sku', e.target.value)} placeholder="Opcional" />
        </div>
        <div className="field-span-2">
          <label htmlFor="product-notes">Notas</label>
          <textarea id="product-notes" value={form.notes} onChange={(e) => update('notes', e.target.value)}
            placeholder="Marca preferida, proveedor, presentación, etc." rows={3} />
        </div>
      </div>
      {product && <p className="form-hint">El stock se modifica desde “Registrar movimiento” para conservar el historial.</p>}
      <div className="form-actions">
        <Link href="/products" className="btn-outline">Cancelar</Link>
        <button className="btn" disabled={submitting}>
          {submitting ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}
