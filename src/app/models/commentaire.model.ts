import { user } from './user.model';
import { Projet } from './projet.model';

export interface Commentaire {
  id?: number;
  contenu: string;
  dateCommentaire?: Date;
  auteur: user;
  projet: Projet;
}
