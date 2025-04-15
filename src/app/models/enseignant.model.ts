import { Utilisateur } from './utilisateur.model';

export interface Enseignant {
  id: number;
  utilisateur: Utilisateur;
  specialite: string;
}
