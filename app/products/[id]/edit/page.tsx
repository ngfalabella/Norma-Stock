'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/app/components/ProductForm';
import { Product } from '@/app/types';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProduct(data);
    }).catch((err) => setError(err.message || 'No se pudo cargar el producto.'));
  }, [id]);

  if (error) return <div className="card form-error">{error}</div>;
  if (!product) return <p>Cargando producto…</p>;

  return (
    <div className="card form-card">
      <div className="page-heading"><div><h2>Editar producto</h2><p>Actualizá los datos de la ficha.</p></div></div>
      <ProductForm product={product} onSave={async (values) => {
        const response = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudo actualizar el producto.');
        router.push('/products');
        router.refresh();
      }} />
    </div>
  );
}
