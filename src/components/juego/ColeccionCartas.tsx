import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CartaJuego } from './CartaJuego';
import { Carta as TipoCartaJuego } from '../../types/juego';
import { PersonajeModal } from '../PersonajeModal';
import { Filter, Search, Trophy } from 'lucide-react';

export const ColeccionCartas: React.FC = () => {
  const { usuario } = useAuth();
  const [cartaSeleccionada, setCartaSeleccionada] = useState<TipoCartaJuego | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [consultaBusqueda, setConsultaBusqueda] = useState('');
  const [rarezaSeleccionada, setRarezaSeleccionada] = useState('');

  if (!usuario) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay usuario autenticado</h3>
          <p className="text-gray-600">Por favor, inicia sesión para ver tu colección.</p>
        </div>
      </div>
    );
  }

  console.log('Usuario cartas:', usuario.cartas); // Debug

  if (!usuario.cartas || usuario.cartas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Colección vacía</h3>
          <p className="text-gray-600">¡Ve a la tienda para conseguir tus primeras cartas!</p>
        </div>
      </div>
    );
  }

  const manejarClickCarta = (carta: TipoCartaJuego) => {
    setCartaSeleccionada(carta);
    setModalAbierto(true);
  };

  const manejarCerrarModal = () => {
    setModalAbierto(false);
    setCartaSeleccionada(null);
  };

  // Filtrar cartas
  const cartasFiltradas = usuario.cartas.filter(carta => {
    const coincideBusqueda = carta.personaje.name.toLowerCase().includes(consultaBusqueda.toLowerCase()) ||
      carta.personaje.race.toLowerCase().includes(consultaBusqueda.toLowerCase());
    const coincideRareza = !rarezaSeleccionada || carta.rareza === rarezaSeleccionada;
    return coincideBusqueda && coincideRareza;
  });

  // Estadísticas de rareza
  const estadisticasRareza = usuario.cartas.reduce((acc, carta) => {
    acc[carta.rareza] = (acc[carta.rareza] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mi Colección</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">{usuario.cartas.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-600">{estadisticasRareza.common || 0}</div>
            <div className="text-sm text-gray-600">Comunes</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{estadisticasRareza.rare || 0}</div>
            <div className="text-sm text-gray-600">Raras</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{estadisticasRareza.epic || 0}</div>
            <div className="text-sm text-gray-600">Épicas</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{estadisticasRareza.legendary || 0}</div>
            <div className="text-sm text-gray-600">Legendarias</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cartas..."
                value={consultaBusqueda}
                onChange={(e) => setConsultaBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="md:w-48">
            <select
              value={rarezaSeleccionada}
              onChange={(e) => setRarezaSeleccionada(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Todas las rarezas</option>
              <option value="common">Común</option>
              <option value="rare">Rara</option>
              <option value="epic">Épica</option>
              <option value="legendary">Legendaria</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Cartas */}
      {cartasFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron cartas</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cartasFiltradas.map((carta) => (
            <CartaJuego
              key={carta.id}
              carta={carta}
              onClick={manejarClickCarta}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {cartaSeleccionada && (
        <PersonajeModal
          personaje={cartaSeleccionada.personaje}
          estaAbierto={modalAbierto}
          estaCerrado={manejarCerrarModal}
        />
      )}
    </div>
  );
};