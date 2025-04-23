import { Etudiant } from './etudiant.model';
import { Document } from './document.model';
import { Soutenance } from './soutenance.model';
import { ChoixProjet } from './choix-projet.model';

export interface Binome {
  id?: number;
  etud1: Etudiant;
  etud2: Etudiant;
  moyenneBinome?: number;
  documents?: Document[];
  soutenance?: Soutenance;
  choixProjets?: ChoixProjet[];
}  