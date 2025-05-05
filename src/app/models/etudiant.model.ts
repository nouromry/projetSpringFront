

import { Utilisateur } from './utilisateur.model';
import { Binome } from './binome.model';

export interface Etudiant extends Utilisateur {
  moyenneGeneral?: number;
  matricule: string;
  filiere: string;
  binomeAsEtud1?: Binome;
  binomeAsEtud2?: Binome;
}