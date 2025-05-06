
export interface DocumentDetailsDTO {
    id: number;
    titre: string;
    type: 'rapport_final' | 'normal';
    dateDepot: Date;
    cheminFichier: string;
    
    binomeId: number;
    etudiant1Nom: string;
    etudiant1Prenom: string;
    etudiant1Filiere: string;
    etudiant2Nom: string;
    etudiant2Prenom: string;
    etudiant2Filiere: string;
    
    projetId: number;
    projetTitre: string;
    
    enseignantId: number;
    enseignantNom: string;
    enseignantPrenom: string;
  }