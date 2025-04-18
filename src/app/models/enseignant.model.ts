
import { user } from './user.model';
import { Projet } from './projet.model';
import { JurySoutenance } from './jury-soutenance.model';

export interface Enseignant extends user {
  specialite?: string;
  projets?: Projet[];
  jurys?: JurySoutenance[];
}
