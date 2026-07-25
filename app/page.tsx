'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/app/types';

function LoadingDashboard() {
  return <div className="page-loading" aria-label="Cargando resumen"><div className="skeleton skeleton-title" /><div className="metric-grid"><div className="skeleton skeleton-card" /><div className="skeleton skeleton-card" /><div className="skeleton skeleton-card" /></div><div className="skeleton skeleton-card" /></div>;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' }).then(async (response) => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) throw new Error(data?.error || 'La respuesta no es válida.');
      setProducts(data);
    }).catch((error) => setLoadError(error.message || 'No se pudo cargar el stock.'))
      .finally(() => setLoading(false));
  }, []);

  const alerts = useMemo(() => products
    .filter((product) => Number(product.current_stock) <= Number(product.min_threshold))
    .sort((a, b) => Number(a.current_stock) - Number(b.current_stock)), [products]);
  const outOfStock = alerts.filter((product) => Number(product.current_stock) <= 0).length;
  const healthy = products.length - alerts.length;

  const copyShoppingList = async () => {
    const text = `Lista de compras - Moka Pastelería\n\n${alerts.map((product) => {
      const missing = Math.max(0, Number(product.min_threshold) - Number(product.current_stock));
      return `☐ ${product.name} — faltan aprox. ${missing.toFixed(2)} ${product.unit}`;
    }).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return <LoadingDashboard />;
  if (loadError) return <div className="alert-error" role="alert"><strong>No se pudo cargar el stock.</strong><br />{loadError}<div className="alert-actions"><button className="btn-outline" onClick={() => window.location.reload()}>Reintentar</button></div></div>;

  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">Panel general</p><h1>Resumen de stock</h1><p>Estado actual del inventario de Moka Pastelería.</p></div>
        <Link href="/movements/new" className="btn">＋ Registrar movimiento</Link>
      </header>

      <section className="metric-grid" aria-label="Indicadores de stock">
        <article className="metric-card"><span className="metric-label">Productos activos</span><strong className="metric-value">{products.length}</strong><p className="metric-detail">Total en inventario</p></article>
        <article className="metric-card"><span className="metric-label">Stock saludable</span><strong className="metric-value">{healthy}</strong><p className="metric-detail">Por encima del mínimo</p></article>
        <article className="metric-card"><span className="metric-label">Requieren atención</span><strong className="metric-value">{alerts.length}</strong><p className="metric-detail">{outOfStock} agotados</p></article>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <div className="section-heading"><div><p className="eyebrow">Prioridad</p><h2>Productos para reponer</h2></div>{alerts.length > 0 && <span className="badge-alert">{alerts.length} pendientes</span>}</div>
          {alerts.length === 0 ? (
            <div className="empty-state"><strong>Todo está en orden</strong><p>No hay productos por debajo del stock mínimo.</p></div>
          ) : (
            <div className="alert-list">
              {alerts.map((product) => {
                const current = Number(product.current_stock);
                const minimum = Number(product.min_threshold);
                const percentage = minimum > 0 ? Math.max(0, Math.min(100, (current / minimum) * 100)) : 0;
                const critical = current <= 0;
                return <div className="alert-item" key={product.id}>
                  <div className="alert-row-head"><div><strong>{product.name}</strong><span className="cell-subtitle">{critical ? 'Agotado' : 'Stock por debajo del mínimo'}</span></div><span className={critical ? 'badge-alert' : 'badge-warning'}>{current} / {minimum} {product.unit}</span></div>
                  <div className="progress" aria-label={`${percentage.toFixed(0)} por ciento del mínimo`}><span className={critical ? 'critical' : ''} style={{ width: `${percentage}%` }} /></div>
                </div>;
              })}
            </div>
          )}
        </article>

        <aside className="card">
          <div className="section-heading"><div><p className="eyebrow">Accesos</p><h2>Acciones rápidas</h2></div></div>
          <div className="quick-actions">
            <Link href="/movements/new" className="btn">Registrar movimiento</Link>
            <Link href="/products/new" className="btn-outline">Agregar producto</Link>
            {alerts.length > 0 && <button className="btn-outline" onClick={copyShoppingList}>{copied ? '✓ Lista copiada' : 'Copiar lista de compras'}</button>}
          </div>
        </aside>
      </section>

      <section className="card table-card">
        <div className="section-heading table-section-heading"><div><p className="eyebrow">Inventario</p><h2>Vista rápida</h2></div><Link href="/products" className="btn-text">Ver todos →</Link></div>
        <div className="table-scroll"><table><thead><tr><th>Producto</th><th>Tipo</th><th>Stock actual</th><th>Estado</th></tr></thead><tbody>
          {products.slice(0, 6).map((product) => {
            const low = Number(product.current_stock) <= Number(product.min_threshold);
            return <tr key={product.id}><td><strong>{product.name}</strong></td><td>{product.category.replaceAll('_', ' ')}</td><td className="stock-value">{product.current_stock} <small>{product.unit}</small></td><td><span className={low ? 'badge-alert' : 'badge-ok'}>{low ? 'Reponer' : 'Disponible'}</span></td></tr>;
          })}
          {products.length === 0 && <tr><td colSpan={4} className="empty-state">Todavía no hay productos. <Link href="/products/new">Agregar el primero</Link></td></tr>}
        </tbody></table></div>
      </section>
    </>
  );
}
