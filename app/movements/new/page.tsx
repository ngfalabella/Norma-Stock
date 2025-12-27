'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMovement() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  // type ahora puede ser 'set' (Ajuste)
  const [form, setForm] = useState({ product_id: '', type: 'out', quantity: '', notes: '' });

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_id) return alert('Elegí un insumo de la lista.');
    
    try {
      const res = await fetch('/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Hubo un error al anotar.');
        return; 
      }
      router.push('/');
      router.refresh(); 
    } catch (error) {
      alert('Error de conexión.');
    }
  };

  const selectedProduct = products.find(p => p.id === Number(form.product_id));

  // Lógica de textos amigables según la acción
  let labelCantidad = "Cantidad";
  if (form.type === 'in') labelCantidad = "¿Cuánto compraste?";
  if (form.type === 'out') labelCantidad = "¿Cuánto usaste?";
  if (form.type === 'set') labelCantidad = "¿Cuánto hay REALMENTE en tu casa?";

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>📝 Registrar Movimiento de Stock </h2>
      <form onSubmit={handleSubmit}>
        
        <label>¿Qué vas a hacer?</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button" 
            className="btn" 
            style={{ flex: 1, background: form.type === 'out' ? 'var(--danger)' : '#333', opacity: form.type === 'out' ? 1 : 0.6 }}
            onClick={() => setForm({...form, type: 'out'})}
          >
            Egreso
          </button>
          <button 
            type="button" 
            className="btn" 
            style={{ flex: 1, background: form.type === 'in' ? 'var(--success)' : '#333', opacity: form.type === 'in' ? 1 : 0.6 }}
            onClick={() => setForm({...form, type: 'in'})}
          >
            Ingreso
          </button>
          <button 
            type="button" 
            className="btn" 
            style={{ flex: 1, background: form.type === 'set' ? '#00bcd4' : '#333', opacity: form.type === 'set' ? 1 : 0.6 }}
            onClick={() => setForm({...form, type: 'set'})}
            title="Usar esto para corregir stock manual"
          >
            Ajuste
          </button>
        </div>

        <label>Elegí el Insumo</label>
        <select 
          required 
          onChange={e => setForm({...form, product_id: e.target.value})}
          defaultValue=""
          style={{ padding: '15px', fontSize: '1.1rem' }} // Más grande para ver mejor
        >
          <option value="" disabled>-- Toca para buscar --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} (Sistema dice: {p.current_stock} {p.unit})</option>
          ))}
        </select>

        <label style={{ marginTop: '15px', display: 'block' }}>{labelCantidad}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            required 
            style={{ fontSize: '1.5rem', padding: '10px' }} // Input gigante para que no cueste leer
            onChange={e => setForm({...form, quantity: e.target.value})}
          />
          <span style={{ fontSize: '1.2rem', color: '#888' }}>
            {selectedProduct ? selectedProduct.unit : ''}
          </span>
        </div>

        <label>Nota (Opcional)</label>
        <input 
          type="text" 
          placeholder="Ej: Regalo Mousse Para Fala" 
          onChange={e => setForm({...form, notes: e.target.value})}
        />

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '20px', padding: '15px', fontSize: '1.1rem' }}>
          ✅ Confirmar y Guardar
        </button>
      </form>
    </div>
  );
}