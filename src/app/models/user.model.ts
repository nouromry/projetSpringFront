export enum UserRole {
  ETUDIANT = 'etudiant',
  ENSEIGNANT = 'enseignant',
  CHEF_DEP = 'chefDep'
}

export interface user {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: UserRole;
  }
  