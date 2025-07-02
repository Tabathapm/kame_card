import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Coins, User, LogOut, Trophy, ShoppingBag, Sword, Users } from 'lucide-react';

interface PropsEncabezadoJuego {
  pestañaActiva: string;
  alCambiarPestaña: (pestaña: string) => void;
}

export const EncabezadoJuego: React.FC<PropsEncabezadoJuego> = ({ pestañaActiva, alCambiarPestaña }) => {
  const { usuario, cerrarSesion } = useAuth();

  if (!usuario) return null;

  const pestañas = [
    { id: 'coleccion', etiqueta: 'Colección', icono: Trophy },
    { id: 'tienda', etiqueta: 'Tienda', icono: ShoppingBag },
    { id: 'batalla', etiqueta: 'Batalla', icono: Sword },
    { id: 'mercado', etiqueta: 'Mercado', icono: Users },
    { id: 'perfil', etiqueta: 'Perfil', icono: User },
  ];

  return (
    <header className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Información del usuario */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {usuario.imgPerfil ? (
                <img
                  src={usuario.imgPerfil}
                  alt={usuario.nombre}
                  className="w-12 h-12 rounded-full border-2 border-white/30"
                />
              ) : (
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{usuario.nombre}</h1>
              <div className="flex items-center gap-2 text-white/90">
                <Coins className="w-4 h-4" />
                <span className="font-medium">{usuario.monedas.toLocaleString()} monedas</span>
              </div>
            </div>
          </div>

          {/* Navegación escritorio */}
          <nav className="hidden lg:flex items-center gap-2">
            {pestañas.map((pestaña) => {
              const Icono = pestaña.icono;
              return (
                <button
                  key={pestaña.id}
                  onClick={() => alCambiarPestaña(pestaña.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${pestañaActiva === pestaña.id
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Icono className="w-5 h-5" />
                  {pestaña.etiqueta}
                </button>
              );
            })}
          </nav>

          {/* Botón cerrar sesión */}
          <button
            onClick={cerrarSesion}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación móvil */}
        <nav className="lg:hidden mt-4 grid grid-cols-5 gap-2">
          {pestañas.map((pestaña) => {
            const Icono = pestaña.icono;
            return (
              <button
                key={pestaña.id}
                onClick={() => alCambiarPestaña(pestaña.id)}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg font-medium transition-all duration-300 ${pestañaActiva === pestaña.id
                    ? 'bg-white/20 text-white backdrop-blur-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Icono className="w-5 h-5" />
                <span className="text-xs">{pestaña.etiqueta}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};