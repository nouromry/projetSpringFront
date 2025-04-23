import { Utilisateur } from './utilisateur.model';

export interface Etudiant extends Utilisateur {
  moyenneGeneral: number;
  matricule: string;
  filiere: string;
}