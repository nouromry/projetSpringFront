import { Binome } from './binome.model';
import { Projet } from './projet.model';

export interface ChoixProjet {
  binome: Binome;
  projet: Projet;
  priorite: number;
}
