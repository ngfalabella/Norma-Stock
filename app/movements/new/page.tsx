'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/types';

export default function NewMovement() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ product_id: '', type: 'out', quantity: '', notes: '' });

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' }).then(async (response) => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) throw new Error(data?.error || 'No se pudieron cargar los productos.');
      setProducts(data);
      const requested = new URLSearchParams(window.location.search).get('product');
      if (requested && data.some((product: Product) => String(product.id) === requested)) {
        setForm((current) => ({ ...current, product_id: requested }));
      }
    }).catch((error) => setLoadError(error.message));
  }, []);

  const selected = products.find((product) => product.id === Number(form.product_id));
  const labels = {
    in: { title: 'Ingreso de stock', quantity: 'Cantidad que ingresó', help: 'Sumará unidades al stock actual.' },
    out: { title: 'Egreso de stock', quantity: 'Cantidad utilizada', help: 'Descontará unidades del stock actual.' },
    set: { title: 'Ajuste por recuento', quantity: 'Stock real contado', help: 'Reemplazará el stock actual por esta cantidad.' },
  }[form.type]!;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/movements', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo registrar el movimiento.');
      router.push('/movements');
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo conectar.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="page-heading"><div><p className="eyebrow">Inventario</p><h1>Registrar movimiento</h1><p>Actualizá el stock y guardá el cambio en el historial.</p></div></header>
      <section className="card form-card">
        {loadError && <div className="form-error" role="alert">{loadError}</div>}
        {submitError && <div className="form-error" role="alert">{submitError}</div>}
        <form onSubmit={submit}>
          <label id="movement-type-label">Tipo de movimiento</label>
          <div className="segmented-control" role="group" aria-labelledby="movement-type-label">
            {(['out', 'in', 'set'] as const).map((type) => <button key={type} type="button"
              className={`segment ${type} ${form.type === type ? 'active' : ''}`}
              aria-pressed={form.type === type}
              onClick={() => setForm({ ...form, type })}>
              {type === 'out' ? 'Egreso' : type === 'in' ? 'Ingreso' : 'Ajuste'}
            </button>)}
          </div>
          <p className="form-hint segment-help">{labels.help}</p>

          <label htmlFor="product">Producto</label>
          <select id="product" required value={form.product_id}
            onChange={(event) => setForm({ ...form, product_id: event.target.value })}>
            <option value="" disabled>Seleccioná un producto</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>

          {selected && <div className="stock-context"><span>Stock registrado</span><strong>{selected.current_stock} {selected.unit}</strong></div>}

          <label htmlFor="quantity">{labels.quantity}</label>
          <div className="quantity-control">
            <input id="quantity" type="number" min="0" step="0.001" inputMode="decimal" required value={form.quantity}
              onChange={(event) => setForm({ ...form, quantity: event.target.value })} placeholder="0" />
            {selected && <span className="badge-info">{selected.unit}</span>}
          </div>

          <label htmlFor="notes">Nota <small>(opcional)</small></label>
          <textarea id="notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })}
            placeholder={`Detalle de ${labels.title.toLowerCase()}…`} rows={3} />

          <div className="form-actions"><Link href="/products" className="btn-outline">Cancelar</Link><button className="btn" disabled={submitting || !!loadError}>{submitting ? 'Guardando…' : 'Confirmar movimiento'}</button></div>
        </form>
      </section>
    </>
  );
}
