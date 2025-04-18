import { Binome } from './binome.model';
import { Projet } from './projet.model';

export enum DocumentType {
  RAPPORT_FINAL = 'rapport_final',
  NORMAL = 'normal'
}

export interface Document {
  id?: number;
  titre: string;
  type: DocumentType;
  dateDepot?: Date;
  cheminFichier: string;
  binome: Binome;
  projet: Projet;
}