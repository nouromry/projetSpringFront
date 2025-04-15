import { Binome } from './binome.model';

export interface Soutenance {
  id: number;
  date: string; // yyyy-MM-dd
  duree: number;
  heureD: string; // HH:mm:ss
  heureF: string; // HH:mm:ss
  binome: Binome;
}
