'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Nuevos estados para Filtro y Orden
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const router = useRouter();

  const fetchProducts = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!id) return;
    if (!confirm('¿Seguro que quieres borrar este insumo?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
        return;
      }
      fetchProducts();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  // 2. Lógica de Ordenamiento (Click en columnas)
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    // Si ya estamos ordenando por esta columna y es ascendente, lo cambiamos a descendente
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 3. Procesamiento de datos (Filtrar -> Ordenar)
  const processedProducts = useMemo(() => {
    // A. Copiamos los productos para no mutar el estado original
    let result = [...products];

    // B. Filtrar por nombre
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // C. Ordenar
    if (sortConfig) {
      result.sort((a, b) => {
        // Obtenemos los valores a comparar
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Si es texto, lo normalizamos a minúsculas para ordenar bien
        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();

        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [products, searchTerm, sortConfig]);

  // Helper para mostrar la flechita
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return '↕️'; // Icono neutral
    return sortConfig.direction === 'asc' ? '⬆️' : '⬇️';
  };

  if (loading) return <p>Cargando insumos...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2>Mis Insumos</h2>
        
        {/* INPUT DE BUSQUEDA */}
        <input 
          type="text" 
          placeholder="🔍 Buscar por nombre..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px', margin: 0 }} // Override del estilo global para que no ocupe todo
        />

        <Link href="/products/new" className="btn">
          + Nuevo Insumo
        </Link>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              {/* COLUMNAS ORDENABLES */}
              <th 
                onClick={() => handleSort('name')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click para ordenar"
              >
                Nombre {getSortIcon('name')}
              </th>
              
              <th 
                onClick={() => handleSort('unit')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Unidad {getSortIcon('unit')}
              </th>
              
              <th 
                onClick={() => handleSort('current_stock')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Stock {getSortIcon('current_stock')}
              </th>
              
              <th>Mínimo</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {processedProducts.map((product) => (
              <tr key={product.id}>
                <td style={{ fontWeight: 'bold' }}>{product.name}</td>
                <td>{product.unit}</td>
                <td>
                  <span className={product.current_stock <= product.min_threshold ? 'alert-row' : ''}>
                    {product.current_stock}
                  </span>
                </td>
                <td>{product.min_threshold}</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="btn-outline"
                    style={{ border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '0.8rem', padding: '5px 10px' }}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
            {processedProducts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                  {searchTerm ? 'No se encontraron productos con ese nombre.' : 'No hay insumos registrados aún.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}