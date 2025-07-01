import { useState, useEffect } from 'react';
import { Personaje } from '../types/dragonball';
import { DragonBallAPI } from '../services/dragonballApi';

export const usePersonajes = () => {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [personajesFiltrados, setPersonajesFiltrados] = useState<Personaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [razaSeleccionada, setRazaSeleccionada] = useState('');
  const [afiliacionSeleccionada, setAfiliacionSeleccionada] = useState('');

  // Cargar personajes iniciales
  useEffect(() => {
    cargarPersonajes();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    aplicarFiltros();
  }, [personajes, busqueda, razaSeleccionada, afiliacionSeleccionada]);

  const cargarPersonajes = async () => {
    try {
      setCargando(true);
      setError(null);

      // Cargar varias páginas para obtener más personajes
      const todosLosPersonajes: Personaje[] = [];
      for (let pagina = 1; pagina <= 3; pagina++) {
        try {
          const respuesta = await DragonBallAPI.getPersonajes(pagina, 20);
          todosLosPersonajes.push(...respuesta.items);
        } catch (errorPagina) {
          console.error(`Error cargando la página ${pagina}:`, errorPagina);
          break;
        }
      }

      if (todosLosPersonajes.length === 0) {
        throw new Error('No se pudieron cargar los personajes');
      }

      setPersonajes(todosLosPersonajes);
    } catch (err) {
      console.error('Error al cargar personajes:', err);
      setError('Error al cargar los personajes. Por favor, inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...personajes];

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const consulta = busqueda.toLowerCase().trim();
      filtrados = filtrados.filter(personaje =>
        personaje.name.toLowerCase().includes(consulta) ||
        personaje.race.toLowerCase().includes(consulta) ||
        personaje.affiliation.toLowerCase().includes(consulta)
      );
    }

    // Filtro por raza
    if (razaSeleccionada) {
      filtrados = filtrados.filter(personaje => personaje.race === razaSeleccionada);
    }

    // Filtro por afiliación
    if (afiliacionSeleccionada) {
      filtrados = filtrados.filter(personaje => personaje.affiliation === afiliacionSeleccionada);
    }

    setPersonajesFiltrados(filtrados);
  };

  const buscarPersonajes = async (consulta: string) => {
    setBusqueda(consulta);
  };

  const reiniciarFiltros = () => {
    setBusqueda('');
    setRazaSeleccionada('');
    setAfiliacionSeleccionada('');
  };

  // Obtener valores únicos para filtros
  const razas = [...new Set(personajes.map(p => p.race))].sort();
  const afiliaciones = [...new Set(personajes.map(p => p.affiliation))].sort();

  return {
    personajes: personajesFiltrados,
    cargando,
    error,
    busqueda,
    razaSeleccionada,
    afiliacionSeleccionada,
    razas,
    afiliaciones,
    buscarPersonajes,
    setRazaSeleccionada,
    setAfiliacionSeleccionada,
    reiniciarFiltros,
    recargar: cargarPersonajes
  };
};