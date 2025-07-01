import { Usuario, Carta } from '../types/juego';
import { Personaje } from '../types/dragonball';
import { DragonBallAPI } from './dragonballApi';

const CLAVE_ALMACENAMIENTO = 'usuarios_dragonball';
const CREDENCIALES_DEMO = {
    email: 'test@gmail.com',
    password: '123456'
};

interface UsuariosGuardados {
    [email: string]: Usuario;
}

export class ServicioAutenticacion {
    private static obtenerUsuariosGuardados(): UsuariosGuardados {
        const datosUsuarios = localStorage.getItem(CLAVE_ALMACENAMIENTO);
        if (datosUsuarios) {
            try {
                const usuarios = JSON.parse(datosUsuarios);
                // Convertir fechas de string a Date
                Object.keys(usuarios).forEach(email => {
                    usuarios[email].creado = new Date(usuarios[email].creado);
                    usuarios[email].cartas = usuarios[email].cartas.map((carta: unknown) => {
                        if (typeof carta === 'object' && carta !== null) {
                            return {
                                ...carta,
                                obtenidoEn: new Date((carta as { obtenidoEn: string }).obtenidoEn)
                            };
                        }
                        return carta;
                    });
                });
                return usuarios;
            } catch (error) {
                console.error('Error al analizar los datos de usuarios:', error);
                localStorage.removeItem(CLAVE_ALMACENAMIENTO);
                return {};
            }
        }
        return {};
    }

    private static guardarUsuarios(usuarios: UsuariosGuardados): void {
        localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(usuarios));
    }

    static obtenerUsuarioActual(): Usuario | null {
        const emailUsuarioActual = localStorage.getItem('email_usuario_actual');
        if (!emailUsuarioActual) return null;

        const usuarios = this.obtenerUsuariosGuardados();
        return usuarios[emailUsuarioActual] || null;
    }

    static async iniciarSesion(email: string, password: string): Promise<Usuario> {
        // Simular retardo de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        const usuarios = this.obtenerUsuariosGuardados();

        // Verificar si el usuario existe
        if (usuarios[email]) {
            // Usuario existente - verificar contraseña
            if (email === CREDENCIALES_DEMO.email && password === CREDENCIALES_DEMO.password) {
                localStorage.setItem('email_usuario_actual', email);
                return usuarios[email];
            } else {
                // Para otros usuarios, por simplicidad aceptamos cualquier contraseña
                // En un sistema real aquí verificarías la contraseña hasheada
                localStorage.setItem('email_usuario_actual', email);
                return usuarios[email];
            }
        } else {
            // Usuario no existe
            if (email === CREDENCIALES_DEMO.email && password === CREDENCIALES_DEMO.password) {
                // Crear usuario demo con cartas iniciales
                const cartasIniciales = await this.generarCartasIniciales();
                const usuario: Usuario = {
                    id: 'usuario-demo',
                    email: email,
                    nombre: 'Guerrero Z',
                    monedas: 1000,
                    cartas: cartasIniciales,
                    creado: new Date()
                };

                usuarios[email] = usuario;
                this.guardarUsuarios(usuarios);
                localStorage.setItem('email_usuario_actual', email);
                return usuario;
            } else {
                throw new Error('Credenciales incorrectas');
            }
        }
    }

    static async registrar(email: string, password: string, nombre: string): Promise<Usuario> {
        // Simular retardo de red
        await new Promise(resolve => setTimeout(resolve, 1500));

        const usuarios = this.obtenerUsuariosGuardados();

        if (usuarios[email]) {
            throw new Error('Este email ya está registrado');
        }

        // Generar cartas iniciales ALEATORIAS
        const cartasIniciales = await this.generarCartasIniciales();

        const usuario: Usuario = {
            id: `usuario-${Date.now()}`,
            email: email,
            nombre,
            monedas: 1000, // Monedas de bienvenida
            cartas: cartasIniciales,
            creado: new Date()
        };

        usuarios[email] = usuario;
        this.guardarUsuarios(usuarios);
        localStorage.setItem('email_usuario_actual', email);
        return usuario;
    }

    static cerrarSesion(): void {
        localStorage.removeItem('email_usuario_actual');
    }

    static actualizarUsuario(usuario: Usuario): void {
        const usuarios = this.obtenerUsuariosGuardados();
        usuarios[usuario.email] = usuario;
        this.guardarUsuarios(usuarios);
    }

    private static async generarCartasIniciales(): Promise<Carta[]> {
        try {
            // Obtener personajes de la API
            const respuesta = await DragonBallAPI.getPersonajes(1, 20);
            if (!respuesta.items || respuesta.items.length < 3) {
                throw new Error('No se pudieron obtener suficientes personajes de la API');
            }

            // Seleccionar 3 personajes aleatorios de la API
            const seleccionados = this.obtenerPersonajesAleatorios(respuesta.items, 3);

            return seleccionados.map((personaje, indice) => ({
                id: `carta-inicial-${Date.now()}-${indice}`,
                personajeId: personaje.id,
                personaje: personaje,
                rareza: this.obtenerRarezaAleatoria(), // Rareza aleatoria
                nivel: 1,
                experiencia: 0,
                obtenido: new Date()
            }));
        } catch (error) {
            console.error('Error generando cartas iniciales:', error);
            throw new Error('No se pudieron generar las cartas iniciales');
        }
    }

    private static obtenerPersonajesAleatorios(personajes: Personaje[], cantidad: number): Personaje[] {
        const mezclados = [...personajes].sort(() => 0.5 - Math.random());
        return mezclados.slice(0, cantidad);
    }

    private static obtenerRarezaAleatoria(): 'common' | 'rare' | 'epic' | 'legendary' {
        const aleatorio = Math.random();
        if (aleatorio < 0.5) return 'common';
        if (aleatorio < 0.75) return 'rare';
        if (aleatorio < 0.92) return 'epic';
        return 'legendary';
    }
}