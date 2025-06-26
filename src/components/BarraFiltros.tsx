import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface BarraFiltrosProps {
  races: string[];
  affiliations: string[];
  selectedRace: string;
  selectedAffiliation: string;
  onRaceChange: (race: string) => void;
  onAffiliationChange: (affiliation: string) => void;
  onReset: () => void;
}

export const BarraFiltros: React.FC<BarraFiltrosProps> = ({
  races,
  affiliations,
  selectedRace,
  selectedAffiliation,
  onRaceChange,
  onAffiliationChange,
  onReset
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-800">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Raza
          </label>
          <select
            value={selectedRace}
            onChange={(e) => onRaceChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todas las razas</option>
            {races.map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Afiliación
          </label>
          <select
            value={selectedAffiliation}
            onChange={(e) => onAffiliationChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todas las afiliaciones</option>
            {affiliations.map((affiliation) => (
              <option key={affiliation} value={affiliation}>
                {affiliation}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <button
            onClick={onReset}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};