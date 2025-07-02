import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PropsFormularioLogin {
    onSwitchToRegister: () => void;
}

export const FormularioLogin: React.FC<PropsFormularioLogin> = ({ onSwitchToRegister }) => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [error, setError] = useState('');
    const { iniciarSesion, cargando } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await iniciarSesion(correo, contrasena);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        }
    };

    const llenarCredencialesDemo = () => {
        setCorreo('test@gmail.com');
        setContrasena('123456');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h1>
                    <p className="text-gray-600">Inicia sesión para jugar Dragon Ball Z Cards</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
                    >
                        {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-6">
                    <button
                        onClick={llenarCredencialesDemo}
                        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-xl font-medium transition-colors duration-300 text-sm"
                    >
                        Usar credenciales de prueba
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Correo: test@gmail.com | Contraseña: 123456
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};