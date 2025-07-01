import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, EstadoDeAutorizacion } from '../types/juego';
import { ServicioAutenticacion } from '../services/servicioAutenticacion';

interface ContextoAutenticacion extends EstadoDeAutorizacion {
    iniciarSesion: (email: string, password: string) => Promise<void>;
    registrar: (email: string, password: string, nombre: string) => Promise<void>;
    cerrarSesion: () => void;
    actualizarUsuario: (usuario: Usuario) => void;
}

const AutenticacionContext = createContext<ContextoAutenticacion | undefined>(undefined);

export const useAutenticacion = () => {
    const contexto = useContext(AutenticacionContext);
    if (!contexto) {
        throw new Error('useAutenticacion debe usarse dentro de un AutenticacionProvider');
    }
    return contexto;
};

interface AutenticacionProviderProps {
    children: ReactNode;
}

export const AutenticacionProvider: React.FC<AutenticacionProviderProps> = ({ children }) => {
    const [estado, setEstado] = useState<EstadoDeAutorizacion>({
        usuario: null,
        autenticado: false,
        cargando: true
    });

    useEffect(() => {
        const usuario = ServicioAutenticacion.obtenerUsuarioActual();
        setEstado({
            usuario,
            autenticado: !!usuario,
            cargando: false
        });
    }, []);

    const iniciarSesion = async (email: string, password: string) => {
        setEstado(prev => ({ ...prev, cargando: true }));
        try {
            const usuario = await ServicioAutenticacion.iniciarSesion(email, password);
            setEstado({
                usuario,
                autenticado: true,
                cargando: false
            });
        } catch (error) {
            setEstado(prev => ({ ...prev, cargando: false }));
            throw error;
        }
    };

    const registrar = async (email: string, password: string, nombre: string) => {
        setEstado(prev => ({ ...prev, cargando: true }));
        try {
            const usuario = await ServicioAutenticacion.registrar(email, password, nombre);
            setEstado({
                usuario,
                autenticado: true,
                cargando: false
            });
        } catch (error) {
            setEstado(prev => ({ ...prev, cargando: false }));
            throw error;
        }
    };

    const cerrarSesion = () => {
        ServicioAutenticacion.cerrarSesion();
        setEstado({
            usuario: null,
            autenticado: false,
            cargando: false
        });
    };

    const actualizarUsuario = (usuario: Usuario) => {
        ServicioAutenticacion.actualizarUsuario(usuario);
        setEstado(prev => ({
            ...prev,
            usuario
        }));
    };

    return (
        <AutenticacionContext.Provider value={{
            ...estado,
            iniciarSesion,
            registrar,
            cerrarSesion,
            actualizarUsuario
        }}>
            {children}
        </AutenticacionContext.Provider>
    );
};