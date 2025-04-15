import { Utilisateur } from './utilisateur.model';

export interface ChefDep {
  id: number;
  utilisateur: Utilisateur;
  departement: string;
}
