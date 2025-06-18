import React from 'react';
import { Search, Zap } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                Dragon Ball Z
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                Explora el universo completo
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar personajes, razas, afiliaciones..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-full w-full md:w-80 bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-yellow-300 focus:outline-none transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};