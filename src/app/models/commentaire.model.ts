import { Utilisateur } from './utilisateur.model';
import { Projet } from './projet.model';

export interface Commentaire {
  id: number;
  contenu: string;
  dateCommentaire: string; // ISO date string
  auteur: Utilisateur;
  projet: Projet;
}
