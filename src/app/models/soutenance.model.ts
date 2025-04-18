import { Binome } from './binome.model';
import { JurySoutenance } from './jury-soutenance.model';

export interface Soutenance {
  id?: number;
  date: Date;
  duree?: number;
  heureD: string; // Time format HH:MM
  heureF: string; // Time format HH:MM
  binome: Binome;
  jury?: JurySoutenance[];
}