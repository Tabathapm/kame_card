import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ServicioJuego } from '../../services/servicioJuego';
import { CartaJuego } from './CartaJuego';
import { Carta as TipoCartaJuego } from '../../types/juego';
import { Coins, ShoppingBag, Sparkles, CreditCard } from 'lucide-react';

export const TiendaCartas: React.FC = () => {
  const { usuario, actualizarUsuario } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [nuevasCartas, setNuevasCartas] = useState<TipoCartaJuego[]>([]);
  const [mostrarNuevasCartas, setMostrarNuevasCartas] = useState(false);

  if (!usuario) return null;

  const paquetesCartas = ServicioJuego.obtenerPaquetesCartas();

  const manejarCompraPaquete = async (paqueteId: string) => {
    const paquete = paquetesCartas.find(p => p.id === paqueteId);
    if (!paquete) return;

    if (usuario.monedas < paquete.precio) {
      alert('No tienes suficientes monedas para comprar este paquete');
      return;
    }

    setCargando(true);
    try {
      const cartas = await ServicioJuego.abrirPaqueteCartas(paquete, usuario);
      setNuevasCartas(cartas);
      setMostrarNuevasCartas(true);

      // Actualizar el contexto con el usuario actualizado
      actualizarUsuario({ ...usuario });
    } catch (error) {
      console.error('Error al comprar el paquete:', error);
      alert('Error al comprar el paquete. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCompraMonedas = (cantidad: number, precio: number) => {
    // Simular compra de monedas
    alert(`¡Funcionalidad de pago próximamente! Comprarías ${cantidad} monedas por $${precio} ARS`);
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Tienda de Cartas</h2>
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-800">{usuario.monedas.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-gray-600">Compra paquetes de cartas para expandir tu colección</p>
      </div>

      {/* Paquetes de Monedas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-green-600" />
          Comprar Monedas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-green-400 transition-colors">
            <div className="text-2xl font-bold text-gray-800 mb-2">500 Monedas</div>
            <div className="text-green-600 font-bold text-lg mb-3">$100 ARS</div>
            <button
              onClick={() => manejarCompraMonedas(500, 100)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
            >
              Comprar
            </button>
          </div>

          <div className="border-2 border-green-400 rounded-xl p-4 text-center bg-green-50 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              ¡POPULAR!
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">1,200 Monedas</div>
            <div className="text-green-600 font-bold text-lg mb-1">$200 ARS</div>
            <div className="text-sm text-gray-600 mb-3">+20% bonus</div>
            <button
              onClick={() => manejarCompraMonedas(1200, 200)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
            >
              Comprar
            </button>
          </div>

          <div className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-green-400 transition-colors">
            <div className="text-2xl font-bold text-gray-800 mb-2">2,500 Monedas</div>
            <div className="text-green-600 font-bold text-lg mb-1">$350 ARS</div>
            <div className="text-sm text-gray-600 mb-3">+25% bonus</div>
            <button
              onClick={() => manejarCompraMonedas(2500, 350)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>

      {/* Paquetes de Cartas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paquetesCartas.map((paquete) => (
          <div key={paquete.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="relative">
              <img
                src={paquete.imagen}
                alt={paquete.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white mb-1">{paquete.nombre}</h3>
                <p className="text-white/90 text-sm">{paquete.cantidadCartas} cartas</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-gray-800">{paquete.precio}</span>
                </div>
                {paquete.rarezaGarantizada && (
                  <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">
                      {paquete.rarezaGarantizada === 'rare' ? 'Rara+' :
                        paquete.rarezaGarantizada === 'epic' ? 'Épica+' : 'Legendaria+'}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => manejarCompraPaquete(paquete.id)}
                disabled={cargando || usuario.monedas < paquete.precio}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                {cargando ? 'Comprando...' :
                  usuario.monedas < paquete.precio ? 'Sin monedas' : 'Comprar Paquete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Nuevas Cartas */}
      {mostrarNuevasCartas && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 text-center">
              <div className="mb-6">
                <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Nuevas Cartas!</h2>
                <p className="text-gray-600">Has obtenido estas increíbles cartas:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {nuevasCartas.map((carta) => (
                  <CartaJuego key={carta.id} carta={carta} />
                ))}
              </div>

              <button
                onClick={() => setMostrarNuevasCartas(false)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300"
              >
                ¡Genial!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};