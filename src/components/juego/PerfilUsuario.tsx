import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Camera, Edit3, Save, X, Trophy, Calendar, Coins, Upload, Palette } from 'lucide-react';

export const PerfilUsuario: React.FC = () => {
  const { usuario, actualizarUsuario } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nombreEditado, setNombreEditado] = useState(usuario?.nombre || '');
  const [archivoImagenPerfil, setArchivoImagenPerfil] = useState<File | null>(null);
  const [archivoImagenBanner, setArchivoImagenBanner] = useState<File | null>(null);
  const [colorBanner, setColorBanner] = useState(usuario?.colorBanner || '#ff6b35');
  const [tipoBanner, setTipoBanner] = useState<'color' | 'imagen'>('color');
  
  const refImagenPerfil = useRef<HTMLInputElement>(null);
  const refImagenBanner = useRef<HTMLInputElement>(null);

  if (!usuario) return null;

  const manejarGuardar = () => {
    const usuarioActualizado = { ...usuario };
    usuarioActualizado.nombre = nombreEditado;

    // Procesar imagen de perfil
    if (archivoImagenPerfil) {
      const reader = new FileReader();
      reader.onload = (e) => {
        usuarioActualizado.imgPerfil = e.target?.result as string;
        
        // Procesar banner si es imagen
        if (tipoBanner === 'imagen' && archivoImagenBanner) {
          const bannerReader = new FileReader();
          bannerReader.onload = (e) => {
            usuarioActualizado.imgBanner = e.target?.result as string;
            usuarioActualizado.colorBanner = undefined;
            actualizarUsuario(usuarioActualizado);
            setEditando(false);
          };
          bannerReader.readAsDataURL(archivoImagenBanner);
        } else {
          // Solo color de banner
          usuarioActualizado.colorBanner = colorBanner;
          usuarioActualizado.imgBanner = undefined;
          actualizarUsuario(usuarioActualizado);
          setEditando(false);
        }
      };
      reader.readAsDataURL(archivoImagenPerfil);
    } else {
      // Sin cambio de imagen de perfil
      if (tipoBanner === 'imagen' && archivoImagenBanner) {
        const bannerReader = new FileReader();
        bannerReader.onload = (e) => {
          usuarioActualizado.imgBanner = e.target?.result as string;
          usuarioActualizado.colorBanner = undefined;
          actualizarUsuario(usuarioActualizado);
          setEditando(false);
        };
        bannerReader.readAsDataURL(archivoImagenBanner);
      } else {
        // Solo color de banner
        usuarioActualizado.colorBanner = colorBanner;
        usuarioActualizado.imgBanner = undefined;
        actualizarUsuario(usuarioActualizado);
        setEditando(false);
      }
    }
  };

  const manejarCancelar = () => {
    setNombreEditado(usuario.nombre);
    setArchivoImagenPerfil(null);
    setArchivoImagenBanner(null);
    setColorBanner(usuario.colorBanner || '#ff6b35');
    setTipoBanner('color');
    setEditando(false);
  };

  const estadisticasCartas = {
    total: usuario.cartas.length,
    comunes: usuario.cartas.filter(c => c.rareza === 'common').length,
    raras: usuario.cartas.filter(c => c.rareza === 'rare').length,
    epicas: usuario.cartas.filter(c => c.rareza === 'epic').length,
    legendarias: usuario.cartas.filter(c => c.rareza === 'legendary').length,
  };

  const kiTotal = usuario.cartas.reduce((sum, carta) => {
    const ki = parseInt(carta.personaje.ki.replace(/\D/g, '')) || 0;
    return sum + ki;
  }, 0);

  const obtenerEstiloBanner = () => {
    if (usuario.imgBanner) {
      return {
        backgroundImage: `url(${usuario.imgBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else {
      return {
        background: usuario.colorBanner || 'linear-gradient(to right, #ff6b35, #f7931e)'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado de perfil */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div 
          className="h-32 relative"
          style={obtenerEstiloBanner()}
        >
          {editando && (
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setTipoBanner('color')}
                className={`p-2 rounded-lg transition-colors ${
                  tipoBanner === 'color' 
                    ? 'bg-white text-gray-800' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Palette className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTipoBanner('imagen')}
                className={`p-2 rounded-lg transition-colors ${
                  tipoBanner === 'imagen' 
                    ? 'bg-white text-gray-800' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            {/* Imagen de perfil */}
            <div className="relative">
              {usuario.imgPerfil ? (
                <img
                  src={usuario.imgPerfil}
                  alt={usuario.nombre}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              {editando && (
                <button 
                  onClick={() => refImagenPerfil.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Información del usuario */}
            <div className="flex-1">
              {editando ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  {tipoBanner === 'color' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color del banner
                      </label>
                      <input
                        type="color"
                        value={colorBanner}
                        onChange={(e) => setColorBanner(e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen del banner
                      </label>
                      <button
                        onClick={() => refImagenBanner.current?.click()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {archivoImagenBanner ? archivoImagenBanner.name : 'Seleccionar imagen'}
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={manejarGuardar}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                    <button
                      onClick={manejarCancelar}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">{usuario.nombre}</h1>
                    <button
                      onClick={() => setEditando(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{usuario.email}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Miembro desde {usuario.creado instanceof Date ? usuario.creado.toLocaleDateString() : new Date(usuario.creado).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">{usuario.monedas.toLocaleString()} monedas</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inputs ocultos para archivos */}
      <input
        ref={refImagenPerfil}
        type="file"
        accept="image/*"
        onChange={(e) => setArchivoImagenPerfil(e.target.files?.[0] || null)}
        className="hidden"
      />
      <input
        ref={refImagenBanner}
        type="file"
        accept="image/*"
        onChange={(e) => setArchivoImagenBanner(e.target.files?.[0] || null)}
        className="hidden"
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-800">Colección</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{estadisticasCartas.total}</div>
          <div className="text-sm text-gray-600">Cartas totales</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Ki</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Poder Total</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {kiTotal >= 1000000000 ? `${(kiTotal / 1000000000).toFixed(1)}B` :
             kiTotal >= 1000000 ? `${(kiTotal / 1000000).toFixed(1)}M` :
             kiTotal >= 1000 ? `${(kiTotal / 1000).toFixed(1)}K` : kiTotal}
          </div>
          <div className="text-sm text-gray-600">Ki combinado</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Rarezas</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Legendarias:</span>
              <span className="font-bold text-yellow-600">{estadisticasCartas.legendarias}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Épicas:</span>
              <span className="font-bold text-purple-600">{estadisticasCartas.epicas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Raras:</span>
              <span className="font-bold text-blue-600">{estadisticasCartas.raras}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Comunes:</span>
              <span className="font-bold text-gray-600">{estadisticasCartas.comunes}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Logros</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${estadisticasCartas.total >= 10 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">Coleccionista (10+ cartas)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${estadisticasCartas.legendarias >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">Carta Legendaria</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${kiTotal >= 1000000 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">Poder Supremo (1M+ Ki)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h3>
        {usuario.cartas.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No tienes cartas aún. ¡Ve a la tienda para conseguir algunas!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {usuario.cartas.slice(0, 5).map((carta) => (
              <div key={carta.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={carta.personaje.image}
                  alt={carta.personaje.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48/ff6b35/ffffff?text=?';
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{carta.personaje.name}</div>
                  <div className="text-sm text-gray-600">
                    Obtenida el {carta.obtenido instanceof Date ? carta.obtenido.toLocaleDateString() : new Date(carta.obtenido).toLocaleDateString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                  carta.rareza === 'legendary' ? 'from-yellow-400 to-yellow-600' :
                  carta.rareza === 'epic' ? 'from-purple-400 to-purple-600' :
                  carta.rareza === 'rare' ? 'from-blue-400 to-blue-600' :
                  'from-gray-400 to-gray-600'
                }`}>
                  {carta.rareza === 'legendary' ? 'Legendaria' :
                   carta.rareza === 'epic' ? 'Épica' :
                   carta.rareza === 'rare' ? 'Rara' : 'Común'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};