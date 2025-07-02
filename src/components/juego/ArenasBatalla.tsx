import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CartaJuego } from './CartaJuego';
import { Carta as TipoCartaJuego } from '../../types/juego';
import { Sword, Bot, Users, Zap, Heart, Shield, Trophy } from 'lucide-react';

export const ArenasBatalla: React.FC = () => {
  const { usuario, actualizarUsuario } = useAuth();
  const [cartaSeleccionada, setCartaSeleccionada] = useState<TipoCartaJuego | null>(null);
  const [modoBatalla, setModoBatalla] = useState<'cpu' | 'jugador' | null>(null);
  const [resultadoBatalla, setResultadoBatalla] = useState<'ganar' | 'perder' | 'empate' | null>(null);
  const [cartaEnemiga, setCartaEnemiga] = useState<TipoCartaJuego | null>(null);
  const [mostrarBatalla, setMostrarBatalla] = useState(false);

  if (!usuario) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Sword className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay usuario autenticado</h3>
          <p className="text-gray-600">Por favor, inicia sesión para acceder a la arena de batalla.</p>
        </div>
      </div>
    );
  }

  console.log('Usuario cartas en batalla:', usuario.cartas); // Debug

  if (!usuario.cartas || usuario.cartas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No tienes cartas</h3>
          <p className="text-gray-600">¡Ve a la tienda para conseguir cartas y poder batallar!</p>
        </div>
      </div>
    );
  }

  const calcularPoderCarta = (carta: TipoCartaJuego): number => {
    const kiBase = parseInt(carta.personaje.ki.replace(/\D/g, '')) || 1000;
    const kiMaximo = parseInt(carta.personaje.maxKi.replace(/\D/g, '')) || kiBase;
    const multiplicadorNivel = 1 + (carta.nivel - 1) * 0.1;
    const bonusExperiencia = 1 + (carta.experiencia / 100) * 0.05;
    
    return Math.floor((kiBase + kiMaximo) / 2 * multiplicadorNivel * bonusExperiencia);
  };

  const generarCartaEnemiga = (): TipoCartaJuego => {
    const personajesEnemigos = [
      {
        id: 999,
        name: 'Frieza',
        ki: '530000',
        maxKi: '120000000',
        race: 'Frieza Race',
        gender: 'Male',
        description: 'Emperador del universo',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        affiliation: 'Frieza Force'
      },
      {
        id: 998,
        name: 'Cell',
        ki: '900000',
        maxKi: '2100000000',
        race: 'Android',
        gender: 'Male',
        description: 'Androide perfecto',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        affiliation: 'Red Ribbon Army'
      },
      {
        id: 997,
        name: 'Majin Buu',
        ki: '1150000000',
        maxKi: '1150000000',
        race: 'Majin',
        gender: 'Male',
        description: 'Demonio ancestral',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
        affiliation: 'Other'
      }
    ];

    const personajeAleatorio = personajesEnemigos[Math.floor(Math.random() * personajesEnemigos.length)];
    const nivelAleatorio = Math.floor(Math.random() * 10) + 1;
    const experienciaAleatoria = Math.floor(Math.random() * 100);
    const rarezas: ('common' | 'rare' | 'epic' | 'legendary')[] = ['common', 'rare', 'epic', 'legendary'];
    const rarezaAleatoria = rarezas[Math.floor(Math.random() * rarezas.length)];

    return {
      id: `enemigo-${Date.now()}`,
      personajeId: personajeAleatorio.id,
      personaje: personajeAleatorio,
      rareza: rarezaAleatoria,
      nivel: nivelAleatorio,
      experiencia: experienciaAleatoria,
      obtenido: new Date()
    };
  };

  const iniciarBatalla = (modo: 'cpu' | 'jugador') => {
    if (!cartaSeleccionada) return;
    
    setModoBatalla(modo);
    const enemigo = generarCartaEnemiga();
    setCartaEnemiga(enemigo);
    setMostrarBatalla(true);

    // Simular batalla
    setTimeout(() => {
      const poderJugador = calcularPoderCarta(cartaSeleccionada);
      const poderEnemigo = calcularPoderCarta(enemigo);
      
      if (poderJugador > poderEnemigo * 1.1) {
        setResultadoBatalla('ganar');
        // Dar recompensas
        const usuarioActualizado = { ...usuario };
        usuarioActualizado.monedas += 50;
        const indiceCarta = usuarioActualizado.cartas.findIndex(c => c.id === cartaSeleccionada.id);
        if (indiceCarta !== -1) {
          usuarioActualizado.cartas[indiceCarta].experiencia = Math.min(100, usuarioActualizado.cartas[indiceCarta].experiencia + 10);
        }
        actualizarUsuario(usuarioActualizado);
      } else if (poderEnemigo > poderJugador * 1.1) {
        setResultadoBatalla('perder');
      } else {
        setResultadoBatalla('empate');
        const usuarioActualizado = { ...usuario };
        usuarioActualizado.monedas += 25;
        const indiceCarta = usuarioActualizado.cartas.findIndex(c => c.id === cartaSeleccionada.id);
        if (indiceCarta !== -1) {
          usuarioActualizado.cartas[indiceCarta].experiencia = Math.min(100, usuarioActualizado.cartas[indiceCarta].experiencia + 5);
        }
        actualizarUsuario(usuarioActualizado);
      }
    }, 3000);
  };

  const reiniciarBatalla = () => {
    setMostrarBatalla(false);
    setResultadoBatalla(null);
    setCartaEnemiga(null);
    setModoBatalla(null);
  };

  if (mostrarBatalla && cartaSeleccionada && cartaEnemiga) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {resultadoBatalla ? 'Resultado de la Batalla' : 'Batalla en Curso...'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Carta del Jugador */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-blue-600 mb-4">Tu Carta</h3>
              <CartaJuego carta={cartaSeleccionada} />
              <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Poder de Combate</div>
                <div className="text-2xl font-bold text-blue-600">
                  {calcularPoderCarta(cartaSeleccionada).toLocaleString()}
                </div>
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-4xl font-bold py-4 px-8 rounded-full mx-auto w-fit">
                VS
              </div>
              {resultadoBatalla && (
                <div className="mt-4">
                  {resultadoBatalla === 'ganar' && (
                    <div className="text-green-600 font-bold text-xl">¡Victoria!</div>
                  )}
                  {resultadoBatalla === 'perder' && (
                    <div className="text-red-600 font-bold text-xl">Derrota</div>
                  )}
                  {resultadoBatalla === 'empate' && (
                    <div className="text-yellow-600 font-bold text-xl">¡Empate!</div>
                  )}
                </div>
              )}
            </div>

            {/* Carta Enemiga */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-red-600 mb-4">
                {modoBatalla === 'cpu' ? 'CPU' : 'Oponente'}
              </h3>
              <CartaJuego carta={cartaEnemiga} />
              <div className="mt-4 bg-red-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Poder de Combate</div>
                <div className="text-2xl font-bold text-red-600">
                  {calcularPoderCarta(cartaEnemiga).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {resultadoBatalla && (
            <div className="mt-8">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-800 mb-2">Recompensas:</h4>
                {resultadoBatalla === 'ganar' && (
                  <div className="text-green-600">
                    • +50 monedas<br/>
                    • +10 experiencia para tu carta
                  </div>
                )}
                {resultadoBatalla === 'empate' && (
                  <div className="text-yellow-600">
                    • +25 monedas<br/>
                    • +5 experiencia para tu carta
                  </div>
                )}
                {resultadoBatalla === 'perder' && (
                  <div className="text-red-600">
                    • Sin recompensas esta vez
                  </div>
                )}
              </div>
              <button
                onClick={reiniciarBatalla}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Nueva Batalla
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sword className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-800">Arena de Batalla</h2>
        </div>
        <p className="text-gray-600">
          Selecciona una carta y elige tu modo de batalla. El poder de combate se calcula basado en el Ki, nivel y experiencia.
        </p>
      </div>

      {/* Modos de Batalla */}
      {cartaSeleccionada && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Modos de Batalla</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => iniciarBatalla('cpu')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Bot className="w-8 h-8 mx-auto mb-3" />
              <div className="font-bold text-lg mb-2">Batalla vs CPU</div>
              <div className="text-sm opacity-90">Enfréntate a la inteligencia artificial</div>
            </button>
            
            <button
              onClick={() => iniciarBatalla('jugador')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Users className="w-8 h-8 mx-auto mb-3" />
              <div className="font-bold text-lg mb-2">Batalla vs Jugador</div>
              <div className="text-sm opacity-90">Próximamente: Multijugador online</div>
            </button>
          </div>
        </div>
      )}

      {/* Selección de Carta */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {cartaSeleccionada ? 'Carta Seleccionada' : 'Selecciona tu Carta de Batalla'}
        </h3>
        
        {cartaSeleccionada ? (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-64">
              <CartaJuego carta={cartaSeleccionada} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-800">Poder Base</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {calcularPoderCarta(cartaSeleccionada).toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800">Nivel</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{cartaSeleccionada.nivel}</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Experiencia</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{cartaSeleccionada.experiencia}/100</div>
                </div>
              </div>
              
              <button
                onClick={() => setCartaSeleccionada(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cambiar Carta
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {usuario.cartas.map((carta) => (
              <CartaJuego
                key={carta.id}
                carta={carta}
                onClick={setCartaSeleccionada}
                className="hover:ring-2 hover:ring-orange-500 cursor-pointer"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};