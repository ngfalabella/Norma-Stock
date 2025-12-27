'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', unit: 'kg', min_threshold: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      router.push('/products'); // Volver al listado
      router.refresh();
    } else {
      alert('Error al crear, Ya lo creaste y ya existe salame');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <h2>📝 Definir Nuevo Insumo</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Aquí solo registras los datos del producto. Su stock inicial será <strong>0 {form.unit}</strong> hasta que registres una compra.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre del insumo</label>
          <input 
            type="text" 
            placeholder="Ej: Harina,Azucar o lo que quiera agregar " 
            required 
            autoFocus
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Unidad de Medida</label>
            <select 
              value={form.unit}
              onChange={e => setForm({...form, unit: e.target.value})}
              style={{ cursor: 'pointer' }}
            >
              <option value="kg">Kilogramos (kg)</option>
              <option value="g">Gramos (g)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="unidades">Unidades (u)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Alerta de Stock Mínimo</label>
            <input 
              type="number" 
              step="0.01" 
              placeholder="Ej: 5" 
              required 
              value={form.min_threshold}
              onChange={e => setForm({...form, min_threshold: e.target.value})}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
              Te avisaremos cuando haya menos de esta cantidad.
            </small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Link href="/products" className="btn-outline" style={{ textAlign: 'center', textDecoration: 'none', flex: 1 }}>
            Cancelar
          </Link>
          <button 
            type="submit" 
            className="btn" 
            style={{ flex: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Crear Ficha de Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}