import { Utilisateur } from './utilisateur.model';

export interface Etudiant {
  id: number;
  utilisateur: Utilisateur;
  moyenneGeneral: number;
  matricule: string;
  filiere: string;
  groupe: String
}
