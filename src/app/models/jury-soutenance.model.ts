import { Enseignant } from './enseignant.model';
import { Soutenance } from './soutenance.model';

export enum JuryRole {
  ENCADRANT = 'encadrant',
  EXAMINATEUR = 'examinateur',
}

export interface JurySoutenanceId {
  enseignantId: number;
  soutenanceId: number;
}

export interface JurySoutenance {
  id: JurySoutenanceId;
  enseignant: Enseignant;
  role: JuryRole;
  fullName?: string;
}