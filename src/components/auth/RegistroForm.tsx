import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PropsRegistroForm {
    onSwitchToLogin: () => void;
}

export const RegistroForm: React.FC<PropsRegistroForm> = ({ onSwitchToLogin }) => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [error, setError] = useState('');
    const { registrar, cargando } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await registrar(correo, contrasena, nombreUsuario);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrarse');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Únete!</h1>
                    <p className="text-gray-600">Crea tu cuenta y recibe cartas gratis</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de usuario
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={nombreUsuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tu nombre de guerrero"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={mostrarContrasena ? 'text' : 'password'}
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {mostrarContrasena ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
                    >
                        {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-medium text-green-800 mb-2">🎁 Recompensas de bienvenida:</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>• 3 cartas de personajes gratis</li>
                        <li>• 1,000 monedas virtuales</li>
                        <li>• Acceso completo al juego</li>
                    </ul>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};