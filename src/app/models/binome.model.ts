import { Etudiant } from './etudiant.model';

export interface Binome {
  id: number;
  etud1: Etudiant;
  etud2: Etudiant;
  moyenneBinome: number;
}
