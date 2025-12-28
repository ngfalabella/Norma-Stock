'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFala, setShowFala] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // --- LÓGICA INTELIGENTE ---
  // 1. Filtrar productos con problemas
  const alerts = products
    .filter(p => p.current_stock <= p.min_threshold)
    .sort((a, b) => {
      // 2. Ordenar por urgencia:
      // Primero los agotados (<=0), luego los que tienen menor % de stock restante
      const ratioA = a.current_stock / a.min_threshold;
      const ratioB = b.current_stock / b.min_threshold;
      return ratioA - ratioB;
    });

  // Función para copiar la lista de faltantes al portapapeles
  const copyShoppingList = () => {
    if (alerts.length === 0) return alert('¡No hay nada que comprar!');

    const text = "🛒 *Lista de Compras - Pastelería*\n\n" +
      alerts.map(p => {
        // Calculamos cuánto falta para llegar al mínimo ideal (opcional, o solo listar)
        const missing = Math.max(0, p.min_threshold - p.current_stock).toFixed(2);
        return `- [ ] ${p.name} (Faltan aprox ${missing} ${p.unit})`;
      }).join('\n');

    navigator.clipboard.writeText(text);
    alert('✅ Lista copiada. ¡Pegala en WhatsApp!');
  };

  if (loading) return <p style={{ padding: '40px', color: 'var(--text-muted)' }}>Analizando stock...</p>;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>STOCK</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Resumen de lo que tenes actualmente.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', marginBottom: '40px' }}>

        {/* --- TARJETA 1: ALERTAS PRIORIZADAS --- */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ textAlign:'center',margin: 0, display: 'flex', alignItems: 'center', justifyContent:'center', gap: '10px', fontSize: '1.1rem' }}>
              ⚠️ Atención Necesaria
              {alerts.length > 0 && (
                <span style={{
                  background: 'var(--danger-text)', color: '#121212',
                  fontSize: '0.8rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold'
                }}>
                  {alerts.length}
                </span>
              )}
            </h3>
          </div>

          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--success-text)', opacity: 0.8 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>✨</div>
              <p style={{ fontWeight: 500, margin: '0 0 5px 0' }}>¡Todo perfecto!</p>
              <span style={{ fontSize: '0.85rem' }}>No tenes faltantes por ahora.</span>

              <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* BOTÓN TRAMPA */}
                <button
                  onClick={() => {
                    // 1. El reto
                    alert("para que haces click micaela, si no vas a regalar nada");

                    // 2. Mostrar la foto
                    setShowFala(true);

                    // 3. Programar que se oculte en 10 segundos (10000 milisegundos)
                    setTimeout(() => {
                      setShowFala(false);
                    }, 5000);
                  }}
                  // ... (el resto de tus estilos style={{...}} déjalos igual) ...
                  style={{
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-poppins)',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s ease',
                    marginBottom: '20px',
                    display:"none"
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  🎁 Hacer Regalo a Fala
                </button>

                {/* IMAGEN OCULTA (Solo aparece si showFala es true) */}
                {showFala && (
                  <div style={{ animation: 'fadeIn 1s ease' }}>
                    {/* Asegurate de tener una foto llamada 'fala.jpg' en la carpeta public */}
                    <img
                      src="/mono.png"
                      alt="Fala juzgandote"
                      style={{
                        width: '100px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        border: '3px solid white'
                      }}
                    />
                    <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#F59E0B' }}>
                      (Deja de boludear)
                    </p>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              {alerts.map(p => {
                // Cálculo visual barra (0 a 100%)
                const percentage = Math.max(0, Math.min(100, (p.current_stock / p.min_threshold) * 100));
                const isCritical = p.current_stock <= 0;

                return (
                  <div key={p.id} className="alert-item">
                    {/* Encabezado del item */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {p.name}
                      </span>
                      <span style={{
                        fontSize: '0.85rem',
                        color: isCritical ? 'var(--danger-text)' : 'var(--text-muted)',
                        fontWeight: isCritical ? 700 : 500
                      }}>
                        {p.current_stock} / {p.min_threshold} <small>{p.unit}</small>
                      </span>
                    </div>

                    {/* Barra de Progreso */}
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: isCritical ? 'var(--danger-text)' : '#F59E0B',
                        borderRadius: '10px',
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}></div>
                    </div>

                    {/* Mensaje de estado */}
                    <div style={{ fontSize: '0.75rem', marginTop: '6px', color: 'rgba(255,255,255,0.4)' }}>
                      {isCritical ? '🛑 Agotado - Reponer ' : '📉 Stock bajo'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- TARJETA 2: ACCIONES RÁPIDAS --- */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem' }}>🚀 Acciones Rápidas</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '25px' }}>
            Accesos directos para mantener el orden.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link href="/movements/new" className="btn" style={{ justifyContent: 'center', fontSize: '1rem', padding: '16px' }}>
              ✍️ Registrar Movimiento de Stock
            </Link>

            <Link href="/products/new" className="btn-outline" style={{ justifyContent: 'center', padding: '16px' }}>
              📦 Registrar Nuevo Producto
            </Link>

            {/* BOTÓN MÁGICO PARA ORDENADOS */}
            {alerts.length > 0 && (
              <button
                onClick={copyShoppingList}
                className="btn-outline"
                style={{
                  justifyContent: 'center',
                  padding: '16px',
                  borderColor: '#F59E0B',
                  color: '#F59E0B',
                  marginTop: '10px'
                }}
              >
                📋 Copiar Lista de Compras
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- TABLA RESUMEN COMPLETO --- */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Inventario General</h3>
          <Link href="/products" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none' }}>
            Ver todo &rarr;
          </Link>
        </div>

        <table style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: '20px' }}>Insumo</th>
              <th>Estado Actual</th>
              <th>Disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            {/* Mostramos solo los primeros 5 para no saturar el dashboard */}
            {products.slice(0, 5).map(p => {
              const isLow = p.current_stock <= p.min_threshold;
              return (
                <tr key={p.id}>
                  <td style={{ paddingLeft: '20px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ fontFamily: 'var(--font-inter)' }}>
                    {p.current_stock} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.unit}</span>
                  </td>
                  <td>
                    {isLow ? (
                      <span className="badge-alert">Bajo</span>
                    ) : (
                      <span className="badge-ok">Normal</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}