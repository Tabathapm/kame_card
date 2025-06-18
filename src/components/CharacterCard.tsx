import React from 'react';
import { Character } from '../types/dragonball';
import { Zap, User, Globe, Heart } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  const getAffiliationColor = (affiliation: string) => {
    const lower = affiliation.toLowerCase();
    if (lower.includes('z fighter') || lower.includes('good')) return 'bg-blue-500';
    if (lower.includes('red ribbon') || lower.includes('army')) return 'bg-red-500';
    if (lower.includes('frieza') || lower.includes('villain')) return 'bg-purple-500';
    if (lower.includes('other') || lower.includes('neutral')) return 'bg-gray-500';
    return 'bg-green-500';
  };

  const formatKi = (ki: string) => {
    if (!ki || ki === 'unknown') return 'Desconocido';
    // Formatear números grandes
    const num = parseInt(ki.replace(/\D/g, ''));
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return ki;
  };

  return (
    <div
      onClick={() => onClick(character)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400/ff6b35/ffffff?text=No+Image';
          }}
        />
        <div className="absolute top-4 right-4">
          <span className={`${getAffiliationColor(character.affiliation)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {character.affiliation}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
          {character.name}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span><strong>Raza:</strong> {character.race}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-500" />
            <span><strong>Género:</strong> {character.gender}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span><strong>Ki:</strong> {formatKi(character.ki)}</span>
          </div>
          
          {character.maxKi && character.maxKi !== character.ki && (
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span><strong>Ki Máximo:</strong> {formatKi(character.maxKi)}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-700 text-sm mt-4 line-clamp-3">
          {character.description || 'Descripción no disponible'}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};