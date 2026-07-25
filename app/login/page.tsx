'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('El correo o la contraseña no son correctos.');
      setLoading(false);
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <div className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <Image src="/image.png" width={72} height={72} alt="" className="login-logo" priority />
          <h1 id="login-title">Norma Cakes</h1>
          <p>Ingresá para gestionar el inventario</p>
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" autoComplete="email" required value={email}
            onChange={(event) => setEmail(event.target.value)} placeholder="nombre@correo.com" />
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" required value={password}
            onChange={(event) => setPassword(event.target.value)} placeholder="Ingresá tu contraseña" />
          <button type="submit" className="btn login-submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </section>
    </div>
  );
}
