'use client';

import { useState, useEffect } from 'react';

export default function BackupReminder() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Configurar el intervalo para que se ejecute cada 1 minuto (60,000 ms)
    const interval = setInterval(() => {
      setShow(false);

      // Ocultar automáticamente después de 10 segundos (10,000 ms)
      setTimeout(() => {
        setShow(false);
      }, 10000);

    }, 1200000);

    // Limpieza al desmontar (por si acaso)
    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className="toast-notification flex flex-row items-center">
      <img
        src="/backup.png"
        alt="backup"
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover'
        }}
      />
      <div className='flex flex-col'>
       <p> ⚠️ Acordate de forzar respaldo Micaela </p>
        <p> Si no lo haces , queda guardado solamente en tu Pc</p>
      </div>
     
    </div>
  );
}