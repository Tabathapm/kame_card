import React, { useState } from 'react';
import { EncabezadoJuego } from './EncabezadoJuego';
import { ColeccionCartas } from './ColeccionCartas';
import { TiendaCartas } from './TiendaCartas';
import { PerfilUsuario } from './PerfilUsuario';
import { ArenasBatalla } from './ArenasBatalla';
import { MercadoCartas } from './MercadoCartas';

export const TableroJuego: React.FC = () => {
  const [pestanaActiva, setPestanaActiva] = useState('coleccion');

  const renderizarContenido = () => {
    switch (pestanaActiva) {
      case 'coleccion':
        return <ColeccionCartas />;
      case 'tienda':
        return <TiendaCartas />;
      case 'perfil':
        return <PerfilUsuario />;
      case 'batalla':
        return <ArenasBatalla />;
      case 'mercado':
        return <MercadoCartas />;
      default:
        return <ColeccionCartas />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      <EncabezadoJuego pestañaActiva={pestanaActiva} alCambiarPestaña={setPestanaActiva} />
      <main className="container mx-auto px-4 py-8">
        {renderizarContenido()}
      </main>
    </div>
  );
};