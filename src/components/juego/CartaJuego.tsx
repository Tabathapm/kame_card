import React from 'react';
import { Carta as CartaJuegoType } from '../../types/juego';
import { ServicioJuego } from '../../services/servicioJuego';
import { Zap, Star } from 'lucide-react';

interface PropiedadesCartaJuego {
  carta: CartaJuegoType;
  onClick?: (carta: CartaJuegoType) => void;
  className?: string;
}

export const CartaJuego: React.FC<PropiedadesCartaJuego> = ({ carta, onClick, className = '' }) => {
  const colorRareza = ServicioJuego.obtenerColorRareza(carta.rareza);
  const nombreRareza = ServicioJuego.obtenerNombreRareza(carta.rareza);

  const formatearKi = (ki: string) => {
    if (!ki || ki === 'unknown') return 'N/A';
    const num = parseInt(ki.replace(/\D/g, ''));
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return ki;
  };

  return (
    <div
      onClick={() => onClick?.(carta)}
      className={`bg-gradient-to-r ${colorRareza} p-1 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${onClick ? 'cursor-pointer' : ''} overflow-hidden group ${className}`}
    >
      <div className="bg-white rounded-xl h-full w-full">
        {/* Imagen del Personaje */}
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={carta.personaje.image}
            alt={carta.personaje.name}
            className="w-full h-52 object-top object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400/ff6b35/ffffff?text=Sin+Imagen';
            }}
          />

          {/* Badge de Rareza */}
          <div className="absolute top-2 right-2">
            <div className={`bg-gradient-to-r ${colorRareza} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
              <Star className="w-3 h-3" />
              {nombreRareza}
            </div>
          </div>

          {/* Badge de Nivel */}
          <div className="absolute top-2 left-2">
            <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
              Nv. {carta.nivel}
            </div>
          </div>
        </div>

        {/* Información de la Carta */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-2 text-lg truncate">
            {carta.personaje.name}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Raza:</span>
              <span className="font-medium text-gray-800">{carta.personaje.race}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Ki:
              </span>
              <span className="font-bold text-yellow-600">{formatearKi(carta.personaje.ki)}</span>
            </div>
          </div>

          {/* Barra de Experiencia */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Experiencia</span>
              <span>{carta.experiencia}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${colorRareza} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(carta.experiencia, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};