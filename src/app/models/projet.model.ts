import { Enseignant } from './enseignant.model';
import { Commentaire } from './commentaire.model';
import { Document } from './document.model';
import { ChoixProjet } from './choix-projet.model';

export enum ProjetEtat {
  EN_COURS = 'en_cours',
  TERMINE = 'terminé',
  EN_ATTENTE = 'en_attente'
}

export interface Projet {
  id?: number;
  titre: string;
  description?: string;
  technologies?: string;
  etat: ProjetEtat;
  dateDepot?: Date;
  dateAffectation?: Date;
  enseignant: Enseignant;
  commentaires?: Commentaire[];
  documents?: Document[];
  choixProjets?: ChoixProjet[];
}
