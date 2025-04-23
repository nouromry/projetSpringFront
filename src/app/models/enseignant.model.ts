import { Utilisateur } from './utilisateur.model';

export interface Enseignant extends Utilisateur {
  specialite: string;
}