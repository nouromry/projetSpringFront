import { Enseignant } from './enseignant.model';
import { Soutenance } from './soutenance.model';

export interface JurySoutenance {
  enseignant: Enseignant;
  soutenance: Soutenance;
  role: 'président' | 'examinateur' | 'rapporteur';
}
