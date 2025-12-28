'use client';

import { useEffect, useState } from 'react';

export default function MovementsHistory() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/movements')
      .then((res) => res.json())
      .then((data) => {
        setMovements(data);
        setLoading(false);
      });
  }, []);

  // Función para que la fecha se vea "humana" (Ej: 27/12/2025 14:30)
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Función para decidir el color y el texto de la etiqueta
  const renderTypeBadge = (type: string, notes: string | null) => {
    // Si la nota indica que fue un ajuste de inventario (el botón azul)
    if (notes && notes.includes('🔎')) {
      return <span className="badge-info">🔎 Ajuste / Recuento</span>;
    }

    if (type === 'in') {
      return <span className="badge-ok">🛒 Llegó Compra</span>;
    } else {
      return <span className="badge-alert">🍳 Se Usó</span>;
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Abriendo el registro...</p>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>📖 Libro Diario de Movimientos</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Aca queda registrado todo lo que entra y sale de la cocina.
        </p>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Cuándo pasó</th>
              <th>Insumo</th>
              <th>Acción</th>
              <th>Cantidad</th>
              <th>Notas / Detalles</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((mov) => (
              <tr key={mov.id}>
                {/* FECHA */}
                <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {formatDate(mov.created_at)}
                </td>

                {/* NOMBRE DEL PRODUCTO */}
                <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {mov.product_name}
                </td>

                {/* TIPO (Etiqueta de color) */}
                <td>
                  {renderTypeBadge(mov.type, mov.notes)}
                </td>

                {/* CANTIDAD */}
                <td style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  {mov.quantity} {mov.unit}
                </td>

                {/* NOTAS */}
                <td style={{ fontStyle: 'italic', color: '#888', fontSize: '0.9rem' }}>
                  {mov.notes || '-'}
                </td>
              </tr>
            ))}

            {movements.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Todavía no hay anotaciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}