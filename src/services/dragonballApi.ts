import { Character, Planet, ApiResponse } from '../types/dragonball';

const BASE_URL = 'https://dragonball-api.com/api';

export class DragonBallAPI {
  static async getCharacters(page: number = 1, limit: number = 10): Promise<ApiResponse<Character>> {
    try {
      const response = await fetch(`${BASE_URL}/characters?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }

  static async getCharacterById(id: number): Promise<Character> {
    try {
      const response = await fetch(`${BASE_URL}/characters/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching character:', error);
      throw error;
    }
  }

  static async getPlanets(page: number = 1, limit: number = 10): Promise<ApiResponse<Planet>> {
    try {
      const response = await fetch(`${BASE_URL}/planets?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching planets:', error);
      throw error;
    }
  }

  static async searchCharacters(query: string): Promise<Character[]> {
    try {
      // La API no parece tener endpoint de búsqueda, así que obtenemos todos y filtramos
      const allCharacters = await this.getAllCharacters();
      return allCharacters.filter(character => 
        character.name.toLowerCase().includes(query.toLowerCase()) ||
        character.race.toLowerCase().includes(query.toLowerCase()) ||
        character.affiliation.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching characters:', error);
      throw error;
    }
  }

  private static async getAllCharacters(): Promise<Character[]> {
    const allCharacters: Character[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await this.getCharacters(page, 50);
        allCharacters.push(...response.items);
        hasMore = page < response.meta.totalPages;
        page++;
      } catch (error) {
        console.error('Error fetching all characters:', error);
        hasMore = false;
      }
    }

    return allCharacters;
  }
}