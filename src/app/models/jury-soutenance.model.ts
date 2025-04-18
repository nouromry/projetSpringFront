import { Enseignant } from './enseignant.model';
import { Soutenance } from './soutenance.model';

export enum JuryRole {
  PRESIDENT = 'président',
  EXAMINATEUR = 'examinateur',
  RAPPORTEUR = 'rapporteur'
}

export interface JurySoutenanceId {
  enseignantId: number;
  soutenanceId: number;
}

export interface JurySoutenance {
  id: JurySoutenanceId;
  enseignant: Enseignant;
  soutenance: Soutenance;
  role: JuryRole;
}