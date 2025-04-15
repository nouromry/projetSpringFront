import { Enseignant } from './enseignant.model';

export interface Projet {
  id: number;
  titre: string;
  description: string;
  technologies: string;
  etat: 'en_cours' | 'termine' | 'en_attente';
  dateDepot: string; // ISO string
  dateAffectation: string;
  enseignant: Enseignant;
}
