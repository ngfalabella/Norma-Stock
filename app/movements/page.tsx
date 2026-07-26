'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { StockMovement } from '@/app/types';

export default function MovementsHistory() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/movements').then(async (response) => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) throw new Error(data?.error || 'No se pudo cargar el historial.');
      setMovements(data);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => filter === 'all' ? movements : movements.filter((movement) => movement.type === filter), [filter, movements]);
  const formatDate = (value: string) => new Intl.DateTimeFormat('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(value));

  if (loading) return <div className="page-loading"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-card" /></div>;
  if (error) return <div className="alert-error" role="alert">{error}</div>;

  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">Trazabilidad</p><h1>Historial de movimientos</h1><p>Registro de todos los ingresos, egresos y ajustes.</p></div>
        <Link href="/movements/new" className="btn">＋ Nuevo movimiento</Link>
      </header>

      <div className="toolbar">
        <div />
        <select aria-label="Filtrar movimientos" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">Todos los movimientos</option><option value="in">Ingresos</option><option value="out">Egresos</option>
        </select>
      </div>

      <section className="card table-card">
        <div className="table-scroll">
          <table className="movements-table">
            <thead><tr><th>Fecha y hora</th><th>Producto</th><th>Movimiento</th><th>Cantidad</th><th>Stock resultante</th><th>Detalle</th></tr></thead>
            <tbody>
              {filtered.map((movement) => {
                const adjusted = movement.notes?.startsWith('Ajuste de inventario');
                return <tr key={movement.id}>
                  <td className="cell-date">{formatDate(movement.created_at)}</td>
                  <td><strong>{movement.product_name}</strong></td>
                  <td><span className={adjusted ? 'badge-info' : movement.type === 'in' ? 'badge-ok' : 'badge-alert'}>{adjusted ? 'Ajuste' : movement.type === 'in' ? 'Ingreso' : 'Egreso'}</span></td>
                  <td className="stock-value">{movement.type === 'in' ? '+' : '−'}{movement.quantity} <small>{movement.unit}</small></td>
                  <td>{movement.stock_after ?? '—'} {movement.stock_after != null ? movement.unit : ''}</td>
                  <td>{movement.notes || <span className="cell-subtitle">Sin detalle</span>}</td>
                </tr>;
              })}
              {!filtered.length && <tr><td colSpan={6} className="empty-state"><strong>No hay movimientos</strong><br />Los cambios de stock aparecerán acá.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
