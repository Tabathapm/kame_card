import React from 'react';
import { Zap } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-6 h-6 text-orange-500 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">Cargando personajes...</p>
        <p className="text-sm text-gray-500">Conectando con el universo Dragon Ball Z</p>
      </div>
    </div>
  );
};