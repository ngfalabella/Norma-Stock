'use client';

import { useEffect, useRef } from 'react';

type Theme = 'dark' | 'light' | 'wine';

const isTheme = (value: string | null): value is Theme =>
  value === 'dark' || value === 'light' || value === 'wine';

export default function ThemeSelector() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const compactMenuRef = useRef<HTMLDetailsElement>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('norma-stock-theme');
    const initialTheme = isTheme(savedTheme) ? savedTheme : 'dark';
    document.documentElement.dataset.theme = initialTheme;
    if (selectRef.current) selectRef.current.value = initialTheme;
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const changeTheme = (nextTheme: Theme) => {
    const root = document.documentElement;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-transition');
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 500);
    }
    root.dataset.theme = nextTheme;
    localStorage.setItem('norma-stock-theme', nextTheme);
    if (selectRef.current) selectRef.current.value = nextTheme;
    compactMenuRef.current?.removeAttribute('open');
  };

  return (
    <div className="theme-control">
      <label htmlFor="theme-selector" className="theme-label">Apariencia</label>
      <select
        id="theme-selector"
        ref={selectRef}
        className="theme-select"
        defaultValue="dark"
        onChange={(event) => changeTheme(event.target.value as Theme)}
        aria-label="Seleccionar tema visual"
      >
        <option value="dark">🌙 Oscuro</option>
        <option value="light">☀️ Claro beige</option>
        <option value="wine">🍰 Beige y bordó</option>
      </select>
      <details className="theme-compact" ref={compactMenuRef}>
        <summary aria-label="Cambiar apariencia" title="Cambiar apariencia">🎨</summary>
        <div className="theme-popover" role="group" aria-label="Elegir apariencia">
          <p>Elegí una apariencia</p>
          <button type="button" onClick={() => changeTheme('dark')}>
            <span aria-hidden="true">🌙</span><span><strong>Oscuro</strong><small>Negro y lavanda</small></span>
          </button>
          <button type="button" onClick={() => changeTheme('light')}>
            <span aria-hidden="true">☀️</span><span><strong>Claro beige</strong><small>Beige y bordó</small></span>
          </button>
          <button type="button" onClick={() => changeTheme('wine')}>
            <span aria-hidden="true">🍰</span><span><strong>Beige y bordó</strong><small>Beige cálido y menú bordó</small></span>
          </button>
        </div>
      </details>
    </div>
  );
}
