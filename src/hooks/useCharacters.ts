import { useState, useEffect } from 'react';
import { Personaje } from '../types/dragonball';
import { DragonBallAPI } from '../services/dragonballApi';

export const useCharacters = () => {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [filtrarPersonajes, setfiltrarPersonajes] = useState<Personaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedAffiliation, setSelectedAffiliation] = useState('');

  // Cargar personajes iniciales
  useEffect(() => {
    loadCharacters();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [personajes, searchQuery, selectedRace, selectedAffiliation]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar múltiples páginas para obtener más personajes
      const todosLosPersonajes: Personaje[] = [];
      for (let page = 1; page <= 3; page++) {
        try {
          const respuesta = await DragonBallAPI.getPersonajes(page, 20);
          todosLosPersonajes.push(...respuesta.items);
        } catch (pageError) {
          console.error(`Error loading page ${page}:`, pageError);
          break;
        }
      }
      
      if (todosLosPersonajes.length === 0) {
        throw new Error('No se pudieron cargar los personajes');
      }
      
      setPersonajes(todosLosPersonajes);
    } catch (err) {
      console.error('Error loading personajes:', err);
      setError('Error al cargar los personajes. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...personajes];

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(character =>
        character.name.toLowerCase().includes(query) ||
        character.race.toLowerCase().includes(query) ||
        character.affiliation.toLowerCase().includes(query)
      );
    }

    // Filtro por raza
    if (selectedRace) {
      filtered = filtered.filter(character => character.race === selectedRace);
    }

    // Filtro por afiliación
    if (selectedAffiliation) {
      filtered = filtered.filter(character => character.affiliation === selectedAffiliation);
    }

    setfiltrarPersonajes(filtered);
  };

  const searchCharacters = async (query: string) => {
    setSearchQuery(query);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRace('');
    setSelectedAffiliation('');
  };

  // Obtener valores únicos para filtros
  const races = [...new Set(personajes.map(char => char.race))].sort();
  const affiliations = [...new Set(personajes.map(char => char.affiliation))].sort();

  return {
    personajes: filtrarPersonajes,
    loading,
    error,
    searchQuery,
    selectedRace,
    selectedAffiliation,
    races,
    affiliations,
    searchCharacters,
    setSelectedRace,
    setSelectedAffiliation,
    resetFilters,
    refetch: loadCharacters
  };
};