export interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: 'etudiant' | 'enseignant' | 'chefDep';
  }
  