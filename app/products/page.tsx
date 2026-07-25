'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PRODUCT_CATEGORIES, Product } from '@/app/types';

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) throw new Error(data.error || 'Respuesta inválida.');
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = useMemo(() => products.filter((product) => {
    const matchesText = product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.sku ?? '').toLowerCase().includes(search.toLowerCase());
    return matchesText && (category === 'all' || product.category === category);
  }), [products, search, category]);

  const remove = async () => {
    if (!deleteTarget) return;
    const response = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) return alert(data.error || 'No se pudo eliminar.');
    setDeleteTarget(null);
    loadProducts();
  };

  if (loading) return <p>Cargando stock…</p>;
  if (error) return <div className="card form-error">{error} <button className="btn-outline" onClick={loadProducts}>Reintentar</button></div>;

  return (
    <div>
      <div className="page-heading">
        <div><p className="eyebrow">Inventario</p><h1>Productos e insumos</h1><p>{products.length} productos activos</p></div>
        <Link href="/products/new" className="btn">+ Agregar producto</Link>
      </div>
      <div className="toolbar">
        <input aria-label="Buscar productos" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o código…" />
        <select aria-label="Filtrar por tipo" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">Todos los tipos</option>
          {Object.entries(PRODUCT_CATEGORIES).map(([value, label]) =>
            <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="card table-card">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Producto</th><th>Tipo</th><th>Stock actual</th><th>Mínimo</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {filtered.map((product) => {
                const low = Number(product.current_stock) <= Number(product.min_threshold);
                return (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong>{product.sku && <small className="cell-subtitle">{product.sku}</small>}</td>
                    <td>{PRODUCT_CATEGORIES[product.category] ?? product.category}</td>
                    <td className="stock-value">{product.current_stock} <small>{product.unit}</small></td>
                    <td>{product.min_threshold} {product.unit}</td>
                    <td><span className={low ? 'badge-alert' : 'badge-ok'}>{low ? 'Stock bajo' : 'Disponible'}</span></td>
                    <td><div className="row-actions">
                      <Link className="btn-small" href={`/products/${product.id}/edit`}>Editar</Link>
                      <button className="btn-small danger" onClick={() => setDeleteTarget(product)}>Eliminar</button>
                    </div></td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={6} className="empty-state">No hay productos que coincidan.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {deleteTarget && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
        if (event.currentTarget === event.target) setDeleteTarget(null);
      }}>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <p className="eyebrow">Confirmación</p>
          <h2 id="delete-title">¿Dar de baja este producto?</h2>
          <p><strong>{deleteTarget.name}</strong> dejará de aparecer en el inventario. Su historial de movimientos se conservará.</p>
          <div className="modal-actions"><button className="btn-outline" autoFocus onClick={() => setDeleteTarget(null)}>Cancelar</button><button className="btn-danger" onClick={remove}>Dar de baja</button></div>
        </div>
      </div>}
    </div>
  );
}
