import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CartaJuego } from './CartaJuego';
import { Carta as TipoCartaJuego, ListaMercado } from '../../types/juego';
import { ShoppingBag, DollarSign, ArrowLeftRight, Search } from 'lucide-react';

export const MercadoCartas: React.FC = () => {
  const { usuario, actualizarUsuario } = useAuth();
  const [pestanaActiva, setPestanaActiva] = useState<'comprar' | 'vender' | 'intercambiar'>('comprar');
  const [cartaSeleccionada, setCartaSeleccionada] = useState<TipoCartaJuego | null>(null);
  const [precioVenta, setPrecioVenta] = useState(100);
  const [busqueda, setBusqueda] = useState('');
  const [rarezaSeleccionada, setRarezaSeleccionada] = useState('');

  if (!usuario) return null;

  // Simulación de listas del mercado
  const listasSimuladas: ListaMercado[] = [
    {
      id: '1',
      carta: {
        id: 'market-1',
        personajeId: 1,
        personaje: {
          id: 1,
          name: 'Goku',
          ki: '3000000',
          maxKi: '3000000',
          race: 'Saiyan',
          gender: 'Male',
          description: 'Guerrero Saiyan',
          image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
          affiliation: 'Z Fighter'
        },
        rareza: 'legendary',
        nivel: 5,
        experiencia: 75,
        obtenido: new Date()
      },
      precio: 500,
      vendedorId: 'otro-usuario',
      vendedorNombre: 'Vegeta_Prince',
      publicado: new Date()
    },
    {
      id: '2',
      carta: {
        id: 'market-2',
        personajeId: 2,
        personaje: {
          id: 2,
          name: 'Vegeta',
          ki: '2500000',
          maxKi: '2500000',
          race: 'Saiyan',
          gender: 'Male',
          description: 'Príncipe Saiyan',
          image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
          affiliation: 'Z Fighter'
        },
        rareza: 'epic',
        nivel: 3,
        experiencia: 50,
        obtenido: new Date()
      },
      precio: 300,
      vendedorId: 'otro-usuario-2',
      vendedorNombre: 'Kakarot_Fan',
      publicado: new Date()
    }
  ];

  const manejarVentaCarta = () => {
    if (!cartaSeleccionada) return;

    // Simular venta
    const usuarioActualizado = { ...usuario };
    usuarioActualizado.monedas += precioVenta;
    usuarioActualizado.cartas = usuarioActualizado.cartas.filter(c => c.id !== cartaSeleccionada.id);
    actualizarUsuario(usuarioActualizado);

    setCartaSeleccionada(null);
    setPrecioVenta(100);
    alert(`¡Carta vendida por ${precioVenta} monedas!`);
  };

  const manejarCompraCarta = (lista: ListaMercado) => {
    if (usuario.monedas < lista.precio) {
      alert('No tienes suficientes monedas para comprar esta carta');
      return;
    }

    const usuarioActualizado = { ...usuario };
    usuarioActualizado.monedas -= lista.precio;
    usuarioActualizado.cartas.push({
      ...lista.carta,
      id: `comprada-${Date.now()}`,
      obtenido: new Date()
    });
    actualizarUsuario(usuarioActualizado);

    alert(`¡Carta comprada por ${lista.precio} monedas!`);
  };

  const listasFiltradas = listasSimuladas.filter(lista => {
    const coincideBusqueda = lista.carta.personaje.name.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRareza = !rarezaSeleccionada || lista.carta.rareza === rarezaSeleccionada;
    return coincideBusqueda && coincideRareza;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Mercado de Cartas</h2>
        </div>
        <p className="text-gray-600">
          Compra, vende e intercambia cartas con otros jugadores
        </p>
      </div>

      {/* Pestañas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPestanaActiva('comprar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${pestanaActiva === 'comprar'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Comprar
          </button>
          <button
            onClick={() => setPestanaActiva('vender')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${pestanaActiva === 'vender'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <DollarSign className="w-5 h-5" />
            Vender
          </button>
          <button
            onClick={() => setPestanaActiva('intercambiar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${pestanaActiva === 'intercambiar'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
            Intercambiar
          </button>
        </div>

        {/* Pestaña Comprar */}
        {pestanaActiva === 'comprar' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar cartas..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:w-48">
                <select
                  value={rarezaSeleccionada}
                  onChange={(e) => setRarezaSeleccionada(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Todas las rarezas</option>
                  <option value="common">Común</option>
                  <option value="rare">Rara</option>
                  <option value="epic">Épica</option>
                  <option value="legendary">Legendaria</option>
                </select>
              </div>
            </div>

            {/* Listas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listasFiltradas.map((lista) => (
                <div key={lista.id} className="border border-gray-200 rounded-xl p-4">
                  <CartaJuego carta={lista.carta} />
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Precio:</span>
                      <span className="font-bold text-green-600 text-lg">{lista.precio} monedas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vendedor:</span>
                      <span className="font-medium text-gray-800">{lista.vendedorNombre}</span>
                    </div>
                    <button
                      onClick={() => manejarCompraCarta(lista)}
                      disabled={usuario.monedas < lista.precio}
                      className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      {usuario.monedas < lista.precio ? 'Sin monedas' : 'Comprar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pestaña Vender */}
        {pestanaActiva === 'vender' && (
          <div className="space-y-6">
            {cartaSeleccionada ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64">
                  <CartaJuego carta={cartaSeleccionada} />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Vender Carta</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio de venta (monedas)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={precioVenta}
                      onChange={(e) => setPrecioVenta(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={manejarVentaCarta}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Vender por {precioVenta} monedas
                    </button>
                    <button
                      onClick={() => setCartaSeleccionada(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Selecciona una carta para vender</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {usuario.cartas.map((carta) => (
                    <CartaJuego
                      key={carta.id}
                      carta={carta}
                      onClick={setCartaSeleccionada}
                      className="hover:ring-2 hover:ring-blue-500 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pestaña Intercambiar */}
        {pestanaActiva === 'intercambiar' && (
          <div className="text-center py-12">
            <ArrowLeftRight className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sistema de Intercambio</h3>
            <p className="text-gray-600 mb-6">
              El sistema de intercambio directo entre jugadores estará disponible próximamente.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-bold text-purple-800 mb-2">Próximamente:</h4>
              <ul className="text-sm text-purple-700 space-y-1 text-left">
                <li>• Intercambios directos entre jugadores</li>
                <li>• Sistema de ofertas y contraoferta</li>
                <li>• Intercambios múltiples (N:M)</li>
                <li>• Historial de intercambios</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};