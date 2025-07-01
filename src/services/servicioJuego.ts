import { Carta, CartaPack, Usuario } from '../types/juego';
import { Personaje } from '../types/dragonball';
import { DragonBallAPI } from './dragonballApi';
import { ServicioAutenticacion } from './ServicioAutenticacion';

export class ServicioJuego {
    static obtenerPaquetesCartas(): CartaPack[] {
        return [
            {
                id: 'paquete-basico',
                nombre: 'Paquete Básico',
                precio: 100,
                cantidadCartas: 3,
                imagen: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
            },
            {
                id: 'paquete-premium',
                nombre: 'Paquete Premium',
                precio: 250,
                cantidadCartas: 5,
                rarezaGarantizada: 'rare',
                imagen: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
            },
            {
                id: 'paquete-legendario',
                nombre: 'Paquete Legendario',
                precio: 500,
                cantidadCartas: 7,
                rarezaGarantizada: 'epic',
                imagen: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
            }
        ];
    }

    static async abrirPaqueteCartas(paquete: CartaPack, usuario: Usuario): Promise<Carta[]> {
        if (usuario.monedas < paquete.precio) {
            throw new Error('No tienes suficientes monedas');
        }

        try {
            // Obtener personajes aleatorios de la API
            let personajes: Personaje[] = [];
            try {
                const respuesta = await DragonBallAPI.getPersonajes(1, 50);
                personajes = respuesta.items;
                if (!personajes || personajes.length < paquete.cantidadCartas) {
                    throw new Error('No hay suficientes personajes en la API');
                }
            } catch (errorApi) {
                console.error('Error al obtener personajes de la API:', errorApi);
                throw new Error('No se pudieron obtener personajes de la API');
            }

            // Seleccionar personajes aleatorios SIN repetidos
            // const personajesAleatoriosSinRepetir = [...personajes]
            //     .sort(() => 0.5 - Math.random())
            //     .slice(0, paquete.cantidadCartas);

            const nuevasCartas: Carta[] = [];

            for (let i = 0; i < paquete.cantidadCartas; i++) {
                const personaje = this.obtenerPersonajeAleatorio(personajes);
                let rareza = this.obtenerRarezaAleatoria();

                // Garantizar rareza mínima si está especificada
                if (paquete.rarezaGarantizada && i === 0) {
                    rareza = this.garantizarRarezaMinima(rareza, paquete.rarezaGarantizada);
                }

                const carta: Carta = {
                    id: `carta-${usuario.id}-${Date.now()}-${i}`,
                    personajeId: personaje.id,
                    personaje,
                    rareza,
                    nivel: 1,
                    experiencia: 0,
                    obtenido: new Date()
                };

                nuevasCartas.push(carta);
            }

            // Actualizar usuario
            usuario.monedas -= paquete.precio;
            usuario.cartas.push(...nuevasCartas);
            ServicioAutenticacion.actualizarUsuario(usuario);

            return nuevasCartas;
        } catch (error) {
            console.error('Error al abrir el paquete de cartas:', error);
            throw new Error('Error al abrir el paquete de cartas');
        }
    }

    static obtenerColorRareza(rareza: string): string {
        switch (rareza) {
            case 'common': return 'from-gray-400 to-gray-600';
            case 'rare': return 'from-blue-400 to-blue-600';
            case 'epic': return 'from-purple-400 to-purple-600';
            case 'legendary': return 'from-yellow-400 to-yellow-600';
            default: return 'from-gray-400 to-gray-600';
        }
    }

    static obtenerNombreRareza(rareza: string): string {
        switch (rareza) {
            case 'common': return 'Común';
            case 'rare': return 'Rara';
            case 'epic': return 'Épica';
            case 'legendary': return 'Legendaria';
            default: return 'Común';
        }
    }

    private static obtenerPersonajesPredefinidos(): Personaje[] {
        return [
            {
                id: 1,
                name: 'Goku',
                ki: '3000000',
                maxKi: '3000000',
                race: 'Saiyan',
                gender: 'Male',
                description: 'Un guerrero Saiyan criado en la Tierra.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Z Fighter'
            },
            {
                id: 2,
                name: 'Vegeta',
                ki: '2500000',
                maxKi: '2500000',
                race: 'Saiyan',
                gender: 'Male',
                description: 'El príncipe de los Saiyans.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Z Fighter'
            },
            {
                id: 3,
                name: 'Piccolo',
                ki: '2000000',
                maxKi: '2000000',
                race: 'Namekian',
                gender: 'Male',
                description: 'Un guerrero Namekiano.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Z Fighter'
            },
            {
                id: 4,
                name: 'Gohan',
                ki: '2200000',
                maxKi: '2200000',
                race: 'Human/Saiyan',
                gender: 'Male',
                description: 'Hijo de Goku.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Z Fighter'
            },
            {
                id: 5,
                name: 'Frieza',
                ki: '530000',
                maxKi: '120000000',
                race: 'Frieza Race',
                gender: 'Male',
                description: 'Emperador del universo.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Frieza Force'
            },
            {
                id: 6,
                name: 'Cell',
                ki: '900000',
                maxKi: '2100000000',
                race: 'Android',
                gender: 'Male',
                description: 'Androide perfecto.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Red Ribbon Army'
            },
            {
                id: 7,
                name: 'Majin Buu',
                ki: '1150000000',
                maxKi: '1150000000',
                race: 'Majin',
                gender: 'Male',
                description: 'Demonio ancestral.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Other'
            },
            {
                id: 8,
                name: 'Trunks',
                ki: '1800000',
                maxKi: '1800000',
                race: 'Human/Saiyan',
                gender: 'Male',
                description: 'Hijo de Vegeta.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Z Fighter'
            },
            {
                id: 9,
                name: 'Krillin',
                ki: '75000',
                maxKi: '75000',
                race: 'Human',
                gender: 'Male',
                description: 'Mejor amigo de Goku.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Z Fighter'
            },
            {
                id: 10,
                name: 'Android 18',
                ki: '30000000',
                maxKi: '30000000',
                race: 'Android',
                gender: 'Female',
                description: 'Androide convertida en aliada.',
                image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                affiliation: 'Z Fighter'
            }
        ];
    }

    private static obtenerPersonajeAleatorio(personajes: Personaje[]): Personaje {
        return personajes[Math.floor(Math.random() * personajes.length)];
    }

    private static obtenerRarezaAleatoria(): 'common' | 'rare' | 'epic' | 'legendary' {
        const aleatorio = Math.random();
        if (aleatorio < 0.5) return 'common';
        if (aleatorio < 0.75) return 'rare';
        if (aleatorio < 0.92) return 'epic';
        return 'legendary';
    }

    private static garantizarRarezaMinima(
        rarezaActual: 'common' | 'rare' | 'epic' | 'legendary',
        rarezaMinima: 'rare' | 'epic' | 'legendary'
    ): 'common' | 'rare' | 'epic' | 'legendary' {
        const ordenRareza = ['common', 'rare', 'epic', 'legendary'];
        const indiceActual = ordenRareza.indexOf(rarezaActual);
        const indiceMinimo = ordenRareza.indexOf(rarezaMinima);

        return indiceActual >= indiceMinimo ? rarezaActual : rarezaMinima;
    }
}