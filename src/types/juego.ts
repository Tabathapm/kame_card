import { Personaje } from './dragonball';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  monedas: number;
  cartas: Carta[];
  creado: Date;
  imgPerfil?: string;
  imgBanner?: string;
  colorBanner?: string;
}

export interface Carta {
  id: string;
  personajeId: number;
  personaje: Personaje;
  rareza: 'common' | 'rare' | 'epic' | 'legendary';
  nivel: number;
  experiencia: number;
  obtenido: Date;
}

export interface CartaPack {
  id: string;
  nombre: string;
  precio: number;
  cantidadCartas: number;
  rarezaGarantizada?: 'rare' | 'epic' | 'legendary';
  imagen: string;
}

export interface ListaMercado {
  id: string;
  carta: Carta;
  precio: number;
  vendedorId: string;
  vendedorNombre: string;
  publicado: Date;
}

export interface EstadoDeAutorizacion {
  usuario: Usuario | null;
  autenticado: boolean;
  cargando: boolean;
}