import React, { useState } from 'react';
import { Header } from './components/Header';
import { PersonajeCard } from './components/PersonajeCard';
import { PersonajeModal } from './components/PersonajeModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BarraFiltros } from './components/BarraFiltros';
import { useCharacters } from './hooks/useCharacters';
import { Personaje } from './types/dragonball';
import { AlertCircle, RefreshCcw } from 'lucide-react';

function App() {
  const {
    personajes,
    loading,
    error,
    searchQuery,
    selectedRace,
    selectedAffiliation,
    races,
    affiliations,
    searchCharacters,
    setSelectedRace,
    setSelectedAffiliation,
    resetFilters,
    refetch
  } = useCharacters();

  const [selectedCharacter, setSelectedCharacter] = useState<Personaje | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCharacterClick = (personaje: Personaje) => {
    setSelectedCharacter(personaje);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleSearchSubmit = () => {
    // La búsqueda se aplica automáticamente a través del hook
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={searchCharacters}
          onSearchSubmit={handleSearchSubmit}
        />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error de Conexión</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={refetch}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <RefreshCcw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={searchCharacters}
        onSearchSubmit={handleSearchSubmit}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!loading && (
          <BarraFiltros
            races={races}
            affiliations={affiliations}
            selectedRace={selectedRace}
            selectedAffiliation={selectedAffiliation}
            onRaceChange={setSelectedRace}
            onAffiliationChange={setSelectedAffiliation}
            onReset={resetFilters}
          />
        )}

        {loading ? (
          <LoadingSpinner />
        ) : personajes.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">No se encontraron personajes</h2>
              <p className="text-gray-600 mb-6">
                Intenta ajustar tus filtros de búsqueda o explora diferentes términos.
              </p>
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery || selectedRace || selectedAffiliation
                  ? `Resultados encontrados: ${personajes.length}`
                  : `Personajes de Dragon Ball Z (${personajes.length})`}
              </h2>
              {(searchQuery || selectedRace || selectedAffiliation) && (
                <p className="text-gray-600 mt-1">
                  {searchQuery && `Búsqueda: "${searchQuery}"`}
                  {selectedRace && ` • Raza: ${selectedRace}`}
                  {selectedAffiliation && ` • Afiliación: ${selectedAffiliation}`}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {personajes.map((personaje) => (
                <PersonajeCard
                  key={personaje.id}
                  personaje={personaje}
                  onClick={handleCharacterClick}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <PersonajeModal
        personaje={selectedCharacter}
        estaAbierto={isModalOpen}
        estaCerrado={handleCloseModal}
      />
    </div>
  );
}

export default App;