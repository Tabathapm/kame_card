import React, { useState } from 'react';
import { Header } from './components/Header';
import { PersonajeCard } from './components/PersonajeCard';
import { PersonajeModal } from './components/PersonajeModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BarraFiltros } from './components/BarraFiltros';
import { usePersonajes } from './hooks/usePersonajes';
import { Personaje } from './types/dragonball';
import { AlertCircle, RefreshCcw } from 'lucide-react';

function App() {
  const {
    personajes,
    cargando,
    error,
    busqueda,
    razaSeleccionada,
    afiliacionSeleccionada,
    razas,
    afiliaciones,
    buscarPersonajes,
    setRazaSeleccionada,
    setAfiliacionSeleccionada,
    reiniciarFiltros,
    recargar: cargarPersonajes
  } = usePersonajes();

  const [personajeSeleccionado, setPersonajeSeleccionado] = useState<Personaje | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handlePersonajeClick = (personaje: Personaje) => {
    setPersonajeSeleccionado(personaje);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setPersonajeSeleccionado(null);
  };

  const handleBuscarSubmit = () => {
    // La búsqueda se aplica automáticamente a través del hook
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
        <Header 
          searchQuery={busqueda}
          onSearchChange={buscarPersonajes}
          onSearchSubmit={handleBuscarSubmit}
        />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error de Conexión</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={cargarPersonajes}
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
        searchQuery={busqueda}
        onSearchChange={buscarPersonajes}
        onSearchSubmit={handleBuscarSubmit}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!cargando && (
          <BarraFiltros
            races={razas}
            affiliations={afiliaciones}
            selectedRace={razaSeleccionada}
            selectedAffiliation={afiliacionSeleccionada}
            onRaceChange={setRazaSeleccionada}
            onAffiliationChange={setAfiliacionSeleccionada}
            onReset={reiniciarFiltros}
          />
        )}

        {cargando ? (
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
                onClick={reiniciarFiltros}
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
                {busqueda || razaSeleccionada || afiliacionSeleccionada
                  ? `Resultados encontrados: ${personajes.length}`
                  : `Personajes de Dragon Ball Z (${personajes.length})`}
              </h2>
              {(busqueda || razaSeleccionada || afiliacionSeleccionada) && (
                <p className="text-gray-600 mt-1">
                  {busqueda && `Búsqueda: "${busqueda}"`}
                  {razaSeleccionada && ` • Raza: ${razaSeleccionada}`}
                  {afiliacionSeleccionada && ` • Afiliación: ${afiliacionSeleccionada}`}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {personajes.map((personaje) => (
                <PersonajeCard
                  key={personaje.id}
                  personaje={personaje}
                  onClick={handlePersonajeClick}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <PersonajeModal
        personaje={personajeSeleccionado}
        estaAbierto={modalAbierto}
        estaCerrado={handleCerrarModal}
      />
    </div>
  );
}

export default App;