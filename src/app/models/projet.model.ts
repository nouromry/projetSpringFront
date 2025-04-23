import { Enseignant } from './enseignant.model';

export interface Projet {
  id: number;
  titre: string;
  description: string;
  technologies: string;
  etat: 'EN_ATTENTE' | 'VALIDE' | 'ANNULEE';
  dateDepot: string;
  dateAffectation: string;
  enseignant: Enseignant;
  filiere: string;
}