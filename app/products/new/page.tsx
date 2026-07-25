'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/app/components/ProductForm';

export default function NewProduct() {
  const router = useRouter();

  return (
    <div className="card form-card">
      <div className="page-heading">
        <div>
          <h2>Nuevo producto</h2>
          <p>Creá la ficha del insumo y, si corresponde, cargá su stock inicial.</p>
        </div>
      </div>
      <ProductForm onSave={async (values) => {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudo crear el producto.');
        router.push(`/products?created=${data.product?.id ?? 'ok'}`);
      }} />
    </div>
  );
}
