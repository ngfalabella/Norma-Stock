'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr'; // Usamos el cliente para navegador
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Creamos el cliente de supabase solo para el login
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('❌ Error: Datos incorrectos');
      setLoading(false);
    } else {
      // Si todo sale bien, recargamos para que el middleware nos deje pasar
      router.push('/');
      router.refresh(); 
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#121212',
      color: '#F3F4F6',
      fontFamily: 'var(--font-inter)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#1E1E1E',
        borderRadius: '12px',
        border: '1px solid #333',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="./image.png" className='w-[100px] h-[100px] rounded-full' />
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: '1.5rem', margin: 0 }}>Norma Cakes</h1>       
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="micaela@pasteleria.com"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333',
                backgroundColor: '#2A2A2A', color: 'white', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333',
                backgroundColor: '#2A2A2A', color: 'white', outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: '10px', padding: '14px', borderRadius: '8px', border: 'none',
              backgroundColor: '#8B5CF6', color: 'white', fontWeight: 'bold', cursor: 'pointer',
              fontFamily: 'var(--font-poppins)', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}