import { Binome } from './binome.model';
import { Projet } from './projet.model';

export interface ChoixProjetId {
  idBinome: number;
  idProjet: number;
}

export interface ChoixProjet {
  id: ChoixProjetId;
  binome: Binome;
  projet: Projet;
  priorite: number;
}
