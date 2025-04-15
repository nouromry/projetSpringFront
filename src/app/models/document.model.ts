import { Binome } from './binome.model';
import { Projet } from './projet.model';

export interface Document {
  id: number;
  titre: string;
  type: 'rapport_final' | 'normal';
  dateDepot: string;
  cheminFichier: string;
  binome: Binome;
  projet: Projet;
}
