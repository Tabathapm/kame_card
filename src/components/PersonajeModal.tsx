import React from 'react';
import { Personaje } from '../types/dragonball';
import { X, Zap, User, Globe, Heart, Shield } from 'lucide-react';

interface PersonajeModalProps {
  personaje: Personaje | null;
  estaAbierto: boolean;
  estaCerrado: () => void;
}

export const PersonajeModal: React.FC<PersonajeModalProps> = ({ personaje, estaAbierto, estaCerrado }) => {
  if (!estaAbierto || !personaje) return null;

  const getAfiliacionColor = (affiliation: string) => {
    const lower = affiliation.toLowerCase();
    if (lower.includes('z fighter') || lower.includes('good')) return 'from-blue-500 to-blue-600';
    if (lower.includes('red ribbon') || lower.includes('army')) return 'from-red-500 to-red-600';
    if (lower.includes('frieza') || lower.includes('villain')) return 'from-purple-500 to-purple-600';
    if (lower.includes('other') || lower.includes('neutral')) return 'from-gray-500 to-gray-600';
    return 'from-green-500 to-green-600';
  };

  const formatKi = (ki: string) => {
    if (!ki || ki === 'unknown') return 'Desconocido';
    const num = parseInt(ki.replace(/\D/g, ''));
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} Billones`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} Millones`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} Miles`;
    return ki;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          {/* imagen */}
          <div className="relative h-80 overflow-hidden rounded-t-3xl">
            <img
              src={personaje.image}
              alt={personaje.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400/ff6b35/ffffff?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* boton de cerrar */}
            <button
              onClick={estaCerrado}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* personaje */}
            <div className="absolute bottom-6 left-6">
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {personaje.name}
              </h2>
              <span className={`bg-gradient-to-r ${getAfiliacionColor(personaje.affiliation)} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                {personaje.affiliation}
              </span>
            </div>
          </div>
          
          {/* contenido */}
          <div className="p-8">
            {/* comienzo grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Raza</span>
                </div>
                <p className="text-blue-900 font-bold text-lg">{personaje.race}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">Género</span>
                </div>
                <p className="text-green-900 font-bold text-lg">{personaje.gender}</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Ki Base</span>
                </div>
                <p className="text-yellow-900 font-bold text-lg">{formatKi(personaje.ki)}</p>
              </div>
              
              {personaje.maxKi && personaje.maxKi !== personaje.ki && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Ki Máximo</span>
                  </div>
                  <p className="text-red-900 font-bold text-lg">{formatKi(personaje.maxKi)}</p>
                </div>
              )}
            </div>
            
            {/* descripcion */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-gray-600" />
                <h3 className="text-gray-800 font-bold text-xl">Descripción</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {personaje.description || 'Información detallada no disponible para este personaje.'}
              </p>
            </div>
            
            {/* boton de cerrar */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={estaCerrado}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};