import { user } from './user.model';
import { Binome } from './binome.model';

export interface Etudiant extends user {
  moyenneGeneral?: number;
  matricule: string;
  filiere: string;
  binomeAsEtud1?: Binome;
  binomeAsEtud2?: Binome;
}