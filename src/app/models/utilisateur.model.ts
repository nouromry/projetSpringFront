export interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: 'etudiant' | 'enseignant' | 'chefDep';
    binomeId?: number;
  }
  

  export enum UserRole {
    ETUDIANT = 'etudiant',
    ENSEIGNANT = 'enseignant',
    CHEF_DEP = 'chefDep'
  }