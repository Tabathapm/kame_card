import { Personaje, Planeta, RespuestaApi } from '../types/dragonball';

const BASE_URL = 'https://dragonball-api.com/api';

export class DragonBallAPI {
  static async getPersonajes(page: number = 1, limit: number = 10): Promise<RespuestaApi<Personaje>> {
    try {
      const respuesta = await fetch(`${BASE_URL}/characters?page=${page}&limit=${limit}`);
      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error al obtener los personajes:', error);
      throw error;
    }
  }

  static async getPersonajePorId(id: number): Promise<Personaje> {
    try {
      const respuesta = await fetch(`${BASE_URL}/characters/${id}`);
      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error al obtener el personaje:', error);
      throw error;
    }
  }

  static async getPlanetas(page: number = 1, limit: number = 10): Promise<RespuestaApi<Planeta>> {
    try {
      const respuesta = await fetch(`${BASE_URL}/planets?page=${page}&limit=${limit}`);
      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error al obtener los planetas:', error);
      throw error;
    }
  }

  static async buscarPersonajes(query: string): Promise<Personaje[]> {
    try {
      // La API no parece tener endpoint de búsqueda, así que obtenemos todos y filtramos
      const todosPersonajes = await this.getTodosLosPersonajes();
      return todosPersonajes.filter(personaje => 
        personaje.name.toLowerCase().includes(query.toLowerCase()) ||
        personaje.race.toLowerCase().includes(query.toLowerCase()) ||
        personaje.affiliation.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error buscar personaje:', error);
      throw error;
    }
  }

  private static async getTodosLosPersonajes(): Promise<Personaje[]> {
    const todosLosPersonajes: Personaje[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const respuesta = await this.getPersonajes(page, 50);
        todosLosPersonajes.push(...respuesta.items);
        hasMore = page < respuesta.meta.totalPages;
        page++;
      } catch (error) {
        console.error('Error al obtener todos los personajes:', error);
        hasMore = false;
      }
    }

    return todosLosPersonajes;
  }
}